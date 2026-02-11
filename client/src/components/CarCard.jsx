import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiZap, FiStar, FiBox, FiX } from 'react-icons/fi';
import './CarCard.css';

const Car3DViewer = lazy(() => import('./Car3DViewer'));

const CarCard = ({ car }) => {
    const fallbackImg = 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&q=80';
    const [show3D, setShow3D] = useState(false);

    const toggle3D = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow3D(!show3D);
    };

    return (
        <Link to={`/cars/${car._id}`} className="car-card card">
            <div className="car-card-img">
                {show3D ? (
                    <div className="car-card-3d-viewer">
                        <button className="car-card-3d-close" onClick={toggle3D} title="Close 3D view">
                            <FiX size={14} />
                        </button>
                        <Suspense fallback={
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#737373', fontSize: 13 }}>
                                Loading 3D model...
                            </div>
                        }>
                            <Car3DViewer />
                        </Suspense>
                    </div>
                ) : (
                    <>
                        <img
                            src={car.images?.[0] || fallbackImg}
                            alt={car.name}
                            onError={(e) => { e.target.src = fallbackImg; }}
                        />
                        <div className="car-card-badges">
                            {car.category && <span className="badge badge-primary">{car.category}</span>}
                        </div>
                        <button className="car-card-3d-toggle" onClick={toggle3D} title="View 3D model">
                            <FiBox size={13} /> 3D
                        </button>
                    </>
                )}
            </div>
            <div className="car-card-body">
                <div className="car-card-header">
                    <div>
                        <p className="car-card-brand">{car.brand}</p>
                        <h3 className="car-card-name">{car.name}</h3>
                    </div>
                    <div className="car-card-rating">
                        <FiStar size={12} /> {car.rating?.toFixed(1) || '4.5'}
                    </div>
                </div>
                <div className="car-card-specs">
                    <span><FiUsers size={13} /> {car.seats} seats</span>
                    <span><FiZap size={13} /> {car.fuelType}</span>
                    <span>{car.transmission}</span>
                </div>
                {car.features?.length > 0 && (
                    <div className="car-card-features">
                        {car.features.slice(0, 3).map((f, i) => (
                            <span key={i} className="feature-chip">{f}</span>
                        ))}
                        {car.features.length > 3 && (
                            <span className="feature-chip more">+{car.features.length - 3}</span>
                        )}
                    </div>
                )}
                <div className="car-card-footer">
                    <div className="car-card-price">
                        <span className="price-amount">₹{car.pricePerHour}</span>
                        <span className="price-unit">/hr</span>
                    </div>
                    <div className="car-card-price daily">
                        <span className="price-amount">₹{car.pricePerDay}</span>
                        <span className="price-unit">/day</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;
