import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import { Opportunity } from '../types';
import { apiUrl } from '../api';

const CATEGORIES = [
  'Food & Hunger', 'Housing', 'Education', 'Healthcare',
  'Community', 'Environment', 'Animals', 'Social Services',
];

function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    fetch(apiUrl(`/api/opportunities?${params.toString()}`))
      .then((res) => res.json())
      .then((data: Opportunity[]) => {
        setAllOpportunities(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load opportunities. Is the server running?');
        setLoading(false);
      });
  }, [category]);

  const opportunities = search
    ? allOpportunities.filter(
        (opp) =>
          opp.title?.toLowerCase().includes(search.toLowerCase()) ||
          opp.description?.toLowerCase().includes(search.toLowerCase()) ||
          opp.organization?.toLowerCase().includes(search.toLowerCase())
      )
    : allOpportunities;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('search') as string;
    const next = new URLSearchParams();
    if (q) next.set('search', q);
    if (category) next.set('category', category);
    setSearchParams(next);
  };

  const handleCategory = (cat: string) => {
    const next = new URLSearchParams();
    if (search) next.set('search', search);
    if (cat && cat !== category) next.set('category', cat);
    setSearchParams(next);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Volunteer Opportunities</h1>
          <p>Find ways to serve the Ithaca community that match your interests and schedule.</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              name="search"
              type="text"
              placeholder="Search by keyword or organization..."
              defaultValue={search}
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="listings-layout container">
        <aside className="filters">
          <h3>Category</h3>
          <button
            className={`filter-btn ${!category ? 'active' : ''}`}
            onClick={() => handleCategory('')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <div>
          {loading && <p className="status-msg">Loading...</p>}
          {error && <p className="status-msg error">{error}</p>}
          {!loading && !error && opportunities.length === 0 && (
            <p className="status-msg">No opportunities found. Try a different search.</p>
          )}
          {!loading && !error && opportunities.length > 0 && (
            <>
              <p className="results-count">
                {opportunities.length} {opportunities.length !== 1 ? 'opportunities' : 'opportunity'} found
              </p>
              <div className="card-grid">
                {opportunities.map((opp, i) => (
                  <OpportunityCard key={opp.id ?? opp.url ?? i} opportunity={opp} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Opportunities;
