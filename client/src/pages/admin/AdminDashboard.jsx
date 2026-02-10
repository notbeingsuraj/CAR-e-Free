import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBarChart2, FiDollarSign, FiTruck, FiUsers, FiCalendar, FiPlusCircle, FiEdit, FiTrash2, FiCheck, FiX, FiActivity } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Admin.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [analytics, setAnalytics] = useState(null);
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Car form
    const [showCarForm, setShowCarForm] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [carForm, setCarForm] = useState({
        name: '', brand: '', seats: 5, fuelType: 'Petrol', transmission: 'Manual',
        pricePerHour: '', pricePerDay: '', category: 'Economy', features: '', rules: '',
        images: '',
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/login'); return; }
        loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [analyticsRes, carsRes, bookingsRes, usersRes] = await Promise.all([
                api.get('/admin/analytics'),
                api.get('/cars?limit=100'),
                api.get('/bookings?limit=50'),
                api.get('/admin/users?limit=50'),
            ]);
            setAnalytics(analyticsRes.data);
            setCars(carsRes.data.cars);
            setBookings(bookingsRes.data.bookings);
            setUsers(usersRes.data.users);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCarSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...carForm,
                pricePerHour: Number(carForm.pricePerHour),
                pricePerDay: Number(carForm.pricePerDay),
                seats: Number(carForm.seats),
                features: carForm.features.split(',').map(f => f.trim()).filter(Boolean),
                images: carForm.images.split(',').map(i => i.trim()).filter(Boolean),
            };

            if (editingCar) {
                await api.put(`/cars/${editingCar._id}`, payload);
                toast.success('Car updated!');
            } else {
                await api.post('/cars', payload);
                toast.success('Car added!');
            }
            setShowCarForm(false);
            setEditingCar(null);
            resetCarForm();
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const deleteCar = async (id) => {
        if (!window.confirm('Delete this car?')) return;
        try {
            await api.delete(`/cars/${id}`);
            toast.success('Car deleted');
            loadData();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const editCar = (car) => {
        setEditingCar(car);
        setCarForm({
            name: car.name, brand: car.brand, seats: car.seats, fuelType: car.fuelType,
            transmission: car.transmission, pricePerHour: car.pricePerHour, pricePerDay: car.pricePerDay,
            category: car.category, features: car.features?.join(', ') || '',
            rules: car.rules || '', images: car.images?.join(', ') || '',
        });
        setShowCarForm(true);
    };

    const resetCarForm = () => {
        setCarForm({ name: '', brand: '', seats: 5, fuelType: 'Petrol', transmission: 'Manual', pricePerHour: '', pricePerDay: '', category: 'Economy', features: '', rules: '', images: '' });
    };

    const updateBookingStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, { status });
            toast.success(`Booking ${status}`);
            loadData();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const verifyUser = async (id, isVerified) => {
        try {
            await api.put(`/admin/users/${id}/verify`, { isVerified });
            toast.success(isVerified ? 'User verified' : 'Verification removed');
            loadData();
        } catch (err) {
            toast.error('Verification failed');
        }
    };

    if (loading) return <div className="container"><div className="spinner" style={{ marginTop: 60 }}></div></div>;

    // Chart data
    const bookingsChartData = {
        labels: analytics?.bookingsPerDay?.map(d => d._id.slice(5)) || [],
        datasets: [{
            label: 'Bookings',
            data: analytics?.bookingsPerDay?.map(d => d.count) || [],
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
        }],
    };

    const revenueBarData = {
        labels: analytics?.revenueByCar?.map(d => d.carName) || [],
        datasets: [{
            label: 'Revenue (₹)',
            data: analytics?.revenueByCar?.map(d => d.revenue) || [],
            backgroundColor: ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
            borderRadius: 8,
        }],
    };

    const statusDoughnut = {
        labels: ['Confirmed', 'Completed', 'Cancelled'],
        datasets: [{
            data: [analytics?.confirmedBookings || 0, analytics?.completedBookings || 0, analytics?.cancelledBookings || 0],
            backgroundColor: ['#4F46E5', '#10B981', '#EF4444'],
            borderWidth: 0,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
        },
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="page-enter">
            <div className="container admin-container">
                <div className="page-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage your platform</p>
                </div>

                <div className="tabs">
                    {['overview', 'cars', 'bookings', 'users'].map(tab => (
                        <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon blue"><FiBarChart2 size={22} /></div>
                                <div className="stat-info">
                                    <h4>Total Bookings</h4>
                                    <div className="stat-value">{analytics?.totalBookings || 0}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon green"><FiDollarSign size={22} /></div>
                                <div className="stat-info">
                                    <h4>Revenue</h4>
                                    <div className="stat-value">₹{(analytics?.totalRevenue || 0).toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon cyan"><FiTruck size={22} /></div>
                                <div className="stat-info">
                                    <h4>Cars</h4>
                                    <div className="stat-value">{analytics?.totalCars || 0}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon amber"><FiActivity size={22} /></div>
                                <div className="stat-info">
                                    <h4>Utilization</h4>
                                    <div className="stat-value">{analytics?.utilization || 0}%</div>
                                </div>
                            </div>
                        </div>

                        <div className="charts-grid">
                            <div className="chart-card">
                                <h3>Bookings (Last 30 Days)</h3>
                                <Line data={bookingsChartData} options={chartOptions} />
                            </div>
                            <div className="chart-card">
                                <h3>Revenue by Car</h3>
                                <Bar data={revenueBarData} options={chartOptions} />
                            </div>
                            <div className="chart-card small">
                                <h3>Booking Status</h3>
                                <div style={{ maxWidth: 220, margin: '0 auto' }}>
                                    <Doughnut data={statusDoughnut} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Cars Tab */}
                {activeTab === 'cars' && (
                    <>
                        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={() => { resetCarForm(); setEditingCar(null); setShowCarForm(true); }}>
                                <FiPlusCircle size={16} /> Add Car
                            </button>
                        </div>

                        {showCarForm && (
                            <div className="modal-overlay" onClick={() => setShowCarForm(false)}>
                                <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
                                    <div className="modal-header">
                                        <h3>{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
                                        <button className="modal-close" onClick={() => setShowCarForm(false)}><FiX /></button>
                                    </div>
                                    <form onSubmit={handleCarSubmit}>
                                        <div className="modal-body">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Name</label>
                                                    <input className="form-input" value={carForm.name} onChange={e => setCarForm({ ...carForm, name: e.target.value })} required />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Brand</label>
                                                    <input className="form-input" value={carForm.brand} onChange={e => setCarForm({ ...carForm, brand: e.target.value })} required />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Price/Hour (₹)</label>
                                                    <input type="number" className="form-input" value={carForm.pricePerHour} onChange={e => setCarForm({ ...carForm, pricePerHour: e.target.value })} required />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Price/Day (₹)</label>
                                                    <input type="number" className="form-input" value={carForm.pricePerDay} onChange={e => setCarForm({ ...carForm, pricePerDay: e.target.value })} required />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Seats</label>
                                                    <select className="form-select" value={carForm.seats} onChange={e => setCarForm({ ...carForm, seats: e.target.value })}>
                                                        <option value="4">4</option><option value="5">5</option><option value="7">7</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Fuel Type</label>
                                                    <select className="form-select" value={carForm.fuelType} onChange={e => setCarForm({ ...carForm, fuelType: e.target.value })}>
                                                        <option>Petrol</option><option>Diesel</option><option>Electric</option><option>CNG</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Transmission</label>
                                                    <select className="form-select" value={carForm.transmission} onChange={e => setCarForm({ ...carForm, transmission: e.target.value })}>
                                                        <option>Manual</option><option>Automatic</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Category</label>
                                                    <select className="form-select" value={carForm.category} onChange={e => setCarForm({ ...carForm, category: e.target.value })}>
                                                        <option>Economy</option><option>Sedan</option><option>SUV</option><option>Premium</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Image URLs (comma separated)</label>
                                                <input className="form-input" value={carForm.images} onChange={e => setCarForm({ ...carForm, images: e.target.value })} placeholder="https://..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Features (comma separated)</label>
                                                <input className="form-input" value={carForm.features} onChange={e => setCarForm({ ...carForm, features: e.target.value })} placeholder="AC, Bluetooth, Sunroof" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Rules</label>
                                                <textarea className="form-input" rows="2" value={carForm.rules} onChange={e => setCarForm({ ...carForm, rules: e.target.value })}></textarea>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowCarForm(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">{editingCar ? 'Update' : 'Add'} Car</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Car</th><th>Category</th><th>Price/Hr</th><th>Price/Day</th><th>Bookings</th><th>Rating</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cars.map(car => (
                                        <tr key={car._id}>
                                            <td><strong>{car.brand} {car.name}</strong></td>
                                            <td><span className="badge badge-neutral">{car.category}</span></td>
                                            <td>₹{car.pricePerHour}</td>
                                            <td>₹{car.pricePerDay}</td>
                                            <td>{car.totalBookings}</td>
                                            <td>⭐ {car.rating?.toFixed(1)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="btn btn-ghost btn-sm" onClick={() => editCar(car)}><FiEdit size={14} /></button>
                                                    <button className="btn btn-ghost btn-sm" onClick={() => deleteCar(car._id)} style={{ color: 'var(--danger)' }}><FiTrash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>Booking</th><th>Student</th><th>Car</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id}>
                                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b._id.slice(-6)}</td>
                                        <td>{b.user?.name}<br /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.user?.email}</span></td>
                                        <td>{b.car?.brand} {b.car?.name}</td>
                                        <td style={{ fontSize: 13 }}>{formatDate(b.startDate)} — {formatDate(b.endDate)}</td>
                                        <td><strong>₹{b.totalCost?.toLocaleString()}</strong></td>
                                        <td><span className={`badge ${b.status === 'confirmed' ? 'badge-success' : b.status === 'cancelled' ? 'badge-danger' : 'badge-primary'}`}>{b.status}</span></td>
                                        <td>
                                            {b.status === 'confirmed' && (
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                    <button className="btn btn-ghost btn-sm" title="Complete" onClick={() => updateBookingStatus(b._id, 'completed')} style={{ color: 'var(--success)' }}><FiCheck size={14} /></button>
                                                    <button className="btn btn-ghost btn-sm" title="Cancel" onClick={() => updateBookingStatus(b._id, 'cancelled')} style={{ color: 'var(--danger)' }}><FiX size={14} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="table-wrapper">
                        <div className="table-header">
                            <h3>Students ({users.length})</h3>
                        </div>
                        <table>
                            <thead>
                                <tr><th>Name</th><th>Email</th><th>Phone</th><th>University Email</th><th>Verified</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td><strong>{u.name}</strong></td>
                                        <td>{u.email}</td>
                                        <td>{u.phone || '—'}</td>
                                        <td>{u.universityEmail || '—'}</td>
                                        <td>
                                            <span className={`badge ${u.isVerified ? 'badge-success' : 'badge-warning'}`}>
                                                {u.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${u.isVerified ? 'btn-danger' : 'btn-primary'}`}
                                                onClick={() => verifyUser(u._id, !u.isVerified)}
                                            >
                                                {u.isVerified ? 'Revoke' : 'Verify'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
