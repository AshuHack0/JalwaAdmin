import { useState } from 'react';
import './AdminPassword.css';

export default function AdminPassword() {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send to backend
    console.log('Update admin password');
    setNewPassword('');
  };

  return (
    <div className="admin-password-page">
      <h1 className="admin-password-title">Admin Password</h1>

      <section className="admin-password-section">
        <div className="admin-password-header">Update Admin Password</div>

        <form onSubmit={handleSubmit} className="admin-password-form">
          <div className="admin-password-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="admin-password-actions">
            <button type="submit" className="admin-password-btn">
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
