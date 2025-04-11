import { SetCookie } from '../../api/IdentityAPI';

type CookiesProps = {
  setShowCookieModal: (show: boolean) => void;
};

const CookiesModal: React.FC<CookiesProps> = ({ setShowCookieModal }) => {
  const handleCookieConsent = async (consent: boolean) => {
    const result = await SetCookie(consent);
    if (result) {
      setShowCookieModal(false); // Hide the modal when the user gives or rejects consent
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
          </div>
          <div className="modal-body">
            Would you like us to use your name as we interact with you?
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={() => handleCookieConsent(true)} // Accept cookies
            >
              Yes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleCookieConsent(false)} // Reject cookies
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesModal;
