import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { right } from '@popperjs/core';

interface StarRatingProps {
  userId: number;
  showId: number;
}
// How to implement in other files:
// <StarRating userId={2} showId={22} />
const StarRating: React.FC<StarRatingProps> = ({ userId, showId }) => {
  const [rating, setRating] = useState<number>(0);
  const Identity_API_URL =
    'https://cinenichebackend-fjhdf8csetdbdmbv.westus2-01.azurewebsites.net';

  // Fetch the user's current rating when the component mounts or when userId/showId changes
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(
          `${Identity_API_URL}/api/movie/GetRating`,
          {
            params: { userId, showId },
          }
        );
        setRating(response.data.rating);
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    fetchRating();
  }, [userId, showId]);

  // Handle a click which sets a new rating
  const handleRatingClick = async (newRating: number) => {
    console.log(
      'Rating clicked with values: newRate, uid, show',
      newRating,
      userId,
      showId
    );
    try {
      setRating(newRating);
      // Send the new rating to the backend
      await axios.post(
        `${Identity_API_URL}/api/movie/AddRating`,
        {}, // keep the body empty or use {}
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { rating: newRating, userId, showId },
        }
      );
      console.log('Rating successfully sent');
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  // Render 5 star icons for rating
  const ratingButtons = [1, 2, 3, 4, 5].map((num) => (
    <span
      key={num}
      className={`star ${num <= rating ? 'selected' : 'unselected'}`}
      onClick={() => handleRatingClick(num)}
    >
      {num <= rating ? '★' : '☆'}
    </span>
  ));

  return (
    <>


    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          
          
          {ratingButtons}
    </div>
    <h6 style={{display:'flex', gap: '4px', justifyContent: 'right'}}>Rating:</h6>
    
    </>
    
  );
};

export default StarRating;
