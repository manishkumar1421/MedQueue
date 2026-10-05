import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../common/AppSidebar';
import { AppHeader } from '../common/AppHeader';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Sidebar navigation */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content body */}
      <div className="dashboard-main">
        <AppHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
