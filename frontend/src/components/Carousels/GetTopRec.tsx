// // GenreRec.tsx
// import { useEffect, useState } from 'react';
// import Slider from 'react-slick';
// import { getTopRec } from '../../api/RecommenderAPI'; // Adjust path if needed
// import { getImage } from '../../api/ImageAPI';
// import MoviePoster from '../movieCards/MoviePoster';
// import { Movie } from '../../types/Movie';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';


// function sanitizeTitle(title: string): string {
//   return title.replace(/[-?#()'":’‘“”.!&]/g, '');
// }
// interface TopRecProps {
//   showId: number;
// }
// const GetTopRec: React.FC<TopRecProps> = ({showId}) => {
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
//   const [loading, setLoading] = useState<boolean>(true);
//   const defaultImageUrl = '/images/default.jpg';
  
//   useEffect(() => {
//     const fetchMovies = async () => {
//       setLoading(true);
//       try {
//         const results = await getTopRec(showId);
//         if (results) {
//           setMovies(results);

//           const imagePromises = results.map(async (movie) => {
//             const sanitizedTitle = sanitizeTitle(movie.title);
//             const blob = await getImage(sanitizedTitle);
//             return {
//               title: movie.title,
//               url: blob ? URL.createObjectURL(blob) : defaultImageUrl,
//             };
//           });

//           const images = await Promise.all(imagePromises);
//           const imageMap: { [title: string]: string } = {};
//           images.forEach((img) => {
//             imageMap[img.title] = img.url;
//           });
//           setMovieImages(imageMap);
//         }
//       } catch (error) {
//         console.error('Error fetching genre recommendations:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMovies();
//   }, [showId]);
//   // Fetch images for the movies when the movies array changes.
//      useEffect(() => {
//       const fetchImages = async () => {
//         const imagePromises = movies.map(async (movie) => {
//           const sanitizedTitle = sanitizeTitle(movie.title);
//           const encodedTitle = encodeURIComponent(sanitizedTitle);
//           try {
//             const blob = await getImage(encodedTitle);
//             if (blob) {
//               return { key: movie.title, url: URL.createObjectURL(blob) };
//             } else {
//               return { key: movie.title, url: '/images/default.jpg' };
//             }
//           } catch (error) {
//             console.error(`Error fetching image for ${movie.title}:`, error);
//             return { key: movie.title, url: '/images/default.jpg' };
//           }
//         });
//         const images = await Promise.all(imagePromises);
//         const imageMap: { [key: string]: string } = {};
//         images.forEach((img) => {
//           imageMap[img.key] = img.url;
//         });
//         setMovieImages(imageMap);
//       };
  
//       if (movies.length > 0) {
//         fetchImages();
//       }
//     }, [movies]);


//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 5,
//     slidesToScroll: 5,
//     cssEase: 'linear',
//     responsive: [
//       { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 4 } },
//       { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
//     ],
//   };
//     if (loading) return <div>Loading movies...</div>;  // Show loading text until the data is fetched
  
//     return (
//       <div className="genre-rec">
//         <h2>If you liked this, you'll definitely love these top 5...</h2>
        
//         <Slider {...sliderSettings}>
//         {movies.map((movie, index) => (
//           <div
//             key={index}
//             className="carousel-item"
//             style={{ padding: '0 5px' }}
//           >
//             <GetTopRec showId={movie.show_id}/> 
//           </div>
//         ))}
//       </Slider>
//       </div>
//     );
//   };
  
//   export default GetTopRec;

  import { useEffect, useState } from 'react';
  import Slider from 'react-slick';
  import { getTopRec } from '../../api/RecommenderAPI';
  import { getImage } from '../../api/ImageAPI';
  import MoviePoster from '../movieCards/MoviePoster';
  import { Movie } from '../../types/Movie';
  import 'slick-carousel/slick/slick.css';
  import 'slick-carousel/slick/slick-theme.css';
import MovieDetails from '../movieCards/MovieDetails';
  
  function sanitizeTitle(title: string): string {
    return title.replace(/[-?#()'":’‘“”.!&]/g, '');
  }
  
  interface TopRecProps {
    showId: number;
  }
  
  const GetTopRec: React.FC<TopRecProps> = ({ showId }) => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedPosterUrl, setSelectedPosterUrl] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const defaultImageUrl = '/images/default.jpg';
  
    useEffect(() => {
      const fetchMovies = async () => {
        setLoading(true);
        try {
          const results = await getTopRec(showId);
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
          console.error('Error fetching top recommendations:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMovies();
    }, [showId]);
  
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      cssEase: 'ease',
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 4 } },
        { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      ],
    };
  
    if (loading) return <div>Loading movies...</div>;
  
   

    return (
      <div className="genre-rec">
        <h2>If you liked this, you'll definitely love these top 5...</h2>
        <Slider {...sliderSettings}>
          {movies.map((movie, index) => (
            <div
              key={index}
              className="carousel-item"
              style={{ padding: '0 10px' }}
            >
              <MoviePoster
                imageUrl={movieImages[movie.title] || defaultImageUrl}
                title={movie.title}
                onClick={() => {
                  setSelectedMovie(movie);
                  setSelectedPosterUrl(movieImages[movie.title]|| '/images/default.jpg')}}// Handle the click to open the modal
            
              />
            </div>
          ))}
        </Slider>
         {/* Show Modal Conditionally */}
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
    );
  };
  
  export default GetTopRec;
  