import { useEffect, useState } from 'react';
import MovieRow from '../components/movieCards/MovieRow';
import GenreRec from '../components/Carousels/GenreRec';
import { getGenres } from '../api/MoviesAPI';
import { Genre } from '../types/Genre';


function MoviePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [visibleCount, setVisibleCount] = useState(2); // how many carousels are visible

    useEffect(() => {
      const fetchGenres = async () => {
        const allGenres = await getGenres();
        setGenres(allGenres);
        console.log(allGenres)
      };
      fetchGenres();
    }, []);

    useEffect(() => {
      const handleScroll = () => {
        const nearBottom =
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
        if (nearBottom && visibleCount < genres.length) {
          setVisibleCount((prev) => prev + 1);
        }
      };
    
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [genres, visibleCount]);

  return (
    <div className="movie-page">
      <MovieRow />

      {/* This will contain all the other stuff on the page */}
      <GenreRec genre={'Action'}/>
      {/* Carousel that loads on scorll for Genre */}
      <div className="movie-page">
    
        {genres.slice(0, visibleCount).map((genre, index) => (
          <GenreRec key={index} genre={genre.genreName} />
        ))}
      </div>
    </div>
  );
}

export default MoviePage;
