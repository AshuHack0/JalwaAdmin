import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './WinGoManager.css';

const WINGO_LABELS = {
  '30sec': 'WinGo 30 sec',
  '1min': 'WinGo 1 Min',
  '3min': 'WinGo 3 Min',
  '5min': 'WinGo 5 Min',
};

const NUMBER_RESULTS = {
  0: { text: 'Red + Violet', red: true, violet: true },
  1: { text: 'Green', green: true },
  2: { text: 'Red', red: true },
  3: { text: 'Green', green: true },
  4: { text: 'Red', red: true },
  5: { text: 'Green + Violet', green: true, violet: true },
  6: { text: 'Red', red: true },
  7: { text: 'Green', green: true },
  8: { text: 'Red', red: true },
  9: { text: 'Green', green: true },
};

export default function WinGoManager() {
  const { variant } = useParams();
  const [countdown, setCountdown] = useState(70); // 01:10
  const [prediction, setPrediction] = useState('');
  const [nextPrediction, setNextPrediction] = useState(null);
  const [liveBets, setLiveBets] = useState([]);

  const label = WINGO_LABELS[variant] || 'WinGo 3 Min';
  const periodId = '20260124100020365';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c <= 0 ? 70 : c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleConfirmPrediction = (e) => {
    e.preventDefault();
    const num = parseInt(prediction, 10);
    if (num >= 0 && num <= 9) {
      setNextPrediction(num);
      setPrediction('');
    }
  };

  const handleUnsetPrediction = () => {
    setNextPrediction(null);
  };

  return (
    <div className="wingo-page">
      <header className="wingo-header">
        <div className="wingo-header-left">
          <h1>{label}</h1>
          <span className="wingo-countdown">Count Down : {formatTime(countdown)}</span>
        </div>
        <div className="wingo-header-right">
          <span className="wingo-period">Period Id : {periodId}</span>
        </div>
      </header>

      <section className="wingo-prediction-section">
        <div className="wingo-prediction-status">
          Next prediction :{' '}
          <span className={nextPrediction !== null ? 'set' : 'not-set'}>
            {nextPrediction !== null ? nextPrediction : 'NOT SET'}
          </span>
        </div>
        <h3 className="wingo-form-label">Prediction Form</h3>
        <form onSubmit={handleConfirmPrediction} className="wingo-prediction-form">
          <input
            type="number"
            min="0"
            max="9"
            placeholder="Enter a number from 0-9"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            className="wingo-prediction-input"
          />
          <div className="wingo-form-buttons">
            <button type="submit" className="wingo-btn wingo-btn-primary">
              Confirm Next Prediction
            </button>
            <button
              type="button"
              className="wingo-btn wingo-btn-secondary"
              onClick={handleUnsetPrediction}
            >
              Unset Prediction
            </button>
          </div>
        </form>
      </section>

      <section className="wingo-total-bet">
        TOTAL BET AMOUNT : 0
      </section>

      <section className="wingo-bet-summary">
        <table className="wingo-table">
          <thead>
            <tr>
              <th>Result</th>
              <th>Number</th>
              <th>Bet</th>
              <th>No. of User</th>
              <th>Amount to Pay</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
              const res = NUMBER_RESULTS[num];
              return (
                <tr key={num}>
                  <td>
                    <span className="wingo-result">
                      {res.red && <span className="red">Red</span>}
                      {res.red && res.violet && ' + '}
                      {res.green && <span className="green">Green</span>}
                      {res.green && res.violet && ' + '}
                      {res.violet && <span>Violet</span>}
                    </span>
                  </td>
                  <td>{num}</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0.00</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="wingo-live-bets">
        <h3>Live Bets</h3>
        <table className="wingo-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Value</th>
              <th>Amount</th>
              <th>Mobile</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {liveBets.length === 0 ? (
              <tr>
                <td colSpan="5" className="wingo-empty">
                  No data available in table
                </td>
              </tr>
            ) : (
              liveBets.map((bet) => (
                <tr key={bet.id}>
                  <td>{bet.userId}</td>
                  <td>{bet.value}</td>
                  <td>{bet.amount}</td>
                  <td>{bet.mobile}</td>
                  <td>{bet.balance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="wingo-pagination">
          Showing 0 to 0 of 0 entries
          <div className="wingo-pagination-btns">
            <button disabled>Previous</button>
            <button disabled>Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
