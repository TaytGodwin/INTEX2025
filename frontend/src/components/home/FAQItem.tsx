import React, { useState } from 'react';


interface FAQItemProps {
  question: string;
  answer: string;
}

// FAQItem component:
// - Displays a question that can be expanded/collapsed to show the answer
// - Uses local state (isOpen) to toggle visibility
const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);


  // Renders a clickable FAQ item:
  // - Displays the question with a toggle arrow
  // - Expands to show the answer when clicked
  // - Includes simple styling and transition effects for interactivity

  return (
    <div
      onClick={toggleOpen}
      style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        marginBottom: '1rem',
        padding: '1.2rem 1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid #333',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',    
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h5
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#fff',
            margin: 0,
          }}
        >
          {question}
        </h5>
        <div
          style={{
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: '#57C8F4',
            fontSize: '1.2rem',
          }}
        >
          ▼
        </div>
      </div>


      {isOpen && (
        <div
          style={{
            marginTop: '1rem',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <p
            style={{
              color: '#ccc',
              fontSize: '1rem',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};


export default FAQItem;