import React from 'react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { BottomNavbar } from '../../components/common/bottom.navbar';
import { LostReportForm } from '../../components/report/lost.report.form';
import { FoundReportForm } from '../../components/report/found.report.form';

type FormMode = 'choose' | 'hilang' | 'temuan';

interface State {
  mode: FormMode;
}

class LaporPageBase extends React.Component<RouterProps, State> {
  state: State = { mode: 'choose' };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const mode = params.get('mode');
    if (mode === 'hilang') this.setState({ mode: 'hilang' });
    else if (mode === 'temuan') this.setState({ mode: 'temuan' });
  }

  componentDidUpdate(prevProps: RouterProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const params = new URLSearchParams(this.props.location.search);
      const mode = params.get('mode');
      if (mode === 'hilang') this.setState({ mode: 'hilang' });
      else if (mode === 'temuan') this.setState({ mode: 'temuan' });
      else this.setState({ mode: 'choose' });
    }
  }

  private selectMode = (mode: FormMode) => {
    this.setState({ mode });
  };

  private renderChoose() {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Buat Laporan</h1>
          <p className="text-brand-muted text-sm mt-1">Pilih jenis laporan yang ingin kamu buat</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => this.selectMode('hilang')}
            className="w-full p-5 rounded-2xl border border-brand-muted/20 bg-brand-surface-alt text-left hover:border-brand-accent/60 hover:bg-brand-surface transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 text-2xl group-hover:bg-rose-500/20 transition-colors">🔍</div>
              <div>
                <p className="font-semibold text-white text-sm">Lapor Hilang</p>
                <p className="text-brand-muted text-xs mt-0.5">Barang kamu hilang dan ingin dilaporkan</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => this.selectMode('temuan')}
            className="w-full p-5 rounded-2xl border border-brand-muted/20 bg-brand-surface-alt text-left hover:border-brand-accent/60 hover:bg-brand-surface transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-2xl group-hover:bg-emerald-500/20 transition-colors">📦</div>
              <div>
                <p className="font-semibold text-white text-sm">Lapor Temuan</p>
                <p className="text-brand-muted text-xs mt-0.5">Kamu menemukan barang orang lain</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  private renderForm() {
    const { mode } = this.state;
    const title = mode === 'hilang' ? 'Lapor Barang Hilang' : 'Lapor Barang Temuan';

    return (
      <div className="w-full max-w-sm px-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => this.props.navigate(-1)} className="text-brand-muted hover:text-white transition-colors" aria-label="Kembali">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-white">{title}</h1>
        </div>

        {mode === 'hilang' ? <LostReportForm /> : <FoundReportForm />}
      </div>
    );
  }

  render() {
    const { mode } = this.state;
    const isChoose = mode === 'choose';

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <main className={['flex-1 flex pb-24', isChoose ? 'items-center justify-center' : 'items-start justify-center pt-6'].join(' ')}>{isChoose ? this.renderChoose() : this.renderForm()}</main>
        <BottomNavbar />
      </div>
    );
  }
}

export const LaporPage = withRouter(LaporPageBase);
