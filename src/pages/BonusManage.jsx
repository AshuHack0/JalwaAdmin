import { useState, useEffect } from 'react';
import { assignBonus, fetchBonuses } from '../utils/api';
import './BonusManage.css';

const BONUS_TYPES = [
  'Manual Bonus',
  'Referral Bonus',
  'Signup Bonus',
  'Deposit Bonus',
  'Loyalty Bonus',
];

export default function BonusManage() {
  const [phone, setPhone] = useState('');
  const [bonusType, setBonusType] = useState(BONUS_TYPES[0]);
  const [bonusAmount, setBonusAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [bonuses, setBonuses] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  const loadBonuses = async (page) => {
    setListLoading(true);
    try {
      const res = await fetchBonuses(page);
      setBonuses(res.data.bonuses);
      setTotal(res.data.total);
    } catch {
      // silently fail on list load
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadBonuses(currentPage);
  }, [currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await assignBonus({ phone, bonusType, amount: parseFloat(bonusAmount), remark });
      setSuccess(res.message);
      setPhone('');
      setBonusAmount('');
      setRemark('');
      setBonusType(BONUS_TYPES[0]);
      // Prepend new bonus to list
      setBonuses((prev) => [res.data, ...prev]);
      setTotal((t) => t + 1);
    } catch (err) {
      setError(err.message || 'Failed to assign bonus');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bonus-manage-page">
      <h1 className="bonus-page-title">Bonus Management</h1>

      <section className="bonus-form-section">
        <div className="bonus-form-header">Assign User Bonus</div>

        <form onSubmit={handleSubmit} className="bonus-form">
          {error && <p className="bonus-msg bonus-msg--error">{error}</p>}
          {success && <p className="bonus-msg bonus-msg--success">{success}</p>}

          <div className="bonus-field">
            <label htmlFor="phone">User Phone</label>
            <input
              id="phone"
              type="text"
              placeholder="Enter user phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="bonus-field">
            <label htmlFor="bonusType">Bonus Type</label>
            <select
              id="bonusType"
              value={bonusType}
              onChange={(e) => setBonusType(e.target.value)}
              disabled={loading}
            >
              {BONUS_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="bonus-field">
            <label htmlFor="bonusAmount">Bonus Amount</label>
            <div className="bonus-amount-wrapper">
              <span className="bonus-amount-prefix">₹</span>
              <input
                id="bonusAmount"
                type="number"
                placeholder="Enter Amount"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="bonus-field">
            <label htmlFor="remark">Remark (Optional)</label>
            <textarea
              id="remark"
              placeholder="Add any remarks..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="bonus-form-actions">
            <button type="submit" className="bonus-submit-btn" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Bonus'}
            </button>
          </div>
        </form>
      </section>

      <section className="bonus-history-section">
        <h2 className="bonus-history-title">Bonus History</h2>

        <div className="bonus-table-wrapper">
          <table className="bonus-table">
            <thead>
              <tr>
                <th>Phone</th>
                <th>Bonus Type</th>
                <th>Amount</th>
                <th>Remark</th>
                <th>Assigned At</th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                <tr><td colSpan="5" className="bonus-table-empty">Loading...</td></tr>
              ) : bonuses.length === 0 ? (
                <tr><td colSpan="5" className="bonus-table-empty">No bonuses assigned yet</td></tr>
              ) : (
                bonuses.map((b) => (
                  <tr key={b._id}>
                    <td>{b.phone}</td>
                    <td><span className="bonus-type-badge">{b.bonusType}</span></td>
                    <td className="bonus-amount-cell">₹{b.amount.toFixed(2)}</td>
                    <td>{b.remark || '-'}</td>
                    <td>{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bonus-pagination">
            <span className="bonus-pagination-info">
              {total} total bonus{total !== 1 ? 'es' : ''}
            </span>
            <div className="bonus-pagination-btns">
              <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
              <span>{currentPage}</span>
              <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
