import { useState, useEffect } from 'react';
import { fetchTelegram, upsertTelegram, removeTelegram } from '../utils/api';
import './AddTelegram.css';

export default function AddTelegram() {
  const [currentUrl, setCurrentUrl] = useState(null);
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTelegram()
      .then((res) => {
        setCurrentUrl(res.data.url);
        if (res.data.url) setInputUrl(res.data.url);
      })
      .catch(() => setError('Failed to load Telegram URL'))
      .finally(() => setLoading(false));
  }, []);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!inputUrl.trim()) {
      setError('Please enter a Telegram URL');
      return;
    }
    setSaving(true);
    try {
      const res = await upsertTelegram(inputUrl.trim());
      setCurrentUrl(res.data.url);
      setSuccess('Telegram URL saved successfully');
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    clearMessages();
    setSaving(true);
    try {
      await removeTelegram();
      setCurrentUrl(null);
      setInputUrl('');
      setSuccess('Telegram URL removed');
    } catch (err) {
      setError(err.message || 'Failed to remove');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-telegram-page">
      <section className="add-telegram-section">
        <h2>Telegram URL</h2>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <>
            {error && <p className="telegram-msg telegram-msg--error">{error}</p>}
            {success && <p className="telegram-msg telegram-msg--success">{success}</p>}

            <form onSubmit={handleSave} className="add-telegram-form">
              <input
                type="url"
                placeholder="https://t.me/..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="add-telegram-input"
                disabled={saving}
              />
              <button type="submit" className="add-telegram-btn add-btn" disabled={saving}>
                {currentUrl ? 'Update' : 'Save'}
              </button>
            </form>

            {currentUrl && (
              <div className="telegram-links-list">
                <div className="telegram-link-item">
                  <span className="telegram-link-icon">🔗</span>
                  <span className="telegram-link-url">{currentUrl}</span>
                  <button
                    type="button"
                    className="telegram-link-remove"
                    onClick={handleRemove}
                    disabled={saving}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
