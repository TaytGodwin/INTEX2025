import AuthorizeView from '../components/authentication/AuthorizeView';
import { useState, useEffect } from 'react';
import { deleteMovie, getTotalMovies, searchMovies } from '../api/MoviesAPI';
import { getGenres } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';
import AddMovieModal from '../components/admin/AddMovieModal';
import EditMovieModal from '../components/admin/EditMovieModal';
import { Genre } from '../types/Genre';
import AdminPagination from '../components/admin/AdminPagination';
import { deleteImage } from '../api/ImageAPI';

const AdminDatabasePage = () => {
  const [allMovies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByPreference, setSortByPreference] = useState('title');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() === '') {
        const { movies, totalNumMovies } = await getTotalMovies(
          pageSize,
          currentPage,
          sortByPreference
        );
        setMovies(movies);
        setTotalPages(Math.ceil(totalNumMovies / pageSize));
      } else {
        const newMovies = await searchMovies(
          searchTerm.trim(),
          pageSize,
          currentPage
        );
        setMovies(newMovies);
        setTotalPages(Math.ceil(newMovies.length / pageSize));
      }
      const genreData: Genre[] = await getGenres();
      setGenres(genreData);
    };
    fetchData();
  }, [pageSize, currentPage, sortByPreference, searchTerm]);

  const handleDelete = async (show_id: number, imageName: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie? It will also delete all ratings and the associated image.'
    );

    if (!confirmDelete) return;

    try {
      // First, delete the movie.
      const movieDeleteSuccess = await deleteMovie(show_id);

      if (movieDeleteSuccess) {
        // Then, delete the associated image using your deleteImage API.
        try {
          await deleteImage(imageName);
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
          // Continue with state update despite image deletion failure
        }

        // Update local state to remove the movie regardless of image deletion result
        setMovies(allMovies.filter((m) => m.show_id !== show_id));

        // Show success message to user
        alert('Movie deleted successfully');
      } else {
        alert('Failed to delete the movie. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred during movie deletion:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleOpenEdit = (movie: Movie) => {
    setMovieToEdit(movie);
    setShowEditModal(true);
  };

  const handleGenres = (movie: Movie) => {
    return (
      <>
        {movie.genres.map((genre, index) => (
          <span key={index}>
            {typeof genre === 'string' ? genre : genre.genreName}
            {index < movie.genres.length - 1 ? ', ' : ''}
          </span>
        ))}
      </>
    );
  };

  return (
    <AuthorizeView allowedRoles={['Administrator']}>
      <div style={adminPageStyle}>
        <main style={contentStyle}>
          <h2 style={headerStyle}>🎬 Movie Database</h2>

          <div style={searchControlStyle}>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={searchInputStyle}
            />
            <button style={searchButtonStyle}>Search</button>
            <button
              style={addButtonStyle}
              onClick={() => setShowAddModal(true)}
            >
              + Add Movie
            </button>
          </div>

          <div className="table-responsive">
            <table style={tableStyle}>
              <thead>
                <tr>
                  {[
                    'Title',
                    'Type',
                    'Genres',
                    'Year',
                    'Director',
                    'Actions',
                  ].map((header, idx) => (
                    <th key={idx} style={thStyle}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allMovies.map((movie) => (
                  <tr key={movie.show_id}>
                    <td style={tdStyle}>{movie.title}</td>
                    <td style={tdStyle}>{movie.type}</td>
                    <td style={tdStyle}>{handleGenres(movie)}</td>
                    <td style={tdStyle}>{movie.release_year}</td>
                    <td style={tdStyle}>{movie.director}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          style={actionButtonStyle.edit}
                          onClick={() => handleOpenEdit(movie)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          style={actionButtonStyle.delete}
                          onClick={() =>
                            handleDelete(movie.show_id, movie.title)
                          }
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            sortByPreference={sortByPreference}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            setSortByPreference={setSortByPreference}
          />
        </main>

        {showAddModal && (
          <AddMovieModal
            genres={genres}
            onClose={() => {
              setShowAddModal(false);
            }}
            onMovieAdded={(updatedMovies) => {
              setMovies(updatedMovies), window.location.reload();
            }}
          />
        )}

        {showEditModal && movieToEdit && (
          <EditMovieModal
            movie={movieToEdit}
            genres={genres}
            onClose={() => {
              setShowEditModal(false);
              setMovieToEdit(null);
            }}
            onMovieUpdated={(updatedMovies) => setMovies(updatedMovies)}
          />
        )}
      </div>
    </AuthorizeView>
  );
};

const adminPageStyle = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#121212',
  fontFamily: 'Poppins, sans-serif',
};

const contentStyle = {
  flex: 1,
  padding: '2rem',
  backgroundColor: '#181818',
  color: '#fff',
};

const headerStyle = {
  fontSize: '1.75rem',
  fontWeight: 600,
  marginBottom: '1.5rem',
};

const searchControlStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1.5rem',
};

const searchInputStyle = {
  backgroundColor: '#2a2a2a',
  border: '1px solid #444',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  flex: 1,
};

const searchButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#57C8F4',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
};

const addButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#57C8F4',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  borderRadius: '10px',
  overflow: 'hidden',
};

const thStyle = {
  backgroundColor: '#2e2e2e',
  color: '#57C8F4',
  fontWeight: 600,
  padding: '0.75rem',
  border: '1px solid #333',
  textAlign: 'left' as const,
};

const tdStyle = {
  padding: '0.75rem',
  border: '1px solid #333',
  color: '#eee',
};

const actionButtonStyle = {
  edit: {
    borderColor: '#57C8F4',
    color: '#57C8F4',
    backgroundColor: 'transparent',
  },
  delete: {
    borderColor: '#ff5e5e',
    color: '#ff5e5e',
    backgroundColor: 'transparent',
  },
};

export default AdminDatabasePage;
