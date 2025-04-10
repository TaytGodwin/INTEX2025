import { useEffect, useState } from 'react';
import MovieRow from '../components/movieCards/MovieRow';
import GenreRec from '../components/Carousels/GenreRec';


function MoviePage() {

  return (
    <div className="movie-page">
      <MovieRow />
      <GenreRec genre={'Action'}/>
    </div>
  );
}

export default MoviePage;
