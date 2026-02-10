import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiClock, FiMapPin, FiX, FiCheckCircle, FiAlertCircle, FiUser, FiShield } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.put(`/bookings/${id}/cancel`);
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        }
    };

    const now = new Date();
    const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.startDate) >= now);
    const past = bookings.filter(b => b.status === 'completed' || new Date(b.endDate) < now);
    const cancelled = bookings.filter(b => b.status === 'cancelled');

    const getDisplayBookings = () => {
        if (activeTab === 'upcoming') return upcoming;
        if (activeTab === 'history') return past;
        return cancelled;
    };

    const statusColors = {
        confirmed: 'badge-success',
        completed: 'badge-primary',
        cancelled: 'badge-danger',
        pending: 'badge-warning',
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
        <div className="page-enter">
            <div className="container">
                <div className="page-header">
                    <h1>My Dashboard</h1>
                    <p>Manage your bookings and profile</p>
                </div>

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar">
                        <FiUser size={28} />
                    </div>
                    <div className="profile-info">
                        <h3>{user?.name}</h3>
                        <p>{user?.email}</p>
                    </div>
                    <div className="profile-status">
                        {user?.isVerified ? (
                            <span className="badge badge-success"><FiCheckCircle size={12} /> Verified</span>
                        ) : (
                            <span className="badge badge-warning"><FiAlertCircle size={12} /> Unverified</span>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
                        Upcoming ({upcoming.length})
                    </button>
                    <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                        History ({past.length})
                    </button>
                    <button className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>
                        Cancelled ({cancelled.length})
                    </button>
                </div>

                {/* Bookings */}
                {loading ? (
                    <div className="spinner"></div>
                ) : getDisplayBookings().length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>No {activeTab} bookings</h3>
                        <p>{activeTab === 'upcoming' ? 'Book your first car now!' : 'Nothing here yet'}</p>
                        {activeTab === 'upcoming' && (
                            <Link to="/cars" className="btn btn-primary">Browse Cars</Link>
                        )}
                    </div>
                ) : (
                    <div className="booking-list">
                        {getDisplayBookings().map(booking => (
                            <div key={booking._id} className="booking-item">
                                <div className="booking-img">
                                    <img
                                        src={booking.car?.images?.[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&q=80'}
                                        alt={booking.car?.name}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&q=80'; }}
                                    />
                                </div>
                                <div className="booking-details">
                                    <div className="booking-top">
                                        <div>
                                            <h4>{booking.car?.brand} {booking.car?.name}</h4>
                                            <span className={`badge ${statusColors[booking.status]}`}>{booking.status}</span>
                                        </div>
                                        <div className="booking-cost">₹{booking.totalCost?.toLocaleString()}</div>
                                    </div>
                                    <div className="booking-meta">
                                        <span><FiCalendar size={14} /> {formatDate(booking.startDate)} → {formatDate(booking.endDate)}</span>
                                        <span><FiMapPin size={14} /> {booking.pickupLocation}</span>
                                    </div>
                                    {booking.status === 'confirmed' && new Date(booking.startDate) > now && (
                                        <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(booking._id)}>
                                            <FiX size={14} /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
