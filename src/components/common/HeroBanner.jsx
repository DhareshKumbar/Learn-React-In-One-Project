import styles from '../../styles/HeroBanner.module.css';
import heroBanner from '../../assets/hero-banner.png';

function HeroBanner() {
    return (
        <section className={styles['hero-banner']}>
            <img src={heroBanner} alt="Hero banner" className={styles['hero-banner-image']} />
            <div className={styles['hero-banner-overlay']}>
                <div className={styles['hero-banner-content']}>
                    <h1>Movie Night Made Easy</h1>
                    <p>Browse trending films and build your watchlist and favourites collections.</p>
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;
