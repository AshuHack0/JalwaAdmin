import { useState } from 'react';
import './BonusManage.css';

const BONUS_TYPES = [
  'Add New Bonus',
  'Referral Bonus',
  'Signup Bonus',
  'Deposit Bonus',
  'Loyalty Bonus',
];

export default function BonusManage() {
  const [userId, setUserId] = useState('');
  const [bonusType, setBonusType] = useState('Add New Bonus');
  const [bonusAmount, setBonusAmount] = useState('');
  const [remark, setRemark] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send to backend
    console.log({ userId, bonusType, bonusAmount, remark });
  };

  return (
    <div className="bonus-manage-page">
      <h1 className="bonus-page-title">Bonus Management</h1>

      <section className="bonus-form-section">
        <div className="bonus-form-header">Assign User Bonus</div>

        <form onSubmit={handleSubmit} className="bonus-form">
          <div className="bonus-field">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="bonus-field">
            <label htmlFor="bonusType">Bonus Type</label>
            <select
              id="bonusType"
              value={bonusType}
              onChange={(e) => setBonusType(e.target.value)}
            >
              {BONUS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
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
                min="0"
                step="0.01"
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
            />
          </div>

          <div className="bonus-form-actions">
            <button type="submit" className="bonus-submit-btn">
              Assign Bonus
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
