import AuthorizeView from '../components/authentication/AuthorizeView';
import React, { useState, useEffect } from 'react';
import { getAllMovies } from '../api/AllMoviesAPI';
import { getGenres } from '../api/GenreAPI';
import { Movie } from '../types/Movie';
import { Genre } from '../types/Genre';
import '../css/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDatabasePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newMovie, setNewMovie] = useState({
    title: '',
    type: '',
    director: '',
    cast: '',
    country: '',
    release_year: new Date().getFullYear(),
    duration: '',
    description: '',
    genres: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await getAllMovies();
      const genreData = await getGenres();
      setMovies(movieData);
      setGenres(genreData);
    };
    fetchData();
  }, []);

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredMovies.length / pageSize);

  const handleAddMovieChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setNewMovie({ ...newMovie, genres: options });
  };

  const handleAddMovieSubmit = async () => {
    try {
      const response = await fetch('https://localhost:5000/api/Movie/AddMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        const updated = await getAllMovies();
        setMovies(updated);
        setShowAddModal(false);
        setNewMovie({
          title: '', type: '', director: '', cast: '', country: '', release_year: new Date().getFullYear(), duration: '', description: '', genres: [],
        });
      } else {
        console.error('Failed to add movie');
      }
    } catch (err) {
      console.error('Error submitting movie:', err);
    }
  };

  return (
    <AuthorizeView allowedRoles={['Administrator']}>
      <div className="admin-page">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <h4 className="admin-title">Admin Panel</h4>
          <ul>
            <li><span>📦</span> Database</li>
          </ul>
          <button className="logout-btn btn btn-outline-danger mt-auto">Logout</button>
        </aside>

        {/* Main content */}
        <main className="admin-content">
          <h2 className="mb-4">🎬 Movie Database</h2>

          {/* Search Controls */}
          <div className="search-controls d-flex align-items-center gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary">Search</button>
            <button className="btn btn-success ms-auto" onClick={() => setShowAddModal(true)}>+ Add Movie</button>
          </div>

          {/* Movie Table */}
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
                        <button className="btn btn-sm btn-outline-secondary" title="View">👁</button>
                        <button className="btn btn-sm btn-outline-primary" title="Edit">✏️</button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
              <button className="btn btn-outline-secondary" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Previous</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              )).slice(0, 5)}
              <button className="btn btn-outline-secondary" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
            </div>
          </div>
        </main>

        {/* Add Movie Modal */}
        {showAddModal && (
          <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Movie</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="title" placeholder="Title" value={newMovie.title} onChange={handleAddMovieChange} />
                  <input className="form-control mb-2" name="type" placeholder="Type" value={newMovie.type} onChange={handleAddMovieChange} />
                  <input className="form-control mb-2" name="director" placeholder="Director" value={newMovie.director} onChange={handleAddMovieChange} />
                  <input className="form-control mb-2" name="cast" placeholder="Cast" value={newMovie.cast} onChange={handleAddMovieChange} />
                  <input className="form-control mb-2" name="country" placeholder="Country" value={newMovie.country} onChange={handleAddMovieChange} />
                  <input className="form-control mb-2" name="release_year" type="number" placeholder="Release Year" value={newMovie.release_year} onChange={handleAddMovieChange} />
                  <input className="form-control mb-2" name="duration" placeholder="Duration" value={newMovie.duration} onChange={handleAddMovieChange} />
                  <textarea className="form-control mb-2" name="description" placeholder="Description" value={newMovie.description} onChange={handleAddMovieChange} />
                  <select className="form-select" multiple value={newMovie.genres} onChange={handleGenreChange}>
                    {genres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddMovieSubmit}>Add Movie</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthorizeView>
  );
};

export default AdminDatabasePage;
