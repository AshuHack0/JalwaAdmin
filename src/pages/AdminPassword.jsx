import { useState } from 'react';
import { changeAdminPassword } from '../utils/api';
import './AdminPassword.css';

export default function AdminPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await changeAdminPassword(password);
      setSuccess('Password updated successfully');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-password-page">
      <h1 className="admin-password-title">Admin Password</h1>

      <section className="admin-password-section">
        <div className="admin-password-header">Update Admin Password</div>

        <form onSubmit={handleSubmit} className="admin-password-form">
          {error && <p className="admin-password-msg admin-password-msg--error">{error}</p>}
          {success && <p className="admin-password-msg admin-password-msg--success">{success}</p>}

          <div className="admin-password-field">
            <label htmlFor="password">Update Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="admin-password-actions">
            <button type="submit" className="admin-password-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
