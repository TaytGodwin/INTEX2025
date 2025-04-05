import { useState } from 'react';
import AuthorizeView from '../components/authentication/AuthorizeView';
import Pagination from '../components/layout/Pagination';

function AdminPage() {
    // CHANGE 'OBJECT' TO THE CORRECT CLASS OF INTEX
    const selectedCategories: string[] = [];
    // const [books, setBooks] = useState<Object[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    // const [editingBook, setEditingBook] = useState<Object | null>(null);

  return (
    <>
      <AuthorizeView>
        <main style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h1>Hello 👋</h1>
          <p>Welcome to my admin page</p>
        </main>

        <table className='table table-bordered table-striped'>
            <thead className='table-light'>
                <tr>
                    <th>ID</th>
                    <th></th> {/*  blank row for edit/delete options */}
                </tr>
            </thead>
            {/* <tbody>
                {object.map((o) => (
                    <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>
                            <button 
                            onClick={() = setEditingObject(o)}
                            className='btn btn-primary btn-sm w-100 mb-1'>
                                Edit
                                </button>
                            <button
                                onClick={() => handleDelete(o.id)}
                                className='btn btn-danger btn-sn w-100'>
                                    Delete
                                </button>
                        </td>
                    </tr>
                ))}
            </tbody> */}
        </table>
        <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
      </AuthorizeView>
    </>
  );
}

export default AdminPage;
