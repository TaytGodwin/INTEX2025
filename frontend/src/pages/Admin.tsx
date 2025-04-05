// import { useEffect, useState } from 'react';
// import AuthorizeView from '../components/authentication/AuthorizeView';
// import Pagination from '../components/layout/Pagination';

// function AdminPage() {
//     //
//     //
//     //
//     // CHANGE 'OBJECT' TO THE CORRECT CLASS OF INTEX
//     // I used 'o', 'object', and 'objects'
//     //
//     //
//     //
//     //
//     //
//     //
//     const selectedCategories: string[] = [];
//     // const [objects, setObjects] = useState<Object[]>([]);
//     const [pageSize, setPageSize] = useState<number>(5);
//     const [pageNum, setPageNum] = useState<number>(1);
//     const [totalPages, setTotalPages] = useState<number>(0);
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);
//     // const [editingObject, setEditingObject] = useState<Object | null>(null);

//     // useEffect(() => {
//     //     const loadObjects = async () => {
//     //       setLoading(true);
//     //       try {
//     //         const data = await fetchObjects(
//     //           pageSize,
//     //           pageNum,
//     //           selectedCategories
//     //         );
//     //         setObjects(data.objectList);
//     //         setTotalPages(Math.ceil(data.numObjects / pageSize));
//     //       } catch (err) {
//     //         setError((err as Error).message);
//     //       } finally {
//     //         setLoading(false);
//     //       }
//     //     };

//     //     loadObjects();
//     //   }, [pageSize, pageNum, sortBy, descending]);

//     //   const handleDelete = async (Id: number) => {
//     //     const confirmDelete = window.confirm(`Confirm delete of? (${Id})`);
//     //     if (!confirmDelete) return;

//     //     try {
//     //       await deleteObject(Id);
//     //       setObjects(objects.filter((o) => o.Id !== Id));
//     //     } catch (err) {
//     //       alert("Failed to delete. Please try again");
//     //       throw err;
//     //     }
//     //   };

//     //   if (loading) return <p>Loading...</p>;
//     //   if (error) return <p className="text-red-500">Error: {error}</p>;

//   return (
//     <>
//       <AuthorizeView>
//         <main style={{ textAlign: 'center', marginTop: '2rem' }}>
//           <h1>Hello 👋</h1>
//           <p>Welcome to my admin page</p>
//           <h6>It's currently under construction</h6>
//         </main>

//         {/* {!showForm && (
//         <button
//           className="btn btn-success mb-3"
//           onClick={() => setShowForm(true)}
//         >
//           Add
//         </button>
//       )}
//       {showForm && (
//         <NewForm
//           onSuccess={() => {
//             setShowForm(false);
//             fetchObjects(
//               pageSize,
//               pageNum,
//               selectedCategories
//             ).then((data) => setObjects(data.objectList));
//           }}
//           onCancel={() => setShowForm(false)}
//         />
//       )}

//       {editingObject && (
//         <EditForm
//           object={editingObject}
//           onSuccess={() => {
//             setEditingObject(null);
//             fetchObject(
//               pageSize,
//               pageNum,
//               selectedCategories
//             ).then((data) => setObjects(data.bookList));
//           }}
//           onCancel={() => setEditingObject(null)}
//         />
//       )} */}

//         <table className='table table-bordered table-striped'>
//             <thead className='table-light'>
//                 <tr>
//                     <th>ID</th>
//                     <th></th> {/*  blank row for edit/delete options */}
//                 </tr>
//             </thead>
//             {/* <tbody>
//                 {object.map((o) => (
//                     <tr key={o.id}>
//                         <td>{o.id}</td>
//                         <td>
//                             <button
//                             onClick={() = setEditingObject(o)}
//                             className='btn btn-primary btn-sm w-100 mb-1'>
//                                 Edit
//                                 </button>
//                             <button
//                                 onClick={() => handleDelete(o.id)}
//                                 className='btn btn-danger btn-sn w-100'>
//                                     Delete
//                                 </button>
//                         </td>
//                     </tr>
//                 ))}
//             </tbody> */}
//         </table>
//         <Pagination
//         currentPage={pageNum}
//         totalPages={totalPages}
//         pageSize={pageSize}
//         onPageChange={setPageNum}
//         onPageSizeChange={(newSize) => {
//           setPageSize(newSize);
//           setPageNum(1);
//         }}
//       />
//       </AuthorizeView>
//     </>
//   );
// }

// export default AdminPage;
