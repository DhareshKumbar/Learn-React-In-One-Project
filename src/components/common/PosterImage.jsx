function PosterImage({ posterPath, title, className = '' }) {
    const classes = `poster-media ${className}`.trim();

    if (! posterPath) {
        return (
            <div className={`${classes} poster-placeholder`} />
        );
    }

    return (
        <img
            className={classes}
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
        />
    );
}

export default PosterImage;