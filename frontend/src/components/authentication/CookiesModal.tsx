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
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1050,
        animation: 'slideDown 1s ease-out',
      }}
    >
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-100%) translateX(-50%);
              opacity: 0;
            }
            to {
              transform: translateY(0) translateX(-50%);
              opacity: 1;
            }
          }
        `}
      </style>
      <div
        style={{
          width: '400px',
          backgroundColor: 'rgba(21,21,21,0.9)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(87,200,244,0.9)',
            padding: '1.2rem',
          }}
        >
          <h5 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>
            Cookie Notification
          </h5>
        </div>
        <div
          style={{
            padding: '1.2rem',
            color: '#ccc',
            fontSize: '1rem',
          }}
        >
          Would you like us to use your name as we interact with you?
        </div>
        <div
          style={{
            padding: '0.75rem 1.2rem',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(32,32,32,0.9)',
          }}
        >
          <button
            onClick={() => handleCookieConsent(true)}
            style={{
              backgroundColor: '#57C8F4',
              border: 'none',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Yes
          </button>
          <button
            onClick={() => handleCookieConsent(false)}
            style={{
              backgroundColor: '#d9534f',
              border: 'none',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginLeft: '0.5rem',
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookiesModal;


// <div
//   style={{
//     position: 'fixed',
//     top: '20px', // you can adjust this for vertical spacing from the top
//     left: '50%',
//     transform: 'translateX(-50%)', // centers the modal horizontally
//     zIndex: 1050,
//     animation: 'slideDown 1s ease-out',
//   }}
// >
//   <style>
//     {`
//       @keyframes slideDown {
//         from {
//           transform: translateY(-100%) translateX(-50%);
//           opacity: 0;
//         }
//         to {
//           transform: translateY(0) translateX(-50%);
//           opacity: 1;
//         }
//       }
//     `}
//   </style>
//   <div
//     style={{
//       width: '400px',
//       backgroundColor: 'rgba(21,21,21,0.9)',
//       borderRadius: '8px',
//       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
//       overflow: 'hidden',
//     }}
//   >
//     <div
//       style={{
//         backgroundColor: 'rgba(87,200,244,0.9)',
//         padding: '1.2rem',
//       }}
//     >
//       <h5 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>
//         Cookie Notification
//       </h5>
//     </div>
//     <div
//       style={{
//         padding: '1.2rem',
//         color: '#ccc',
//         fontSize: '1rem',
//       }}
//     >
//       This site uses cookies to improve your experience.
//     </div>
//     <div
//       style={{
//         padding: '0.75rem 1.2rem',
//         display: 'flex',
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(32,32,32,0.9)',
//       }}
//     >
//       <button
//         onClick={() => setShowCookieModal(false)}
//         style={{
//           backgroundColor: '#57C8F4',
//           border: 'none',
//           color: '#fff',
//           padding: '0.5rem 1rem',
//           borderRadius: '4px',
//           cursor: 'pointer',
//           fontSize: '1rem',
//         }}
//       >
//         OK
//       </button>
//     </div>
//   </div>
// </div>