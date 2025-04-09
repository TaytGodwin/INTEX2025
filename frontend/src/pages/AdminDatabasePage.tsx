import AuthorizeView from '../components/authentication/AuthorizeView';
import { useState, useEffect } from 'react';
import { deleteMovie, getAllMovies } from '../api/MoviesAPI';
import { getGenres } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';
// import EditMovieModal from '../components/EditMovieModal';
import '../css/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddMovieModal from '../components/admin/AddMovieModal';

const AdminDatabasePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await getAllMovies();
      const genreData: string[] = await getGenres();
      setGenres(genreData);
      setMovies(movieData);
    };

    fetchData();
  }, []);

  const handleDelete = async (show_id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie? It will also delete all ratings associated with this movie'
    );
    if (!confirmDelete) return; // exit this if they no longer want to delete

    try {
      // Call delete API
      const success = await deleteMovie(show_id);

      if (success) {
        // Remove the deleted movie from the local state
        setMovies(movies.filter((m) => m.show_id !== show_id)); // Updates the UI
      } else {
        alert('Failed to delete the movie. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    }
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMovies = filteredMovies.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredMovies.length / pageSize);

  // const handleOpenEdit = (movie: Movie) => {
  //   setMovieToEdit(movie);
  //   setShowEditModal(true);
  // };

  return (
    <AuthorizeView allowedRoles={['Administrator']}>
      <div className="admin-page">
        <aside className="admin-sidebar">
          <h4 className="admin-title">Admin Panel</h4>
          <ul>
            <li>
              <span>📦</span> Database
            </li>
            <li>
              <span>👥</span> Users
            </li>
          </ul>
          <button className="logout-btn btn btn-outline-danger mt-auto">
            Logout
          </button>
        </aside>

        <main className="admin-content">
          <h2 className="mb-4">🎬 Movie Database</h2>

          <div className="search-controls d-flex align-items-center gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary">Search</button>
            <button
              className="btn btn-success ms-auto"
              onClick={() => setShowAddModal(true)}
            >
              + Add Movie
            </button>
          </div>

          <div className="table-responsive">
            <table className="movie-table table table-bordered table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Genres</th>
                  <th>Year</th>
                  <th>Director</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMovies.map((movie) => (
                  <tr key={movie.show_id}>
                    <td>{movie.title}</td>
                    <td>{movie.type}</td>
                    <td>{movie.genres.map((g) => g.genreName).join(', ')}</td>
                    <td>{movie.release_year}</td>
                    <td>{movie.director}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Edit"
                          // onClick={() => handleOpenEdit(movie)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(movie.show_id)} // Pass a function reference
                        >
                          <span style={{ color: 'black' }}>🗑</span> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls d-flex align-items-center justify-content-between mt-3">
            <div>
              <label className="me-2">Page Size:</label>
              <select
                className="form-select d-inline-block w-auto"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="page-buttons d-flex gap-1">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              )).slice(0, 5)}
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          </div>
        </main>

        {showAddModal && (
          <AddMovieModal
            genres={genres}
            onClose={() => {
              console.log('Closing modal...');
              setShowAddModal(false);
            }}
            onMovieAdded={(updatedMovies) => setMovies(updatedMovies)}
          />
        )}

        {/* {showEditModal && movieToEdit && (
          <EditMovieModal
            movie={movieToEdit}
            genres={genres}
            onClose={() => {
              setShowEditModal(false);
              setMovieToEdit(null);
            }}
            onMovieUpdated={(updatedMovies) => setMovies(updatedMovies)}
          />
        )} */}
      </div>
    </AuthorizeView>
  );
};

export default AdminDatabasePage;
