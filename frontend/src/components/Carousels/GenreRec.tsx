import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getGenreMovies} from '../../api/RecommenderAPI'; // Adjust path if needed
import { getImage } from '../../api/ImageAPI';
import MoviePoster from '../movieCards/MoviePoster';
import MovieDetails from '../movieCards/MovieDetails'; // Ensure this import is correct
import { Movie } from '../../types/Movie';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="spinner" />
    <style>
      {`
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #57c8f4;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
          }
  
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
    </style>
  </div>
);
function sanitizeTitle(title: string): string {
  return title.replace(/[-?#()'":’‘“”.!&]/g, '');
}

interface GenreRecProps {
  genre: string; // Destructure genre as a string
}

const GenreRec: React.FC<GenreRecProps> = ({ genre }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPosterUrl, setSelectedPosterUrl] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const defaultImageUrl = '/images/default.jpg';

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Assuming that the genre is being used to fetch related movies
        // You might need to adjust this based on your API. If it's a genre-based request, use the correct API
        const results = await getGenreMovies(genre); // Example usage, replace with showId logic
        if (results) {
          setMovies(results);

          const imagePromises = results.map(async (movie) => {
            const sanitizedTitle = sanitizeTitle(movie.title);
            const blob = await getImage(sanitizedTitle);
            return {
              title: movie.title,
              url: blob ? URL.createObjectURL(blob) : defaultImageUrl,
            };
          });

          const images = await Promise.all(imagePromises);
          const imageMap: { [title: string]: string } = {};
          images.forEach((img) => {
            imageMap[img.title] = img.url;
          });
          setMovieImages(imageMap);
        }
      } catch (error) {
        console.error('Error fetching genre recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre]); // Runs when genre changes

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    cssEase: 'ease',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };
  

  if (loading) {
    return (
      <div className="genre-rec">
        <h2>Recommended <strong>{genre}</strong> Movies</h2>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="genre-rec">
      <h2>
        Recommended <strong>{genre}</strong> Movies
      </h2>
      <Slider {...sliderSettings}>
        {movies.map((movie, index) => (
          <div
            key={index}
            className="carousel-item"
            style={{ padding: '0 5px' }}
          >
            <MoviePoster
              key={movie.show_id}
              imageUrl={movieImages[movie.title] || defaultImageUrl}
              title={movie.title}
              onClick={() => {
                setSelectedMovie(movie);
                setSelectedPosterUrl(
                  movieImages[movie.title] || '/images/default.jpg'
                );
              }} // Handle the click to open the modal
            />
          </div>
        ))}
      </Slider>
      {/* Show Modal Conditionally */}
        {selectedMovie && (
          <MovieDetails
            
            movie={selectedMovie}
            posterUrl={selectedPosterUrl}
            onClose={() => {
              setSelectedMovie(null);
              setSelectedPosterUrl('');
            }}
          />
          )}
    </div>
  );
};

export default GenreRec;
