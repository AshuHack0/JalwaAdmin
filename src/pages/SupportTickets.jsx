import { useState, useEffect, useCallback } from 'react';
import { fetchSupportTickets, updateSupportTicketStatus } from '../utils/api';
import { BASE_URL } from '../utils/api';
import './SupportTickets.css';

const STATUS_LABELS = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const STATUS_OPTIONS = ['pending', 'in-progress', 'resolved', 'rejected'];

const TYPE_LABELS = {
  'deposit-report': 'Deposit Report',
  'withdrawal-statement': 'Withdrawal Statement',
  'change-password': 'Change Password',
  'delete-withdraw-bank': 'Delete Withdraw Bank',
  'delete-upi-rebind': 'Delete UPI / Rebind',
  'delete-usdt-rebind': 'Delete USDT / Rebind',
  'modify-ifsc': 'Modify IFSC',
  'change-bank-name': 'Change Bank Name',
};

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export default function SupportTickets({ title, ticketTypes }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail/action modal
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveMsgType, setSaveMsgType] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // If multiple types, fetch each and merge (most cases are single type)
      if (ticketTypes && ticketTypes.length > 1) {
        const results = await Promise.all(
          ticketTypes.map((type) =>
            fetchSupportTickets({ type, status: statusFilter, page, search })
          )
        );
        const merged = results.flatMap((r) => r.data.tickets);
        merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTickets(merged);
        setTotal(results.reduce((s, r) => s + r.data.total, 0));
        setPages(Math.max(...results.map((r) => r.data.pages)));
      } else {
        const type = ticketTypes?.[0];
        const res = await fetchSupportTickets({ type, status: statusFilter, page, search });
        setTickets(res.data.tickets);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [ticketTypes, statusFilter, page, search]);

  useEffect(() => { load(); }, [load]);

  // Debounce search
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const openDetail = (ticket) => {
    setSelected(ticket);
    setNewStatus(ticket.status);
    setRemark(ticket.remark || '');
    setSaveMsg('');
  };

  const closeDetail = () => {
    setSelected(null);
    setSaveMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await updateSupportTicketStatus(selected._id, newStatus, remark);
      const updated = res.data.ticket;
      setTickets((prev) =>
        prev.map((t) => (t._id === updated._id ? { ...t, status: updated.status, remark: updated.remark } : t))
      );
      setSelected((s) => ({ ...s, status: updated.status, remark: updated.remark }));
      setSaveMsgType('success');
      setSaveMsg('Ticket updated successfully');
    } catch (err) {
      setSaveMsgType('error');
      setSaveMsg(err.message || 'Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="st-page">
      <header className="st-header">
        <h1>{title}</h1>
        <span className="st-total">{total} ticket{total !== 1 ? 's' : ''}</span>
      </header>

      <div className="st-controls">
        <input
          type="text"
          className="st-search"
          placeholder="Search by phone or UID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="st-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {error && <p className="st-msg st-msg--error">{error}</p>}

      <div className="st-table-wrapper">
        <table className="st-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="st-empty">Loading...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan="5" className="st-empty">No tickets found.</td></tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>
                    <div className="st-user">
                      <span className="st-phone">{ticket.user?.phone || '-'}</span>
                      {ticket.user?.uid && <span className="st-uid">UID: {ticket.user.uid}</span>}
                    </div>
                  </td>
                  <td>{TYPE_LABELS[ticket.type] || ticket.type}</td>
                  <td>
                    <span className={`st-badge st-badge--${ticket.status}`}>
                      {STATUS_LABELS[ticket.status] || ticket.status}
                    </span>
                  </td>
                  <td className="st-date">{formatDate(ticket.createdAt)}</td>
                  <td>
                    <button className="st-view-btn" onClick={() => openDetail(ticket)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="st-pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {selected && (
        <div className="st-modal-overlay" onClick={closeDetail}>
          <div className="st-modal" onClick={(e) => e.stopPropagation()}>
            <div className="st-modal-header">
              <h2>Ticket Details</h2>
              <span className="st-modal-close" onClick={closeDetail}>×</span>
            </div>

            <div className="st-modal-meta">
              <div className="st-meta-row">
                <span className="st-meta-label">User</span>
                <span>{selected.user?.phone || '-'} {selected.user?.uid ? `(UID: ${selected.user.uid})` : ''}</span>
              </div>
              <div className="st-meta-row">
                <span className="st-meta-label">Type</span>
                <span>{TYPE_LABELS[selected.type] || selected.type}</span>
              </div>
              <div className="st-meta-row">
                <span className="st-meta-label">Submitted</span>
                <span>{formatDate(selected.createdAt)}</span>
              </div>
            </div>

            {Object.keys(selected.fields || {}).length > 0 && (
              <div className="st-modal-section">
                <h3>Fields</h3>
                <div className="st-fields">
                  {Object.entries(selected.fields).map(([k, v]) => (
                    <div key={k} className="st-field-row">
                      <span className="st-field-key">{k}</span>
                      <span className="st-field-val">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.files?.length > 0 && (
              <div className="st-modal-section">
                <h3>Attachments</h3>
                <div className="st-files">
                  {selected.files.map((f, i) => {
                    const isImage = f.mimetype?.startsWith('image/');
                    return (
                      <div key={i} className="st-file-item">
                        {isImage && (
                          <a href={`${BASE_URL}${f.url}`} target="_blank" rel="noreferrer">
                            <img
                              src={`${BASE_URL}${f.url}`}
                              alt={f.originalName}
                              className="st-file-preview"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </a>
                        )}
                        <div className="st-file-info">
                          <a
                            href={`${BASE_URL}${f.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="st-file-link"
                          >
                            {f.fieldName} — {f.originalName}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="st-modal-form">
              <h3>Update Status</h3>
              {saveMsg && (
                <p className={`st-msg st-msg--${saveMsgType}`}>{saveMsg}</p>
              )}
              <div className="st-form-row">
                <label>Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} disabled={saving}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div className="st-form-row">
                <label>Remark</label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  placeholder="Optional remark..."
                  disabled={saving}
                />
              </div>
              <div className="st-modal-actions">
                <button type="button" className="st-btn st-btn--secondary" onClick={closeDetail}>Close</button>
                <button type="submit" className="st-btn st-btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
