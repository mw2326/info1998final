import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="" className="navbar-logo" />
          IthacaServes
        </Link>
        <div className="navbar-links">
          <Link to="/opportunities" className={isActive('/opportunities') ? 'active' : ''}>
            Browse
          </Link>
          {user && (
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
              Admin
            </Link>
          )}
          {user ? (
            <button className="btn-outline" onClick={logout}>Sign Out</button>
          ) : (
            <Link to="/login" className="btn-primary">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
