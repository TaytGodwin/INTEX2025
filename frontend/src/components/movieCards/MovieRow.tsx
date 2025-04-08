import React from 'react';
import MoviePoster from './MoviePoster';
import '../../css/theme.css';

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
  return (
    <div className="movie-row">
      <h2 className="category-title">{categoryName}</h2>
      <div className="movie-row-scroll">
        {movies.map((movie) => (
          <MoviePoster
            key={movie.id}
            imageUrl={movie.imageUrl}
            title={movie.title}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieRow;