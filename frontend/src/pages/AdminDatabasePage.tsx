import AuthorizeView from '../components/authentication/AuthorizeView';
import React, { useState, useEffect } from 'react';
import { getAllMovies } from '../api/AllMoviesAPI';
import { Movie } from '../types/Movie';
import '../css/theme.css'; // Your custom styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Optional: Bootstrap utilities

const AdminDatabasePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getAllMovies();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredMovies.length / pageSize);

  return (
    <AuthorizeView allowedRoles={['Administrator']}>
      <div className="admin-page">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <h4 className="admin-title">Admin Panel</h4>
          <ul>
            <li><span>📦</span> Database</li>
            <li><span>👥</span> Users</li>
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
            <button className="btn btn-success ms-auto">+ Add Movie</button>
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
                    <td>{movie.genres.join(', ')}</td>
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
      </div>
    </AuthorizeView>
  );
};

export default AdminDatabasePage;
