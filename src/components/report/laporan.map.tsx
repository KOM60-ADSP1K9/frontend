import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { HomepageLaporanItem, LokasiEmbedded } from '../../types/report.types';

interface Props {
  laporan: HomepageLaporanItem[];
  onMarkerClick?: (items: HomepageLaporanItem[]) => void;
  zoomControl?: boolean;
}

type LocationGroup = { loc: LokasiEmbedded; items: HomepageLaporanItem[] };

const IPB_CENTER: [number, number] = [-6.5598, 106.7247];
const DEFAULT_ZOOM = 15;

function buildGroups(laporan: HomepageLaporanItem[]): LocationGroup[] {
  const groupMap = new Map<string, LocationGroup>();
  laporan.forEach((item) => {
    const loc = item.type === 'hilang' ? item.lost_at_location : item.found_at_location;
    if (!loc) return;
    const existing = groupMap.get(loc.id);
    if (existing) {
      existing.items.push(item);
    } else {
      groupMap.set(loc.id, { loc, items: [item] });
    }
  });
  return Array.from(groupMap.values());
}

function makeGroupIcon(items: HomepageLaporanItem[]): L.DivIcon {
  const hasHilang = items.some((i) => i.type === 'hilang');
  const hasTemuan = items.some((i) => i.type === 'temuan');
  const color = hasHilang && hasTemuan ? '#fb923c' : hasHilang ? '#f87171' : '#34d399';
  const count = items.length;
  const size = count > 1 ? 26 : 16;

  const inner =
    count > 1
      ? `<span style="font-size:10px;font-weight:700;color:white;line-height:1">${count}</span>`
      : '';

  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center">${inner}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export class LaporanMap extends React.Component<Props> {
  private containerRef = React.createRef<HTMLDivElement>();
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  componentDidMount() {
    const container = this.containerRef.current;
    if (!container || this.map) return;
    if (container.offsetWidth === 0 && container.offsetHeight === 0) return;

    this.map = L.map(container, {
      center: IPB_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: this.props.zoomControl ?? false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.updateMarkers();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.laporan !== this.props.laporan || prevProps.onMarkerClick !== this.props.onMarkerClick) {
      this.updateMarkers();
    }
  }

  componentWillUnmount() {
    this.map?.remove();
    this.map = null;
  }

  private updateMarkers() {
    if (!this.map) return;

    this.markers.forEach((m) => m.remove());
    this.markers = [];

    const groups = buildGroups(this.props.laporan);

    groups.forEach(({ loc, items }) => {
      const marker = L.marker([loc.latitude, loc.longitude], { icon: makeGroupIcon(items) });
      marker.bindTooltip(loc.name, { direction: 'top', offset: [0, -10] });

      if (this.props.onMarkerClick) {
        marker.on('click', () => this.props.onMarkerClick!(items));
      }

      marker.addTo(this.map!);
      this.markers.push(marker);
    });
  }

  render() {
    return <div ref={this.containerRef} style={{ width: '100%', height: '100%' }} />;
  }
}
