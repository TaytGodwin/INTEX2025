import AuthorizeView from '../components/authentication/AuthorizeView';

function MoviePage() {
  return (
    <AuthorizeView allowedRoles={['User', 'Administrator']}>
      <>
        <p>This is a movie page</p>
      </>
    </AuthorizeView>
  );
}

export default MoviePage;
