import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiDroplet, FiHeart } from 'react-icons/fi';
import { TbManualGearbox, TbAutomaticGearbox } from 'react-icons/tb';
import './CarCard.css';

const CarCard = ({ car }) => {
    const fallbackImg = 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&q=80';
    const [liked, setLiked] = useState(false);

    const toggleFav = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
    };

    return (
        <Link to={`/cars/${car._id}`} className="car-card" id={`car-${car._id}`}>
            {/* Favorite */}
            <button
                className={`car-card-fav ${liked ? 'active' : ''}`}
                onClick={toggleFav}
                aria-label="Add to favorites"
            >
                <FiHeart size={16} fill={liked ? '#EF4444' : 'none'} />
            </button>

            {/* Image */}
            <div className="car-card-img-wrap">
                {car.category && (
                    <span className="car-card-category">{car.category}</span>
                )}
                <img
                    src={car.images?.[0] || fallbackImg}
                    alt={car.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = fallbackImg; }}
                />
            </div>

            {/* Body */}
            <div className="car-card-body">
                <div className="car-card-title">
                    <h3 className="car-card-name">{car.brand} {car.name}</h3>
                    <span className="car-card-type">
                        {car.category || 'Car'} • {car.transmission}
                    </span>
                </div>

                <div className="car-card-specs">
                    <span className="car-card-spec">
                        <FiUsers size={14} />
                        {car.seats} Seats
                    </span>
                    <span className="car-card-spec">
                        <FiDroplet size={14} />
                        {car.fuelType}
                    </span>
                    <span className="car-card-spec">
                        {car.transmission === 'Automatic'
                            ? <TbAutomaticGearbox size={14} />
                            : <TbManualGearbox size={14} />
                        }
                        {car.transmission}
                    </span>
                </div>

                <div className="car-card-footer">
                    <div className="car-card-price">
                        <span className="amount">₹{car.pricePerDay?.toLocaleString('en-IN')}</span>
                        <span className="unit">/day</span>
                    </div>
                    <span className="car-card-btn">
                        Select Car →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;
