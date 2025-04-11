import React from 'react';
import FAQItem from './FAQItem';


interface FAQ {
  question: string;
  answer: string;
}

// FAQSection component:
// - Defines a list of frequently asked questions and their answers
// - Each item will be rendered using the FAQItem component
const FAQSection: React.FC = () => {
  const faqs: FAQ[] = [
    {
      question: 'How do I create an account?',
      answer: 'Click the "Get Started" button and follow the registration process.',
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, you can cancel anytime under your account settings.',
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'We offer a 7-day free trial for new users to explore the platform.',
    },
    {
      question: 'Can I use PayPal or a credit card to pay?',
      answer: 'We accept all major credit cards, PayPal, and other popular payment methods.',
    },
    {
      question: 'Can I use this on my phone or tablet?',
      answer: 'Yes! Our platform works seamlessly on all modern mobile devices.',
    },
    {
      question: 'Is customer support available if I need help?',
      answer: 'Absolutely. Our support team is available 24/7 via chat and email.',
    },
    {
      question: 'How is my data protected?',
      answer: 'We use industry-standard encryption and follow strict privacy protocols.',
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time from your account settings.',
    },
  ];


  // Renders the FAQ section layout:
  // - Includes a styled header and a responsive grid of FAQItem components 
  return (
    <section
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          color: '#fff',
          textAlign: 'center',
          marginBottom: '2rem',
          fontWeight: 700,
          fontSize: '2rem',
          fontFamily: 'Fredoka One',
        }}
      >
        FAQs
      </h2>
 
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}


export default FAQSection;