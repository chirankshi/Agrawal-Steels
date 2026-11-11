'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminApi } from '../../lib/adminApi';
import './admin.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
    const currentUser = adminApi.getCurrentUser();
    setUser(currentUser);

    if (!currentUser && !isLoginPage) {
      router.replace('/admin/login');
      return;
    }

    // Ping backend health
    adminApi.checkBackendHealth().then((isOnline) => {
      setBackendOnline(isOnline);
    });

    // Check pending enquiries count for badge
    adminApi.getEnquiryStats().then((stats) => {
      if (stats && stats.pending !== undefined) {
        setPendingCount(stats.pending);
      }
    });
  }, [pathname, isLoginPage, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <div className="admin-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700 }}>Initializing Aggarwal Steels Command Desk...</div>
      </div>
    );
  }

  // Login page layout without sidebar
  if (isLoginPage) {
    return <div className="admin-body">{children}</div>;
  }

  const handleLogout = () => {
    adminApi.logout();
    router.replace('/admin/login');
  };

  const navLinks = [
    {
      href: '/admin',
      label: 'Overview',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
      exact: true,
    },
    {
      href: '/admin/enquiries',
      label: 'Quotation RFQs',
      badge: pendingCount > 0 ? pendingCount : null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href: '/admin/orders',
      label: 'Order Dispatches',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18.5" r="2.5" />
          <circle cx="6.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      href: '/admin/products',
      label: 'Steel Inventory',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      href: '/admin/reports',
      label: 'Reports & Export',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="20" y2="10" />
          <line x1="18" x2="18" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="16" />
        </svg>
      ),
    },
    {
      href: '/admin/settings',
      label: 'Desk Settings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-body">
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-brand">
            <div className="admin-brand-logo">AS</div>
            <div className="admin-brand-info">
              <h1>AGGARWAL STEELS</h1>
              <span>Command Desk</span>
            </div>
          </div>

          <nav className="admin-nav">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge && <span className="nav-badge">{link.badge}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {user?.user?.username?.slice(0, 1).toUpperCase() || 'A'}
              </div>
              <div className="sidebar-user-text">
                <strong>{user?.user?.username || 'Admin'}</strong>
                <span>{user?.user?.role || 'Super Admin'}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-sidebar-logout"
              title="Sign Out"
              onClick={handleLogout}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Main Area */}
        <div className="admin-main">
          {/* Header */}
          <header className="admin-header">
            <div className="admin-header-left">
              <button
                type="button"
                className="btn-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              </button>

              <div className="admin-page-title">
                <h2>Plant &amp; Sales Management</h2>
                <p>Bhiwadi &bull; Manesar &bull; Faridabad Hub</p>
              </div>
            </div>

            <div className="admin-header-right">
              <div className={`connection-pill ${backendOnline ? 'online' : 'offline'}`}>
                <span className="status-dot"></span>
                <span>{backendOnline ? 'Supabase Connected' : 'Local Sync Active'}</span>
              </div>

              <Link href="/" target="_blank" className="btn-header-link">
                <span>View Site</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

