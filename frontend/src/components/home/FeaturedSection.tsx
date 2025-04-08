import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getAllMovies } from '../../api/AllMoviesAPI'; // New API call to fetch all movies
import { getImage } from '../../api/ImageAPI';
import MoviePoster from '../movieCards/MoviePoster';
import { Movie } from '../../types/Movie';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function FeaturedSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  // Using the movie title as the key to store the fetched image URL
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  // A default image URL in case fetching fails
  const defaultImageUrl = '/images/default.jpg';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Call your API to get all movies
        const result = await getAllMovies();
        if (result) {
          // Grab the first 10 movies from the result
          const topTenMovies = result.slice(0, 10);
          setMovies(topTenMovies);

          // For each movie, fetch its image using the movie title
          const imagePromises = topTenMovies.map(async (movie) => {
            const blob = await getImage(movie.title);
            if (blob) {
              return { title: movie.title, url: URL.createObjectURL(blob) };
            } else {
              return { title: movie.title, url: defaultImageUrl };
            }
          });
          const images = await Promise.all(imagePromises);
          const imageMap: { [title: string]: string } = {};
          images.forEach((img) => {
            imageMap[img.title] = img.url;
          });
          setMovieImages(imageMap);
        }
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const sliderSettings = {
    dots: true,           // Show navigation dots
    infinite: false,      // Do not loop infinitely; change to true if desired
    speed: 500,           // Transition speed in milliseconds
    slidesToShow: 5,      // Number of movie posters to show at once
    slidesToScroll: 5,    // Number of posters to scroll at a time
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  if (loading) return <div>Loading movies...</div>;

  return (
    <section className="featured-section">
      <h2>Featured on MyFlix</h2>
      <Slider {...sliderSettings}>
        {movies.map((movie, index) => (
          <div key={index} className="carousel-item" style={{ padding: '0 5px' }}>
            <MoviePoster
              imageUrl={movieImages[movie.title] || defaultImageUrl}
              title={movie.title}
            />
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default FeaturedSection;