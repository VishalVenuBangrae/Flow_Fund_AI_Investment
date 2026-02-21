import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth';

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
  },
  leftPanel: {
    flex: '1',
    background: 'linear-gradient(135deg, #0f2d25 0%, #1a4d3e 40%, #0d3d2e 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '48px 40px',
  },
  shapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  shape1: {
    position: 'absolute',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.08)',
    top: '-80px',
    right: '-80px',
  },
  shape2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(26, 77, 62, 0.6)',
    bottom: '20%',
    left: '-60px',
  },
  shape3: {
    position: 'absolute',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.06)',
    bottom: '40%',
    right: '15%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'relative',
    zIndex: 1,
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    border: '2px solid rgba(255,255,255,0.9)',
    borderRadius: '50%',
    position: 'relative',
  },
  logoIconInner: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.9)',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  logoText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  centerBlock: {
    position: 'relative',
    zIndex: 1,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: '42px',
    fontWeight: 700,
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  welcomeSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '18px',
    fontWeight: 400,
  },
  siteUrl: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    position: 'relative',
    zIndex: 1,
  },
  rightPanel: {
    width: '480px',
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px 56px',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.06)',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#0f2d25',
    marginBottom: '32px',
  },
  inputWrap: {
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '2px solid #e8e8e8',
    padding: '14px 0',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: 'transparent',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  btnPrimary: {
    width: '100%',
    padding: '16px 24px',
    marginTop: '8px',
    background: 'linear-gradient(90deg, #1a4d3e 0%, #2d6a52 50%, #3d7a5c 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  btnPrimaryArrow: {
    width: '18px',
    height: '18px',
    borderRight: '2px solid #fff',
    borderBottom: '2px solid #fff',
    transform: 'rotate(-45deg)',
    marginLeft: '4px',
  },
  error: {
    color: '#c53030',
    fontSize: '14px',
    marginBottom: '16px',
  },
  divider: {
    margin: '28px 0 24px',
    textAlign: 'center',
    color: '#999',
    fontSize: '13px',
  },
  linkBlock: {
    textAlign: 'center',
    marginTop: '24px',
  },
  link: {
    color: '#1a4d3e',
    fontWeight: 600,
    textDecoration: 'none',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerApi({ first_name, last_name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.layout}>
      <div style={styles.leftPanel}>
        <div style={styles.shapes}>
          <div style={styles.shape1} />
          <div style={styles.shape2} />
          <div style={styles.shape3} />
        </div>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <div style={styles.logoIconInner} />
          </div>
          <span style={styles.logoText}>FLOWFUND</span>
        </div>
        <div style={styles.centerBlock}>
          <h1 style={styles.welcomeTitle}>Create account</h1>
          <p style={styles.welcomeSub}>Join to start managing your finances</p>
        </div>
        <span style={styles.siteUrl}>flowfund.ai</span>
      </div>

      <div style={styles.rightPanel}>
        <h2 style={styles.formTitle}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.inputWrap}>
            <label style={styles.label}>First name</label>
            <input
              type="text"
              style={styles.input}
              placeholder="First name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Last name</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Last name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Creating account...' : 'CONTINUE'}
            {!loading && <span style={styles.btnPrimaryArrow} />}
          </button>
        </form>
        <p style={styles.divider}>Already have an account?</p>
        <div style={styles.linkBlock}>
          <Link style={styles.link} to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
