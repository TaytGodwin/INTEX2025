import { useEffect, useState } from 'react';
import LazyGenreRec from '../components/Carousels/LazyCarousels/LazyGenreRec';
import { getGenres, getUserId, getUserName } from '../api/MoviesAPI';
import { Genre } from '../types/Genre';
import GetContentRec from '../components/Carousels/GetContentRec';
import LandingMovieHero from '../components/movieCards/LandingMovieHero';
import LazyForYou from '../components/Carousels/LazyCarousels/LazyForYou';
import { pingAuth } from '../api/IdentityAPI';
import CookiesModal from '../components/authentication/CookiesModal';

function MoviePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [user_id, setUserId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [userName, setUserName] = useState<string>('to CineNiche');
  const [showCookieModal, setShowCookieModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setVisibleCount((prev) => prev + 2); // Show 2 more carousels
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      const allGenres = await getGenres();
      setGenres(allGenres);
      console.log(allGenres);
    };
    fetchGenres();
  }, []);

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
  // Adds scrolling ability

  // Fetch and set user name once user_id is available
  useEffect(() => {
    if (user_id !== null) {
      const fetchUserName = async () => {
        const name = await getUserName(user_id);
        setUserName(name); // Set the userName after fetching from the API
      };

      fetchUserName();
    }
  }, [user_id]); // This effect depends on user_id

  // Function to get the value of a specific cookie by name
  const getCookieValue = (cookieName: string): string | undefined => {
    const cookies = document.cookie.split('; ').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
      },
      {} as { [key: string]: string }
    );

    return cookies[cookieName];
  };

  // Check cookie consent and show modal if not present
  useEffect(() => {
    const cookieConsentValue = getCookieValue('CookieConsent');
    if (!cookieConsentValue) {
      setShowCookieModal(true); // Show modal if CookieConsent is not present
    } else if (cookieConsentValue === 'No') {
      setUserName('to CineNiche'); // Set default user name if consent is No
    } else if (cookieConsentValue === 'Yes') {
      // If consent is Yes, set user name to the actual user name
      if (user_id !== null) {
        const fetchUserName = async () => {
          const name = await getUserName(user_id);
          setUserName(name); // Set user name if consent is Yes
        };
        fetchUserName();
      }
    }
  }, [user_id, userName]); // Run this effect only when user_id changes or is available

  return (
    <div className="movie-page">
      {showCookieModal && (
        <CookiesModal setShowCookieModal={setShowCookieModal} />
      )}
      <LandingMovieHero userName={userName} />
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
        }}
      ></div>
      {user_id !== null && (
        <>
          <LazyForYou userId={user_id} />
          <GetContentRec userId={user_id} />
        </>
      )}

      {/* Because you liked..... Title .... this is this .... */}

      <div className="genre-recs-wrapper">
        {genres.slice(0, visibleCount).map((genre, index) => (
          <LazyGenreRec key={index} genre={genre.genreName} />
        ))}
      </div>
    </div>
  );
}

export default MoviePage;
