import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const menuItems = [
  {
    label: 'WinGo Manager',
    children: [
      { path: '/wingo/30sec', label: 'WinGo 30 sec' },
      { path: '/wingo/1min', label: 'WinGo 1 Min' },
      { path: '/wingo/3min', label: 'WinGo 3 Min' },
      { path: '/wingo/5min', label: 'WinGo 5 Min' },
    ],
  },
  {
    label: 'Finance',
    children: [
      { path: '/finance/deposit-update', label: 'Deposit Update' },
      { path: '/finance/withdraw-apply', label: 'Withdraw Apply' },
      { path: '/finance/withdraw-sent', label: 'Withdraw Sent' },
      { path: '/finance/withdraw-reject', label: 'Withdraw Reject' },
    ],
  },
  {
    label: 'Support',
    children: [
      { path: '/support/deposit-problem', label: 'Deposite Problem' },
      { path: '/support/withdrawal-problem', label: 'Withdrawal Problem' },
      { path: '/support/ifsc-modification', label: 'IFSC Modification' },
      { path: '/support/bank-modification', label: 'Bank Modification' },
      { path: '/support/game-problem', label: 'Game Problem' },
    ],
  },
  {
    label: 'Manage Game',
    children: [
      { path: '/manage/telegram', label: 'Add Telegram' },
      { path: '/manage/bonus', label: 'Bonus Manage' },
      { path: '/manage/admin-password', label: 'Admin Password' },
      { path: '/manage/modify-bank', label: 'Modify Bank' },
      { path: '/manage/check-ip', label: 'Check Same IP' },
      { path: '/manage/maintenance', label: 'Site Maintenance' },
      { path: '/manage/banned-users', label: 'See Banned Users' },
      { path: '/manage/users', label: 'Users' },
      { path: '/manage/gift-code', label: 'Gift Code' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState('WinGo Manager'); // Open by default
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith('/manage')) setOpenMenu('Manage Game');
    else if (location.pathname.startsWith('/wingo')) setOpenMenu('WinGo Manager');
    else if (location.pathname.startsWith('/finance')) setOpenMenu('Finance');
    else if (location.pathname.startsWith('/support')) setOpenMenu('Support');
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuIcon = (label) => {
    switch (label) {
      case 'WinGo Manager':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>;
      case 'Finance':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
      case 'Support':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
      case 'Manage Game':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
      default:
        return null;
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">71CLUB</div>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar-container">
          <div className="sidebar-avatar">
            {/* Using a stylized "SP" as avatar since image gen failed */}
            <div className="avatar-img-placeholder"></div>
          </div>
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-username">SPA4KY</span>
          <span className="sidebar-role">Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.label} className="sidebar-menu-item">
            {item.children ? (
              <>
                <button
                  className={`sidebar-menu-btn ${openMenu === item.label ? 'open' : ''}`}
                  onClick={() => setOpenMenu(openMenu === item.label ? '' : item.label)}
                >
                  <span className="menu-icon">{getMenuIcon(item.label)}</span>
                  <span className="menu-label">{item.label}</span>
                  <span className="sidebar-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </span>
                </button>
                {openMenu === item.label && (
                  <div className="sidebar-submenu">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `sidebar-submenu-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="submenu-dot">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /></svg>
                        </span>
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-menu-btn sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="menu-icon">{getMenuIcon(item.label)}</span>
                <span className="menu-label">{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a href="https://71club.com" target="_blank" rel="noopener noreferrer" className="sidebar-website-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          Go To Website
        </a>
        <button onClick={handleLogout} className="sidebar-logout">
          Logout
        </button>
      </div>
    </aside>
  );
}
