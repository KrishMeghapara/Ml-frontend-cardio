import React, { useEffect, useState } from 'react';
import { calculateRiskFactors, getComparisonToAverage, POPULATION_AVERAGES } from '../utils/riskFactors';
import { downloadPDF } from '../utils/pdfExport';
import './ResultDisplay.css';

const ResultDisplay = ({ prediction, formData, onReset, onNewAssessment, onEditAssessment }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showFactors, setShowFactors] = useState(true);
  const [riskFactors, setRiskFactors] = useState([]);
  const [comparison, setComparison] = useState(null);

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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case 'medium':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case 'high':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getFactorIcon = (iconName) => {
    const icons = {
      calendar: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      heart: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      scale: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18" />
          <path d="M18 9l-6-6-6 6" />
          <path d="M6 15l6 6 6-6" />
        </svg>
      ),
      droplet: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
      activity: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      user: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const getRecommendationIcon = (index, riskLevel) => {
    const icons = [
      <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>,
      <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>,
      <svg key="3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>,
      <svg key="4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>,
      <svg key="5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ];
    return icons[index] || icons[0];
  };

  const getRiskRecommendations = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return [
          'Maintain your current healthy lifestyle',
          'Continue regular physical activity',
          'Keep up with routine health check-ups',
          'Monitor your blood pressure regularly',
          'Stay hydrated and eat balanced meals'
        ];
      case 'medium':
        return [
          'Consider consulting with a healthcare professional',
          'Review your diet and exercise habits',
          'Monitor blood pressure and cholesterol levels',
          'Consider stress management techniques',
          'Avoid smoking and limit alcohol consumption'
        ];
      case 'high':
        return [
          'Consult with a healthcare professional soon',
          'Consider immediate lifestyle changes',
          'Monitor vital signs regularly',
          'Follow medical advice strictly',
          'Consider medication if recommended by doctor'
        ];
      default:
        return ['Consult with a healthcare professional for guidance'];
    }
  };

  const handleDownloadPDF = () => {
    downloadPDF(prediction, formData);
  };

  // Calculate SVG progress ring
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (animatedPercentage / 100) * circumference;

  const riskLevel = prediction.risk_level.toLowerCase();

  return (
    <div
      className={`result-display risk-${riskLevel} ${isVisible ? 'visible' : ''}`}
      role="region"
      aria-labelledby="result-heading"
    >
      {/* SVG Gradients */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="gradientSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradientWarning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="gradientDanger" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>

      <div className="result-header">
        <h2 id="result-heading" tabIndex="-1">Your Cardiovascular Risk Assessment</h2>
        <p className="result-subtitle">Based on your health information</p>
      </div>

      <div className="result-content">
        {/* Risk Score Visualization */}
        <div className="risk-visualization">
          <div className="risk-ring-container" role="img" aria-label={`Risk score: ${prediction.percentage}%`}>
            <svg className="risk-ring-svg" viewBox="0 0 200 200" aria-hidden="true">
              <circle
                className="risk-ring-bg"
                cx="100"
                cy="100"
                r={radius}
              />
              <circle
                className={`risk-ring-progress ${riskLevel}`}
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
            <div className="risk-ring-center">
              <div className="risk-percentage" aria-hidden="true">
                {animatedPercentage}
                <span className="risk-percentage-symbol">%</span>
              </div>
              <div className="risk-label">Risk Score</div>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className="risk-level-section">
            <div className={`risk-badge ${riskLevel}`} role="status">
              <span className="risk-icon" aria-hidden="true">{getRiskIcon(prediction.risk_level)}</span>
              <span className="risk-text">{prediction.risk_level} Risk</span>
            </div>
          </div>

          {/* Comparison to Average */}
          {comparison && (
            <div className={`comparison-section ${comparison.status}`}>
              <div className="comparison-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
                <span>{comparison.text}</span>
              </div>
              <p className="comparison-description">{comparison.description}</p>
              <p className="comparison-note">Population average risk: {POPULATION_AVERAGES.overallRisk}%</p>
            </div>
          )}
        </div>

        {/* Risk Factor Breakdown */}
        {riskFactors.length > 0 && (
          <div className="risk-factors-section">
            <button
              className="section-toggle"
              onClick={() => setShowFactors(!showFactors)}
              aria-expanded={showFactors}
              aria-controls="risk-factors-content"
            >
              <div className="section-header-inline">
                <span className="section-emoji" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </span>
                <h3>Risk Factor Breakdown</h3>
              </div>
              <svg
                className={`toggle-icon ${showFactors ? 'open' : ''}`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showFactors && (
              <div id="risk-factors-content" className="risk-factors-content">
                <p className="factors-intro">
                  These factors contributed to your risk assessment, ordered by impact:
                </p>
                <ul className="risk-factors-list" role="list">
                  {riskFactors.map((factor, index) => (
                    <li key={index} className={`risk-factor-item ${factor.riskLevel}`}>
                      <div className="factor-header">
                        <div className="factor-icon" aria-hidden="true">
                          {getFactorIcon(factor.icon)}
                        </div>
                        <div className="factor-info">
                          <span className="factor-name">{factor.name}</span>
                          <span className="factor-value">{factor.value}</span>
                        </div>
                        <div className={`factor-status ${factor.riskLevel}`}>
                          {factor.riskLevel === 'low' ? 'Good' : factor.riskLevel === 'medium' ? 'Moderate' : 'Elevated'}
                        </div>
                      </div>
                      <div className="factor-bar-container" aria-hidden="true">
                        <div
                          className={`factor-bar ${factor.riskLevel}`}
                          style={{ width: `${Math.min(factor.contribution * 2, 100)}%` }}
                        />
                      </div>
                      <p className="factor-recommendation">{factor.recommendation}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Interpretation */}
        <div className="interpretation-section">
          <div className="section-header-inline">
            <span className="section-emoji" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            <h3>What This Means</h3>
          </div>
          <p className="interpretation-text">
            {prediction.interpretation}
          </p>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <div className="section-header-inline">
            <span className="section-emoji" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <h3>Personalized Recommendations</h3>
          </div>
          <ul className="recommendations-list" role="list">
            {getRiskRecommendations(prediction.risk_level).map((recommendation, index) => (
              <li key={index}>
                <span className="recommendation-icon" aria-hidden="true">
                  {getRecommendationIcon(index, prediction.risk_level)}
                </span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-section">
          <div className="disclaimer-box" role="note">
            <span className="disclaimer-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <div className="disclaimer-content">
              <h4>Important Disclaimer</h4>
              <p>
                This assessment is based on statistical models and is for educational purposes only.
                It should not replace professional medical advice, diagnosis, or treatment.
                Always consult with qualified healthcare professionals for medical decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="result-actions">
          {formData && (
            <button
              onClick={onEditAssessment}
              className="btn btn-secondary"
              aria-label="Edit your previous answers"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Answers
            </button>
          )}
          <button
            onClick={onNewAssessment}
            className="btn btn-primary"
            aria-label="Start a new assessment"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            New Assessment
          </button>
          <button
            onClick={onReset}
            className="btn btn-secondary"
            aria-label="Return to home page"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-secondary btn-print"
            aria-label="Download results as PDF"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;