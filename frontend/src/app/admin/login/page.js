'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '../../../lib/adminApi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('AggarwalSteel@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (adminApi.isAuthenticated()) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminApi.login(username, password);
      if (result.success) {
        router.replace('/admin');
      } else {
        setError(result.message || 'Invalid username or password');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('AggarwalSteel@2026');
    setError('');
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">AS</div>

        <div className="login-header">
          <h2>Aggarwal Steels</h2>
          <p>Industrial Command &amp; Sales Management Portal</p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              fontSize: '0.8rem',
              padding: '10px 14px',
              borderRadius: '6px',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <div className="login-demo-box">
          <div>
            <strong>Authorized Desk Credentials:</strong>
          </div>
          <div>User: <code>admin</code> | Pass: <code>AggarwalSteel@2026</code></div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: 'none',
              border: 'none',
              color: '#f59e0b',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
              padding: '4px 0 0 0',
              textDecoration: 'underline',
            }}
          >
            Click to auto-fill credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group-adm">
            <label htmlFor="loginUser">Desk Username</label>
            <input
              type="text"
              id="loginUser"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              autoComplete="username"
            />
          </div>

          <div className="form-group-adm">
            <label htmlFor="loginPass">Access Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="loginPass"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary-adm"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontSize: '0.95rem',
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Command Desk →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link
            href="/"
            style={{
              color: '#94a3b8',
              fontSize: '0.78rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

