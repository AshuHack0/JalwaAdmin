import { useState, useEffect, useCallback } from 'react';
import { fetchWithdrawals, approveWithdrawal, rejectWithdrawal } from '../utils/api';
import './DepositUpdate.css';
import './WithdrawApply.css';

export default function WithdrawApply() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  // Approve modal state
  const [approveTarget, setApproveTarget] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');

  // Reject modal state
  const [rejectTarget, setRejectTarget] = useState(null);
  const [remark, setRemark] = useState('');

  const limit = 50;

  const load = useCallback(async (p, s) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWithdrawals({ status: 'pending', page: p, search: s });
      setWithdrawals(res.data.withdrawals);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.message || 'Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, search); }, [page, load]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, search); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleApprove = async (e) => {
    e.preventDefault();
    setActionLoading(approveTarget._id);
    try {
      await approveWithdrawal(approveTarget._id, paymentRef);
      setWithdrawals((prev) => prev.filter((w) => w._id !== approveTarget._id));
      setTotal((t) => t - 1);
      setApproveTarget(null);
      setPaymentRef('');
    } catch (err) {
      setError(err.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    setActionLoading(rejectTarget._id);
    try {
      await rejectWithdrawal(rejectTarget._id, remark);
      setWithdrawals((prev) => prev.filter((w) => w._id !== rejectTarget._id));
      setTotal((t) => t - 1);
      setRejectTarget(null);
      setRemark('');
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
          <h1>Withdraw Apply</h1>
          <p className="deposit-subheader">Pending withdrawal requests — {total} pending</p>
        </div>
      </header>

      {error && <p className="deposit-msg deposit-msg--error">{error}</p>}

      <div className="deposit-controls">
        <span className="deposit-entries-label">{total} pending</span>
        <div className="deposit-search">
          <label>Search:{' '}
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              className="deposit-search-input" placeholder="Phone or Order ID" />
          </label>
        </div>
      </div>

      <div className="deposit-table-wrapper">
        <table className="deposit-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Bank</th>
              <th>Account No.</th>
              <th>IFSC</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="deposit-empty">Loading...</td></tr>
            ) : withdrawals.length === 0 ? (
              <tr><td colSpan="8" className="deposit-empty">No pending withdrawals</td></tr>
            ) : (
              withdrawals.map((row, i) => (
                <tr key={row._id}>
                  <td>{(page - 1) * limit + i + 1}</td>
                  <td>{row.phone}</td>
                  <td className="deposit-amount">₹{row.amount.toLocaleString()}</td>
                  <td>{row.bankName || '-'}</td>
                  <td className="deposit-mono">{row.accountNumber || '-'}</td>
                  <td className="deposit-mono">{row.ifscCode || '-'}</td>
                  <td>{new Date(row.createdAt).toLocaleString('en-IN')}</td>
                  <td>
                    <div className="deposit-actions">
                      <button type="button" className="deposit-btn approve-btn"
                        onClick={() => { setApproveTarget(row); setPaymentRef(''); }}
                        disabled={!!actionLoading}>
                        Approve
                      </button>
                      <button type="button" className="deposit-btn reject-btn"
                        onClick={() => { setRejectTarget(row); setRemark(''); }}
                        disabled={!!actionLoading}>
                        Reject
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

      {/* Approve Modal */}
      {approveTarget && (
        <div className="wd-modal-overlay" onClick={() => setApproveTarget(null)}>
          <div className="wd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wd-modal-header">
              <h2>Approve Withdrawal</h2>
              <span className="wd-modal-close" onClick={() => setApproveTarget(null)}>×</span>
            </div>
            <div className="wd-modal-info">
              <span>Phone: <strong>{approveTarget.phone}</strong></span>
              <span>Amount: <strong className="wd-amount">₹{approveTarget.amount.toLocaleString()}</strong></span>
            </div>
            <form onSubmit={handleApprove} className="wd-modal-form">
              <div className="wd-modal-field">
                <label>Payment Reference (UTR)</label>
                <input type="text" placeholder="Enter UTR / payment ref (optional)"
                  value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} />
              </div>
              <div className="wd-modal-actions">
                <button type="button" className="wd-btn wd-btn-secondary" onClick={() => setApproveTarget(null)}>Cancel</button>
                <button type="submit" className="wd-btn wd-btn-approve" disabled={!!actionLoading}>
                  {actionLoading ? 'Approving...' : 'Confirm Approve'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="wd-modal-overlay" onClick={() => setRejectTarget(null)}>
          <div className="wd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wd-modal-header">
              <h2>Reject Withdrawal</h2>
              <span className="wd-modal-close" onClick={() => setRejectTarget(null)}>×</span>
            </div>
            <div className="wd-modal-info">
              <span>Phone: <strong>{rejectTarget.phone}</strong></span>
              <span>Amount: <strong className="wd-amount">₹{rejectTarget.amount.toLocaleString()}</strong></span>
            </div>
            <p className="wd-refund-note">Wallet will be refunded automatically.</p>
            <form onSubmit={handleReject} className="wd-modal-form">
              <div className="wd-modal-field">
                <label>Reason (optional)</label>
                <input type="text" placeholder="Enter rejection reason"
                  value={remark} onChange={(e) => setRemark(e.target.value)} />
              </div>
              <div className="wd-modal-actions">
                <button type="button" className="wd-btn wd-btn-secondary" onClick={() => setRejectTarget(null)}>Cancel</button>
                <button type="submit" className="wd-btn wd-btn-reject" disabled={!!actionLoading}>
                  {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
