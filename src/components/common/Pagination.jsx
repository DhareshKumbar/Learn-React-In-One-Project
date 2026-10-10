import styles from '../../styles/Trending.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

function Pagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>
            <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
            >
                <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            <span className={styles['pagination-status']}>Page {page} of {totalPages}</span>
            <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
            >
                <FontAwesomeIcon icon={faAnglesRight} />
            </button>
        </div>
    );
}

export default Pagination;