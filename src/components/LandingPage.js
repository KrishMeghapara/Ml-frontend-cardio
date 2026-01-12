import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

const LandingPage = ({ onStartAssessment }) => {
  const [showMethodology, setShowMethodology] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const heroRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for reveal animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((section) => observerRef.current.observe(section));

    return () => observerRef.current?.disconnect();
  }, []);

  // Subtle mouse tracking for hero glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
      return () => hero.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const modelFeatures = [
    {
      icon: 'brain',
      title: 'Random Forest AI',
      description: 'Advanced ensemble learning with 200 decision trees for robust, reliable predictions',
      accent: 'primary'
    },
    {
      icon: 'chart',
      title: '73.4% Accuracy',
      description: 'Clinically validated on extensive cardiovascular disease datasets',
      accent: 'success'
    },
    {
      icon: 'flask',
      title: '12 Parameters',
      description: 'Comprehensive analysis of vital health indicators and lifestyle factors',
      accent: 'secondary'
    },
    {
      icon: 'zap',
      title: 'Instant Results',
      description: 'Real-time risk assessment with personalized health insights',
      accent: 'warning'
    }
  ];

  const keyFeatures = [
    { icon: 'hospital', text: 'Clinical-grade ML model', size: 'large' },
    { icon: 'lock', text: 'Privacy-first design', size: 'medium' },
    { icon: 'smartphone', text: 'Multi-device access', size: 'medium' },
    { icon: 'target', text: 'Evidence-based assessment', size: 'large' },
    { icon: 'clipboard', text: 'Personalized recommendations', size: 'medium' },
    { icon: 'shield', text: 'Medical best practices', size: 'medium' }
  ];

  const getIcon = (name, size = 24) => {
    const icons = {
      brain: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4v1a3 3 0 0 1-2.35 2.93 4 4 0 0 1 .35 1.57 4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4 4 4 0 0 1 .35-1.57A3 3 0 0 1 4 11v-1a4 4 0 0 1 4-4 4 4 0 0 1 4-4z" />
          <path d="M12 2v4" />
          <path d="M8 6v2" />
          <path d="M16 6v2" />
        </svg>
      ),
      chart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      flask: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6" />
          <path d="M10 3v6.5a1.5 1.5 0 0 1-.5 1.1L4 16.5A2 2 0 0 0 5.5 20h13a2 2 0 0 0 1.5-3.5l-5.5-5.9a1.5 1.5 0 0 1-.5-1.1V3" />
        </svg>
      ),
      zap: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      hospital: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4 8 4v14" />
          <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
          <path d="M12 7v4" />
          <path d="M10 9h4" />
        </svg>
      ),
      lock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      smartphone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      target: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      clipboard: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      ),
      shield: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
      search: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      info: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      database: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
      cpu: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      arrowRight: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      ),
      heartPulse: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      alertTriangle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      heart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    };
    return icons[name] || null;
  };

  // ECG Line Component
  const ECGLine = () => (
    <div className="ecg-container" aria-hidden="true">
      <svg className="ecg-line" viewBox="0 0 600 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0" />
            <stop offset="20%" stopColor="var(--primary-500)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--primary-400)" stopOpacity="1" />
            <stop offset="80%" stopColor="var(--primary-500)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="ecg-path"
          d="M0,50 L100,50 L120,50 L130,20 L140,80 L150,30 L160,70 L170,50 L200,50 L220,50 L230,10 L240,90 L250,50 L280,50 L300,50 L320,50 L330,25 L340,75 L350,35 L360,65 L370,50 L400,50 L420,50 L430,15 L440,85 L450,50 L480,50 L500,50 L520,50 L530,20 L540,80 L550,30 L560,70 L570,50 L600,50"
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );

  // Floating Particles Component
  const FloatingParticles = () => (
    <div className="floating-particles" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`particle particle-${i + 1}`}>
          <span className="particle-dot"></span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="landing-page-v2">
      {/* Ambient Background Effects */}
      <div className="ambient-background" aria-hidden="true">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section
        className="hero-section-v2"
        aria-labelledby="hero-title"
        ref={heroRef}
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        }}
      >
        <div className="hero-glow" aria-hidden="true"></div>
        <FloatingParticles />

        <div className="hero-content">
          <div className="hero-badge-v2">
            <span className="badge-pulse"></span>
            <span className="badge-icon" aria-hidden="true">{getIcon('hospital', 16)}</span>
            <span>AI-Powered Cardiovascular Assessment</span>
          </div>

          <h1 className="hero-title-v2" id="hero-title">
            <span className="title-line">
              <span className="title-word reveal-text">Cardio</span>
              <span className="title-word title-accent reveal-text">Predict</span>
            </span>
            <span className="title-subtitle reveal-text">
              Professional Health Risk Assessment
            </span>
          </h1>

          <p className="hero-description-v2 reveal-text">
            Leverage advanced machine learning to understand your cardiovascular health.
            Our clinically-validated Random Forest algorithm analyzes 12 key health parameters
            to provide evidence-based risk predictions.
          </p>

          {/* ECG Animation */}
          <ECGLine />

          {/* Stats with animated counters */}
          <div className="hero-stats-v2" role="list" aria-label="Key statistics">
            <div className="stat-card" role="listitem">
              <div className="stat-icon">{getIcon('chart', 20)}</div>
              <div className="stat-content">
                <span className="stat-number">73.4%</span>
                <span className="stat-label">Clinical Accuracy</span>
              </div>
            </div>
            <div className="stat-card" role="listitem">
              <div className="stat-icon">{getIcon('layers', 20)}</div>
              <div className="stat-content">
                <span className="stat-number">12</span>
                <span className="stat-label">Health Parameters</span>
              </div>
            </div>
            <div className="stat-card" role="listitem">
              <div className="stat-icon">{getIcon('cpu', 20)}</div>
              <div className="stat-content">
                <span className="stat-number">200</span>
                <span className="stat-label">Decision Trees</span>
              </div>
            </div>
          </div>

          <div className="hero-actions-v2">
            <button
              onClick={onStartAssessment}
              className="btn-primary-v2"
              aria-label="Start your health assessment"
            >
              <span className="btn-content">
                <span className="btn-icon" aria-hidden="true">{getIcon('heartPulse', 20)}</span>
                <span>Start Assessment</span>
              </span>
              <span className="btn-shimmer"></span>
            </button>
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="btn-secondary-v2"
              aria-expanded={showMethodology}
              aria-controls="methodology-section"
            >
              <span className="btn-icon" aria-hidden="true">{getIcon('info', 18)}</span>
              {showMethodology ? 'Hide Methodology' : 'View Methodology'}
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section
        id="features-section"
        className={`features-section-v2 reveal-section ${isVisible['features-section'] ? 'revealed' : ''}`}
        aria-labelledby="features-title"
      >
        <div className="section-header">
          <h2 className="section-title-v2" id="features-title">
            <span className="title-decorator"></span>
            Advanced Technology
          </h2>
          <p className="section-subtitle">Powered by state-of-the-art machine learning</p>
        </div>

        <div className="bento-grid" role="list">
          {modelFeatures.map((feature, index) => (
            <div
              key={index}
              className={`bento-card bento-card-${index + 1}`}
              role="listitem"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className={`bento-icon accent-${feature.accent}`} aria-hidden="true">
                {getIcon(feature.icon, 28)}
              </div>
              <h3 className="bento-title">{feature.title}</h3>
              <p className="bento-description">{feature.description}</p>
              <div className="bento-glow" aria-hidden="true"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology Section */}
      {showMethodology && (
        <section
          id="methodology-section"
          className="methodology-section-v2 reveal-section revealed"
          aria-labelledby="methodology-title"
        >
          <div className="methodology-container">
            <h2 className="section-title-v2" id="methodology-title">
              <span className="title-decorator"></span>
              Scientific Methodology
            </h2>

            <div className="methodology-grid-v2" role="list">
              <div className="methodology-card" role="listitem">
                <div className="methodology-icon">{getIcon('database', 24)}</div>
                <h3>Dataset</h3>
                <p>Trained on comprehensive cardiovascular disease datasets with rigorous data cleaning, validation, and realistic value ranges.</p>
              </div>

              <div className="methodology-card" role="listitem">
                <div className="methodology-icon">{getIcon('cpu', 24)}</div>
                <h3>Algorithm</h3>
                <p>Random Forest Classifier with 200 estimators, optimized hyperparameters, and cross-validation for robust performance.</p>
              </div>

              <div className="methodology-card" role="listitem">
                <div className="methodology-icon">{getIcon('layers', 24)}</div>
                <h3>Features</h3>
                <p>12 key parameters including age, gender, blood pressure, cholesterol, glucose, BMI, and lifestyle factors.</p>
              </div>

              <div className="methodology-card" role="listitem">
                <div className="methodology-icon">{getIcon('check', 24)}</div>
                <h3>Validation</h3>
                <p>73.4% accuracy on test set with stratified sampling. Feature importance analysis ensures clinical relevance.</p>
              </div>
            </div>

            {/* Feature Importance Visualization */}
            <div className="importance-visualization">
              <h3>
                <span className="importance-icon">{getIcon('target', 20)}</span>
                Key Risk Factors by Importance
              </h3>
              <div className="importance-bars">
                {[
                  { name: 'Age', value: 26.1, level: 'critical' },
                  { name: 'Systolic BP', value: 16.6, level: 'high' },
                  { name: 'BMI', value: 16.0, level: 'high' },
                  { name: 'Weight', value: 11.6, level: 'medium' },
                  { name: 'Height', value: 11.1, level: 'medium' }
                ].map((item, index) => (
                  <div key={index} className="importance-row">
                    <span className="importance-name">{item.name}</span>
                    <div className="importance-bar-container">
                      <div
                        className={`importance-bar-fill level-${item.level}`}
                        style={{ '--width': `${(item.value / 26.1) * 100}%`, '--delay': `${index * 0.1}s` }}
                      ></div>
                    </div>
                    <span className="importance-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Features - Bento Style */}
      <section
        id="why-section"
        className={`why-section-v2 reveal-section ${isVisible['why-section'] ? 'revealed' : ''}`}
        aria-labelledby="why-title"
      >
        <div className="section-header">
          <h2 className="section-title-v2" id="why-title">
            <span className="title-decorator"></span>
            Why Choose CardioPredict
          </h2>
          <p className="section-subtitle">Trusted, secure, and scientifically validated</p>
        </div>

        <div className="features-flex" role="list">
          {keyFeatures.map((feature, index) => (
            <div
              key={index}
              className={`feature-chip ${feature.size}`}
              role="listitem"
              style={{ '--delay': `${index * 0.08}s` }}
            >
              <span className="chip-icon" aria-hidden="true">{getIcon(feature.icon, 18)}</span>
              <span className="chip-text">{feature.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Disclaimers */}
      <section
        id="disclaimers-section"
        className={`disclaimers-section-v2 reveal-section ${isVisible['disclaimers-section'] ? 'revealed' : ''}`}
        aria-labelledby="disclaimers-title"
      >
        <h2 className="sr-only" id="disclaimers-title">Important Disclaimers</h2>

        <div className="disclaimer-cards">
          <div className="disclaimer-card-v2 medical" role="note">
            <div className="disclaimer-icon-wrapper">
              {getIcon('heartPulse', 24)}
            </div>
            <div className="disclaimer-body">
              <h3>Medical Disclaimer</h3>
              <p>
                <strong>For educational purposes only.</strong> This tool does not diagnose, treat, or prevent any disease.
                Always consult qualified healthcare providers for medical advice.
              </p>
            </div>
          </div>

          <div className="disclaimer-card-v2 technical" role="note">
            <div className="disclaimer-icon-wrapper">
              {getIcon('alertTriangle', 24)}
            </div>
            <div className="disclaimer-body">
              <h3>Technical Limitations</h3>
              <p>
                Our AI achieves 73.4% accuracy. Results are risk indicators, not definitive diagnoses.
                Approximately 26.6% of predictions may vary.
              </p>
            </div>
          </div>

          <div className="disclaimer-card-v2 privacy" role="note">
            <div className="disclaimer-icon-wrapper">
              {getIcon('lock', 24)}
            </div>
            <div className="disclaimer-body">
              <h3>Privacy & Security</h3>
              <p>
                Your data is processed locally and never stored. We don't collect, store, or share
                any personal health information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        id="cta-section"
        className={`cta-section-v2 reveal-section ${isVisible['cta-section'] ? 'revealed' : ''}`}
        aria-labelledby="cta-title"
      >
        <div className="cta-background" aria-hidden="true">
          <div className="cta-orb"></div>
        </div>
        <div className="cta-content-v2">
          <div className="cta-heart" aria-hidden="true">
            {getIcon('heart', 48)}
          </div>
          <h2 id="cta-title">Ready to Assess Your Heart Health?</h2>
          <p>Take our comprehensive 3-minute assessment for personalized risk analysis.</p>
          <button
            onClick={onStartAssessment}
            className="btn-primary-v2 btn-cta"
            aria-label="Begin your cardiovascular risk assessment now"
          >
            <span className="btn-content">
              <span className="btn-icon" aria-hidden="true">{getIcon('arrowRight', 20)}</span>
              <span>Begin Assessment</span>
            </span>
            <span className="btn-shimmer"></span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
