import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { HomepageLaporanItem, LokasiEmbedded } from '../../types/report.types';

interface Props {
  laporan: HomepageLaporanItem[];
  onMarkerClick?: (items: HomepageLaporanItem[]) => void;
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

export const LaporanMap: React.FC<Props> = ({ laporan, onMarkerClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    // Skip init when container is inside a display:none parent (e.g. lg:hidden layout)
    if (containerRef.current.offsetWidth === 0 && containerRef.current.offsetHeight === 0) return;

    mapRef.current = L.map(containerRef.current, {
      center: IPB_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const groups = buildGroups(laporan);

    groups.forEach(({ loc, items }) => {
      const marker = L.marker([loc.latitude, loc.longitude], { icon: makeGroupIcon(items) });
      marker.bindTooltip(loc.name, { direction: 'top', offset: [0, -10] });

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(items));
      }

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [laporan, onMarkerClick]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
