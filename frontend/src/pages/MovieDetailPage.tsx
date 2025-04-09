import '../css/theme.css';
import AuthorizeView from '../components/authentication/AuthorizeView';

function MovieDetailPage() {
  const relatedMovies = Array.from({ length: 20 }, (_, i) => ({
    title: `Movie ${i + 1}`,
    imageUrl: 'https://via.placeholder.com/150x220?text=Poster',
  }));

  return (
    <AuthorizeView allowedRoles={['User', 'Administrator']}>
      <div className="movie-detail-overlay">
        <div className="movie-detail-card">
          {/* Poster & Action Buttons */}
          <div className="header-section">
            <img
              className="banner-poster"
              src="https://via.placeholder.com/800x400?text=Black+Tiger"
              alt="Black Tiger Poster"
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
              <span>2025</span>
              <span className="tag">HD</span>
              <span className="tag">TV-14</span>
              <span className="warnings">gore, language, violence</span>
            </div>
            <div className="cast-genres">
              <p>
                <strong>Cast:</strong> Millie Boddy Brown, Dez Gunn,{' '}
                <em>More</em>
              </p>
              <p>
                <strong>Genres:</strong> TV Action
              </p>
            </div>
            <p className="description">
              Born an assassin, Black Tiger finally decides to try to leave his
              past life behind...
            </p>
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
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MovieDetailPage;
