/**
 * Simple file-backed JSON store. No native bindings needed.
 * In production this would be replaced with a real database (e.g. PostgreSQL + Prisma).
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

const DEFAULT_STATE = {
  opportunities: [],
  users: [],
  savedOpportunities: [],
  nextId: { opportunities: 1, users: 1, savedOpportunities: 1 },
};

function load() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_STATE, null, 2));
    return structuredClone(DEFAULT_STATE);
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function save(state) {
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
}

const db = {
  // Opportunities
  getAllOpportunities(search, category) {
    const state = load();
    let results = state.opportunities;
    if (search) {
      const term = search.toLowerCase();
      results = results.filter(
        (o) =>
          o.title.toLowerCase().includes(term) ||
          o.organization.toLowerCase().includes(term) ||
          (o.description || '').toLowerCase().includes(term)
      );
    }
    if (category) {
      results = results.filter((o) => o.category === category);
    }
    return results.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  },

  getOpportunityById(id) {
    const state = load();
    return state.opportunities.find((o) => o.id === Number(id)) || null;
  },

  createOpportunity(data) {
    const state = load();
    const opportunity = {
      id: state.nextId.opportunities++,
      created_at: new Date().toISOString(),
      spots: 10,
      ...data,
    };
    state.opportunities.push(opportunity);
    save(state);
    return opportunity;
  },

  updateOpportunity(id, data) {
    const state = load();
    const idx = state.opportunities.findIndex((o) => o.id === Number(id));
    if (idx === -1) return null;
    state.opportunities[idx] = { ...state.opportunities[idx], ...data };
    save(state);
    return state.opportunities[idx];
  },

  deleteOpportunity(id) {
    const state = load();
    const idx = state.opportunities.findIndex((o) => o.id === Number(id));
    if (idx === -1) return false;
    state.opportunities.splice(idx, 1);
    save(state);
    return true;
  },

  // Users
  getUserByEmail(email) {
    const state = load();
    return state.users.find((u) => u.email === email) || null;
  },

  getUserById(id) {
    const state = load();
    return state.users.find((u) => u.id === Number(id)) || null;
  },

  createUser(data) {
    const state = load();
    const user = { id: state.nextId.users++, role: 'student', created_at: new Date().toISOString(), ...data };
    state.users.push(user);
    save(state);
    return user;
  },

  // Saved opportunities
  getSavedOpportunities(userId) {
    const state = load();
    const savedIds = state.savedOpportunities
      .filter((s) => s.user_id === Number(userId))
      .map((s) => s.opportunity_id);
    return state.opportunities
      .filter((o) => savedIds.includes(o.id))
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  },

  isAlreadySaved(userId, opportunityId) {
    const state = load();
    return state.savedOpportunities.some(
      (s) => s.user_id === Number(userId) && s.opportunity_id === Number(opportunityId)
    );
  },

  saveOpportunity(userId, opportunityId) {
    const state = load();
    state.savedOpportunities.push({
      id: state.nextId.savedOpportunities++,
      user_id: Number(userId),
      opportunity_id: Number(opportunityId),
      created_at: new Date().toISOString(),
    });
    save(state);
  },

  unsaveOpportunity(userId, opportunityId) {
    const state = load();
    state.savedOpportunities = state.savedOpportunities.filter(
      (s) => !(s.user_id === Number(userId) && s.opportunity_id === Number(opportunityId))
    );
    save(state);
  },
};

module.exports = db;
