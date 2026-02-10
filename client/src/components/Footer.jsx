import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <h3>CAReFree</h3>
                    <p>The student-first car rental platform for Chandigarh University. Affordable hourly & daily rentals with free campus pickup.</p>
                </div>
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/cars">Browse Cars</Link>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/login">Login</Link>
                </div>
                <div className="footer-col">
                    <h4>Support</h4>
                    <a href="#">FAQs</a>
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Cancellation Policy</a>
                </div>
                <div className="footer-col">
                    <h4>Contact</h4>
                    <a href="#"><FiMapPin size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />CU Campus, Mohali</a>
                    <a href="tel:+911234567890"><FiPhone size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />+91 12345 67890</a>
                    <a href="mailto:hello@carefree.in"><FiMail size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />hello@carefree.in</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} CAReFree. Made for CU Students.</p>
            </div>
        </footer>
    );
};

export default Footer;
