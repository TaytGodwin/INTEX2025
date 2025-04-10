import { useEffect, useState } from 'react';
import GenreRec from '../components/Carousels/GenreRec';
import { getGenres } from '../api/MoviesAPI';
import { Genre } from '../types/Genre';
import GetContentRec from '../components/Carousels/GetContentRec';
import ForYou from '../components/Carousels/ForYou';
import GetTopRec from '../components/Carousels/GetTopRec';
import LandingMovieHero from '../components/movieCards/LandingMovieHero';


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
// Adds scrolling ability 
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
      <LandingMovieHero/>
      <div
      style={{
        width: '100%',
        height: '4px', // You can adjust height
        backgroundColor: '#57c8f4', // Nice blue color
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '2rem',
        position: 'relative', // or 'fixed' if you want it to stay on top while scrolling
        top: 0,
        zIndex: 100,
        }}>
      </div>
      <ForYou userId={4} />
      <GenreRec genre={'Action'} />

      <div className="genre-recs-wrapper">
        {genres.slice(0, visibleCount).map((genre, index) => (
          <GenreRec key={index} genre={genre.genreName} />
        ))}
      </div>
</div>
  );
}

export default MoviePage;
