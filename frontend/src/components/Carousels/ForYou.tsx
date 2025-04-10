// GenreRec.tsx
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getForYou } from '../../api/RecommenderAPI'; // Adjust path if needed
import { getImage } from '../../api/ImageAPI';
import MovietopTen from '../movieCards/MovietopTen';
import { Movie } from '../../types/Movie';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieDetails from '../movieCards/MovieDetails';


const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="spinner" />
    <style>
      {`
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top: 4px solid #57C8F4;
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
  userId: number;
}
const ForYou: React.FC<GenreRecProps> = ({ userId }) => {
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
        const results = await getForYou(userId);
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
  }, [userId]);

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
        <h3>Your Top 10</h3>
        <Spinner />
      </div>
    );
  } 


  return (
    <div className="genre-rec">
      <h2>
        Your Top 10<strong>{}</strong>
      </h2>
      <Slider {...sliderSettings}>
        {movies.map((movie, index) => (
          <div
            key={index}
            className="carousel-item"
            style={{ padding: '0 5px' }}
          >
          
            <MovietopTen
              key={movie.show_id}
              posterUrl={movieImages[movie.title] || '/images/default.jpg'}
              title={movie.title}
              onClick={() => {setSelectedMovie(movie); 
                
                setSelectedPosterUrl(
                  movieImages[movie.title] || '/images/default.jpg'
                );
              }}
              rank={index + 1} // optional: shows 1-10
            />
          </div>
        ))}
      </Slider>
      {/* Modal to display movie details */}
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

export default ForYou;
