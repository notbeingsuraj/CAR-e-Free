import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../services/authService';
import { FiMail, FiLock, FiArrowRight, FiPhone, FiHash } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
    const [authMode, setAuthMode] = useState('email'); // 'email' | 'phone'

    // Email/password state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Phone/OTP state
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpStep, setOtpStep] = useState('phone'); // 'phone' | 'otp'

    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Email/password login
    const handleEmailSubmit = async (e) => {
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

    // Phone OTP: send code
    const handleSendOtp = async () => {
        if (!phone) { toast.error('Please enter your phone number'); return; }

        setLoading(true);
        try {
            await sendOtp(phone);
            setOtpStep('otp');
            toast.success('OTP sent successfully!');
        } catch {
            toast.error('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Phone OTP: verify code
    const handleVerifyOtp = async () => {
        if (!otp) { toast.error('Please enter the OTP'); return; }

        setLoading(true);
        try {
            const user = await verifyOtp(otp);
            toast.success('Phone verified!');
            console.log('Logged in user:', user);
            navigate('/dashboard');
        } catch {
            toast.error('Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // Reset phone flow when switching tabs
    const switchMode = (mode) => {
        setAuthMode(mode);
        setOtpStep('phone');
        setOtp('');
    };

    return (
        <div className="auth-page page-enter">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Log in to your CAReFree account</p>
                </div>

                {/* Auth mode tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${authMode === 'email' ? 'active' : ''}`}
                        onClick={() => switchMode('email')}
                    >
                        <FiMail size={14} /> Email
                    </button>
                    <button
                        className={`auth-tab ${authMode === 'phone' ? 'active' : ''}`}
                        onClick={() => switchMode('phone')}
                    >
                        <FiPhone size={14} /> Phone
                    </button>
                </div>

                {/* Email/Password form */}
                {authMode === 'email' && (
                    <form onSubmit={handleEmailSubmit}>
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
                )}

                {/* Phone OTP form */}
                {authMode === 'phone' && (
                    <div className="phone-auth-form">
                        {otpStep === 'phone' && (
                            <div className="form-group">
                                <label className="form-label"><FiPhone size={14} /> Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="+91 98765 43210"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block btn-lg"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    style={{ marginTop: 16 }}
                                >
                                    {loading ? 'Sending...' : 'Send OTP'} <FiArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {otpStep === 'otp' && (
                            <div className="form-group">
                                <label className="form-label"><FiHash size={14} /> Enter OTP</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    maxLength={6}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block btn-lg"
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    style={{ marginTop: 16 }}
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'} <FiArrowRight size={18} />
                                </button>
                                <button
                                    type="button"
                                    className="auth-link-btn"
                                    onClick={() => setOtpStep('phone')}
                                >
                                    ← Change number
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default Login;
