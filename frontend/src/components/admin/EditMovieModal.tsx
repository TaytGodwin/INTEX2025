import React, { useState } from 'react';
import { Movie } from '../../types/Movie'; // Import the Movie type for TypeScript type checking
import { getAllMovies, updateMovie } from '../../api/MoviesAPI'; // Import API functions for fetching and updating movies
import Select from 'react-select'; // Import react-select for multi-select dropdown
import { Genre } from '../../types/Genre';

// Define the EditMovieModalProps interface to type the props passed into the modal
export interface EditMovieModalProps {
  movie: Movie; // Movie object that we want to edit
  genres: Genre[]; // List of genre names to populate the genre selection dropdown
  onClose: () => void; // Function to close the modal
  onMovieUpdated: (updatedMovies: Movie[]) => void; // Function to update the movie list in the parent component
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({
  movie, // The current movie that will be edited
  genres, // The available genres
  onClose, // Close function passed from the parent
  onMovieUpdated, // Function to update the list of movies after editing
}) => {
  // Initialize state with the movie to be edited
  const [editedMovie, setEditedMovie] = useState<Movie>(movie);

  // Handle changes in the input fields and update the corresponding property in the edited movie state
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target; // Get the input's name and value
    setEditedMovie({ ...editedMovie, [name]: value }); // Update the editedMovie state with the new value
  };

  // Handle form submission to update the movie
  const handleSubmit = async () => {
    try {
      const response = await updateMovie(editedMovie); // Call the API to update the movie

      if (response) {
        // If successful, fetch the updated movie list
        const updated = await getAllMovies(); // Get all movies after the update
        onMovieUpdated(updated); // Update the movie list in the parent component
        onClose(); // Close the modal
      } else {
        console.error('Failed to update movie'); // Log an error if the update failed
      }
    } catch (error) {
      console.error('Error:', error); // Log any errors that occur during the update process
    }
  };

  return (
    // Modal structure
    <div
      className="modal d-block" // Make the modal visible
      tabIndex={-1} // Prevent the modal from receiving focus initially
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Add a semi-transparent black background
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Movie</h5>{' '}
            {/* Title of the modal */}
            <button className="btn-close" onClick={onClose}></button>{' '}
            {/* Close button */}
          </div>
          <div className="modal-body">
            {/* Movie details input fields */}
            <input
              className="form-control mb-2"
              name="title" // This is for the title of the movie
              value={editedMovie.title}
              onChange={handleChange} // Trigger handleChange to update state on input change
            />
            <input
              className="form-control mb-2"
              name="type" // This is for the type of the movie
              value={editedMovie.type}
              onChange={handleChange} // Trigger handleChange to update state on input change
            />
            <input
              className="form-control mb-2"
              name="director" // This is for the director's name
              value={editedMovie.director}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="cast" // This is for the cast of the movie
              value={editedMovie.cast}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="country" // This is for the country where the movie was made
              value={editedMovie.country}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="release_year" // This is for the release year of the movie
              type="number"
              value={editedMovie.release_year}
              onChange={handleChange}
            />
            <input
              className="form-control mb-2"
              name="duration" // This is for the duration of the movie
              value={editedMovie.duration}
              onChange={handleChange}
            />
            <textarea
              className="form-control mb-2"
              name="description" // This is for the description of the movie
              value={editedMovie.description}
              onChange={handleChange}
            />
            {/* Rating selection */}
            <select
              className="form-select"
              name="rating" // This is for the movie's rating
              value={editedMovie.rating}
              onChange={handleChange}
            >
              <option value="">Select Rating</option>
              {/* Movie ratings options */}
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
              ].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Genre selection using react-select */}
            <Select
              isMulti // Allow multiple selections
              className="mb-2" // Adjust styling for select dropdown
              options={genres.map((g) => ({ value: g, label: g }))} // Map genres to options for react-select
              required
              value={editedMovie.genres.map((g) => ({ value: g, label: g }))} // Set the selected genres in the state
              onChange={(selectedOptions) =>
                setEditedMovie({
                  ...editedMovie,
                  genres: selectedOptions
                    ? selectedOptions.map((opt) => opt.value) // Update genres state
                    : [],
                })
              }
            />
          </div>
          {/* Modal footer with Cancel and Save buttons */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>{' '}
            {/* Close the modal */}
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save Changes
            </button>{' '}
            {/* Save changes and close */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovieModal;
