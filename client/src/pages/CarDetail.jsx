import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiUsers, FiZap, FiStar, FiMapPin, FiClock, FiChevronLeft, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './CarDetail.css';

const CarDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    // Booking form
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchCar();
    }, [id]);

    useEffect(() => {
        if (car && startDate && endDate) {
            calculateCost();
        }
    }, [startDate, endDate, car]);

    const fetchCar = async () => {
        try {
            const { data } = await api.get(`/cars/${id}`);
            setCar(data);
        } catch (err) {
            toast.error('Car not found');
            navigate('/cars');
        } finally {
            setLoading(false);
        }
    };

    const calculateCost = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end - start;
        if (diffMs <= 0) { setTotalCost(0); return; }

        const hours = diffMs / (1000 * 60 * 60);
        const days = Math.floor(hours / 24);
        const remainingHours = Math.ceil(hours % 24);

        const cost = (days * car.pricePerDay) + (remainingHours * car.pricePerHour);
        setTotalCost(cost);
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book');
            navigate('/login');
            return;
        }
        if (!startDate || !endDate) {
            toast.error('Please select dates');
            return;
        }
        if (new Date(endDate) <= new Date(startDate)) {
            toast.error('End date must be after start date');
            return;
        }

        setBookingLoading(true);
        try {
            await api.post('/bookings', {
                carId: car._id,
                startDate,
                endDate,
                totalCost,
            });
            toast.success('Booking confirmed! 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 0' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!car) return null;

    const fallbackImg = 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80';

    return (
        <div className="page-enter">
            <div className="container">
                <Link to="/cars" className="back-link">
                    <FiChevronLeft size={18} /> Back to Cars
                </Link>

                <div className="detail-layout">
                    {/* Left — Images & Info */}
                    <div className="detail-main">
                        <div className="detail-gallery">
                            <div className="gallery-main">
                                <img
                                    src={car.images?.[activeImg] || fallbackImg}
                                    alt={car.name}
                                    onError={(e) => { e.target.src = fallbackImg; }}
                                />
                            </div>
                            {car.images?.length > 1 && (
                                <div className="gallery-thumbs">
                                    {car.images.map((img, i) => (
                                        <button
                                            key={i}
                                            className={`gallery-thumb ${i === activeImg ? 'active' : ''}`}
                                            onClick={() => setActiveImg(i)}
                                        >
                                            <img src={img} alt={`${car.name} ${i + 1}`} onError={(e) => { e.target.src = fallbackImg; }} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="detail-info">
                            <div className="detail-header">
                                <div>
                                    <p className="detail-brand">{car.brand}</p>
                                    <h1>{car.name}</h1>
                                </div>
                                <div className="detail-rating">
                                    <FiStar size={18} /> {car.rating?.toFixed(1)}
                                    <span className="rating-count">({car.totalBookings} trips)</span>
                                </div>
                            </div>

                            <div className="detail-specs">
                                <div className="spec-item">
                                    <FiUsers size={18} />
                                    <div>
                                        <strong>{car.seats} Seats</strong>
                                        <span>Capacity</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <FiZap size={18} />
                                    <div>
                                        <strong>{car.fuelType}</strong>
                                        <span>Fuel Type</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span style={{ fontSize: 18 }}>⚙️</span>
                                    <div>
                                        <strong>{car.transmission}</strong>
                                        <span>Transmission</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span style={{ fontSize: 18 }}>📂</span>
                                    <div>
                                        <strong>{car.category}</strong>
                                        <span>Category</span>
                                    </div>
                                </div>
                            </div>

                            {car.features?.length > 0 && (
                                <div className="detail-section">
                                    <h3>Features</h3>
                                    <div className="feature-tags">
                                        {car.features.map((f, i) => (
                                            <span key={i} className="badge badge-neutral">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="detail-section">
                                <h3><FiAlertTriangle size={16} /> Rules & Penalties</h3>
                                <p className="rules-text">{car.rules}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Booking Card */}
                    <aside className="booking-card">
                        <div className="booking-card-inner">
                            <div className="booking-prices">
                                <div className="booking-price">
                                    <span className="price-big">₹{car.pricePerHour}</span>
                                    <span className="price-label">/hour</span>
                                </div>
                                <div className="booking-price secondary">
                                    <span className="price-big">₹{car.pricePerDay}</span>
                                    <span className="price-label">/day</span>
                                </div>
                            </div>

                            <div className="booking-form">
                                <div className="form-group">
                                    <label className="form-label"><FiCalendar size={14} /> Pickup Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-input"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><FiCalendar size={14} /> Return Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-input"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        min={startDate || new Date().toISOString().slice(0, 16)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label"><FiMapPin size={14} /> Pickup Location</label>
                                    <select className="form-select">
                                        <option>CU Campus - Main Gate</option>
                                        <option>CU Campus - Block A</option>
                                        <option>CU Campus - Hostel Area</option>
                                    </select>
                                </div>

                                {totalCost > 0 && (
                                    <div className="cost-breakdown">
                                        <div className="cost-row">
                                            <span>Rental Cost</span>
                                            <strong>₹{totalCost.toLocaleString()}</strong>
                                        </div>
                                        <div className="cost-row">
                                            <span>Platform Fee</span>
                                            <strong>₹0</strong>
                                        </div>
                                        <div className="cost-row total">
                                            <span>Total</span>
                                            <strong>₹{totalCost.toLocaleString()}</strong>
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="btn btn-primary btn-block btn-lg"
                                    onClick={handleBooking}
                                    disabled={bookingLoading || !startDate || !endDate}
                                >
                                    {bookingLoading ? 'Booking...' : totalCost > 0 ? `Book for ₹${totalCost.toLocaleString()}` : 'Book Now'}
                                </button>

                                <p className="booking-note">
                                    <FiClock size={13} /> Free cancellation up to 4 hours before pickup
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;
