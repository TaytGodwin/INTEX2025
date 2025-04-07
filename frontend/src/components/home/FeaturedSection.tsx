
import MoviePoster from '../movieCards/MoviePoster';

function FeaturedSection() {
  // Example data - in your application, you might fetch this from your backend
  const featuredMovies = [
    { imageUrl: 'https://example.com/movie1.jpg', title: 'Movie One' },
    { imageUrl: 'https://example.com/movie2.jpg', title: 'Movie Two' },
    { imageUrl: 'https://example.com/movie3.jpg', title: 'Movie Three' },
    { imageUrl: 'https://example.com/movie4.jpg', title: 'Movie Four' },
  ];

  return (
    <section className="container my-5">
      <h2 className="mb-4">Featured on MyFlix</h2>
      <div className="row">
        {featuredMovies.map((movie, index) => (
          <div key={index} className="col-md-3 mb-3">
            <MoviePoster imageUrl={movie.imageUrl} title={movie.title} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedSection;