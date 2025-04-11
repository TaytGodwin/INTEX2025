
  import React, { useState, useEffect } from 'react';
  import { Movie } from '../types/Movie';
  import { getImage } from '../api/ImageAPI';
  import {getUserId} from '../api/MoviesAPI'
  import MoviePoster from '../components/movieCards/MoviePoster';
  import MovieDetails from '../components/movieCards/MovieDetails';
 
  import { getFavorites } from '../api/RecommenderAPI';
import { pingAuth,  } from '../api/IdentityAPI';
import LandingMovieHero from '../components/movieCards/LandingMovieHero';
  
function sanitizeTitle(title: string): string {
    return title.replace(/[\/\-?#()'":’‘“”.!&]/g, '');
  }
  const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner" />
      <style>
        {`
            .spinner {
              border: 4px solid rgba(255, 255, 255, 0.2);
              border-top: 4px solid #57c8f4;
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
  
  const FavoritesPage: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedPosterUrl, setSelectedPosterUrl] = useState<string>('');
    const defaultImageUrl = '/images/default.jpg';
    
    //Adds User's ID
     // Use pingAuth to get the user's email and then fetch the user id via getUserId
      useEffect(() => {
        const fetchUserEmailAndId = async () => {
          const authData = await pingAuth();
          if (authData?.email) {
            const id = await getUserId(authData.email);
            setUserId(id);
          }
        };
    
        fetchUserEmailAndId();
      }, []);


    // Fetch favorites for the user and then fetch images for each movie
    useEffect(() => {
      const fetchFavorites = async () => {
        if (!userId) return;
        setLoading(true);
        try {
          // Fetch top 25 favorite movies
          const results = await getFavorites(userId);
          setFavorites(results);
  
          // For each movie, fetch its poster image
          const imagePromises = results.map(async (movie) => {
            const sanitized = sanitizeTitle(movie.title);
            const blob = await getImage(sanitized);
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
        } catch (error) {
          console.error('Error fetching favorites:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFavorites();
    }, [userId]);
  
    return (
        <div style={{ padding: '2rem', paddingBottom: '4rem', minHeight: '100vh', background: 'radial-gradient(ellipse at center, rgba(87,200,244,0.1) 0%, rgba(21,21,21,0.99) 60%)'}}> 
{/* Header Section  */}

<header
  style={{
    padding: '3rem 2rem',
    background: 'transparent',
    borderBottom: '2px solid #57c8f4',
    textAlign: 'center',
  }}
>
  <h1
    style={{
      marginBottom: '0.5rem',
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#fff',
    }}
  >
    Your Top 25 Movies
  </h1>
  <p
    style={{
      fontSize: '1.25rem',
      color: '#ddd',
    }}
  >
    Discover your favorites, filtered weekly and updated regularly.
  </p>
</header>
    <div style={{ padding: '0 2rem', marginTop: '3rem' }}>
      {loading ? (
        <Spinner />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '2rem',
            padding: '1rem',
            paddingBottom: '4rem',
          }}
        >
          {favorites.map((movie, index) => {
            const rank = index + 1;
            const imageUrl = movieImages[movie.title] || defaultImageUrl;
            return (
              <div
                key={movie.show_id}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    paddingLeft: '5rem',
                }}
                onClick={() => {
                  setSelectedMovie(movie);
                  setSelectedPosterUrl(imageUrl);
                }}
              >
                {/* Ranking overlay, hidden behind the poster */}   
                 <div
                      style={{
                        fontSize: '13rem',
                        fontWeight: 900,
                        color: 'rgba(255, 255, 255, 0.08)',
                        outline: '#fff', 
                        // color: '#fff',
                        position: 'absolute',
                        left: rank >= 10 ? '-3rem' : '0',
                        zIndex: 0,
                      }}
                    >
                  {rank}
               </div>
                <MoviePoster
                  imageUrl={imageUrl}
                  title={movie.title}
                  
                />
              </div>
            
            );
          })}
        </div>
      )}
      <div/>

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
    </div>
  );
};
export default FavoritesPage;