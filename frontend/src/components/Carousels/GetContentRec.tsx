import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getContentRecs } from '../../api/RecommenderAPI';
import { getImage } from '../../api/ImageAPI';
import { Movie } from '../../types/Movie';
import { ContentRecGroup } from '../../types/Recommendations';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieDetails from '../movieCards/MovieDetails';
import MoviePoster from '../movieCards/MoviePoster';

const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="spinner" />
    <style>
      {`
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top: 4px solid #57C8F4;
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

function sanitizeTitle(title: string): string {
  return title.replace(/[-?#()'":’‘“”.!&]/g, '');
}

interface GetContentRecProps {
  userId: number;
}


const GetContentRec: React.FC<GetContentRecProps> = ({ userId }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPosterUrl, setSelectedPosterUrl] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
  const [sourceTitle, setSourceTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const defaultImageUrl = '/images/default.jpg';

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const recGroups: ContentRecGroup[] | null = await getContentRecs(userId);
        console.log("Content Rec API response:", recGroups);
  
        if (recGroups && recGroups.length > 0) {
          const group = recGroups[0]; // Just take the first liked show for now
          setSourceTitle(`"${group.recommendations[0]?.title}"`); // Optional improvement
  
          const recommendations = group.recommendations;
          setRecommendations(recommendations);
  
          const imagePromises = recommendations.map(async (movie) => {
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
        console.error('Error fetching content recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecommendations();
  }, [userId]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    cssEase: 'ease',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  if (loading) {
    return (
      <div className="genre-rec">
        <h2> Because you liked <strong>{sourceTitle}</strong>
        <Spinner /></h2>
       
      </div>
    );
  }

  return (
    <div className="genre-rec">
      <h2>
        Because you liked <strong>{sourceTitle}</strong>
      </h2>
      <Slider {...sliderSettings}>
        {recommendations.map((movie, index) => (
          <div key={index} className="carousel-item" style={{ padding: '0 5px' }}>
            <MoviePoster
              key={movie.show_id}
              imageUrl={movieImages[movie.title] || defaultImageUrl}
              title={movie.title}
              onClick={() => {
                setSelectedMovie(movie);
                setSelectedPosterUrl(movieImages[movie.title] || defaultImageUrl);
              }}
            />
          </div>
        ))}
      </Slider>

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

export default GetContentRec;