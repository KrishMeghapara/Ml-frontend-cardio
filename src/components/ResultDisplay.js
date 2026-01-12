import React, { useEffect, useState, useRef } from 'react';
import { calculateRiskFactors, getComparisonToAverage, POPULATION_AVERAGES } from '../utils/riskFactors';
import { downloadPDF } from '../utils/pdfExport';
import './ResultDisplay.css';

const ResultDisplay = ({ prediction, formData, onReset, onNewAssessment, onEditAssessment }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showFactors, setShowFactors] = useState(true);
  const [riskFactors, setRiskFactors] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [activeTab, setActiveTab] = useState('factors');
  const resultRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    // Animate percentage counter
    const targetPercentage = prediction.percentage;
    const duration = 1500;
    const steps = 60;
    const increment = targetPercentage / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetPercentage) {
        setAnimatedPercentage(targetPercentage);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(Math.round(current));
      }
    }, duration / steps);

    // Calculate risk factors if form data is available
    if (formData) {
      const factors = calculateRiskFactors(formData);
      setRiskFactors(factors);
    }

    // Calculate comparison to population average
    const comp = getComparisonToAverage(prediction.percentage);
    setComparison(comp);

    return () => clearInterval(timer);
  }, [prediction.percentage, formData]);

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case 'medium':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case 'high':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getIcon = (name, size = 20) => {
    const icons = {
      chart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      info: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      clipboard: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      ),
      alert: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      heart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      activity: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      edit: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      ),
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      download: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      scale: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18" />
          <path d="M18 9l-6-6-6 6" />
          <path d="M6 15l6 6 6-6" />
        </svg>
      ),
      droplet: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
      user: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    };
    return icons[name] || null;
  };

  const getFactorIcon = (iconName) => {
    return getIcon(iconName, 18);
  };

  const getRiskRecommendations = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return [
          { text: 'Maintain your current healthy lifestyle', icon: 'check' },
          { text: 'Continue regular physical activity', icon: 'activity' },
          { text: 'Keep up with routine health check-ups', icon: 'calendar' },
          { text: 'Monitor your blood pressure regularly', icon: 'heart' },
          { text: 'Stay hydrated and eat balanced meals', icon: 'droplet' }
        ];
      case 'medium':
        return [
          { text: 'Consult with a healthcare professional', icon: 'user' },
          { text: 'Review your diet and exercise habits', icon: 'activity' },
          { text: 'Monitor blood pressure and cholesterol', icon: 'heart' },
          { text: 'Consider stress management techniques', icon: 'info' },
          { text: 'Avoid smoking and limit alcohol', icon: 'alert' }
        ];
      case 'high':
        return [
          { text: 'Consult with a healthcare professional soon', icon: 'alert' },
          { text: 'Consider immediate lifestyle changes', icon: 'activity' },
          { text: 'Monitor vital signs regularly', icon: 'heart' },
          { text: 'Follow medical advice strictly', icon: 'clipboard' },
          { text: 'Consider medication if recommended', icon: 'info' }
        ];
      default:
        return [{ text: 'Consult with a healthcare professional', icon: 'user' }];
    }
  };

  const handleDownloadPDF = () => {
    downloadPDF(prediction, formData);
  };

  // Calculate SVG progress ring
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (animatedPercentage / 100) * circumference;

  const riskLevel = prediction.risk_level.toLowerCase();

  // Get risk color classes
  const getRiskColorClass = () => {
    switch (riskLevel) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      default: return 'risk-medium';
    }
  };

  return (
    <div
      className={`result-display-v2 ${getRiskColorClass()} ${isVisible ? 'visible' : ''}`}
      role="region"
      aria-labelledby="result-heading"
      ref={resultRef}
    >
      {/* Background Decorations */}
      <div className="result-bg-decoration" aria-hidden="true">
        <div className={`result-orb result-orb-1 ${getRiskColorClass()}`}></div>
        <div className={`result-orb result-orb-2 ${getRiskColorClass()}`}></div>
      </div>

      {/* SVG Gradients */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="gradientLow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradientMedium" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="gradientHigh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header Section */}
      <div className="result-header-v2">
        <div className="result-badge-v2">
          <span className="badge-dot"></span>
          <span>Assessment Complete</span>
        </div>
        <h2 id="result-heading" tabIndex="-1">Your Cardiovascular Risk Assessment</h2>
        <p className="result-subtitle-v2">Based on your health information and AI analysis</p>
      </div>

      {/* Main Result Card */}
      <div className="result-main-card">
        <div className="result-score-section">
          {/* Risk Ring */}
          <div className="risk-ring-container-v2" role="img" aria-label={`Risk score: ${prediction.percentage}%`}>
            <svg className="risk-ring-svg-v2" viewBox="0 0 200 200" aria-hidden="true">
              <circle
                className="risk-ring-bg-v2"
                cx="100"
                cy="100"
                r={radius}
              />
              <circle
                className={`risk-ring-progress-v2 ${riskLevel}`}
                cx="100"
                cy="100"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                style={{
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </svg>
            <div className="risk-ring-center-v2">
              <div className="risk-percentage-v2" aria-hidden="true">
                {animatedPercentage}
                <span className="risk-percentage-symbol-v2">%</span>
              </div>
              <div className="risk-label-v2">Risk Score</div>
            </div>
          </div>

          <div className="score-details-right">
            {/* Risk Level Badge */}
            <div className={`risk-level-badge-v2 ${riskLevel}`} role="status">
              <span className="risk-level-icon" aria-hidden="true">{getRiskIcon(prediction.risk_level)}</span>
              <div className="risk-level-text">
                <span className="risk-level-title">{prediction.risk_level}</span>
                <span className="risk-level-subtitle">Risk Level</span>
              </div>
            </div>

            {/* Comparison to Average */}
            {comparison && (
              <div className={`comparison-card-v2 ${comparison.status}`}>
                <div className="comparison-header">
                  {getIcon('chart', 18)}
                  <span>{comparison.text}</span>
                </div>
                <p className="comparison-desc">{comparison.description}</p>
                <div className="comparison-stat">
                  <span className="stat-label">Population Average:</span>
                  <span className="stat-value">{POPULATION_AVERAGES.overallRisk}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interpretation Card */}
        <div className="interpretation-card-v2">
          <div className="card-header-v2">
            {getIcon('info', 22)}
            <h3>What This Means</h3>
          </div>
          <p className="interpretation-text-v2">
            {prediction.interpretation}
          </p>
        </div>
      </div>

      {/* Tabbed Content Section */}
      <div className="result-tabs-section">
        <div className="tabs-header" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'factors'}
            className={`tab-btn ${activeTab === 'factors' ? 'active' : ''}`}
            onClick={() => setActiveTab('factors')}
          >
            {getIcon('chart', 18)}
            <span>Risk Factors</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'recommendations'}
            className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            {getIcon('clipboard', 18)}
            <span>Recommendations</span>
          </button>
        </div>

        <div className="tabs-content">
          {/* Risk Factors Tab */}
          {activeTab === 'factors' && riskFactors.length > 0 && (
            <div className="tab-panel factors-panel" role="tabpanel">
              <p className="panel-intro">
                These factors contributed to your risk assessment, ordered by impact:
              </p>
              <div className="factors-grid">
                {riskFactors.map((factor, index) => (
                  <div key={index} className={`factor-card-v2 ${factor.riskLevel}`}>
                    <div className="factor-card-header">
                      <div className="factor-icon-v2" aria-hidden="true">
                        {getFactorIcon(factor.icon)}
                      </div>
                      <div className="factor-info-v2">
                        <span className="factor-name-v2">{factor.name}</span>
                        <span className="factor-value-v2">{factor.value}</span>
                      </div>
                      <div className={`factor-badge-v2 ${factor.riskLevel}`}>
                        {factor.riskLevel === 'low' ? 'Good' : factor.riskLevel === 'medium' ? 'Moderate' : 'Elevated'}
                      </div>
                    </div>
                    <div className="factor-bar-v2" aria-hidden="true">
                      <div
                        className={`factor-bar-fill-v2 ${factor.riskLevel}`}
                        style={{ '--width': `${Math.min(factor.contribution * 2, 100)}%` }}
                      ></div>
                    </div>
                    <p className="factor-rec-v2">{factor.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="tab-panel recommendations-panel" role="tabpanel">
              <p className="panel-intro">
                Personalized recommendations based on your risk profile:
              </p>
              <div className="recommendations-grid">
                {getRiskRecommendations(prediction.risk_level).map((rec, index) => (
                  <div key={index} className="recommendation-card-v2">
                    <div className={`rec-icon ${riskLevel}`}>
                      {getIcon(rec.icon, 20)}
                    </div>
                    <span className="rec-text">{rec.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="disclaimer-section-v2">
        <div className="disclaimer-card-v2" role="note">
          <div className="disclaimer-icon-v2">
            {getIcon('alert', 24)}
          </div>
          <div className="disclaimer-content-v2">
            <h4>Important Medical Disclaimer</h4>
            <p>
              This assessment is based on statistical models and is for <strong>educational purposes only</strong>.
              It should not replace professional medical advice, diagnosis, or treatment.
              Always consult with qualified healthcare professionals for medical decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="result-actions-v2">
        {formData && (
          <button
            onClick={onEditAssessment}
            className="action-btn-v2 secondary"
            aria-label="Edit your previous answers"
          >
            {getIcon('edit', 18)}
            <span>Edit Answers</span>
          </button>
        )}
        <button
          onClick={onNewAssessment}
          className="action-btn-v2 primary"
          aria-label="Start a new assessment"
        >
          {getIcon('refresh', 18)}
          <span>New Assessment</span>
        </button>
        <button
          onClick={onReset}
          className="action-btn-v2 secondary"
          aria-label="Return to home page"
        >
          {getIcon('home', 18)}
          <span>Home</span>
        </button>
        <button
          onClick={handleDownloadPDF}
          className="action-btn-v2 accent"
          aria-label="Download results as PDF"
        >
          {getIcon('download', 18)}
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;