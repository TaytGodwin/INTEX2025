import React from 'react';
import '../css/theme.css'; 

function MovieDetailPage() {
  // Sample related movies (you can fetch dynamically later)
  const relatedMovies = Array.from({ length: 20 }, (_, i) => ({
    title: `Movie ${i + 1}`,
    imageUrl: 'https://via.placeholder.com/150x220?text=Poster',
  }));

  return (
    <div className="movie-detail-page">
      {/* Poster and Close Icon */}
      <div className="movie-poster-section">
        <button className="close-button">×</button>
        <img
          className="main-poster"
          src="https://via.placeholder.com/300x450?text=Movie+Poster"
          alt="Movie Poster"
        />
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="play-button">▶</button>
        <button className="add-button">＋</button>
        <button className="favorite-button">☆</button>
      </div>

      {/* Description */}
      <div className="description">
        <p>Description Content</p>
      </div>

      {/* Related */}
      <div className="related-section">
        <h3>More like this...</h3>
        <div className="related-grid">
          {relatedMovies.map((movie, index) => (
            <div className="related-card" key={index}>
              <img src={movie.imageUrl} alt={movie.title} />
              <div className="related-title">{movie.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
