import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // SVG icons instead of emojis for consistency
  const HeartIcon = () => (
    <svg
      className="heart-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const LockIcon = () => (
    <svg
      className="lock-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-main">
            <span>© {currentYear}</span>
            <span className="footer-brand">CardioPredict</span>
            <span className="footer-separator">•</span>
            <span>Built with</span>
            <HeartIcon />
            <span>for health awareness</span>
          </p>

          <p className="footer-disclaimer">
            <LockIcon />
            <span>This tool is for educational purposes only. Always consult healthcare professionals for medical advice.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;