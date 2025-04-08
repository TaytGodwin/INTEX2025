import React, { useState } from 'react';
import '../../css/theme.css';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={toggleOpen}>
      <div className="faq-header">
        <h5 className="faq-question mb-0">{question}</h5>
        <div className={`faq-toggle-icon ${isOpen ? 'rotated' : ''}`}>
          <span style={{ color: '#57C8F4' }}>&#9662;</span>
        </div>
      </div>
      {isOpen && (
        <div className="faq-answer mt-2">
          <p className="faq-answer-text">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
