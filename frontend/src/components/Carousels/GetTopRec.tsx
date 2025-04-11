import { useEffect, useState, useCallback } from 'react';
import Slider from 'react-slick';
import { getTopRec } from '../../api/RecommenderAPI';
import { getImage } from '../../api/ImageAPI';
import MoviePoster from '../movieCards/MoviePoster';
import { Movie } from '../../types/Movie';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieDetails from '../movieCards/MovieDetails';


function sanitizeTitle(title: string): string {
  return title.replace(/[-?#()'":’‘“”.!&]/g, '');
}
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

interface TopRecProps {
  showId: number;
}

const GetTopRec: React.FC<TopRecProps> = ({ showId }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPosterUrl, setSelectedPosterUrl] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const defaultImageUrl = '/images/default.jpg';
    // Extract the fetching logic into a function
    const fetchMovies = useCallback(async () => {
      setLoading(true);
      try {
        const results = await getTopRec(showId);
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
        console.error('Error fetching top recommendations:', error);
      } finally {
        setLoading(false);
      }
    }, [showId]);
  
    useEffect(() => {
      fetchMovies();
    }, [fetchMovies]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    cssEase: 'ease',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  




if (loading) {
      return (
        <div className="genre-rec">
          <h3>If you liked this, you'll definitely love these...</h3>
          <Spinner />
        </div>
      );
    } 

  else if (movies.length < 2) {
    return (
      <div className="genre-rec" style={{ textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ color: '#fff' }}>
          If you enjoyed this, discover more movies!
        </h3>
        <button
          onClick={() => {
            window.location.href = '/search';
          }}
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#57C8F4',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Go to Search
        </button>
      </div>
    );
  }
 

  return (
    <div className="genre-rec">
      <h3>If you liked this, you'll definitely love these...</h3>
      <Slider {...sliderSettings}>
        {movies.map((movie, index) => (
          <div
            key={index}
            className="carousel-item"
            style={{ padding: '0 10px' }}
          >
            <MoviePoster
              key={movie.show_id}
              imageUrl={movieImages[movie.title] || defaultImageUrl}
              title={movie.title}
              onClick={() => {
                setSelectedMovie(movie);
                setSelectedPosterUrl(movieImages[movie.title]|| '/images/default.jpg')}}// Handle the click to open the modal
          
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

export default GetTopRec;
