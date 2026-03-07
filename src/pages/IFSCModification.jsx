import { useState, useEffect } from 'react';
import { fetchUsersWithBankDetails, updateBankDetails } from '../utils/api';
import './IFSCModification.css';

export default function IFSCModification() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [error, setError] = useState('');

  // Modal state
  const [editUser, setEditUser] = useState(null);
  const [ifscValue, setIfscValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveMsgType, setSaveMsgType] = useState('');

  const load = async (phone = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchUsersWithBankDetails(phone);
      setUsers(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const t = setTimeout(() => load(searchPhone), 400);
    return () => clearTimeout(t);
  }, [searchPhone]);

  const openEdit = (user) => {
    setEditUser(user);
    setIfscValue(user.ifscCode || '');
    setSaveMsg('');
  };

  const closeEdit = () => {
    setEditUser(null);
    setIfscValue('');
    setSaveMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMsg('');
    setSaving(true);
    try {
      await updateBankDetails(editUser._id, {
        bankName: editUser.bankName,
        accountHolder: editUser.accountHolder,
        accountNumber: editUser.accountNumber,
        ifscCode: ifscValue.trim().toUpperCase(),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editUser._id ? { ...u, ifscCode: ifscValue.trim().toUpperCase() } : u
        )
      );
      setSaveMsgType('success');
      setSaveMsg('IFSC code updated successfully');
      setEditUser((u) => ({ ...u, ifscCode: ifscValue.trim().toUpperCase() }));
    } catch (err) {
      setSaveMsgType('error');
      setSaveMsg(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ifsc-page">
      <header className="ifsc-header">
        <h1>IFSC Modification</h1>
      </header>

      <div className="ifsc-controls">
        <input
          type="text"
          className="ifsc-search"
          placeholder="Search by phone..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <span className="ifsc-count">{users.length} record{users.length !== 1 ? 's' : ''}</span>
      </div>

      {error && <p className="ifsc-msg ifsc-msg--error">{error}</p>}

      <div className="ifsc-table-wrapper">
        <table className="ifsc-table">
          <thead>
            <tr>
              <th>Phone</th>
              <th>Account Holder</th>
              <th>Bank Name</th>
              <th>Account No.</th>
              <th>IFSC Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="ifsc-empty">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="ifsc-empty">No bank records found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.phone}</td>
                  <td>{user.accountHolder || '-'}</td>
                  <td>{user.bankName || '-'}</td>
                  <td className="ifsc-mono">{user.accountNumber || '-'}</td>
                  <td className="ifsc-mono">{user.ifscCode || '-'}</td>
                  <td>
                    <button
                      type="button"
                      className="ifsc-edit-btn"
                      onClick={() => openEdit(user)}
                    >
                      Edit IFSC
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="ifsc-modal-overlay" onClick={closeEdit}>
          <div className="ifsc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ifsc-modal-header">
              <h2>Update IFSC Code</h2>
              <span className="ifsc-modal-close" onClick={closeEdit}>×</span>
            </div>

            <div className="ifsc-modal-subtitle">
              <span>Phone: <strong>{editUser.phone}</strong></span>
              <span>Account: <strong>{editUser.accountNumber || '-'}</strong></span>
            </div>

            <form onSubmit={handleSave} className="ifsc-modal-form">
              {saveMsg && (
                <p className={`ifsc-msg ifsc-msg--${saveMsgType}`}>{saveMsg}</p>
              )}
              <div className="ifsc-modal-field">
                <label htmlFor="ifscCode">IFSC Code</label>
                <input
                  id="ifscCode"
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={ifscValue}
                  onChange={(e) => setIfscValue(e.target.value.toUpperCase())}
                  required
                  disabled={saving}
                  className="ifsc-modal-input"
                />
              </div>
              <div className="ifsc-modal-actions">
                <button type="button" className="ifsc-btn ifsc-btn-secondary" onClick={closeEdit}>
                  Close
                </button>
                <button type="submit" className="ifsc-btn ifsc-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
