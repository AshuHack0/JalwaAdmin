import './Placeholder.css';

export default function Placeholder({ title = 'Coming Soon' }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>{title}</h2>
        <p>This section is under development.</p>
      </div>
    </div>
  );
}
