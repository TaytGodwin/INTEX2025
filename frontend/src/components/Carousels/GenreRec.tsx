// GenreRec.tsx

import { useState, useEffect } from 'react';
import { getGenreMovies } from '../../api/RecommenderAPI';  // Import the mock API call
import MoviePoster from '../movieCards/MoviePoster';  // Assuming you have a MoviePoster component for displaying images
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const GenreRec = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<any | null>(null); // Track the selected movie for the modal
  
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          // Fetch movie data from mock API
          const movieData = await getAllMovies();
          setMovies(movieData);  // Store the fetched movies in state
        } catch (error) {
          console.error('Error fetching movies:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMovies();  // Call the function when the component mounts
    }, []);
  
    const handlePosterClick = (movie: any) => {
      setSelectedMovie(movie); // Set the selected movie for modal
    };
  
    const closeModal = () => {
      setSelectedMovie(null); // Close the modal
    };
  
    if (loading) return <div>Loading movies...</div>;  // Show loading text until the data is fetched
  
    return (
      <div className="genre-rec">
        <h2>Recommended Movies in Your Genre</h2>
        <div className="carousel">
          {movies.map((movie) => (
            <MoviePoster
              key={movie.show_id}
              imageUrl={`/images/${movie.title.toLowerCase().replace(/ /g, '-')}.jpg`}  // Example image URL logic
              title={movie.title}
              onClick={() => handlePosterClick(movie)} // Handle the click to open the modal
            />
          ))}
        </div>
  
        {/* Modal to display movie details */}
        {selectedMovie && (
          <div className="modal show" style={{ display: 'block' }} tabIndex={-1} aria-labelledby="movieModal" aria-hidden="false">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="movieModal">{selectedMovie.title}</h5>
                  <button type="button" className="close" onClick={closeModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p><strong>Director:</strong> {selectedMovie.director}</p>
                  <p><strong>Cast:</strong> {selectedMovie.cast.join(', ')}</p>
                  <p><strong>Release Year:</strong> {selectedMovie.releaseYear}</p>
                  <p><strong>Rating:</strong> {selectedMovie.rating}</p>
                  <p><strong>Duration:</strong> {selectedMovie.duration}</p>
                  <p>{selectedMovie.description}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default GenreRec;