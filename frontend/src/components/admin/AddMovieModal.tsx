import React, { useState } from 'react';
import Select from 'react-select';
import { Genre } from '../../types/Genre';

interface AddMovieModalProps {
  genres: Genre[];
  onClose: () => void;
  onMovieAdded: (updatedMovies: any[]) => void;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({ genres, onClose, onMovieAdded }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (selected: any) => {
    const genreValues = selected.map((s: any) => s.value);
    setFormData({ ...formData, selectedGenres: genreValues });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMovieAdded([]);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add New Movie</h2>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={formStyle}>
          {['title', 'type', 'director', 'cast', 'country', 'release_year', 'rating', 'duration', 'description'].map((field, i) => (
            <div key={i}>
              <label style={labelStyle}>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
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
            options={genres.map((g) => ({ value: g.genreName, label: g.genreName }))}
            value={formData.selectedGenres.map((g) => ({ value: g, label: g }))}
            onChange={handleGenreChange}
            styles={selectStyles}
          />
          <div style={buttonRowStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={submitButtonStyle}>Add Movie</button>
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
