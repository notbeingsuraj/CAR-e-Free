import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Please fill all fields'); return; }

        setLoading(true);
        try {
            const userData = await login(email, password);
            toast.success(`Welcome back, ${userData.name}!`);
            navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page page-enter">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Log in to your CAReFree account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><FiMail size={14} /> Email</label>
                        <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiLock size={14} /> Password</label>
                        <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'} <FiArrowRight size={18} />
                    </button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
