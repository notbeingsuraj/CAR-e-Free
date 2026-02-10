import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiGrid, FiUser, FiLogOut, FiMenu, FiX, FiShield } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">CAReFree</Link>

                <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>

                <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>
                            <FiHome size={16} /> Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/cars" className={isActive('/cars')} onClick={() => setMenuOpen(false)}>
                            <FiGrid size={16} /> Cars
                        </Link>
                    </li>
                    {user ? (
                        <>
                            <li>
                                <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>
                                    <FiUser size={16} /> Dashboard
                                </Link>
                            </li>
                            {user.role === 'admin' && (
                                <li>
                                    <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>
                                        <FiShield size={16} /> Admin
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                    <FiLogOut size={16} /> Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className={`btn btn-ghost ${isActive('/login')}`} onClick={() => setMenuOpen(false)}>
                                    Log In
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
