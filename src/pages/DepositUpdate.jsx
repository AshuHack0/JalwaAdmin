import { useState } from 'react';
import './DepositUpdate.css';

const MOCK_DATA = [
  { id: 1, userId: 2257855, mobile: '9178360777', refNumber: 'N/A', amount: 500, orderId: '71CLUB202601240128068675', date: '2026-01-24 01:28:06' },
  { id: 2, userId: 2257856, mobile: '9198765432', refNumber: 'N/A', amount: 200, orderId: '71CLUB202601240128068676', date: '2026-01-24 01:30:15' },
  { id: 3, userId: 2257857, mobile: '9187654321', refNumber: 'N/A', amount: 10000, orderId: '71CLUB202601240128068677', date: '2026-01-24 01:35:22' },
  { id: 4, userId: 2257858, mobile: '9176543210', refNumber: 'N/A', amount: 50000, orderId: '71CLUB202601240128068678', date: '2026-01-24 01:40:08' },
  { id: 5, userId: 2257859, mobile: '9165432109', refNumber: 'N/A', amount: 1000, orderId: '71CLUB202601240128068679', date: '2026-01-24 01:45:33' },
];

export default function DepositUpdate() {
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState(MOCK_DATA);

  const handleApprove = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReject = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="deposit-update-page">
      <header className="deposit-header">
        <div>
          <h1>Deposit Update</h1>
          <p className="deposit-subheader">Payment Update</p>
        </div>
      </header>

      <div className="deposit-controls">
        <div className="deposit-entries">
          <label>
            Show{' '}
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="deposit-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>{' '}
            entries
          </label>
        </div>
        <div className="deposit-search">
          <label>
            Search:{' '}
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="deposit-search-input"
            />
          </label>
          <button type="button" className="deposit-settings-btn" title="Settings">
            Settings
          </button>
        </div>
      </div>

      <div className="deposit-table-wrapper">
        <table className="deposit-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Mobile</th>
              <th>Reference Number</th>
              <th>Amount</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.userId}</td>
                <td>{row.mobile}</td>
                <td>{row.refNumber}</td>
                <td>{row.amount}</td>
                <td>{row.orderId}</td>
                <td>{row.date}</td>
                <td>
                  <div className="deposit-actions">
                    <button
                      type="button"
                      className="deposit-btn approve-btn"
                      onClick={() => handleApprove(row.id)}
                    >
                      Approve Payment
                    </button>
                    <button
                      type="button"
                      className="deposit-btn reject-btn"
                      onClick={() => handleReject(row.id)}
                    >
                      Reject Payment
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
