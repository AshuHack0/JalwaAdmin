import { useState } from 'react';
import { getUserByPhone, updateBankDetails } from '../utils/api';
import './ModifyBank.css';

export default function ModifyBank() {
  const [phone, setPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [searchError, setSearchError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setFoundUser(null);
    setSearching(true);
    try {
      const res = await getUserByPhone(phone.trim());
      const user = res.data;
      setFoundUser(user);
      setBankDetails({
        bankName: user.bankName || '',
        accountHolder: user.accountHolder || '',
        accountNumber: user.accountNumber || '',
        confirmAccountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || '',
      });
      setIsModalOpen(true);
      setSaveError('');
      setSaveSuccess('');
    } catch (err) {
      setSearchError(err.message || 'User not found');
    } finally {
      setSearching(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFoundUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      setSaveError('Account numbers do not match');
      return;
    }

    setSaving(true);
    try {
      await updateBankDetails(foundUser._id, {
        bankName: bankDetails.bankName,
        accountHolder: bankDetails.accountHolder,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
      });
      setSaveSuccess('Bank details updated successfully');
    } catch (err) {
      setSaveError(err.message || 'Failed to update bank details');
    } finally {
      setSaving(false);
    }
  };

  const accountMismatch =
    bankDetails.accountNumber &&
    bankDetails.confirmAccountNumber &&
    bankDetails.accountNumber !== bankDetails.confirmAccountNumber;

  return (
    <div className="modify-bank-page">
      <h1 className="modify-bank-title">Modify Bank</h1>

      <section className="modify-bank-section">
        <div className="modify-bank-header">Search User by Phone</div>

        <form onSubmit={handleSearch} className="modify-bank-form">
          {searchError && (
            <p className="modify-bank-msg modify-bank-msg--error">{searchError}</p>
          )}
          <div className="modify-bank-field">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="text"
              placeholder="Enter user phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={searching}
            />
          </div>

          <div className="modify-bank-actions">
            <button type="submit" className="modify-bank-btn modify-bank-btn-primary" disabled={searching}>
              {searching ? 'Searching...' : 'Search & Edit Bank Details'}
            </button>
          </div>
        </form>
      </section>

      {isModalOpen && foundUser && (
        <div className="modify-bank-modal-overlay" onClick={closeModal}>
          <div className="modify-bank-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modify-bank-modal-header">
              <h2>Update Bank Details</h2>
              <span className="modify-bank-modal-close" onClick={closeModal}>×</span>
            </div>

            <div className="modify-bank-modal-subtitle">
              <span>Phone: <strong>{foundUser.phone}</strong></span>
              <span style={{ marginLeft: '1rem' }}>Nickname: <strong>{foundUser.nickname}</strong></span>
            </div>

            <form onSubmit={handleSave} className="modify-bank-modal-form">
              {saveError && <p className="modify-bank-msg modify-bank-msg--error">{saveError}</p>}
              {saveSuccess && <p className="modify-bank-msg modify-bank-msg--success">{saveSuccess}</p>}

              <div className="modify-bank-field">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  placeholder="Enter bank name"
                  value={bankDetails.bankName}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="modify-bank-field">
                <label htmlFor="accountHolder">Account Holder Name</label>
                <input
                  id="accountHolder"
                  name="accountHolder"
                  type="text"
                  placeholder="Enter account holder name"
                  value={bankDetails.accountHolder}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="modify-bank-field">
                <label htmlFor="accountNumber">Account Number</label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  placeholder="Enter account number"
                  value={bankDetails.accountNumber}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="modify-bank-field">
                <label htmlFor="confirmAccountNumber">Confirm Account Number</label>
                <input
                  id="confirmAccountNumber"
                  name="confirmAccountNumber"
                  type="text"
                  placeholder="Confirm account number"
                  value={bankDetails.confirmAccountNumber}
                  onChange={handleChange}
                  disabled={saving}
                />
                {accountMismatch && (
                  <span className="modify-bank-error">Account numbers do not match</span>
                )}
              </div>

              <div className="modify-bank-field">
                <label htmlFor="ifscCode">IFSC Code</label>
                <input
                  id="ifscCode"
                  name="ifscCode"
                  type="text"
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifscCode}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="modify-bank-modal-actions">
                <button
                  type="button"
                  className="modify-bank-btn modify-bank-btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="modify-bank-btn modify-bank-btn-primary"
                  disabled={saving || !!accountMismatch}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
