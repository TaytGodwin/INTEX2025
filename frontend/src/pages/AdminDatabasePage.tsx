import AuthorizeView from '../components/authentication/AuthorizeView';
import React, { useState, useEffect } from 'react';
import { getAllMovies } from '../api/AllMoviesAPI';
import { Movie } from '../types/Movie';
import '../css/theme.css'; // For consistent styling

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
  const paginatedMovies = filteredMovies.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredMovies.length / pageSize);

  return (
    <AuthorizeView allowedRoles={['Administrator']}>
      <div className="admin-page">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <h4 className="admin-title">Admin Home</h4>
          <ul>
            <li>
              <span>📦</span> Database
            </li>
            <li>
              <span>👥</span> Users
            </li>
          </ul>
          <button className="logout-btn">Logout</button>
        </aside>

        {/* Main content */}
        <main className="admin-content">
          <h2>Database</h2>

          {/* Search */}
          <div className="search-controls">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>Search</button>
            <button className="add-movie-btn">+ Add Movie</button>
          </div>

          {/* Table */}
          <table className="movie-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovies.map((movie) => (
                <tr key={movie.show_id}>
                  <td>{movie.title}</td>
                  <td>
                    {movie.genres.map((genre) => genre.genreName).join(', ')}
                  </td>
                  <td>{movie.release_year}</td>
                  <td>
                    <button title="View">👁</button>
                    <button title="Edit">✏️</button>
                    <button title="Delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-controls">
            <label>
              Page Size:
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </label>

            <div className="page-buttons">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              )).slice(0, 5)}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </AuthorizeView>
  );
};

export default AdminDatabasePage;
