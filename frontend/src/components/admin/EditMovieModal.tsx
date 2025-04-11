import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Genre } from '../../types/Genre';
import { loadImage, uploadImage } from '../../api/MoviesAPI';

interface EditMovieModalProps {
  movie: any; // Replace with correct type
  genres: Genre[];
  onClose: () => void;
  onMovieUpdated: (updatedMovies: any[]) => void;
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const url = await loadImage(formData.title);
      setImageUrl(url);
    };
    fetchImage();
  }, [formData.title]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (selected: any) => {
    const genreValues = selected.map((s: any) => s.value);
    setFormData({ ...formData, selectedGenres: genreValues });
  };

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

    // Proceed with updating the movie
    onMovieUpdated([formData]);
    onClose();
  };

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
            style={{ maxWidth: '100%', height: 'auto' }}
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
