import { useEffect, useState } from 'react';
import GenreRec from '../components/Carousels/GenreRec';
import LazyGenreRec from '../components/Carousels/LazyCarousels/LazyGenreRec';
import { getGenres } from '../api/MoviesAPI';
import { Genre } from '../types/Genre';
import GetContentRec from '../components/Carousels/GetContentRec';
import ForYou from '../components/Carousels/ForYou';
import GetTopRec from '../components/Carousels/GetTopRec';
import LandingMovieHero from '../components/movieCards/LandingMovieHero';
import LazyForYou from '../components/Carousels/LazyCarousels/LazyForYou';



function MoviePage() {
  const [genres, setGenres] = useState<Genre[]>([]);

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        setVisibleCount(prev => prev + 2); // Show 2 more carousels
      }
    };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

    useEffect(() => {
      const fetchGenres = async () => {
        const allGenres = await getGenres();
        setGenres(allGenres);
        console.log(allGenres)
      };
      fetchGenres();
    }, []);
// Adds scrolling ability 

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
      <LazyForYou userId={4} />
    
      <div className="genre-recs-wrapper">
      {genres.slice(0, visibleCount).map((genre, index) => (
        <LazyGenreRec key={index} genre={genre.genreName} />
      ))}
      </div>
</div>
  );
}

export default MoviePage;
