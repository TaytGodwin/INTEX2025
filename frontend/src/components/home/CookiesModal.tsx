import { SetCookie } from '../../api/IdentityAPI';

type CookiesProps = {
  setShowCookieModal: (show: boolean) => void;
};

const CookiesModal: React.FC<CookiesProps> = ({ setShowCookieModal }) => {
  const handleAcknowledge = async () => {
    const result = await SetCookie();
    if (result) {
      setShowCookieModal(false); // Hide modal only when user accepts
    } else {
      console.error('Cookie Preferences not set');
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cookie Notification</h5>
            <button
              className="btn-close"
              onClick={() => setShowCookieModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            This site uses cookies to improve your experience.
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleAcknowledge}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesModal;
