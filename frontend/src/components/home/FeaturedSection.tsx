import MoviePoster from '../movieCards/MoviePoster';

function FeaturedSection() {
  const featuredMovies = [
    { imageUrl: 'https://example.com/movie1.jpg', title: 'Movie One' },
    { imageUrl: 'https://example.com/movie2.jpg', title: 'Movie Two' },
    { imageUrl: 'https://example.com/movie3.jpg', title: 'Movie Three' },
    { imageUrl: 'https://example.com/movie4.jpg', title: 'Movie Four' },
  ];

  return (
    <section className="featured-section">
      <h2>Featured on MyFlix</h2>
      <div className="featured-movie-grid">
        {featuredMovies.map((movie, index) => (
          <div key={index} className="featured-movie-card">
            <MoviePoster imageUrl={movie.imageUrl} title={movie.title} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedSection;
