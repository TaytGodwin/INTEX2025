import React from 'react';
import Slider from 'react-slick';
import MoviePoster from './MoviePoster';
import '../../css/theme.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
}

interface MovieRowProps {
  categoryName: string;
  movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ categoryName, movies }) => {
  const settings = {
    dots: false,            // Whether to show dots for navigation
    infinite: false,        // Whether the slider should loop infinitely
    speed: 500,             // Transition speed in ms
    slidesToShow: 5,        // Number of slides to show at once
    slidesToScroll: 5,      // Number of slides to scroll per arrow click
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

  return (
    <div className="movie-row">
      <h2 className="category-title">{categoryName}</h2>
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ padding: '0 5px' }}>
            <MoviePoster
              imageUrl={movie.imageUrl}
              title={movie.title}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieRow;