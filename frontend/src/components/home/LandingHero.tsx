import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import genericBg from '../../assets/Solo A Star Wars Story.jpg';
import poster1 from '../../assets/The Music of Silence.jpg';
import poster2 from '../../assets/The Secret Life of Pets 2.jpg';
import poster3 from '../../assets/Jaws.jpg'
import '../../css/theme.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const LandingHero: React.FC = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,  // 5 seconds per slide
    arrows: true,
  };

  // Array of images for the slider; first is generic background.
  const slides = [genericBg, poster1, poster2, poster3];

  return (
    <section 
      className="landing-hero" 
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Overlay with welcome message */}
      <div
        className="hero-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent overlay
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
          padding: '0 1rem'
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to CineNiche</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Stream your favorite shows and movies anytime, anywhere.
        </p>
        <Link 
          to="/register" 
          className="btn-primary" 
          style={{ fontSize: '1.5rem', padding: '0.75rem 1.5rem' }}
        >
          Get Started
        </Link>
      </div>
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <div key={index} className="hero-slide">
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              style={{
                width: '100%',
                maxWidth: '400px', // The image won't exceed 600px in width
                height: '50vh',
                objectFit: 'cover',
                margin: '0 auto'
              }}
            />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default LandingHero;