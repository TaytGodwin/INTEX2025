import React, { useState } from 'react';
import { Movie } from '../types/Movie';
import { getAllMovies } from '../api/AllMoviesAPI'; // ✅ You were missing this import


export interface EditMovieModalProps {
  movie: Movie;
  genres: string[];
  onClose: () => void;
  onMovieUpdated: (updatedMovies: Movie[]) => void; // ✅ Updated to expect updated movies
}


const EditMovieModal: React.FC<EditMovieModalProps> = ({ movie, genres, onClose, onMovieUpdated }) => {
  const [editedMovie, setEditedMovie] = useState({
    ...movie,
    genres: movie.genres.map(g => g.genreName) // string[] for editing
  });
 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedMovie({ ...editedMovie, [name]: value });
  };


  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://intexbackend25-c6ffa9adgthsgtdf.eastus-01.azurewebsites.net/api/Movie/UpdateMovie/${movie.show_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editedMovie), // ✅ Correct variable name
      });


      if (response.ok) {
        const updated = await getAllMovies(); // ✅ Now this works
        onMovieUpdated(updated); // ✅ Pass updated movie list
        onClose();
      } else {
        console.error('Failed to update movie');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Movie</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input className="form-control mb-2" name="title" value={editedMovie.title} onChange={handleChange} />
            <input className="form-control mb-2" name="type" value={editedMovie.type} onChange={handleChange} />
            <input className="form-control mb-2" name="director" value={editedMovie.director} onChange={handleChange} />
            <input className="form-control mb-2" name="cast" value={editedMovie.cast} onChange={handleChange} />
            <input className="form-control mb-2" name="country" value={editedMovie.country} onChange={handleChange} />
            <input className="form-control mb-2" name="release_year" type="number" value={editedMovie.release_year} onChange={handleChange} />
            <input className="form-control mb-2" name="duration" value={editedMovie.duration} onChange={handleChange} />
            <textarea className="form-control mb-2" name="description" value={editedMovie.description} onChange={handleChange} />
            <select className="form-select" name="rating" value={editedMovie.rating} onChange={handleChange}>
              <option value="">Select Rating</option>
              {['G', 'PG', 'PG-13', 'R', 'NR', 'UR', 'TV-Y', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA', 'TV-Y7', 'TV-Y7-FV'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              className="form-select mb-2"
              multiple
              value={editedMovie.genres.map(g => g.genre)} // adjust if needed
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                setEditedMovie({
                  ...editedMovie,
                genres: selected.map((name) => ({ genreName: name })) // adjust to your genre type
              });
            }}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>


          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EditMovieModal;


