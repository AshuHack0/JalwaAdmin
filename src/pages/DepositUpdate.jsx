import { useState, useEffect, useCallback } from 'react';
import { fetchDeposits, approveDeposit, rejectDeposit } from '../utils/api';
import './DepositUpdate.css';

export default function DepositUpdate() {
  const [deposits, setDeposits] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const limit = 50;

  const load = useCallback(async (p, s) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchDeposits({ status: 'pending', page: p, search: s });
      setDeposits(res.data.deposits);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.message || 'Failed to load deposits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, search); }, [page, load]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, search); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve');
    try {
      await approveDeposit(id);
      setDeposits((prev) => prev.filter((d) => d._id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      setError(err.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '_reject');
    try {
      await rejectDeposit(id);
      setDeposits((prev) => prev.filter((d) => d._id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      setError(err.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="deposit-update-page">
      <header className="deposit-header">
        <div>
          <h1>Deposit Update</h1>
          <p className="deposit-subheader">Pending payment approvals — {total} pending</p>
        </div>
      </header>

      {error && <p className="deposit-msg deposit-msg--error">{error}</p>}

      <div className="deposit-controls">
        <div className="deposit-entries">
          <span className="deposit-entries-label">{total} pending deposit{total !== 1 ? 's' : ''}</span>
        </div>
        <div className="deposit-search">
          <label>
            Search:{' '}
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="deposit-search-input"
              placeholder="Phone or Order ID"
            />
          </label>
        </div>
      </div>

      <div className="deposit-table-wrapper">
        <table className="deposit-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mobile</th>
              <th>Nickname</th>
              <th>Ref. Number</th>
              <th>Amount</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="deposit-empty">Loading...</td></tr>
            ) : deposits.length === 0 ? (
              <tr><td colSpan="8" className="deposit-empty">No pending deposits</td></tr>
            ) : (
              deposits.map((row, index) => (
                <tr key={row._id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{row.user?.phone || '-'}</td>
                  <td>{row.user?.nickname || '-'}</td>
                  <td>{row.paymentRef || 'N/A'}</td>
                  <td className="deposit-amount">₹{row.amount.toLocaleString()}</td>
                  <td className="deposit-mono">{row.orderId || '-'}</td>
                  <td>{new Date(row.createdAt).toLocaleString('en-IN')}</td>
                  <td>
                    <div className="deposit-actions">
                      <button
                        type="button"
                        className="deposit-btn approve-btn"
                        onClick={() => handleApprove(row._id)}
                        disabled={!!actionLoading}
                      >
                        {actionLoading === row._id + '_approve' ? '...' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        className="deposit-btn reject-btn"
                        onClick={() => handleReject(row._id)}
                        disabled={!!actionLoading}
                      >
                        {actionLoading === row._id + '_reject' ? '...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="deposit-pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
