import AuthorizeView from '../components/authentication/AuthorizeView';
import { useState, useEffect } from 'react';
import { deleteMovie, getTotalMovies } from '../api/MoviesAPI';
import { getGenres } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';
import '../css/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddMovieModal from '../components/admin/AddMovieModal';
import EditMovieModal from '../components/admin/EditMovieModal';
import { Genre } from '../types/Genre';
import AdminPagination from '../components/admin/AdminPagination';

const AdminDatabasePage = () => {
  const [allMovies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByPreference, setSortByPreference] = useState('title');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { movies, totalNumMovies } = await getTotalMovies(
        pageSize,
        currentPage,
        sortByPreference
      );
      const genreData: Genre[] = await getGenres();
      setGenres(genreData);
      setMovies(movies);
      setTotalPages(Math.ceil(totalNumMovies / pageSize));
    };

    fetchData();
  }, [pageSize, currentPage, sortByPreference]);

  const handleDelete = async (show_id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie? It will also delete all ratings associated with this movie'
    );
    if (!confirmDelete) return;

    try {
      const success = await deleteMovie(show_id);

      if (success) {
        setMovies(allMovies.filter((m) => m.show_id !== show_id));
      } else {
        alert('Failed to delete the movie. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    }
  };

  const handleOpenEdit = (movie: Movie) => {
    setMovieToEdit(movie);
    setShowEditModal(true);
    console.log(movie);
  };

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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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
                {allMovies.map((movie) => (
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
                          onClick={() => handleOpenEdit(movie)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(movie.show_id)}
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
            onClose={() => setShowAddModal(false)}
            onMovieAdded={(updatedMovies) => setMovies(updatedMovies)}
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

export default AdminDatabasePage;
