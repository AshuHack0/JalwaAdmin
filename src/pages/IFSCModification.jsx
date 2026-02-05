import './IFSCModification.css';

export default function IFSCModification() {
  const records = [];

  return (
    <div className="ifsc-page">
      <header className="ifsc-header">
        <h1>IFSC Modification</h1>
      </header>

      <div className="ifsc-table-wrapper">
        <table className="ifsc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Order No</th>
              <th>Ifsc Code</th>
              <th>Bank Account No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" className="ifsc-empty">
                  No results found.
                </td>
              </tr>
            ) : (
              records.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.userId}</td>
                  <td>{row.orderNo}</td>
                  <td>{row.ifscCode}</td>
                  <td>{row.bankAccountNo}</td>
                  <td>{row.actions}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
