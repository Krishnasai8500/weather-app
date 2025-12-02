import { useState } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;  // <-- put your key here

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        }
        throw new Error('Failed to fetch weather');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f172a',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15,23,42,0.9)',
          boxShadow: '0 20px 45px rgba(0,0,0,0.45)',
          border: '1px solid rgba(148,163,184,0.4)',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          🌤 Simple Weather
        </h1>

        <form onSubmit={fetchWeather} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter city name, e.g. London"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '999px',
              border: '1px solid rgba(148,163,184,0.7)',
              marginBottom: '0.5rem',
              outline: 'none',
              backgroundColor: '#020617',
              color: 'white',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background:
                'linear-gradient(135deg, rgb(56,189,248), rgb(52,211,153))',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>

        {error && (
          <div
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(248,113,113,0.6)',
              fontSize: '0.9rem',
              marginBottom: '0.75rem',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {weather && (
          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: '12px',
              background:
                'radial-gradient(circle at top, rgba(56,189,248,0.25), transparent 55%), #020617',
              border: '1px solid rgba(148,163,184,0.4)',
            }}
          >
            <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>
              {weather.name}, {weather.sys?.country}
            </h2>
            <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 600 }}>
              {Math.round(weather.main.temp)}°C
            </p>
            <p style={{ margin: '0.25rem 0 0.5rem', textTransform: 'capitalize' }}>
              {weather.weather?.[0]?.description}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
                opacity: 0.9,
              }}
            >
              <span>Feels like: {Math.round(weather.main.feels_like)}°C</span>
              <span>Humidity: {weather.main.humidity}%</span>
            </div>
          </div>
        )}

        {!weather && !error && !loading && (
          <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '0.25rem' }}>
            Tip: try searching for major cities first to test it out.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
