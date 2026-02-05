import { useState } from 'react';
import './ManageUsers.css';

const MOCK_USERS = [
  {
    id: 1,
    mobile: '1212121212',
    ownCode: '4907452257850',
    refCode: '875623739399',
    custId: '2257850',
    wallet: '98559193',
    recharge: '0.00',
    firstRecharge: '0.00',
    regDate: '1st Dec 2025',
    password: 'Jalwa123',
    ifsc: '',
    accountNo: '',
  },
  {
    id: 2,
    mobile: '123456789',
    ownCode: '4907452257851',
    refCode: '875623739400',
    custId: '2257851',
    wallet: '5000',
    recharge: '219,180.00',
    firstRecharge: '10.00',
    regDate: '29th Sep 2025',
    password: 'Aa123',
    ifsc: '',
    accountNo: '',
  },
  {
    id: 3,
    mobile: '9876543210',
    ownCode: '4907452257852',
    refCode: '875623739401',
    custId: '2257852',
    wallet: '10170',
    recharge: '50,000.00',
    firstRecharge: '50,000.00',
    regDate: '23rd Jan 2026',
    password: 'noobnoobl',
    ifsc: '',
    accountNo: '',
  },
  {
    id: 4,
    mobile: '9876543211',
    ownCode: '4907452257853',
    refCode: '875623739402',
    custId: '2257853',
    wallet: '28',
    recharge: '0.00',
    firstRecharge: '0.00',
    regDate: '2nd Feb 2026',
    password: 'Pass123',
    ifsc: '',
    accountNo: '',
  },
];

export default function ManageUsers() {
  const [entries, setEntries] = useState(50);
  const [searchMobile, setSearchMobile] = useState('');
  const [searchCustId, setSearchCustId] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = users.filter((u) => {
    const matchMobile = !searchMobile || u.mobile.includes(searchMobile);
    const matchCustId = !searchCustId || u.custId.includes(searchCustId);
    return matchMobile && matchCustId;
  });

  const totalPages = Math.ceil(filteredUsers.length / entries) || 1;
  const startIndex = (currentPage - 1) * entries;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + entries);

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleView = (user) => {
    // In production, open modal or navigate to user details
    console.log('View user:', user);
  };

  return (
    <div className="manage-users-page">
      <header className="manage-users-header">
        <h1>Manage User</h1>
      </header>

      <div className="manage-users-controls">
        <div className="manage-users-entries">
          <label>
            Show{' '}
            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="manage-users-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>{' '}
            entries
          </label>
        </div>
        <div className="manage-users-search">
          <input
            type="text"
            placeholder="Search Mobile"
            value={searchMobile}
            onChange={(e) => {
              setSearchMobile(e.target.value);
              setCurrentPage(1);
            }}
            className="manage-users-search-input"
          />
          <input
            type="text"
            placeholder="Search Cust ID"
            value={searchCustId}
            onChange={(e) => {
              setSearchCustId(e.target.value);
              setCurrentPage(1);
            }}
            className="manage-users-search-input"
          />
        </div>
      </div>

      <div className="manage-users-table-wrapper">
        <table className="manage-users-table">
          <thead>
            <tr>
              <th>Mobile</th>
              <th>Own Code</th>
              <th>Ref. Code</th>
              <th>Cust ID</th>
              <th>Wallet</th>
              <th>Recharge</th>
              <th>1st Recharge</th>
              <th>Reg. Date</th>
              <th>Password</th>
              <th>IFSC</th>
              <th>Account NO.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="12" className="manage-users-empty">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.mobile}</td>
                  <td>{user.ownCode}</td>
                  <td>{user.refCode}</td>
                  <td>{user.custId}</td>
                  <td>
                    <span className="manage-users-wallet">{user.wallet}</span>
                  </td>
                  <td>{user.recharge}</td>
                  <td>{user.firstRecharge}</td>
                  <td>{user.regDate}</td>
                  <td>{user.password}</td>
                  <td>{user.ifsc || '-'}</td>
                  <td>{user.accountNo || '-'}</td>
                  <td>
                    <div className="manage-users-actions">
                      <button
                        type="button"
                        className="manage-users-action-btn manage-users-view-btn"
                        onClick={() => handleView(user)}
                        title="View"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="manage-users-action-btn manage-users-delete-btn"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="manage-users-pagination">
        <span className="manage-users-pagination-info">
          Showing {filteredUsers.length ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + entries, filteredUsers.length)} of{' '}
          {filteredUsers.length} entries
        </span>
        <div className="manage-users-pagination-btns">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="manage-users-page-num">Page {currentPage}</span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
