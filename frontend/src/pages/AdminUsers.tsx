import AuthorizeView from '../components/authentication/AuthorizeView';

// Database area with CRUD functioanlity for USERS
function AdminUsers() {
  return (
    <AuthorizeView allowedRoles={['Administrator']}>
      <></>
    </AuthorizeView>
  );
}

export default AdminUsers;
