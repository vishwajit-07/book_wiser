import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

export default function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { path: '/', icon: 'menu_book', label: 'Library' },
    { path: '#curations', icon: 'auto_stories', label: 'Curations' },
    { path: '#archives', icon: 'inventory_2', label: 'Archives' },
    { path: '#analytics', icon: 'analytics', label: 'Analytics' },
  ];

  const topLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '#collections', label: 'Collections' },
    { href: '#reports', label: 'Reports' },
    { href: '#settings', label: 'Settings' },
  ];

  return (
    <>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-64 flex-col p-md gap-base border-r border-outline-variant/30 bg-surface-container-low z-50
        transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:flex
        ${isMobileSidebarOpen ? 'flex' : 'hidden lg:flex'}
      `}>
        <div className="flex items-center justify-between gap-sm mb-lg">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <div className="flex flex-col">
              <span className="font-inter text-sm text-on-surface font-bold">Library Admin</span>
              <span className="font-inter text-[11px] text-on-surface-variant">Institutional</span>
            </div>
          </div>
          <button
            className="lg:hidden p-1 rounded-full text-on-surface-variant hover:bg-surface-variant/50"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex flex-col gap-xs flex-1">
          {navItems.map((item) => {
            const isActive = item.path === '/' ? pathname === '/' : false;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-sm p-sm rounded-lg font-inter text-label-md transition-all hover:translate-x-1 ${isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/50'
                  }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-sm">
          <a href="#help" className="flex items-center gap-sm p-sm text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors">
            <span className="material-symbols-outlined">help</span>
            <span className="font-inter text-label-md">Help Center</span>
          </a>
        </div>
      </aside>

      <nav className="bg-surface/70 backdrop-blur-xl sticky top-0 z-40 border-b border-outline-variant/30 shadow-sm lg:ml-64">
        <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-md lg:gap-lg">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden material-symbols-outlined p-2 -ml-2 rounded-full hover:bg-surface-container-high/50 transition-all text-on-surface-variant active:scale-95"
            >
              menu
            </button>
            <Link to="/" className="font-outfit text-headline-md font-bold text-on-background truncate">
              Book Wiser
            </Link>
            <div className="hidden lg:flex gap-md items-center">
              {topLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : false;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-inter text-label-md transition-colors ${isActive
                        ? 'text-primary border-b-2 border-primary pb-1'
                        : 'text-on-surface-variant hover:text-primary'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-base">
            <button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high/50 transition-all text-on-surface-variant active:scale-95">
              search
            </button>
            <button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high/50 transition-all text-on-surface-variant active:scale-95 hidden sm:block">
              notifications
            </button>
            <button className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high/50 transition-all text-on-surface-variant active:scale-95">
              account_circle
            </button>
          </div>
        </div>
      </nav>

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-container-max mx-auto px-gutter py-md">
          <Outlet />
        </div>
      </main>

      <Link to="/add-book" className="lg:hidden fixed bottom-md right-md w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-[40]">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
      </Link>
    </>
  );
}
