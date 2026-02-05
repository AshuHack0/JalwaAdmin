import { useState } from 'react';
import './GiftCode.css';

export default function GiftCode() {
  const [numberToGenerate, setNumberToGenerate] = useState('');
  const [maxUsers, setMaxUsers] = useState('');
  const [remark, setRemark] = useState('');
  const [price, setPrice] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState([]);

  const handleGenerate = (e) => {
    e.preventDefault();
    const count = parseInt(numberToGenerate, 10) || 1;
    const max = maxUsers || '0';
    const priceVal = price || '0';

    const newCodes = Array.from({ length: Math.min(count, 10) }, (_, i) => ({
      id: Date.now() + i,
      serialCode: `GC-${Date.now().toString(36).toUpperCase()}-${i + 1}`,
      maxUsers: max,
      price: priceVal,
      remark: remark || '-',
      createdAt: new Date().toLocaleString(),
    }));

    setGeneratedCodes((prev) => [...newCodes, ...prev]);
    setNumberToGenerate('');
    setMaxUsers('');
    setRemark('');
    setPrice('');
  };

  const handleDelete = (id) => {
    setGeneratedCodes((prev) => prev.filter((code) => code.id !== id));
  };

  return (
    <div className="gift-code-page">
      <h1 className="gift-code-title">Generate Gift Codes</h1>

      <section className="gift-code-generate-section">
        <div className="gift-code-form-header">Generate Gift Codes</div>

        <form onSubmit={handleGenerate} className="gift-code-form">
          <div className="gift-code-field">
            <label htmlFor="numberToGenerate">Number of codes to generate</label>
            <input
              id="numberToGenerate"
              type="number"
              placeholder="Enter number to generate bulk code"
              value={numberToGenerate}
              onChange={(e) => setNumberToGenerate(e.target.value)}
              min="1"
            />
          </div>

          <div className="gift-code-field">
            <label htmlFor="maxUsers">Maximum Users</label>
            <input
              id="maxUsers"
              type="number"
              placeholder="Enter Maximum Users"
              value={maxUsers}
              onChange={(e) => setMaxUsers(e.target.value)}
              min="0"
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
            />
          </div>

          <div className="gift-code-field">
            <label htmlFor="price">Price</label>
            <div className="gift-code-price-wrapper">
              <span className="gift-code-price-prefix">₹</span>
              <input
                id="price"
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="gift-code-form-actions">
            <button type="submit" className="gift-code-generate-btn">
              Generate Gift Codes
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
                <th>Serial Code</th>
                <th>Max Users</th>
                <th>Price</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {generatedCodes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="gift-code-empty">
                    No codes generated yet
                  </td>
                </tr>
              ) : (
                generatedCodes.map((code) => (
                  <tr key={code.id}>
                    <td className="gift-code-serial">{code.serialCode}</td>
                    <td>{code.maxUsers}</td>
                    <td>₹{code.price}</td>
                    <td>{code.createdAt}</td>
                    <td>
                      <button
                        type="button"
                        className="gift-code-delete-btn"
                        onClick={() => handleDelete(code.id)}
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
