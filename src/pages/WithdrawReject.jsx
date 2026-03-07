import { useState, useEffect, useCallback } from 'react';
import { fetchWithdrawals } from '../utils/api';
import './DepositUpdate.css';

export default function WithdrawReject() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 50;

  const load = useCallback(async (p, s) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWithdrawals({ status: 'rejected', page: p, search: s });
      setWithdrawals(res.data.withdrawals);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, search); }, [page, load]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, search); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="deposit-update-page">
      <header className="deposit-header">
        <div>
          <h1>Withdraw Reject</h1>
          <p className="deposit-subheader">Rejected withdrawals (wallet refunded) — {total} total</p>
        </div>
      </header>

      {error && <p className="deposit-msg deposit-msg--error">{error}</p>}

      <div className="deposit-controls">
        <span className="deposit-entries-label">{total} rejected</span>
        <div className="deposit-search">
          <label>Search:{' '}
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              className="deposit-search-input" placeholder="Phone" />
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
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="deposit-empty">Loading...</td></tr>
            ) : withdrawals.length === 0 ? (
              <tr><td colSpan="8" className="deposit-empty">No rejected withdrawals</td></tr>
            ) : (
              withdrawals.map((row, i) => (
                <tr key={row._id}>
                  <td>{(page - 1) * limit + i + 1}</td>
                  <td>{row.phone}</td>
                  <td className="deposit-amount" style={{ color: 'var(--danger)' }}>₹{row.amount.toLocaleString()}</td>
                  <td>{row.bankName || '-'}</td>
                  <td className="deposit-mono">{row.accountNumber || '-'}</td>
                  <td className="deposit-mono">{row.ifscCode || '-'}</td>
                  <td>{row.remark || '-'}</td>
                  <td>{new Date(row.createdAt).toLocaleString('en-IN')}</td>
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
