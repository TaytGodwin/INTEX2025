import React, { useState } from 'react';
import { addMovie, getAllMovies } from '../../api/MoviesAPI';
import { NewMovie } from '../../types/NewMovie';
import { Movie } from '../../types/Movie';
import Select from 'react-select';

interface AddMovieModalProps {
  genres: string[]; // List of genres to populate dropdown
  onClose: () => void; // Function to close model
  onMovieAdded: (updatedMovies: Movie[]) => void; // Call back to parent after update
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
  genres,
  onClose,
  onMovieAdded,
}) => {
  const [newMovie, setNewMovie] = useState<NewMovie>({
    // Initializing movie
    title: '',
    type: '',
    director: '',
    cast: '',
    country: '',
    release_year: new Date().getFullYear(),
    rating: '',
    duration: '',
    description: '',
    genres: [],
  });

  const handleChange = (
    // Generically updates the movie object anytime a feild is changed in input
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  // const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   // Sets the list of genres
  //   const selectedGenres = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value
  //   );
  //   setNewMovie({ ...newMovie, genres: selectedGenres });
  // };

  const handleSubmit = async () => {
    try {
      const response = await addMovie(newMovie); // Calls the generic API call

      if (response) {
        const updated = await getAllMovies(); // ✅ fetch the updated list
        onMovieAdded(updated); // ✅ send updated list to parent
        onClose();
      } else {
        console.error('Failed to add movie');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Movie</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              className="form-control mb-2"
              name="title"
              placeholder="Title"
              value={newMovie.title}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="type"
              placeholder="Type"
              value={newMovie.type}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="director"
              placeholder="Director"
              value={newMovie.director}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="cast"
              placeholder="Cast"
              value={newMovie.cast}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="country"
              placeholder="Country"
              value={newMovie.country}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="release_year"
              type="number"
              min={1888}
              placeholder="Release Year"
              value={newMovie.release_year}
              onChange={handleChange}
            />
            <select
              className="form-select mb-2"
              name="rating"
              value={newMovie.rating}
              onChange={handleChange}
            >
              <option value="">Select Rating</option>
              {[
                'G',
                'PG',
                'PG-13',
                'R',
                'NR',
                'UR',
                'TV-Y',
                'TV-G',
                'TV-PG',
                'TV-14',
                'TV-MA',
                'TV-Y7',
                'TV-Y7-FV',
              ].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
            <input
              className="form-control mb-2"
              name="duration"
              placeholder="Duration"
              value={newMovie.duration}
              onChange={handleChange}
            />
            <textarea
              className="form-control mb-2"
              name="description"
              placeholder="Description"
              value={newMovie.description}
              onChange={handleChange}
            />
            <label className="form-label">Select Genres</label>
            <Select
              isMulti
              className="mb-2" // ❌ remove Bootstrap's "form-select", it breaks react-select styles
              options={genres.map((g) => ({ value: g, label: g }))}
              value={newMovie.genres.map((g) => ({ value: g, label: g }))}
              onChange={(selectedOptions) =>
                setNewMovie({
                  ...newMovie,
                  genres: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                })
              }
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Add Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMovieModal;
