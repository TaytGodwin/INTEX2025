import React, { useState } from 'react';
import Select from 'react-select';
import { Genre } from '../../types/Genre';
import { addMovie, uploadImage } from '../../api/MoviesAPI';

// Props for the AddMovieModal component:
// - genres: list of available genres for the dropdown
// - onClose: function to close the modal
// - onMovieAdded: function to update the parent component when a movie is added
interface AddMovieModalProps {
  genres: Genre[];
  onClose: () => void;
  onMovieAdded: React.Dispatch<React.SetStateAction<any[]>>;
}

// Main AddMovieModal component:
// - Initializes form state for movie details including title, type, director, etc.
// - selectedGenres holds the genre names chosen by the user
const AddMovieModal: React.FC<AddMovieModalProps> = ({
  genres,
  onClose,
  onMovieAdded,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    director: '',
    cast: '',
    country: '',
    release_year: '',
    rating: '',
    duration: '',
    description: '',
    selectedGenres: [] as string[],
  });

  // Handles changes to text, number, and textarea inputs by updating formData state
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Updates selectedGenres in formData when genres are selected from the dropdown
  const handleGenreChange = (selected: any) => {
    const genreValues = selected.map((s: any) => s.value);
    setFormData({ ...formData, selectedGenres: genreValues });
  };

  // Stores the uploaded image file (JPG only) for the movie poster
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Handles image file upload:
  // - Accepts only JPG files
  // - Updates imageFile state if valid
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'image/jpeg') {
        setImageFile(file);
      } else {
        alert('Only JPG files are allowed');
      }
    }
  };

  // Handles form submission:
  // - Validates required fields
  // - Renames and uploads image
  // - Submits new movie data to backend
  // - Updates parent movie list and closes modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that the title is provided, which we use as the image name
    const imageName = formData.title.trim();
    if (!imageName) {
      alert('Image title is required!');
      return;
    }

    // Validate that an image file has been selected
    if (!imageFile) {
      alert('Please select an image file.');
      return;
    }

    // Create a new File object with the title as the new file name
    // This replaces the front part of the original file name with the title.
    const renamedFile = new File([imageFile], `${imageName}.jpg`, {
      type: imageFile.type,
    });

    // Call the API function from MoviesAPI to upload the image
    const uploadSuccess = await uploadImage(imageName, renamedFile);
    if (!uploadSuccess) {
      alert('Image upload failed.');
      return;
    }

    // Constructs the new movie object from formData to be sent to the backend
    const newMovie = {
      title: formData.title,
      type: formData.type,
      director: formData.director,
      cast: formData.cast,
      country: formData.country,
      release_year: Number(formData.release_year),
      rating: formData.rating,
      duration: formData.duration,
      description: formData.description,
      genres: formData.selectedGenres, // adjust as required by your backend
    };

    // Submit the movie record to the backend
    const addMovieSuccess = await addMovie(newMovie);
    if (!addMovieSuccess) {
      alert('Failed to add the movie to the database.');
      return;
    }

    // Proceed with additional actions like updating the movie list and closing the modal
    onMovieAdded((prevMovies) => [...prevMovies, newMovie]);
    onClose();
  };

  // Renders the modal UI:
  // - Includes inputs for movie details
  // - Genre multi-select dropdown
  // - JPG image upload
  // - Cancel and Submit buttons
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add New Movie</h2>
          <button onClick={onClose} style={closeButtonStyle}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} style={formStyle}>
          {[
            'title',
            'type',
            'director',
            'cast',
            'country',
            'release_year',
            'rating',
            'duration',
            'description',
          ].map((field, i) => (
            <div key={i}>
              <label style={labelStyle}>
                {field
                  .replace('_', ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
              {field === 'description' ? (
                <textarea
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  style={inputStyle}
                />
              ) : (
                <input
                  type={field === 'release_year' ? 'number' : 'text'}
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
          <label style={labelStyle}>Genres</label>
          <Select
            isMulti
            options={genres.map((g) => ({
              value: g.genreName,
              label: g.genreName,
            }))}
            value={formData.selectedGenres.map((g) => ({ value: g, label: g }))}
            onChange={handleGenreChange}
            styles={selectStyles}
          />
          <div>
            <label style={labelStyle}>Upload Image (JPG only)</label>
            <input
              type="file"
              accept=".jpg, image/jpeg"
              onChange={handleFileUpload}
              style={inputStyle}
            />
          </div>
          <div style={buttonRowStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" style={submitButtonStyle}>
              Add Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline style definitions for modal layout and components:
// - Includes styles for overlay, modal container, headers, form inputs, buttons, and react-select customization
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#2a2a2a',
  padding: '2rem',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '600px',
  color: '#fff',
  maxHeight: '80vh', // Set a maximum height for the modal
  overflowY: 'auto', // Enable vertical scrolling for overflow content
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  fontFamily: 'Fredoka One',
};

const modalTitleStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 700,
  fontFamily: 'Fredoka, sans-serif',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  color: '#ccc',
  cursor: 'pointer',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const labelStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 500,
  marginBottom: '0.25rem',
};

const inputStyle: React.CSSProperties = {
  backgroundColor: '#444',
  color: '#fff',
  border: '1px solid #666',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontSize: '1rem',
  width: '100%',
};

const selectStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: '#444',
    borderColor: '#666',
    color: '#fff',
    borderRadius: '6px',
    padding: '2px',
  }),
  input: (base: any) => ({
    ...base,
    color: '#fff',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#fff',
  }),
  multiValue: (styles: any) => ({
    ...styles,
    backgroundColor: '#57C8F4',
    color: '#000',
  }),
  multiValueLabel: (styles: any) => ({
    ...styles,
    color: '#000',
    fontWeight: 600,
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#2a2a2a',
    color: '#fff',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? '#57C8F4' : '#2a2a2a',
    color: state.isFocused ? '#000' : '#fff',
  }),
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: '#6c757d',
  color: '#fff',
  padding: '0.5rem 1.25rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const submitButtonStyle: React.CSSProperties = {
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  backgroundColor: '#57C8F4',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
};

export default AddMovieModal;
