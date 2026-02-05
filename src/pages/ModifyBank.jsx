import { useState } from 'react';
import './ModifyBank.css';

export default function ModifyBank() {
  const [userId, setUserId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
  });

  const openModal = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      setIsModalOpen(true);
      setBankDetails({
        bankName: '',
        accountHolder: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      return;
    }
    // In production, send to backend
    console.log('Update bank for user', userId, bankDetails);
    closeModal();
  };

  return (
    <div className="modify-bank-page">
      <h1 className="modify-bank-title">Modify Bank</h1>

      <section className="modify-bank-section">
        <div className="modify-bank-header">Select User to Update Bank Details</div>

        <form onSubmit={openModal} className="modify-bank-form">
          <div className="modify-bank-field">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="modify-bank-actions">
            <button type="submit" className="modify-bank-btn">
              Update Bank Details
            </button>
          </div>
        </form>
      </section>

      {isModalOpen && (
        <div className="modify-bank-modal-overlay" onClick={closeModal}>
          <div
            className="modify-bank-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modify-bank-modal-header">
              <h2>Update Bank Details</h2>
              <span className="modify-bank-modal-close" onClick={closeModal}>
                ×
              </span>
            </div>

            <div className="modify-bank-modal-subtitle">
              User ID: <strong>{userId}</strong>
            </div>

            <form onSubmit={handleSave} className="modify-bank-modal-form">
              <div className="modify-bank-field">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  placeholder="Enter bank name"
                  value={bankDetails.bankName}
                  onChange={handleChange}
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
                />
                {bankDetails.accountNumber &&
                  bankDetails.confirmAccountNumber &&
                  bankDetails.accountNumber !== bankDetails.confirmAccountNumber && (
                    <span className="modify-bank-error">
                      Account numbers do not match
                    </span>
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
                />
              </div>

              <div className="modify-bank-modal-actions">
                <button
                  type="button"
                  className="modify-bank-btn modify-bank-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modify-bank-btn modify-bank-btn-primary"
                  disabled={
                    bankDetails.accountNumber !== bankDetails.confirmAccountNumber
                  }
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
