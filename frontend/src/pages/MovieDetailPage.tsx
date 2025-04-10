import '../css/theme.css'; // Assuming you have a theme for styling
import { useState } from 'react';

interface Movie {
  title: string;
  imageUrl: string;
  director: string;
  cast: string[];
  release_year: number;
  rating: string;
  duration: string;
  description: string;
}

const MovieDetailModal = ({ selectedMovie, closeModal }: { selectedMovie: Movie, closeModal: () => void }) => {
  const relatedMovies = Array.from({ length: 5 }, (_, i) => ({
    title: `Related Movie ${i + 1}`,
    imageUrl: 'https://via.placeholder.com/150x220?text=Poster',
  }));

  return (
    <div className="movie-detail-overlay">
      <div className="movie-detail-card">
        {/* Poster & Action Buttons */}
        <div className="header-section">
          <img
            className="banner-poster"
            src={selectedMovie.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
            alt={selectedMovie.title}
          />
          <div className="action-buttons">
            <button className="play-button">▶</button>
            <button className="add-button">＋</button>
            <button className="favorite-button">☆</button>
          </div>
        </div>

        {/* Metadata */}
        <div className="movie-info">
          <div className="tags">
            <span>{selectedMovie.release_year}</span>
            <span className="tag">HD</span>
            <span className="tag">{selectedMovie.rating}</span>
            {/* Add other metadata if needed */}
          </div>
          <div className="cast-genres">
            <p>
              <strong>Cast:</strong> {selectedMovie.cast.join(', ')}
            </p>
            <p>
              <strong>Genres:</strong> Action, Drama {/* Replace with actual genres */}
            </p>
          </div>
          <p className="description">{selectedMovie.description}</p>
        </div>

        {/* Recommendations */}
        <div className="related-section">
          <h3>If you’ll like this, you’d definitely love…</h3>
          <div className="scrollable-related">
            {relatedMovies.map((movie, index) => (
              <div className="related-card" key={index}>
                <img src={movie.imageUrl} alt={movie.title} />
                <div className="related-title">{movie.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
