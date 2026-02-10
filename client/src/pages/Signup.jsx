import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', phone: '', universityEmail: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, phone, universityEmail } = formData;

        if (!name || !email || !password) { toast.error('Name, email and password are required'); return; }
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }

        setLoading(true);
        try {
            await register({ name, email, password, phone, universityEmail });
            toast.success('Account created! Welcome to CAReFree 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page page-enter">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join CAReFree and start renting</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label"><FiUser size={14} /> Full Name</label>
                            <input type="text" name="name" className="form-input" placeholder="Suraj Kumar" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><FiPhone size={14} /> Phone</label>
                            <input type="tel" name="phone" className="form-input" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiMail size={14} /> Email</label>
                        <input type="email" name="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiMail size={14} /> University Email (Optional)</label>
                        <input type="email" name="universityEmail" className="form-input" placeholder="you@cuchd.in" value={formData.universityEmail} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label"><FiLock size={14} /> Password</label>
                            <input type="password" name="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><FiLock size={14} /> Confirm Password</label>
                            <input type="password" name="confirmPassword" className="form-input" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'} <FiArrowRight size={18} />
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
