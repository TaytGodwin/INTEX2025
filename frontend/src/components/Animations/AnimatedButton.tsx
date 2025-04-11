
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AnimatedButton = () => {
  return (
    <Link to="/search" style={{ textDecoration: 'none' }}>
      <motion.button
        style={{
          position: 'relative',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(45deg, #6b8ce3, #b0c4de)',
          color: '#fff',
          fontSize: '1.5rem',
          height: 60,
          outline: 'none',
          overflow: 'hidden',
        }}
        initial={{
          borderRadius: '50%',
          width: 60,
        }}
        whileHover={{
          borderRadius: '50px',
          width: 200,
          transition: { duration: 0.5 },
        }}
      >
        {/* "Bubble" text */}
        <motion.span
          initial={{ opacity: 1 }}
          whileHover={{ opacity: 0, transition: { duration: 0.3 } }}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            lineHeight: '60px',
          }}
        >
          Explore
        </motion.span>
        {/* Expanded text */}
        <motion.span
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1, transition: { duration: 0.3, delay: 0.2 } }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            textAlign: 'center',
            lineHeight: '60px',
          }}
        >
          Let's Explore!
        </motion.span>
      </motion.button>
    </Link>
  );
};

export default AnimatedButton;