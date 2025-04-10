// GenreRec.tsx
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getForYou } from '../../api/RecommenderAPI'; // Adjust path if needed
import { getImage } from '../../api/ImageAPI';
import MovietopTen from '../movieCards/MovietopTen';
import { Movie } from '../../types/Movie';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MoviePoster from '../movieCards/MoviePoster';

function sanitizeTitle(title: string): string {
  return title.replace(/[-?#()'":’‘“”.!&]/g, '');
}
interface GenreRecProps {
  userId: number;
}
const ForYou: React.FC<GenreRecProps> = ({ userId }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
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
    cssEase: 'linear',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  const handlePosterClick = (movie: any) => {
    setSelectedMovie(movie); // Set the selected movie for modal
  };

  const closeModal = () => {
    setSelectedMovie(null); // Close the modal
  };

  if (loading) return <div>Loading movies...</div>; // Show loading text until the data is fetched

  function setSelectedPosterUrl(arg0: string) {
    throw new Error('Function not implemented.');
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
            {/* <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{
                fontSize: '10rem',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.08)',
                position: 'absolute',
                left: 0,
                zIndex: 0,
              }}>
                5
              </div>
              <img
                src={movieImages[movie.title] || '/images/default.jpg'}
                alt="The Croods"
                style={{
                  width: '150px',
                  height: 'auto',
                  marginLeft: '3rem',
                  zIndex: 1,
                  borderRadius: '6px',
                }}
              />
            </div> */}

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
            {/* <MovietopTen
              key={movie.show_id}
              posterUrl={movieImages[movie.title] || '/images/default.jpg'}
              title={movie.title}
              onClick={() => handlePosterClick(movie)}
              rank={index + 1} // optional: shows 1-10
            /> */}
          </div>
        ))}
      </Slider>
      {/* Modal to display movie details */}
      {selectedMovie && (
        <div
          className="modal show"
          style={{ display: 'block' }}
          tabIndex={-1}
          aria-labelledby="movieModal"
          aria-hidden="false"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="movieModal">
                  {selectedMovie.title}
                </h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Director:</strong> {selectedMovie.director}
                </p>
                <p>
                  <strong>Cast:</strong> {selectedMovie.cast}
                </p>
                <p>
                  <strong>Release Year:</strong> {selectedMovie.release_year}
                </p>
                <p>
                  <strong>Rating:</strong> {selectedMovie.rating}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedMovie.duration}
                </p>
                <p>{selectedMovie.description}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForYou;
