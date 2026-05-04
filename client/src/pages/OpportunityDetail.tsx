import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Opportunity } from '../types';

function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<Opportunity>;
      })
      .then((data) => { setOpportunity(data); setLoading(false); })
      .catch(() => { setError('Opportunity not found.'); setLoading(false); });
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      setSaveMsg('Please sign in to save opportunities.');
      return;
    }

    const res = await fetch(`/api/users/${user.uid}/saved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ opportunityId: id }),
    });
    const data = await res.json() as { error?: string };

    if (res.ok) {
      setSaved(true);
      setSaveMsg('Saved to your dashboard!');
    } else {
      setSaveMsg(data.error ?? 'Something went wrong.');
    }
  };

  if (loading) return <div className="container status-msg">Loading...</div>;
  if (error || !opportunity) return (
    <div className="container detail-page">
      <p className="status-msg error">{error}</p>
      <Link to="/opportunities" className="back-link">← Back to opportunities</Link>
    </div>
  );

  const formattedDate = opportunity.date
    ? new Date(opportunity.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
    : 'Ongoing';

  return (
    <div className="container detail-page">
      <Link to="/opportunities" className="back-link">← Back to opportunities</Link>

      <div className="detail-header">
        {opportunity.category && <span className="category-tag">{opportunity.category}</span>}
        <h1>{opportunity.title}</h1>
        <p className="detail-org">{opportunity.organization}</p>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <h2>About this opportunity</h2>
          <p>{opportunity.description}</p>
        </div>

        <aside className="detail-sidebar">
          <div className="detail-info-card">
            <div className="info-row">
              <span className="info-label">Date</span>
              <span>{formattedDate}</span>
            </div>
            {opportunity.location && (
              <div className="info-row">
                <span className="info-label">Location</span>
                <span>{opportunity.location}</span>
              </div>
            )}
            {opportunity.spots !== undefined && (
              <div className="info-row">
                <span className="info-label">Spots</span>
                <span>{opportunity.spots}</span>
              </div>
            )}
            {opportunity.organization && (
              <div className="info-row">
                <span className="info-label">Organization</span>
                <span>{opportunity.organization}</span>
              </div>
            )}
            <button
              className={`btn-primary btn-full ${saved ? 'btn-saved' : ''}`}
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? 'Saved ✓' : 'Save Opportunity'}
            </button>
            {saveMsg && <p className="save-msg">{saveMsg}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default OpportunityDetail;
