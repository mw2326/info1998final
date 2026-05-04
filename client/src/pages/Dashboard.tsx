import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OpportunityCard from '../components/OpportunityCard';
import { Opportunity } from '../types';
import { apiUrl } from '../api';

function Dashboard() {
  const { user, token, loading } = useAuth();
  const [saved, setSaved] = useState<Opportunity[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }

    fetch(apiUrl(`/api/users/${user.uid}/saved`), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json() as Promise<Opportunity[]>)
      .then((data) => { setSaved(data); setFetching(false); })
      .catch(() => { setError('Could not load saved opportunities.'); setFetching(false); });
  }, [user, token, loading, navigate]);

  const handleUnsave = async (oppId: string) => {
    if (!user) return;
    const res = await fetch(apiUrl(`/api/users/${user.uid}/saved/${oppId}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSaved((prev) => prev.filter((o) => o.id !== oppId));
    }
  };

  if (loading || !user) return null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user.name ?? user.email}.</p>
        </div>
      </div>

      <div className="container section">
        <h2>Saved Opportunities</h2>

        {fetching && <p className="status-msg">Loading your saved opportunities...</p>}
        {error && <p className="status-msg error">{error}</p>}

        {!fetching && !error && saved.length === 0 && (
          <div className="empty-state">
            <p>You haven't saved any opportunities yet.</p>
            <Link to="/opportunities" className="btn-primary">Browse opportunities</Link>
          </div>
        )}

        {!fetching && !error && saved.length > 0 && (
          <div className="saved-list">
            {saved.map((opp) => (
              <div key={opp.id} className="saved-item">
                <div className="saved-card-wrap">
                  <OpportunityCard opportunity={opp} />
                </div>
                <button
                  className="btn-danger btn-unsave"
                  onClick={() => opp.id && handleUnsave(opp.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
