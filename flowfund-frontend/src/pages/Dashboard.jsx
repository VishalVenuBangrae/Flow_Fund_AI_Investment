import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout as logoutApi } from '../api/auth';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8faf9 0%, #fff 100%)',
    padding: '32px 48px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '48px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e8ecea',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    border: '2px solid #1a4d3e',
    borderRadius: '50%',
    position: 'relative',
  },
  logoIconInner: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    border: '2px solid #1a4d3e',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  logoText: {
    color: '#0f2d25',
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  btnLogout: {
    padding: '10px 20px',
    background: '#fff',
    color: '#1a4d3e',
    border: '2px solid #1a4d3e',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  card: {
    maxWidth: '520px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(15, 45, 37, 0.08)',
    padding: '40px',
    border: '1px solid #e8ecea',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#0f2d25',
    marginBottom: '24px',
  },
  row: {
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
  },
  rowLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  },
  label: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '4px',
  },
  value: {
    fontSize: '16px',
    color: '#0f2d25',
    fontWeight: 500,
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 600,
    background: 'rgba(26, 77, 62, 0.12)',
    color: '#1a4d3e',
  },
  loading: {
    color: '#666',
    fontSize: '16px',
  },
  error: {
    color: '#c53030',
    fontSize: '14px',
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile()
      .then(({ data }) => setProfile(data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (_) {}
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <div style={styles.logoIconInner} />
            </div>
            <span style={styles.logoText}>FLOWFUND</span>
          </div>
        </div>
        <p style={styles.loading}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <div style={styles.logoIconInner} />
            </div>
            <span style={styles.logoText}>FLOWFUND</span>
          </div>
          <button style={styles.btnLogout} onClick={handleLogout}>Log out</button>
        </div>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'User';

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <div style={styles.logoIconInner} />
          </div>
          <span style={styles.logoText}>FLOWFUND</span>
        </div>
        <button style={styles.btnLogout} onClick={handleLogout}>Log out</button>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Profile</h2>
        <div style={styles.row}>
          <div style={styles.label}>Name</div>
          <div style={styles.value}>{fullName}</div>
        </div>
        <div style={styles.row}>
          <div style={styles.label}>Email</div>
          <div style={styles.value}>{profile.email}</div>
        </div>
        <div style={{ ...styles.row, ...styles.rowLast }}>
          <div style={styles.label}>Role</div>
          <div style={styles.value}>
            <span style={styles.roleBadge}>{profile.role_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
