import React from 'react';
import { BottomNavbar } from '../components/common/BottomNavbar';

export class RiwayatPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <main className="flex-1 flex items-center justify-center pb-24">
          <p className="text-brand-muted text-sm">Riwayat — coming soon</p>
        </main>
        <BottomNavbar />
      </div>
    );
  }
}
