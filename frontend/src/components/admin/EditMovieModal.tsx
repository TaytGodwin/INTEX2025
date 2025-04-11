import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Genre } from '../../types/Genre';
import { loadImage, updateMovie, uploadImage } from '../../api/MoviesAPI';

// Props for the EditMovieModal component:
// - movie: the existing movie data to be edited
// - genres: list of available genres for selection
// - onClose: function to close the modal
// - onMovieUpdated: function to update the movie list after editing
interface EditMovieModalProps {
  movie: any; 
  genres: Genre[];
  onClose: () => void;
  onMovieUpdated: React.Dispatch<React.SetStateAction<any[]>>;
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({
  movie,
  genres,
  onClose,
  onMovieUpdated,
}) => {
  const [formData, setFormData] = useState({
    ...movie,
    selectedGenres: movie.genres || [], // Ensure genres are initialized as an array
  });

  // State for managing image updates:
  // - imageFile stores a new image file if uploaded
  // - imageUrl holds the current or preview image URL
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Loads the existing movie poster image when the modal opens or the title changes:
  // - Fetches the image blob using the movie title
  // - Converts it to a preview URL and sets both imageUrl and imageFile
  useEffect(() => {
    const fetchImage = async () => {
      const blob = await loadImage(formData.title);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setImageFile(blob); // Now imageFile holds the blob, not a promise or URL.
      }
    };
    fetchImage();
  }, [formData.title]);

  // Handles input changes for text, number, and textarea fields
  // - Updates the corresponding value in formData
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Updates the selectedGenres field in formData based on user selection from the dropdown
  const handleGenreChange = (selected: any) => {
    const genreValues = selected.map((s: any) => s.value);
    setFormData({ ...formData, selectedGenres: genreValues });
  };

  // Handles new image file upload:
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
    const renamedFile = new File([imageFile], `${imageName}`, {
      type: imageFile.type,
    });

    // Call the API function from MoviesAPI to upload the image
    const uploadSuccess = await uploadImage(imageName, renamedFile);
    if (!uploadSuccess) {
      alert('Image upload failed.');
      return;
    }

    const updateSuccess = await updateMovie(formData);
    if (!updateSuccess) {
      alert('Movie update failed.');
      return;
    }
    // Proceed with updating the movie
    onMovieUpdated((prevMovies: any[]) =>
      prevMovies.map((m) => (m.show_id === formData.show_id ? formData : m))
    );
    onClose();
  };

  // Form layout for editing a movie:
  // - Displays current poster image (or fallback)
  // - Dynamically renders form inputs from field list
  // - Includes genre multi-select and image upload
  // - Save and cancel button actions at the bottom
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Edit Movie</h2>
          <button onClick={onClose} style={closeButtonStyle}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} style={formStyle}>
          <img
            src={imageUrl || '/images/default.jpg'}
            alt="Movie Poster"
            onError={(e) => {
              e.currentTarget.src = '/images/default.jpg';
            }}
            style={{ maxWidth: '45%', height: 'auto', alignSelf: 'center' }}
          />
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
            <div key={i} style={inputWrapperStyle}>
              <label style={labelStyle}>
                {field
                  .replace('_', ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
              {field === 'description' ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  style={inputStyle}
                />
              ) : (
                <input
                  type={field === 'release_year' ? 'number' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
          <label style={labelStyle}>Genres</label>
          <Select
            isMulti
            options={genres.map((g: Genre) => ({
              value: g.genreName,
              label: g.genreName,
            }))}
            value={formData.selectedGenres.map((g: string) => ({
              value: g,
              label: g,
            }))}
            onChange={handleGenreChange}
            styles={selectStyles}
          />
          <div style={{ marginTop: '1rem' }}>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline styles for the EditMovieModal component:
// - Includes layout and design for overlay, modal container, header, form elements, buttons, and custom react-select styles
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

const inputWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
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

export default EditMovieModal;
