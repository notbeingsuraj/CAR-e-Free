import { Link } from 'react-router-dom';
import { FiUsers, FiZap, FiStar } from 'react-icons/fi';
import CarTypeIcon from './CarTypeIcon';
import './CarCard.css';

const CarCard = ({ car }) => {
    const fallbackImg = 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&q=80';

    return (
        <Link to={`/cars/${car._id}`} className="car-card card">
            <div className="car-card-img">
                <img
                    src={car.images?.[0] || fallbackImg}
                    alt={car.name}
                    onError={(e) => { e.target.src = fallbackImg; }}
                />
                <div className="car-card-badges">
                    {car.category && <span className="badge badge-primary">{car.category}</span>}
                </div>
                <div className="car-card-3d-icon">
                    <CarTypeIcon category={car.category} />
                </div>
            </div>
            <div className="car-card-body">
                <div className="car-card-header">
                    <div>
                        <p className="car-card-brand">{car.brand}</p>
                        <h3 className="car-card-name">{car.name}</h3>
                    </div>
                    <div className="car-card-rating">
                        <FiStar size={14} /> {car.rating?.toFixed(1) || '4.5'}
                    </div>
                </div>
                <div className="car-card-specs">
                    <span><FiUsers size={14} /> {car.seats} seats</span>
                    <span><FiZap size={14} /> {car.fuelType}</span>
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
