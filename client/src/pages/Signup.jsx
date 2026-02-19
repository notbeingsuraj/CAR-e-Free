import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = formData;

        if (!name || !email || !password) { toast.error('Name, email and password are required'); return; }

        try {
            await signup(email, password, name);
            toast.success('Account created! Welcome to CAReFree 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h2>Join the Club</h2>
                    <p>Create an account to start booking rides</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><FiUser size={14} /> Full Name</label>
                        <input type="text" name="name" className="form-input" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label"><FiMail size={14} /> Email Address</label>
                        <input type="email" name="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label"><FiLock size={14} /> Password</label>
                        <input type="password" name="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                    </div>

                    <button type="submit" className="auth-btn">
                        Sign Up <FiArrowRight size={18} />
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
