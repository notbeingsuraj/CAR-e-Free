import './CarCard.css';

const SkeletonCard = () => {
    return (
        <div className="car-card" style={{ pointerEvents: 'none' }}>
            <div className="car-card-img-wrap">
                <div className="skeleton" style={{ width: '70%', height: '100px', borderRadius: '8px' }}></div>
            </div>
            <div className="car-card-body">
                <div className="car-card-title">
                    <div className="skeleton" style={{ width: '65%', height: '18px', borderRadius: '6px' }}></div>
                    <div className="skeleton" style={{ width: '40%', height: '13px', borderRadius: '4px', marginTop: '6px' }}></div>
                </div>
                <div className="car-card-specs">
                    <div className="skeleton" style={{ width: '60px', height: '14px', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '50px', height: '14px', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '70px', height: '14px', borderRadius: '4px' }}></div>
                </div>
                <div className="car-card-footer" style={{ borderTop: 'none', paddingTop: '12px' }}>
                    <div className="skeleton" style={{ width: '90px', height: '22px', borderRadius: '6px' }}></div>
                    <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '9999px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
