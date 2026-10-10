import styles from '../../styles/Nav.module.css';
import brandLogo from '../../assets/df-brand.svg';
import { Link } from 'react-router-dom';

function Nav({ handleClearSearch }) {
    return (
        <nav className={styles.navbar}>
            <div className={styles['navbar-brand']}>
                <Link to="/" onClick={handleClearSearch}>
                    <img src={brandLogo} alt="DoubleFeature Logo" className={styles['navbar-logo']} />
                </Link>
                <Link to="/" onClick={handleClearSearch} className={styles['navbar-brand-link']}>DoubleFeature</Link>
            </div>

            <div className={styles['navbar-links']}>
                <Link to="/" onClick={handleClearSearch} className={styles['nav-link']}>Trending</Link>
                <Link to="/watchlist" className={styles['nav-link']}>Watchlist</Link>
                <Link to="/favourites" className={styles['nav-link']}>Favourites</Link>
            </div>
        </nav>
    );
}

export default Nav;