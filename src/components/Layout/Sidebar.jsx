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
  const [openMenu, setOpenMenu] = useState(null);
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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">71CLUB</div>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar">SP</div>
        <div className="sidebar-user-info">
          <span className="sidebar-username">{user?.name || 'Admin'}</span>
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
                  <span>{item.label}</span>
                  <span className="sidebar-arrow">›</span>
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
                <span>{item.label}</span>
                {item.arrow && <span className="sidebar-arrow">›</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout">
          Logout
        </button>
      </div>
    </aside>
  );
}
