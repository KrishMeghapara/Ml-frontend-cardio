import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage = ({ onStartAssessment }) => {
  const [showMethodology, setShowMethodology] = useState(false);

  const modelFeatures = [
    {
      icon: 'brain',
      title: 'Random Forest Algorithm',
      description: 'Advanced ensemble learning method with 200 decision trees for robust predictions'
    },
    {
      icon: 'chart',
      title: '71.3% Clinical Accuracy',
      description: 'Validated on cardiovascular disease dataset with rigorous testing protocols'
    },
    {
      icon: 'flask',
      title: '12 Health Parameters',
      description: 'Analyzes age, blood pressure, BMI, cholesterol, lifestyle factors and more'
    },
    {
      icon: 'zap',
      title: 'Real-time Analysis',
      description: 'Instant risk assessment with detailed explanations and recommendations'
    }
  ];

  const keyFeatures = [
    { icon: 'hospital', text: 'Clinical-grade machine learning model' },
    { icon: 'lock', text: 'Privacy-first design - no data stored' },
    { icon: 'smartphone', text: 'Accessible on all devices' },
    { icon: 'target', text: 'Evidence-based risk assessment' },
    { icon: 'clipboard', text: 'Personalized health recommendations' },
    { icon: 'shield', text: 'Developed with medical best practices' }
  ];

  // Standardized icon sizes - all icons use consistent 24x24 base size
  // CSS will handle visual sizing via transform or wrapper
  const getIcon = (name, size = 24) => {
    const icons = {
      brain: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4v1a3 3 0 0 1-2.35 2.93 4 4 0 0 1 .35 1.57 4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4 4 4 0 0 1 .35-1.57A3 3 0 0 1 4 11v-1a4 4 0 0 1 4-4 4 4 0 0 1 4-4z" />
          <path d="M12 2v4" />
          <path d="M8 6v2" />
          <path d="M16 6v2" />
        </svg>
      ),
      chart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      flask: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6" />
          <path d="M10 3v6.5a1.5 1.5 0 0 1-.5 1.1L4 16.5A2 2 0 0 0 5.5 20h13a2 2 0 0 0 1.5-3.5l-5.5-5.9a1.5 1.5 0 0 1-.5-1.1V3" />
        </svg>
      ),
      zap: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      hospital: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4 8 4v14" />
          <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
          <path d="M12 7v4" />
          <path d="M10 9h4" />
        </svg>
      ),
      lock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      smartphone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      target: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      clipboard: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      ),
      shield: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
      search: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      info: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      database: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
      cpu: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      ),
      layers: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      arrowRight: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      ),
      heartPulse: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      alertTriangle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    };
    return icons[name] || null;
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-badge">
          <span className="badge-icon" aria-hidden="true">{getIcon('hospital', 18)}</span>
          <span>Professional Cardiovascular Assessment</span>
        </div>

        <h1 className="hero-title" id="hero-title">
          <span className="title-highlight">CardioPredict</span>
          <span className="title-subtitle">Professional Health Risk Assessment</span>
        </h1>

        <p className="hero-description">
          Advanced machine learning technology to assess your cardiovascular disease risk.
          Our Random Forest algorithm analyzes 12 key health parameters to provide
          evidence-based risk predictions with clinical-grade accuracy.
        </p>

        <div className="hero-stats" role="list" aria-label="Key statistics">
          <div className="stat-item" role="listitem">
            <span className="stat-number">71.3%</span>
            <span className="stat-label">Clinical Accuracy</span>
          </div>
          <div className="stat-item" role="listitem">
            <span className="stat-number">12</span>
            <span className="stat-label">Health Parameters</span>
          </div>
          <div className="stat-item" role="listitem">
            <span className="stat-number">200</span>
            <span className="stat-label">Decision Trees</span>
          </div>
        </div>

        <div className="hero-actions">
          <button
            onClick={onStartAssessment}
            className="btn btn-primary btn-large"
            aria-label="Start your health assessment"
          >
            <span className="btn-icon" aria-hidden="true">{getIcon('search', 20)}</span>
            Start Health Assessment
          </button>
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="btn btn-secondary btn-large"
            aria-expanded={showMethodology}
            aria-controls="methodology-section"
          >
            <span className="btn-icon" aria-hidden="true">{getIcon('info', 20)}</span>
            {showMethodology ? 'Hide Methodology' : 'View Methodology'}
          </button>
        </div>
      </section>

      {/* Model Features */}
      <section className="features-section" aria-labelledby="features-title">
        <h2 className="section-title" id="features-title">
          <span className="section-icon" aria-hidden="true">{getIcon('flask', 24)}</span>
          Advanced Technology
        </h2>
        <div className="features-grid" role="list">
          {modelFeatures.map((feature, index) => (
            <div key={index} className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">{getIcon(feature.icon, 32)}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology Section */}
      {showMethodology && (
        <section
          id="methodology-section"
          className="methodology-section"
          aria-labelledby="methodology-title"
        >
          <div className="methodology-content">
            <h2 className="methodology-title" id="methodology-title">
              <span className="section-icon" aria-hidden="true">{getIcon('clipboard', 24)}</span>
              Scientific Methodology
            </h2>

            <div className="methodology-grid" role="list">
              <div className="methodology-item" role="listitem">
                <h3>
                  <span aria-hidden="true">{getIcon('database', 18)}</span>
                  Dataset
                </h3>
                <p>Trained on cardiovascular disease dataset with rigorous data cleaning and validation. Outliers removed, realistic value ranges enforced.</p>
              </div>

              <div className="methodology-item" role="listitem">
                <h3>
                  <span aria-hidden="true">{getIcon('cpu', 18)}</span>
                  Algorithm
                </h3>
                <p>Random Forest Classifier with 200 estimators, optimized hyperparameters, and cross-validation for robust performance.</p>
              </div>

              <div className="methodology-item" role="listitem">
                <h3>
                  <span aria-hidden="true">{getIcon('layers', 18)}</span>
                  Features
                </h3>
                <p>12 key parameters: Age, Gender, Height, Weight, Blood Pressure (Systolic/Diastolic), Cholesterol, Glucose, Smoking, Alcohol, Physical Activity, BMI.</p>
              </div>

              <div className="methodology-item" role="listitem">
                <h3>
                  <span aria-hidden="true">{getIcon('check', 18)}</span>
                  Validation
                </h3>
                <p>71.3% accuracy on test set with stratified sampling. Feature importance analysis ensures clinical relevance.</p>
              </div>
            </div>

            <div className="feature-importance">
              <h3>
                <span aria-hidden="true">{getIcon('target', 18)}</span>
                Key Risk Factors (by importance)
              </h3>
              <div className="importance-list" role="list">
                <div className="importance-item importance-high" role="listitem">
                  <span className="importance-bar" style={{ width: '100%' }} aria-hidden="true"></span>
                  <span className="importance-label">Age (26.1%)</span>
                </div>
                <div className="importance-item importance-high" role="listitem">
                  <span className="importance-bar" style={{ width: '64%' }} aria-hidden="true"></span>
                  <span className="importance-label">Systolic Blood Pressure (16.6%)</span>
                </div>
                <div className="importance-item importance-medium" role="listitem">
                  <span className="importance-bar" style={{ width: '61%' }} aria-hidden="true"></span>
                  <span className="importance-label">BMI (16.0%)</span>
                </div>
                <div className="importance-item importance-medium" role="listitem">
                  <span className="importance-bar" style={{ width: '44%' }} aria-hidden="true"></span>
                  <span className="importance-label">Weight (11.6%)</span>
                </div>
                <div className="importance-item importance-low" role="listitem">
                  <span className="importance-bar" style={{ width: '42%' }} aria-hidden="true"></span>
                  <span className="importance-label">Height (11.1%)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Features */}
      <section className="key-features-section" aria-labelledby="why-title">
        <h2 className="section-title" id="why-title">
          <span className="section-icon" aria-hidden="true">{getIcon('shield', 24)}</span>
          Why Choose CardioPredict
        </h2>
        <div className="key-features-grid" role="list">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="key-feature-item" role="listitem">
              <span className="key-feature-icon" aria-hidden="true">{getIcon(feature.icon, 20)}</span>
              <span className="key-feature-text">{feature.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Disclaimers */}
      <section className="disclaimers-section" aria-labelledby="disclaimers-title">
        <h2 className="sr-only" id="disclaimers-title">Important Disclaimers</h2>

        <div className="disclaimer-card medical-disclaimer" role="note">
          <div className="disclaimer-header">
            <span className="disclaimer-icon" aria-hidden="true">{getIcon('heartPulse', 24)}</span>
            <h3>Medical Disclaimer</h3>
          </div>
          <div className="disclaimer-content">
            <p>
              <strong>This tool is for educational and informational purposes only.</strong>
              It is not intended to diagnose, treat, cure, or prevent any disease. The risk
              assessment provided should not replace professional medical advice, diagnosis,
              or treatment. Always seek the advice of qualified healthcare providers with
              questions about your medical condition.
            </p>
          </div>
        </div>

        <div className="disclaimer-card technical-disclaimer" role="note">
          <div className="disclaimer-header">
            <span className="disclaimer-icon" aria-hidden="true">{getIcon('alertTriangle', 24)}</span>
            <h3>Technical Limitations</h3>
          </div>
          <div className="disclaimer-content">
            <p>
              Our AI model achieves 71.3% accuracy on validation data. While this represents
              good performance for cardiovascular risk prediction, it means approximately
              28.7% of predictions may be incorrect. Results should be interpreted as risk
              indicators, not definitive diagnoses.
            </p>
          </div>
        </div>

        <div className="disclaimer-card privacy-disclaimer" role="note">
          <div className="disclaimer-header">
            <span className="disclaimer-icon" aria-hidden="true">{getIcon('lock', 24)}</span>
            <h3>Privacy & Data Security</h3>
          </div>
          <div className="disclaimer-content">
            <p>
              Your health information is processed locally and is not stored on our servers.
              We do not collect, store, or share any personal health data. All assessments
              are performed in real-time without data retention.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" aria-labelledby="cta-title">
        <div className="cta-content">
          <h2 id="cta-title">Ready to Assess Your Cardiovascular Risk?</h2>
          <p>Take our comprehensive 3-minute assessment to get your personalized risk analysis.</p>
          <button
            onClick={onStartAssessment}
            className="btn btn-primary btn-large cta-button"
            aria-label="Begin your cardiovascular risk assessment now"
          >
            <span className="btn-icon" aria-hidden="true">{getIcon('arrowRight', 20)}</span>
            Begin Assessment Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;