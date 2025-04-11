import Slider from 'react-slick';
import MoviePoster from '../movieCards/MoviePoster';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import your asset images from the Featured directory
import Hook from '../../../public/assets/Featured/Hook.jpg';
import HowToTrainYourDragon2 from '../../../public/assets/Featured/How to Train Your Dragon 2.jpg';
import IpMan2 from '../../../public/assets/Featured/Ip Man 2.jpg';
import KungFuPanda2 from '../../../public/assets/Featured/Kung Fu Panda 2.jpg';
import SavedByTheBell from '../../../public/assets/Featured/Saved by the Bell.jpg';
import ScaryMovie5 from '../../../public/assets/Featured/Scary Movie 5.jpg';
import SevenPounds from '../../../public/assets/Featured/Seven Pounds.jpg';
import StrangerThings from '../../../public/assets/Featured/Stranger Things.jpg';
import { useState } from 'react';
import React from 'react';

// Hardcoded array of featured movies
const hardcodedMovies = [
  { title: 'Hook', posterUrl: Hook },
  { title: 'How to Train Your Dragon 2', posterUrl: HowToTrainYourDragon2 },
  { title: 'Ip Man 2', posterUrl: IpMan2 },
  { title: 'Kung Fu Panda 2', posterUrl: KungFuPanda2 },
  { title: 'Saved by the Bell', posterUrl: SavedByTheBell },
  { title: 'Scary Movie 5', posterUrl: ScaryMovie5 },
  { title: 'Seven Pounds', posterUrl: SevenPounds },
  { title: 'Stranger Things', posterUrl: StrangerThings },
];

function FeaturedSection() {
  const [movies] = useState(hardcodedMovies);

  // Slider configuration
  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 200000, // Adjust for smooth continuous scroll
    cssEase: 'linear',
    pauseOnHover: false,
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
    <section
      className="featured-section"
      style={{ padding: '2rem', background: '#151515' }}
    >
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>
        Featured on MyFlix
      </h2>
      <Slider {...sliderSettings}>
        {movies.map((movie, index) => (
          <div
            key={index}
            className="carousel-item"
            style={{ padding: '0 10px' }}
          >
            <MoviePoster imageUrl={movie.posterUrl} title={movie.title} />
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default React.memo(FeaturedSection);
