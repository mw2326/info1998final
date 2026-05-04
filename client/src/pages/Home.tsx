import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import { Opportunity } from '../types';
import { apiUrl } from '../api';

const QUICK_SEARCHES = [
  { label: 'Food & Meals', term: 'food' },
  { label: 'Environment', term: 'environment' },
  { label: 'Tutoring', term: 'tutor' },
  { label: 'Seniors', term: 'aging' },
  { label: 'Arts & Culture', term: 'arts' },
  { label: 'Health', term: 'health' },
  { label: 'Housing', term: 'habitat' },
  { label: 'Disaster Relief', term: 'red cross' },
];

function Home() {
  const [featured, setFeatured] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl('/api/opportunities'))
      .then((res) => res.json())
      .then((data: Opportunity[]) => {
        setFeatured(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load opportunities. Is the server running?');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Volunteer in Ithaca.<br />Make it count.</h1>
          <p>
            Find local volunteering and shadowing opportunities in the Ithaca community —
            built for Cornell students who want to get involved and build real skills.
          </p>
          <Link to="/opportunities" className="btn-primary btn-lg">
            Browse Opportunities
          </Link>
        </div>
      </section>

      {/* Quick search chips */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse by Interest</h2>
          <div className="category-grid">
            {QUICK_SEARCHES.map(({ label, term }) => (
              <Link
                key={term}
                to={`/opportunities?search=${encodeURIComponent(term)}`}
                className="category-chip"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Opportunities */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Upcoming Opportunities</h2>
            <Link to="/opportunities" className="view-all">View all →</Link>
          </div>
          {loading && <p className="status-msg">Loading opportunities...</p>}
          {error && <p className="status-msg error">{error}</p>}
          {!loading && !error && (
            <div className="card-grid">
              {featured.map((opp, i) => (
                <OpportunityCard key={opp.id ?? opp.url ?? i} opportunity={opp} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container cta-inner">
          <h2>Ready to give back?</h2>
          <p>Create a free account to save opportunities and track your involvement.</p>
          <Link to="/login" className="btn-primary btn-lg">Get Started</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
