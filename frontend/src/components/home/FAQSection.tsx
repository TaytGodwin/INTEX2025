import React from 'react';
import FAQItem from './FAQItem';

interface FAQ {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  // In a real application, you might fetch these from an API or a CMS
  const faqs: FAQ[] = [
    {
      question: 'How do I sign up?',
      answer: 'Click the "Get Started" button and follow the registration process.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel anytime under your account settings.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'We offer a 7-day free trial for new users to explore the platform.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, PayPal, and other popular payment methods.',
    },
  ];

  return (
    <section className="my-5 container">
      <h2 className="mb-4">FAQs</h2>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </section>
  );
};

export default FAQSection;