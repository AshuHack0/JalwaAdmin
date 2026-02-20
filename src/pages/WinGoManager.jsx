import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCurrentRound } from '../utils/api';
import './WinGoManager.css';

const WINGO_LABELS = {
  '30sec': 'WinGo 30 sec',
  '1min': 'WinGo 1 Min',
  '3min': 'WinGo 3 Min',
  '5min': 'WinGo 5 Min',
};

const COLOR_DISPLAY = {
  RED_VIOLET: { text: 'Red + Violet', red: true, violet: true },
  GREEN: { text: 'Green', green: true },
  RED: { text: 'Red', red: true },
  GREEN_VIOLET: { text: 'Green + Violet', green: true, violet: true },
};

// Map of numbers 0-9 to colors for display
const NUMBER_COLORS = {
  0: 'RED_VIOLET',
  1: 'GREEN',
  2: 'RED',
  3: 'GREEN',
  4: 'RED',
  5: 'GREEN_VIOLET',
  6: 'RED',
  7: 'GREEN',
  8: 'RED',
  9: 'GREEN',
};

export default function WinGoManager() {
  const { variant } = useParams();
  const [predictionInput, setPredictionInput] = useState('');
  const [nextPrediction, setNextPrediction] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [periodId, setPeriodId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Stats placeholders for now
  const totalBetAmount = 0;
  const betStats = [];

  const label = WINGO_LABELS[variant] || 'WinGo 3 Min';

  const isRefreshing = useRef(false);
  const isFetchingRef = useRef(false);

  const loadData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    try {
      const roundRes = await fetchCurrentRound(variant);

      if (roundRes.success && roundRes.data) {
        const d = roundRes.data;
        const current = d.currentRound;
        if (current) {
          setPeriodId(current.period || '');
          const now = new Date();
          const endsAt = new Date(current.endsAt);
          const remainingMs = Math.max(0, endsAt.getTime() - now.getTime());
          setCountdown(Math.floor(remainingMs / 1000));
        }
      }

      setError('');
    } catch (err) {
      console.error('Error loading data:', err);
      if (!err.message?.includes('401') && !err.message?.includes('403')) {
        setError('Error fetching data from server');
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [variant]);

  // Initial load when component mounts or variant changes
  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  // Local 1-second countdown; fetch fresh data when it hits 0
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
        
        if (prev === 0 && !isRefreshing.current) {
          isRefreshing.current = true;
          (async () => {
            await loadData();
            setTimeout(() => {
              isRefreshing.current = false;
            }, 500);
          })();
        }
        
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loadData]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getColorDisplay = (colorKey) => {
    return COLOR_DISPLAY[colorKey] || { text: colorKey, red: false, green: false, violet: false };
  };

  if (loading) {
    return (
      <div className="wingo-container">
        <div className="wingo-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="wingo-container">
      {error && <div className="wingo-error">{error}</div>}

      <div className="wingo-page-header">
        <div className="header-left">
          <h1 className="game-title">{label}</h1>
          <div className="game-countdown">Count Down : {formatTime(countdown)}</div>
        </div>
        <div className="header-center">
          <div className="prediction-content-wrapper">
            <div className="prediction-banner">
               Next prediction : <span className={nextPrediction !== null ? 'prediction-value' : 'prediction-not-set'}>
                 {nextPrediction !== null ? nextPrediction : 'NOT SET'}
               </span>
            </div>
            <div className="prediction-subtitle">Prediction Form</div>
          </div>
        </div>
        <div className="header-right">
          <div className="period-id">Period Id : {periodId}</div>
        </div>
      </div>

      <section className="prediction-form-section">
        <form onSubmit={(e) => e.preventDefault()} className="prediction-form">
          <input
            type="number"
            min="0"
            max="9"
            placeholder="Enter a number from 0-9"
            value={predictionInput}
            onChange={(e) => setPredictionInput(e.target.value)}
            className="prediction-input"
            disabled
          />
          <div className="prediction-actions">
            <button type="button" className="btn btn-confirm" disabled>
              Confirm Next Prediction
            </button>
            <button
              type="button"
              className="btn btn-unset"
              disabled
            >
              Unset Prediction
            </button>
          </div>
        </form>
      </section>

      <section className="stats-section">
        <div className="total-bet-amount">TOTAL BET AMOUNT : {totalBetAmount}</div>
        
        <div className="table-container">
          <table className="wingo-data-table result-table">
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
                const colorKey = NUMBER_COLORS[num];
                const display = getColorDisplay(colorKey);
                const stat = betStats.find(s => s.number === num) || { bet: 0, userCount: 0, amountToPay: 0 };
                
                return (
                  <tr key={num}>
                    <td>
                      <span className="result-text">
                        {display.green && <span className="text-green">Green</span>}
                        {display.green && display.violet && <span className="text-sep"> + </span>}
                        {display.red && <span className="text-red">Red</span>}
                        {display.red && display.violet && <span className="text-sep"> + </span>}
                        {display.violet && <span className="text-violet">Violet</span>}
                      </span>
                    </td>
                    <td>{num}</td>
                    <td>—</td>
                    <td>—</td>
                    <td>0.00</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      
      <footer className="page-footer">
        Copyright © SPA4KY 2025
      </footer>
    </div>
  );
}
