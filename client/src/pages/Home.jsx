import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiShield, FiTruck, FiArrowRight, FiStar, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';
import CarCard from '../components/CarCard';
import SkeletonCard from '../components/SkeletonCard';
import './Home.css';

const Home = () => {
    const [featuredCars, setFeaturedCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDate, setSearchDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedCars();
    }, []);

    const fetchFeaturedCars = async () => {
        try {
            const { data } = await api.get('/cars/featured');
            setFeaturedCars(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/cars${searchDate ? `?date=${searchDate}` : ''}`);
    };

    return (
        <div className="page-enter">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="hero-content container">
                    <div className="hero-badge">
                        <FiShield size={14} /> Student Verified Platform
                    </div>
                    <h1 className="hero-title">
                        Your Ride,<br />
                        <span className="gradient-text">Your Freedom.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Affordable hourly & daily car rentals for CU students.<br />
                        Free campus pickup. Zero hassle. Book in under 2 minutes.
                    </p>

                    <form className="hero-search" onSubmit={handleSearch}>
                        <div className="search-field">
                            <FiClock size={18} />
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                placeholder="When do you need a car?"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">
                            <FiSearch size={18} /> Find Cars
                        </button>
                    </form>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <strong>500+</strong>
                            <span>Happy Riders</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <strong>50+</strong>
                            <span>Cars Available</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <strong>4.8</strong>
                            <span>⭐ Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="trust-section container">
                <div className="trust-grid">
                    <div className="trust-item">
                        <div className="trust-icon blue"><FiShield size={24} /></div>
                        <div>
                            <h4>Student Verified</h4>
                            <p>Only CU verified students can rent</p>
                        </div>
                    </div>
                    <div className="trust-item">
                        <div className="trust-icon green"><FiTruck size={24} /></div>
                        <div>
                            <h4>Free Campus Pickup</h4>
                            <p>Delivered to your hostel gate</p>
                        </div>
                    </div>
                    <div className="trust-item">
                        <div className="trust-icon amber"><FiClock size={24} /></div>
                        <div>
                            <h4>Flexible Rentals</h4>
                            <p>Hourly or daily — you choose</p>
                        </div>
                    </div>
                    <div className="trust-item">
                        <div className="trust-icon purple"><FiStar size={24} /></div>
                        <div>
                            <h4>Transparent Pricing</h4>
                            <p>No hidden fees, ever</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Cars */}
            <section className="featured-section container">
                <div className="section-header">
                    <div>
                        <h2>Featured Cars</h2>
                        <p>Most popular picks by CU students</p>
                    </div>
                    <Link to="/cars" className="btn btn-secondary">
                        View All <FiArrowRight size={16} />
                    </Link>
                </div>
                <div className="car-grid">
                    {loading
                        ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                        : featuredCars.map(car => <CarCard key={car._id} car={car} />)
                    }
                </div>
            </section>

            {/* How It Works */}
            <section className="how-section container">
                <div className="section-header center">
                    <h2>How It Works</h2>
                    <p>Rent a car in 3 simple steps</p>
                </div>
                <div className="how-grid">
                    <div className="how-step">
                        <div className="how-number">1</div>
                        <h3>Search & Select</h3>
                        <p>Browse our fleet, compare prices, and pick your ride</p>
                    </div>
                    <div className="how-connector"></div>
                    <div className="how-step">
                        <div className="how-number">2</div>
                        <h3>Book Instantly</h3>
                        <p>Choose your dates, confirm pricing, and book in seconds</p>
                    </div>
                    <div className="how-connector"></div>
                    <div className="how-step">
                        <div className="how-number">3</div>
                        <h3>Pick Up & Drive</h3>
                        <p>Free campus delivery. Just verify, grab keys, and go!</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section container">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2>Ready to Hit the Road?</h2>
                        <p>Join 500+ CU students who've ditched complicated rentals.</p>
                        <div className="cta-features">
                            <span><FiCheckCircle size={16} /> No deposit</span>
                            <span><FiCheckCircle size={16} /> Instant booking</span>
                            <span><FiCheckCircle size={16} /> 24/7 support</span>
                        </div>
                        <Link to="/signup" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>
                            Get Started Free <FiArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
