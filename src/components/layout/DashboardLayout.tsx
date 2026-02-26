import { ReactNode, useState, useCallback, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  // Memoize callback functions to prevent recreating on every render
  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleDesktopSidebarToggle = useCallback(() => {
    setDesktopSidebarCollapsed((prev) => !prev);
  }, []);

  const handleMenuClick = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  // Memoize sidebar props to prevent re-renders
  const sidebarProps = useMemo(
    () => ({
      collapsed: desktopSidebarCollapsed,
      onToggle: handleDesktopSidebarToggle,
    }),
    [desktopSidebarCollapsed, handleDesktopSidebarToggle]
  );

  const mobileSidebarProps = useMemo(
    () => ({
      collapsed: false,
      onToggle: handleMobileMenuClose,
      isMobile: true,
    }),
    [handleMobileMenuClose]
  );

  return (
    <div className="flex h-screen bg-[#F6F9FC] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar {...sidebarProps} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleMobileMenuClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            <Sidebar {...mobileSidebarProps} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F6F9FC]">
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />

        {/* Main Content with custom scrollbar */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
