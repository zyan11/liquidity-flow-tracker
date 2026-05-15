import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const ASSETS = [
  { name: 'US Stocks', emoji: '📈' },
  { name: 'Bitcoin', emoji: '₿' },
  { name: 'Gold', emoji: '🥇' },
  { name: 'Bonds', emoji: '📊' },
  { name: 'Dollar', emoji: '💵' },
  { name: 'Ethereum', emoji: '⟠' },
  { name: 'Oil', emoji: '🛢️' },
  { name: 'EM Markets', emoji: '🌍' },
];

const SCENARIOS = {
  'Risk-On': [90, 85, 30, 20, 40, 80, 70, 75],
  'Risk-Off': [15, 10, 85, 90, 80, 12, 20, 10],
  'Inflationary': [50, 70, 90, 10, 20, 60, 85, 55],
  'Recessionary': [20, 25, 75, 85, 70, 20, 15, 15],
  'Weak Dollar': [65, 88, 92, 45, 5, 85, 80, 80],
};

const SIGNALS = {
  'Risk-On': ['VIX below 15 — fear is low', 'Bitcoin leading altcoins up', 'Tech stocks at highs', 'Bond yields rising'],
  'Risk-Off': ['VIX spiking above 30', 'Gold breaking out', 'Investors fleeing to safety', 'Stocks selling off'],
  'Inflationary': ['CPI above 4%', 'Gold and Oil surging', 'Real yields negative', 'Fed behind the curve'],
  'Recessionary': ['GDP contracting', 'Yield curve inverted', 'Unemployment rising', 'Credit spreads widening'],
  'Weak Dollar': ['DXY below 100', 'Commodities rallying', 'EM assets outperforming', 'Crypto gaining vs USD'],
};

function getColor(value) {
  if (value >= 70) return '#00ff88';
  if (value >= 40) return '#ffaa00';
  return '#ff4466';
}

function App() {
  const [scenario, setScenario] = useState('Risk-On');
  const [animated, setAnimated] = useState(true);
  const [prices, setPrices] = useState({ btc: '...', eth: '...', gold: '...', dxy: '...' });

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
        );
        const data = await res.json();
        setPrices(prev => ({
          ...prev,
          btc: '$' + data.bitcoin.usd.toLocaleString(),
          eth: '$' + data.ethereum.usd.toLocaleString(),
        }));
      } catch {
        setPrices(prev => ({ ...prev, btc: 'N/A', eth: 'N/A' }));
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const values = SCENARIOS[scenario];

  const styles = {
    app: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 100%)',
      color: '#e0e0e0',
      padding: '20px',
      fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #00ff88, #00aaff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
    },
    subtitle: {
      color: '#666',
      fontSize: '13px',
    },
    prices: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap',
      marginBottom: '24px',
    },
    priceChip: {
      background: '#111',
      border: '1px solid #222',
      borderRadius: '8px',
      padding: '6px 14px',
      fontSize: '13px',
      color: '#00ff88',
    },
    scenarioRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      flexWrap: 'wrap',
      marginBottom: '28px',
    },
    scenarioBtn: (active) => ({
      padding: '8px 18px',
      borderRadius: '20px',
      border: active ? '2px solid #00ff88' : '2px solid #333',
      background: active ? '#00ff8820' : '#111',
      color: active ? '#00ff88' : '#888',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: active ? 'bold' : 'normal',
      transition: 'all 0.2s',
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '14px',
      maxWidth: '900px',
      margin: '0 auto 28px auto',
    },
    card: {
      background: '#111',
      border: '1px solid #1e1e2e',
      borderRadius: '12px',
      padding: '16px',
    },
    cardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    assetName: {
      fontSize: '15px',
      fontWeight: '600',
    },
    flowValue: (val) => ({
      fontSize: '18px',
      fontWeight: 'bold',
      color: getColor(val),
    }),
    barBg: {
      background: '#1a1a2e',
      borderRadius: '6px',
      height: '10px',
      overflow: 'hidden',
    },
    barFill: (val) => ({
      width: animated ? `${val}%` : '0%',
      height: '100%',
      background: `linear-gradient(90deg, ${getColor(val)}, ${getColor(val)}88)`,
      borderRadius: '6px',
      transition: 'width 1s ease',
    }),
    label: (val) => ({
      marginTop: '6px',
      fontSize: '11px',
      color: getColor(val),
    }),
    signals: {
      maxWidth: '900px',
      margin: '0 auto 20px auto',
      background: '#111',
      border: '1px solid #1e1e2e',
      borderRadius: '12px',
      padding: '16px 20px',
    },
    signalTitle: {
      fontSize: '13px',
      color: '#888',
      marginBottom: '10px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    signalList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    signalChip: {
      background: '#0d1117',
      border: '1px solid #00ff8840',
      borderRadius: '20px',
      padding: '5px 12px',
      fontSize: '12px',
      color: '#00ff88',
    },
    footer: {
      textAlign: 'center',
      color: '#333',
      fontSize: '11px',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚡ Liquidity Flow Tracker</h1>
        <p style={styles.subtitle}>Real-time capital flow across major asset classes</p>
      </div>

      <div style={styles.prices}>
        <span style={styles.priceChip}>₿ BTC {prices.btc}</span>
        <span style={styles.priceChip}>⟠ ETH {prices.eth}</span>
      </div>

      <div style={styles.scenarioRow}>
        {Object.keys(SCENARIOS).map(s => (
          <button
            key={s}
            style={styles.scenarioBtn(scenario === s)}
            onClick={() => { setScenario(s); setAnimated(false); setTimeout(() => setAnimated(true), 50); }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {ASSETS.map((asset, i) => {
          const val = values[i];
          const label = val >= 70 ? '🟢 Strong Inflow' : val >= 40 ? '🟡 Neutral' : '🔴 Outflow';
          return (
            <div key={asset.name} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.assetName}>{asset.emoji} {asset.name}</span>
                <span style={styles.flowValue(val)}>{val}%</span>
              </div>
              <div style={styles.barBg}>
                <div style={styles.barFill(val)} />
              </div>
              <div style={styles.label(val)}>{label}</div>
            </div>
          );
        })}
      </div>

      <div style={styles.signals}>
        <div style={styles.signalTitle}>📡 Market Signals — {scenario}</div>
        <div style={styles.signalList}>
          {SIGNALS[scenario].map((sig, i) => (
            <span key={i} style={styles.signalChip}>{sig}</span>
          ))}
        </div>
      </div>

      <div style={styles.footer}>
        Live BTC & ETH prices via CoinGecko · Refreshes every 60s · For educational use only
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
