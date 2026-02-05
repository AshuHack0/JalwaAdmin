import { useState } from 'react';
import './AddTelegram.css';

export default function AddTelegram() {
  const [newLink, setNewLink] = useState('');
  const [telegramLinks, setTelegramLinks] = useState([
    'https://t.me/+c6R17VZgaYRkMzJl',
  ]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newLink.trim()) {
      setTelegramLinks((prev) => [...prev, newLink.trim()]);
      setNewLink('');
    }
  };

  const handleRemove = (index) => {
    setTelegramLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // In production, persist to backend
    console.log('Saved links:', telegramLinks);
  };

  return (
    <div className="add-telegram-page">
      <section className="add-telegram-section">
        <h2>Add Telegram</h2>

        <form onSubmit={handleAdd} className="add-telegram-form">
          <input
            type="url"
            placeholder="Add new telegram"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="add-telegram-input"
          />
          <button type="submit" className="add-telegram-btn add-btn">
            Add
          </button>
        </form>

        <div className="telegram-links-list">
          {telegramLinks.map((link, index) => (
            <div key={index} className="telegram-link-item">
              <span className="telegram-link-icon">🔒</span>
              <span className="telegram-link-url">{link}</span>
              <button
                type="button"
                className="telegram-link-remove"
                onClick={() => handleRemove(index)}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="add-telegram-btn save-btn"
          onClick={handleSave}
        >
          Save
        </button>
      </section>
    </div>
  );
}
