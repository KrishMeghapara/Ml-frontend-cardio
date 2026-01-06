import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import HealthForm from './components/HealthForm';
import ResultDisplay from './components/ResultDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'assessment', 'results'
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key to go back
      if (e.key === 'Escape') {
        if (currentView === 'results') {
          handleBackToAssessment();
        } else if (currentView === 'assessment') {
          handleReset();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Announce view changes to screen readers
  useEffect(() => {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      const messages = {
        landing: 'Home page loaded. Welcome to CardioPredict.',
        assessment: 'Health assessment form loaded. Please fill in your health information.',
        results: 'Your assessment results are ready.'
      };
      announcer.textContent = messages[currentView] || '';
    }
  }, [currentView]);

  const handleStartAssessment = useCallback(() => {
    setCurrentView('assessment');
    setPrediction(null);
    setError(null);
    // Focus management for accessibility
    setTimeout(() => {
      const firstInput = document.getElementById('age');
      if (firstInput) firstInput.focus();
    }, 100);
  }, []);

  const handlePrediction = useCallback((result, submittedFormData) => {
    setPrediction(result);
    setFormData(submittedFormData);
    setError(null);
    setCurrentView('results');
    // Scroll to top to show results
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus management
    setTimeout(() => {
      const resultHeading = document.querySelector('.result-header h2');
      if (resultHeading) resultHeading.focus();
    }, 100);
  }, []);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    setPrediction(null);
  }, []);

  const handleReset = useCallback(() => {
    setPrediction(null);
    setFormData(null);
    setError(null);
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToAssessment = useCallback(() => {
    setCurrentView('assessment');
    setPrediction(null);
    setError(null);
    // Keep formData for editing
  }, []);

  const handleEditAssessment = useCallback(() => {
    setCurrentView('assessment');
    setPrediction(null);
    // formData is preserved for editing
  }, []);

  const handleLoading = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  const handleNavigateHome = useCallback(() => {
    handleReset();
  }, [handleReset]);

  return (
    <ThemeProvider>
      <div className="App">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Screen reader announcer */}
        <div
          id="sr-announcer"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        <Header onNavigateHome={handleNavigateHome} />

        <main id="main-content" className="main-content" role="main">
          <div className="container">
            {/* Landing Page */}
            {currentView === 'landing' && (
              <LandingPage onStartAssessment={handleStartAssessment} />
            )}

            {/* Assessment Form */}
            {currentView === 'assessment' && (
              <>
                {/* Error Section */}
                {error && (
                  <section className="error-section" role="alert" aria-live="assertive">
                    <div className="error-message">
                      <h3>
                        <span className="error-icon" aria-hidden="true">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        </span>
                        Assessment Error
                      </h3>
                      <p>{error}</p>
                      <div className="error-actions">
                        <button
                          onClick={handleBackToAssessment}
                          className="btn btn-primary"
                          aria-label="Try the assessment again"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={handleReset}
                          className="btn btn-secondary"
                          aria-label="Return to home page"
                        >
                          Back to Home
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {!error && (
                  <HealthForm
                    onPrediction={handlePrediction}
                    onError={handleError}
                    onLoading={handleLoading}
                    loading={loading}
                    onBack={handleReset}
                    initialData={formData}
                  />
                )}
              </>
            )}

            {/* Results Display */}
            {currentView === 'results' && prediction && (
              <ResultDisplay
                prediction={prediction}
                formData={formData}
                onReset={handleReset}
                onNewAssessment={handleBackToAssessment}
                onEditAssessment={handleEditAssessment}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;