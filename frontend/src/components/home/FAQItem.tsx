import React, { useState } from 'react';
import '../../css/App.css';

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
          {/* This could be a simple caret or arrow icon */}
          <span>&#9662;</span>
        </div>
      </div>
      {isOpen && (
        <div className="faq-answer mt-2">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;