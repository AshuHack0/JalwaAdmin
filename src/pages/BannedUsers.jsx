import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, toggleBanUser } from '../utils/api';
import './ManageUsers.css';

export default function BannedUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchMobile, setSearchMobile] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const entries = 50;

  const load = useCallback(async (page, phone) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchUsers({ phone, page, limit: entries, isBanned: true });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.message || 'Failed to load banned users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(currentPage, searchMobile);
  }, [currentPage, load]);

  useEffect(() => {
    setCurrentPage(1);
    load(1, searchMobile);
  }, [searchMobile]);

  const totalPages = Math.ceil(total / entries) || 1;
  const startIndex = (currentPage - 1) * entries;

  const handleUnban = async (user) => {
    setError('');
    setSuccess('');
    try {
      await toggleBanUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setTotal((t) => t - 1);
      setSuccess(`${user.phone} has been unbanned`);
    } catch (err) {
      setError(err.message || 'Failed to unban user');
    }
  };

  return (
    <div className="manage-users-page">
      <header className="manage-users-header">
        <h1>Banned Users</h1>
      </header>

      {error && <p className="manage-users-error">{error}</p>}
      {success && <p className="manage-users-success">{success}</p>}

      <div className="manage-users-controls">
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          {total} banned user{total !== 1 ? 's' : ''}
        </span>
        <div className="manage-users-search">
          <input
            type="text"
            placeholder="Search Mobile"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
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
              <th>Nickname</th>
              <th>Wallet</th>
              <th>Total Deposited</th>
              <th>Banned Since</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="manage-users-empty">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="manage-users-empty">No banned users</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="manage-users-row--banned">
                  <td>{user.phone}</td>
                  <td className="manage-users-mono">{user.uid}</td>
                  <td className="manage-users-mono">{user.nickname}</td>
                  <td>₹{user.walletBalance?.toFixed(2)}</td>
                  <td>₹{user.totalDeposited?.toFixed(2)}</td>
                  <td>{new Date(user.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <button
                      type="button"
                      className="manage-users-action-btn manage-users-unban-btn"
                      onClick={() => handleUnban(user)}
                      title="Unban user"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
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
