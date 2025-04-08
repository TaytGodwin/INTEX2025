import { useEffect, useState } from 'react';
import { getComedyMovies } from '../../api/RecommenderAPI';
import MoviePoster from '../movieCards/MoviePoster';
import { Movie } from '../../types/Movie';

function FeaturedSection() {
  const [ComedyMovieData, setComedyMovies] = useState<Movie[]>([])
  useEffect(() => {
    const fetchComedyMovies = async () => {
      try {
        const result = await getComedyMovies();
        if (result) {
          setComedyMovies(result);
        }
      } catch (err) {
        console.error('Failed to fetch comedy movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComedyMovies();
  }, []);





  return (
    <section className="featured-section">
      <h2>Featured on MyFlix</h2>
      <div className="featured-movie-grid">
        {ComedyMovieData.map((movie, index) => (
          <div key={index} className="featured-movie-card">
            <MoviePoster imageUrl={movie.imageUrl} title={movie.title} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedSection;
function setMovies(result: Movie[]) {
  throw new Error('Function not implemented.');
}

function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

