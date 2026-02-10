const SkeletonCard = () => {
    return (
        <div className="card">
            <div className="skeleton skeleton-img"></div>
            <div style={{ padding: 18 }}>
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '50%', marginTop: 12 }}></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
