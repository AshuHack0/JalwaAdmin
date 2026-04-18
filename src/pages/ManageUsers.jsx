import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, toggleBanUser, deleteUser } from '../utils/api';
import './ManageUsers.css';

export function extractUID(id) {
  if (!id) return "0000000";
  const digits = id.replace(/\D/g, "");
  return digits.slice(-7).padStart(7, "0");
}

export default function ManageUsers() {
  const [entries, setEntries] = useState(50);
  const [searchMobile, setSearchMobile] = useState('');
  const [searchCustId, setSearchCustId] = useState('');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (page, phone, uid, limit) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchUsers({ phone, uid, page, limit });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(currentPage, searchMobile, searchCustId, entries);
  }, [currentPage, entries, load]);

  // Debounced search — reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
    load(1, searchMobile, searchCustId, entries);
  }, [searchMobile, searchCustId]);

  const totalPages = Math.ceil(total / entries) || 1;
  const startIndex = (currentPage - 1) * entries;

  const handleBan = async (user) => {
    try {
      const res = await toggleBanUser(user._id);
      setUsers((prev) =>
        prev.map((u) => u._id === user._id ? { ...u, isBanned: res.data.isBanned } : u)
      );
    } catch (err) {
      setError(err.message || 'Failed to update ban status');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user.phone}? This cannot be undone.`)) return;
    try {
      await deleteUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setTotal((t) => t - 1);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="manage-users-page">
      <header className="manage-users-header">
        <h1>Manage User</h1>
      </header>

      {error && <p className="manage-users-error">{error}</p>}

      <div className="manage-users-controls">
        <div className="manage-users-entries">
          <label>
            Show{' '}
            <select
              value={entries}
              onChange={(e) => { setEntries(Number(e.target.value)); setCurrentPage(1); }}
              className="manage-users-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>{' '}
            entries
          </label>
        </div>
        <div className="manage-users-search">
          <input
            type="text"
            placeholder="Search Mobile"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            className="manage-users-search-input"
          />
          <input
            type="text"
            placeholder="Search UID"
            value={searchCustId}
            onChange={(e) => setSearchCustId(e.target.value)}
            className="manage-users-search-input"
          />
        </div>
      </div>

      <div className="manage-users-table-wrapper">
        <table className="manage-users-table">
          <thead>
            <tr>
              <th>Mobile</th>
              <th>UID</th>
              <th>Cust ID</th>
              <th>Wallet</th>
              <th>Total Deposited</th>
              <th>Reg. Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="manage-users-empty">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="8" className="manage-users-empty">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className={user.isBanned ? 'manage-users-row--banned' : ''}>
                  <td>{user.phone}</td>
                  <td className="manage-users-mono">{extractUID(user?._id)}</td>
                  <td className="manage-users-mono">{user.nickname}</td>
                  <td>
                    <span className="manage-users-wallet">₹{user.walletBalance?.toFixed(2)}</span>
                  </td>
                  <td>₹{user.totalDeposited?.toFixed(2)}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <span className={`manage-users-badge ${user.isBanned ? 'manage-users-badge--banned' : 'manage-users-badge--active'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="manage-users-actions">
                      {/* Ban / Unban toggle — tick = ban */}
                      <button
                        type="button"
                        className={`manage-users-action-btn ${user.isBanned ? 'manage-users-unban-btn' : 'manage-users-ban-btn'}`}
                        onClick={() => handleBan(user)}
                        title={user.isBanned ? 'Unban user' : 'Ban user'}
                      >
                        {user.isBanned ? (
                          // X icon — unban
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        ) : (
                          // Tick icon — ban
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                      <button
                        type="button"
                        className="manage-users-action-btn manage-users-delete-btn"
                        onClick={() => handleDelete(user)}
                        title="Delete"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="manage-users-pagination">
        <span className="manage-users-pagination-info">
          Showing {total ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + entries, total)} of {total} entries
        </span>
        <div className="manage-users-pagination-btns">
          <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Previous
          </button>
          <span className="manage-users-page-num">{currentPage}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
