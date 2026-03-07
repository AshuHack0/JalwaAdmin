import { useState, useEffect } from 'react';
import { generateGiftCodes, fetchGiftCodes, deleteGiftCode } from '../utils/api';
import './GiftCode.css';

export default function GiftCode() {
  const [count, setCount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [remark, setRemark] = useState('');
  const [amount, setAmount] = useState('');
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchGiftCodes()
      .then((res) => setCodes(res.data))
      .catch(() => setError('Failed to load gift codes'))
      .finally(() => setLoading(false));
  }, []);

  const clearMessages = () => { setError(''); setSuccess(''); };

  const handleGenerate = async (e) => {
    e.preventDefault();
    clearMessages();
    setGenerating(true);
    try {
      const res = await generateGiftCodes({
        count: parseInt(count, 10) || 1,
        maxUses: parseInt(maxUses, 10),
        amount: parseFloat(amount),
        remark,
      });
      setCodes((prev) => [...res.data, ...prev]);
      setSuccess(`${res.data.length} gift code(s) generated`);
      setCount('');
      setMaxUses('');
      setRemark('');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Failed to generate codes');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    clearMessages();
    try {
      await deleteGiftCode(id);
      setCodes((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete code');
    }
  };

  return (
    <div className="gift-code-page">
      <h1 className="gift-code-title">Generate Gift Codes</h1>

      <section className="gift-code-generate-section">
        <div className="gift-code-form-header">Generate Gift Codes</div>

        <form onSubmit={handleGenerate} className="gift-code-form">
          {error && <p className="gift-code-msg gift-code-msg--error">{error}</p>}
          {success && <p className="gift-code-msg gift-code-msg--success">{success}</p>}

          <div className="gift-code-field">
            <label htmlFor="count">Number of codes to generate</label>
            <input
              id="count"
              type="number"
              placeholder="Enter number to generate bulk code"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="100"
              disabled={generating}
            />
          </div>

          <div className="gift-code-field">
            <label htmlFor="maxUses">Maximum Users</label>
            <input
              id="maxUses"
              type="number"
              placeholder="Enter Maximum Users"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              min="1"
              required
              disabled={generating}
            />
          </div>

          <div className="gift-code-field">
            <label htmlFor="remark">Remark</label>
            <input
              id="remark"
              type="text"
              placeholder="Add remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              disabled={generating}
            />
          </div>

          <div className="gift-code-field">
            <label htmlFor="amount">Amount (₹)</label>
            <div className="gift-code-price-wrapper">
              <span className="gift-code-price-prefix">₹</span>
              <input
                id="amount"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
                disabled={generating}
              />
            </div>
          </div>

          <div className="gift-code-form-actions">
            <button type="submit" className="gift-code-generate-btn" disabled={generating}>
              {generating ? 'Generating...' : 'Generate Gift Codes'}
            </button>
          </div>
        </form>
      </section>

      <section className="gift-code-history-section">
        <h2 className="gift-code-section-title">Generated Codes History</h2>

        <div className="gift-code-table-wrapper">
          <table className="gift-code-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Amount</th>
                <th>Max Uses</th>
                <th>Used</th>
                <th>Remark</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="gift-code-empty">Loading...</td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="gift-code-empty">No codes generated yet</td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code._id}>
                    <td className="gift-code-serial">{code.code}</td>
                    <td>₹{code.amount}</td>
                    <td>{code.maxUses}</td>
                    <td>{code.usedCount}</td>
                    <td>{code.remark || '-'}</td>
                    <td>{new Date(code.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        className="gift-code-delete-btn"
                        onClick={() => handleDelete(code._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
