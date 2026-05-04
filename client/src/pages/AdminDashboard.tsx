import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Opportunity } from '../types';

const CATEGORIES = ['Food & Hunger', 'Housing', 'Education', 'Healthcare', 'Community', 'Environment', 'Animals', 'Social Services'];

const EMPTY_FORM = { title: '', organization: '', description: '', category: '', location: '', date: '', spots: 10 };

type FormState = typeof EMPTY_FORM;

function AdminDashboard() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/'); return; }
    fetchOpportunities();
  }, [user, loading, navigate]);

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json() as Opportunity[];
      setOpportunities(data);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/opportunities/${editing}` : '/api/opportunities';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, spots: Number(form.spots) }),
      });
      const data = await res.json() as { error?: string };

      if (res.ok) {
        setSuccess(editing ? 'Opportunity updated!' : 'Opportunity created!');
        setForm(EMPTY_FORM);
        setEditing(null);
        fetchOpportunities();
      } else {
        setError(data.error ?? 'Something went wrong.');
      }
    } catch {
      setError('Could not connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (opp: Opportunity) => {
    if (!opp.id) return;
    setEditing(opp.id);
    setForm({
      title: opp.title ?? '',
      organization: opp.organization ?? '',
      description: opp.description ?? '',
      category: opp.category ?? '',
      location: opp.location ?? '',
      date: opp.date ?? '',
      spots: opp.spots ?? 10,
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await fetch(`/api/opportunities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOpportunities();
    } catch {
      alert('Failed to delete opportunity.');
    }
  };

  if (loading || !user) return null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Create, edit, and delete volunteer opportunities.</p>
        </div>
      </div>

      <div className="container admin-layout">
        <div className="admin-form-section">
          <h2>{editing ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>

          {error && <p className="form-error" style={{ marginBottom: '12px' }}>{error}</p>}
          {success && <p className="save-msg" style={{ marginBottom: '12px', fontSize: '0.95rem' }}>{success}</p>}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Food Bank Volunteer" required />
            </div>
            <div className="form-group">
              <label>Organization *</label>
              <input name="organization" value={form.organization} onChange={handleChange} placeholder="e.g. Ithaca Food Bank" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the opportunity..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Spots Available</label>
                <input name="spots" type="number" min="1" value={form.spots} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Ithaca, NY" />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Opportunity'}
              </button>
              {editing && (
                <button type="button" className="btn-outline" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-list-section">
          <h2>All Opportunities ({opportunities.length})</h2>

          {fetching && <p className="status-msg">Loading...</p>}

          {!fetching && opportunities.length === 0 && (
            <p className="status-msg">No opportunities yet. Create one using the form.</p>
          )}

          {opportunities.map((opp) => (
            <div key={opp.id} className={`admin-list-item ${editing === opp.id ? 'editing' : ''}`}>
              <div className="admin-list-info">
                <strong>{opp.title}</strong>
                <p>{opp.organization} · {opp.category} · {opp.date || 'No date'}</p>
              </div>
              <div className="admin-list-actions">
                <button className="btn-outline" onClick={() => handleEdit(opp)}>Edit</button>
                <button className="btn-danger" onClick={() => opp.id && handleDelete(opp.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
