import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiPhone, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, phone } = formData;

        if (!name || !phone) { toast.error('Name and phone are required'); return; }

        setLoading(true);
        try {
            await signup(phone, name);
            toast.success('Account created! Welcome to CAReFree 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || 'Signup failed');
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
                    <div className="form-group">
                        <label className="form-label"><FiUser size={14} /> Full Name</label>
                        <input type="text" name="name" className="form-input" placeholder="Suraj Kumar" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiPhone size={14} /> Phone</label>
                        <input type="tel" name="phone" className="form-input" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
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
