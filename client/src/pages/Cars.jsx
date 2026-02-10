import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import api from '../services/api';
import CarCard from '../components/CarCard';
import SkeletonCard from '../components/SkeletonCard';
import './Cars.css';

const Cars = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        seats: searchParams.get('seats') || '',
        fuelType: searchParams.get('fuelType') || '',
        transmission: searchParams.get('transmission') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || '',
    });

    useEffect(() => {
        fetchCars();
    }, [page, filters]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 8 };
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params[key] = value;
            });
            const { data } = await api.get('/cars', { params });
            setCars(data.cars);
            setTotalPages(data.pages);
            setTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ search: '', seats: '', fuelType: '', transmission: '', category: '', minPrice: '', maxPrice: '', sort: '' });
        setPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(v => v).length;

    return (
        <div className="page-enter">
            <div className="container">
                <div className="page-header">
                    <h1>Browse Cars</h1>
                    <p>{total} cars available for rent</p>
                </div>

                <div className="cars-layout">
                    {/* Filter Toggle (mobile) */}
                    <button className="filter-toggle btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
                        <FiFilter size={16} />
                        Filters {activeFilterCount > 0 && <span className="badge badge-primary">{activeFilterCount}</span>}
                    </button>

                    {/* Sidebar */}
                    <aside className={`filter-sidebar ${showFilters ? 'open' : ''}`}>
                        <div className="filter-header">
                            <h3>Filters</h3>
                            {activeFilterCount > 0 && (
                                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                                    <FiX size={14} /> Clear
                                </button>
                            )}
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Search</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Car name or brand..."
                                value={filters.search}
                                onChange={e => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Category</label>
                            <select className="form-select" value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}>
                                <option value="">All Categories</option>
                                <option value="Economy">Economy</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Seats</label>
                            <select className="form-select" value={filters.seats} onChange={e => handleFilterChange('seats', e.target.value)}>
                                <option value="">Any</option>
                                <option value="4">4 Seats</option>
                                <option value="5">5 Seats</option>
                                <option value="7">7 Seats</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Fuel Type</label>
                            <select className="form-select" value={filters.fuelType} onChange={e => handleFilterChange('fuelType', e.target.value)}>
                                <option value="">Any</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="CNG">CNG</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Transmission</label>
                            <select className="form-select" value={filters.transmission} onChange={e => handleFilterChange('transmission', e.target.value)}>
                                <option value="">Any</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Price Range (per day)</label>
                            <div className="filter-price-range">
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Min ₹"
                                    value={filters.minPrice}
                                    onChange={e => handleFilterChange('minPrice', e.target.value)}
                                />
                                <span>—</span>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Max ₹"
                                    value={filters.maxPrice}
                                    onChange={e => handleFilterChange('maxPrice', e.target.value)}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="cars-main">
                        <div className="cars-toolbar">
                            <span className="cars-count">{total} cars found</span>
                            <select className="form-select sort-select" value={filters.sort} onChange={e => handleFilterChange('sort', e.target.value)}>
                                <option value="">Sort: Default</option>
                                <option value="price_asc">Price: Low → High</option>
                                <option value="price_desc">Price: High → Low</option>
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>

                        <div className="car-grid">
                            {loading
                                ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
                                : cars.length > 0
                                    ? cars.map(car => <CarCard key={car._id} car={car} />)
                                    : (
                                        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                            <div className="empty-icon">🚗</div>
                                            <h3>No cars found</h3>
                                            <p>Try adjusting your filters</p>
                                            <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
                                        </div>
                                    )
                            }
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>←</button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                ))}
                                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>→</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Cars;
