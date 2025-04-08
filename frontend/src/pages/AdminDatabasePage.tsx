import AuthorizeView from '../components/authentication/AuthorizeView';

function AdminDatabasePage() {

  return (
    <>
      <AuthorizeView allowedRoles={['Administrator']}>
      <main style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h1>Hello 👋</h1>
          <p>Welcome to my admin page</p>
          <h6>It's currently under construction</h6>
        </main>
      </AuthorizeView>
    </>
  );
}

export default AdminDatabasePage;
