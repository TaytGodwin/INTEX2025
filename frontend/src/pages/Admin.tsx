import AuthorizeView from '../components/authentication/AuthorizeView';

function AdminPage() {
  return (
    <>
      <AuthorizeView>
        <main style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h1>Hello 👋</h1>
          <p>Welcome to my admin page</p>
        </main>
      </AuthorizeView>
    </>
  );
}

export default AdminPage;
