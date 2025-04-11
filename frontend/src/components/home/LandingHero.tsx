import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import poster4 from '../../assets/Posters/4.svg';
import poster1 from '../../assets/Posters/1.svg';
import poster2 from '../../assets/Posters/2.svg';
import poster3 from '../../assets/Posters/3.svg';
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
  const slides = [poster1, poster2, poster3, poster4];

  return (
    <section 
      className="landing-hero" 
      style={{ position: 'relative', overflow: 'hidden', marginTop: '-70px'}}
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
          padding: '0'
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to CineNiche</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Stream your favorite shows and movies anytime, anywhere.
        </p>
        <Link to="/register" className="nav-link sign-in-button" style={{
                  fontSize: '2rem',
                  borderRadius: '50px',
                  padding: '0.5rem 1.5rem',
                  
                }}>
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
                maxWidth: '1000px', // The image won't exceed 600px in width
                height: '60vh',
                objectFit: 'cover',
                margin: '0 auto',
                borderRadius: '15px' //
              }}
            />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default LandingHero;