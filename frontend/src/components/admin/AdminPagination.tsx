// Props for the Pagination component:
// - Handles current page, total pages, page size, and sort preference
// - Includes callbacks for changing page, page size, and sort preference
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  sortByPreference: string;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  setSortByPreference: (newPreference: string) => void;
}

const AdminPagination = ({
  currentPage,
  totalPages,
  sortByPreference,
  pageSize,
  onPageChange,
  onPageSizeChange,
  setSortByPreference,
}: 

  // Renders pagination buttons:
  // - Shows all pages if totalPages <= 5
  // - Adds ellipses when totalPages > 5 for cleaner navigation
  // - Highlights the current page and adds click handler to change pages
  PaginationProps) => {
  const renderPageButtons = () => {
    const buttons = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);
      if (currentPage > 3) buttons.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        buttons.push(i);
      }
      if (currentPage < totalPages - 2) buttons.push('...');
      buttons.push(totalPages);
    }

    return buttons.map((btn, index) =>
      btn === '...' ? (
        <span
          key={`ellipsis-${index}`}
          className="btn btn-outline-secondary disabled"
        >
          ...
        </span>
      ) : (
        <button
          key={btn}
          className={`btn ${currentPage === btn ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => onPageChange(Number(btn))}
        >
          {btn}
        </button>
      )
    );
  };

  return (
    // Renders pagination controls:
    // - Page size selector (resets to page 1 on change)
    // - Sort by dropdown to update sorting preference
    // - Page navigation buttons with dynamic rendering and ellipses
    <div className="pagination-controls d-flex flex-column gap-3 mt-4">
      {/* Page Size */}
      <div className="d-flex align-items-center gap-2">
        <label>Page Size:</label>
        <select
          className="form-select w-auto"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // Reset to page 1 when size changes
          }}
        >
          {[15, 25, 50].map((size) => (
            <option key={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="d-flex align-items-center gap-2">
        <label>Sort By:</label>
        <select
          className="form-select w-auto"
          value={sortByPreference}
          onChange={(e) => setSortByPreference(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="director">Director</option>
          <option value="type">Type</option>
        </select>
      </div>

      {/* Page Navigation */}
      <div className="page-buttons d-flex gap-1 align-items-center flex-wrap">
        <button
          className="btn btn-outline-secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {renderPageButtons()}
        <button
          className="btn btn-outline-secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
