/**
 * Enhanced PDF Export utility for CardioPredict health assessment results
 * Features: Professional letterhead, visual charts, doctor notes, comparison metrics
 */

// Generate visual bar chart as SVG for risk factors
const generateRiskFactorChart = (formData) => {
  if (!formData) return '';

  const factors = [
    {
      name: 'Age',
      value: Math.min(100, (formData.age / 80) * 100),
      status: formData.age > 55 ? 'high' : formData.age > 40 ? 'medium' : 'low'
    },
    {
      name: 'Blood Pressure',
      value: Math.min(100, (formData.ap_hi / 180) * 100),
      status: formData.ap_hi >= 140 ? 'high' : formData.ap_hi >= 120 ? 'medium' : 'low'
    },
    {
      name: 'BMI',
      value: Math.min(100, ((formData.weight / Math.pow(formData.height / 100, 2)) / 40) * 100),
      status: (formData.weight / Math.pow(formData.height / 100, 2)) >= 30 ? 'high' :
        (formData.weight / Math.pow(formData.height / 100, 2)) >= 25 ? 'medium' : 'low'
    },
    {
      name: 'Cholesterol',
      value: formData.cholesterol * 33,
      status: formData.cholesterol === 3 ? 'high' : formData.cholesterol === 2 ? 'medium' : 'low'
    },
    {
      name: 'Physical Activity',
      value: formData.active ? 30 : 80,
      status: formData.active ? 'low' : 'high'
    },
    {
      name: 'Smoking',
      value: formData.smoke ? 90 : 10,
      status: formData.smoke ? 'high' : 'low'
    }
  ];

  const getColor = (status) => {
    switch (status) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return factors.map((factor, index) => `
    <div class="factor-row">
      <span class="factor-name">${factor.name}</span>
      <div class="factor-bar-container">
        <div class="factor-bar" style="width: ${factor.value}%; background: ${getColor(factor.status)};"></div>
      </div>
      <span class="factor-status" style="color: ${getColor(factor.status)};">${factor.status.toUpperCase()}</span>
    </div>
  `).join('');
};

// Generate comparison metrics
const generateComparisonMetrics = (formData) => {
  if (!formData) return '';

  const bmi = formData.weight / Math.pow(formData.height / 100, 2);

  const metrics = [
    {
      label: 'Your BMI',
      value: bmi.toFixed(1),
      average: '24.9',
      status: bmi >= 30 ? 'Above recommended' : bmi >= 25 ? 'Slightly elevated' : 'Normal range'
    },
    {
      label: 'Blood Pressure',
      value: `${formData.ap_hi}/${formData.ap_lo}`,
      average: '120/80',
      status: formData.ap_hi >= 140 ? 'Elevated' : formData.ap_hi >= 120 ? 'Slightly elevated' : 'Normal'
    },
    {
      label: 'Cholesterol',
      value: ['Normal', 'Above Normal', 'High'][formData.cholesterol - 1],
      average: 'Normal',
      status: formData.cholesterol > 1 ? 'Needs attention' : 'Good'
    }
  ];

  return metrics.map(m => `
    <div class="metric-card">
      <div class="metric-label">${m.label}</div>
      <div class="metric-value">${m.value}</div>
      <div class="metric-comparison">Average: ${m.average}</div>
      <div class="metric-status">${m.status}</div>
    </div>
  `).join('');
};

export const generatePDFContent = (prediction, formData = null) => {
  const { percentage, risk_level, interpretation } = prediction;
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const time = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const reportId = `CPR-${Date.now().toString(36).toUpperCase()}`;

  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskGradient = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'medium': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'high': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  const getRecommendations = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return [
          { icon: '✓', text: 'Maintain your current healthy lifestyle', priority: 'Routine' },
          { icon: '✓', text: 'Continue regular physical activity (150+ min/week)', priority: 'Routine' },
          { icon: '✓', text: 'Keep up with annual health check-ups', priority: 'Routine' },
          { icon: '✓', text: 'Monitor blood pressure at home regularly', priority: 'Routine' },
          { icon: '✓', text: 'Maintain a heart-healthy diet rich in vegetables', priority: 'Routine' }
        ];
      case 'medium':
        return [
          { icon: '!', text: 'Schedule an appointment with your healthcare provider', priority: 'Important' },
          { icon: '!', text: 'Review and improve your diet and exercise habits', priority: 'Important' },
          { icon: '!', text: 'Get blood pressure and cholesterol tested soon', priority: 'Important' },
          { icon: '✓', text: 'Practice stress management techniques', priority: 'Recommended' },
          { icon: '!', text: 'Quit smoking if applicable', priority: 'Important' }
        ];
      case 'high':
        return [
          { icon: '⚠', text: 'Consult with a healthcare professional as soon as possible', priority: 'Urgent' },
          { icon: '⚠', text: 'Consider immediate lifestyle modifications', priority: 'Urgent' },
          { icon: '!', text: 'Monitor vital signs daily', priority: 'Important' },
          { icon: '!', text: 'Follow all medical advice and prescriptions', priority: 'Important' },
          { icon: '⚠', text: 'Discuss medication options with your doctor', priority: 'Urgent' }
        ];
      default:
        return [{ icon: '!', text: 'Consult with a healthcare professional for guidance', priority: 'Important' }];
    }
  };

  const recommendations = getRecommendations(risk_level);
  const riskColor = getRiskColor(risk_level);
  const riskGradient = getRiskGradient(risk_level);
  const populationAverage = 35;
  const comparisonPercent = Math.abs(percentage - populationAverage);
  const comparisonText = percentage < populationAverage
    ? `${comparisonPercent}% below population average`
    : percentage > populationAverage
      ? `${comparisonPercent}% above population average`
      : 'At population average';

  // Calculate BMI if formData available
  const bmi = formData ? (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1) : null;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>CardioPredict Health Assessment Report - ${reportId}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background: #ffffff;
      }
      
      .page {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
      }
      
      /* ========== HEADER ========== */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 25px;
        border-bottom: 3px solid #0ea5e9;
        margin-bottom: 30px;
      }
      
      .header-left {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      .logo-icon {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }
      
      .logo-text {
        font-size: 28px;
        font-weight: 800;
        color: #0ea5e9;
        letter-spacing: -0.5px;
      }
      
      .logo-subtitle {
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .header-right {
        text-align: right;
        font-size: 12px;
        color: #6b7280;
      }
      
      .report-id {
        font-weight: 600;
        color: #374151;
        font-size: 13px;
        margin-bottom: 4px;
      }
      
      /* ========== RISK SCORE SECTION ========== */
      .risk-section {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-radius: 16px;
        padding: 35px;
        margin-bottom: 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .risk-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: ${riskGradient};
      }
      
      .score-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 40px;
        margin-bottom: 20px;
      }
      
      .score-circle {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 4px solid ${riskColor};
      }
      
      .score-value {
        font-size: 48px;
        font-weight: 800;
        color: ${riskColor};
        line-height: 1;
      }
      
      .score-percent {
        font-size: 20px;
        opacity: 0.7;
      }
      
      .score-label {
        font-size: 11px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-top: 5px;
      }
      
      .risk-badge {
        display: inline-block;
        padding: 10px 30px;
        background: ${riskGradient};
        color: white;
        border-radius: 50px;
        font-weight: 700;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 0 4px 15px ${riskColor}40;
      }
      
      .comparison-badge {
        margin-top: 15px;
        padding: 8px 20px;
        background: ${percentage < populationAverage ? '#dcfce7' : percentage > populationAverage ? '#fee2e2' : '#fef3c7'};
        color: ${percentage < populationAverage ? '#166534' : percentage > populationAverage ? '#991b1b' : '#92400e'};
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        display: inline-block;
      }
      
      /* ========== RISK FACTOR CHART ========== */
      .chart-section {
        margin-bottom: 30px;
      }
      
      .section-title {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e5e7eb;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .section-icon {
        width: 28px;
        height: 28px;
        background: #0ea5e9;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      }
      
      .factor-row {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px 0;
        border-bottom: 1px solid #f3f4f6;
      }
      
      .factor-name {
        width: 140px;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
      }
      
      .factor-bar-container {
        flex: 1;
        height: 12px;
        background: #e5e7eb;
        border-radius: 6px;
        overflow: hidden;
      }
      
      .factor-bar {
        height: 100%;
        border-radius: 6px;
        transition: width 0.5s ease;
      }
      
      .factor-status {
        width: 80px;
        font-size: 11px;
        font-weight: 700;
        text-align: right;
      }
      
      /* ========== COMPARISON METRICS ========== */
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-bottom: 30px;
      }
      
      .metric-card {
        background: #f9fafb;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        border: 1px solid #e5e7eb;
      }
      
      .metric-label {
        font-size: 11px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
      }
      
      .metric-value {
        font-size: 24px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 5px;
      }
      
      .metric-comparison {
        font-size: 11px;
        color: #9ca3af;
        margin-bottom: 8px;
      }
      
      .metric-status {
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
      }
      
      /* ========== HEALTH DATA ========== */
      .health-data-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        background: #f9fafb;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 30px;
      }
      
      .data-item {
        background: white;
        padding: 12px 15px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
      }
      
      .data-label {
        font-size: 11px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }
      
      .data-value {
        font-size: 15px;
        font-weight: 600;
        color: #111827;
      }
      
      /* ========== INTERPRETATION ========== */
      .interpretation-box {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        padding: 20px 25px;
        border-radius: 12px;
        border-left: 5px solid #0ea5e9;
        margin-bottom: 30px;
        line-height: 1.8;
        color: #1e40af;
      }
      
      /* ========== RECOMMENDATIONS ========== */
      .recommendations-list {
        list-style: none;
        margin-bottom: 30px;
      }
      
      .recommendation-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        padding: 15px;
        background: #f9fafb;
        border-radius: 10px;
        margin-bottom: 10px;
        border: 1px solid #e5e7eb;
      }
      
      .recommendation-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
      
      .recommendation-icon.urgent {
        background: #fee2e2;
        color: #dc2626;
      }
      
      .recommendation-icon.important {
        background: #fef3c7;
        color: #d97706;
      }
      
      .recommendation-icon.routine {
        background: #dcfce7;
        color: #16a34a;
      }
      
      .recommendation-content {
        flex: 1;
      }
      
      .recommendation-text {
        font-size: 14px;
        color: #374151;
        font-weight: 500;
      }
      
      .recommendation-priority {
        font-size: 11px;
        color: #6b7280;
        margin-top: 3px;
      }
      
      /* ========== DOCTOR NOTES ========== */
      .doctor-notes {
        background: #f9fafb;
        border: 2px dashed #d1d5db;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 30px;
      }
      
      .notes-title {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .notes-lines {
        border-bottom: 1px solid #e5e7eb;
        height: 30px;
        margin-bottom: 10px;
      }
      
      /* ========== DISCLAIMER ========== */
      .disclaimer {
        background: #fffbeb;
        border-radius: 12px;
        padding: 20px;
        border-left: 5px solid #f59e0b;
        margin-bottom: 30px;
      }
      
      .disclaimer-title {
        font-size: 13px;
        font-weight: 700;
        color: #92400e;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .disclaimer-text {
        font-size: 12px;
        color: #a16207;
        line-height: 1.7;
      }
      
      /* ========== FOOTER ========== */
      .footer {
        text-align: center;
        padding-top: 25px;
        border-top: 2px solid #e5e7eb;
        color: #9ca3af;
        font-size: 11px;
      }
      
      .footer-logo {
        font-weight: 700;
        color: #0ea5e9;
        font-size: 14px;
        margin-bottom: 5px;
      }
      
      .footer-note {
        margin-top: 10px;
        font-style: italic;
      }
      
      /* ========== PRINT STYLES ========== */
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .page {
          padding: 20px;
          max-width: 100%;
        }
        .risk-section, .metric-card, .data-item, .recommendation-item {
          -webkit-print-color-adjust: exact !important;
        }
      }
      
      @page {
        size: A4;
        margin: 15mm;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <div class="logo-icon">♥</div>
          <div>
            <div class="logo-text">CardioPredict</div>
            <div class="logo-subtitle">AI Health Assessment</div>
          </div>
        </div>
        <div class="header-right">
          <div class="report-id">Report ID: ${reportId}</div>
          <div>Date: ${date}</div>
          <div>Time: ${time}</div>
        </div>
      </div>
      
      <!-- Risk Score Section -->
      <div class="risk-section">
        <div class="score-container">
          <div class="score-circle">
            <div class="score-value">${percentage}<span class="score-percent">%</span></div>
            <div class="score-label">Risk Score</div>
          </div>
        </div>
        <div class="risk-badge">${risk_level} Risk</div>
        <div class="comparison-badge">${comparisonText}</div>
      </div>
      
      <!-- Comparison Metrics -->
      ${formData ? `
      <div class="metrics-grid">
        ${generateComparisonMetrics(formData)}
      </div>
      ` : ''}
      
      <!-- Risk Factor Chart -->
      ${formData ? `
      <div class="chart-section">
        <div class="section-title">
          <span class="section-icon">📊</span>
          Risk Factor Analysis
        </div>
        ${generateRiskFactorChart(formData)}
      </div>
      ` : ''}
      
      <!-- Interpretation -->
      <div class="section">
        <div class="section-title">
          <span class="section-icon">💡</span>
          Assessment Interpretation
        </div>
        <div class="interpretation-box">
          ${interpretation}
        </div>
      </div>
      
      <!-- Health Data -->
      ${formData ? `
      <div class="section">
        <div class="section-title">
          <span class="section-icon">📋</span>
          Your Health Data
        </div>
        <div class="health-data-grid">
          <div class="data-item">
            <div class="data-label">Age</div>
            <div class="data-value">${formData.age} years</div>
          </div>
          <div class="data-item">
            <div class="data-label">Gender</div>
            <div class="data-value">${formData.gender === 1 ? 'Male' : 'Female'}</div>
          </div>
          <div class="data-item">
            <div class="data-label">BMI</div>
            <div class="data-value">${bmi}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Height</div>
            <div class="data-value">${formData.height} cm</div>
          </div>
          <div class="data-item">
            <div class="data-label">Weight</div>
            <div class="data-value">${formData.weight} kg</div>
          </div>
          <div class="data-item">
            <div class="data-label">Blood Pressure</div>
            <div class="data-value">${formData.ap_hi}/${formData.ap_lo} mmHg</div>
          </div>
          <div class="data-item">
            <div class="data-label">Cholesterol</div>
            <div class="data-value">${['Normal', 'Above Normal', 'High'][formData.cholesterol - 1]}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Glucose</div>
            <div class="data-value">${['Normal', 'Above Normal', 'High'][formData.gluc - 1]}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Lifestyle</div>
            <div class="data-value">${[
        formData.smoke ? 'Smoker' : 'Non-smoker',
        formData.alco ? 'Drinks' : 'No alcohol',
        formData.active ? 'Active' : 'Sedentary'
      ].join(' • ')}</div>
          </div>
        </div>
      </div>
      ` : ''}
      
      <!-- Recommendations -->
      <div class="section">
        <div class="section-title">
          <span class="section-icon">✓</span>
          Personalized Recommendations
        </div>
        <ul class="recommendations-list">
          ${recommendations.map(rec => `
            <li class="recommendation-item">
              <div class="recommendation-icon ${rec.priority.toLowerCase()}">${rec.icon}</div>
              <div class="recommendation-content">
                <div class="recommendation-text">${rec.text}</div>
                <div class="recommendation-priority">Priority: ${rec.priority}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <!-- Doctor Notes Section -->
      <div class="doctor-notes">
        <div class="notes-title">
          <span>📝</span> Notes for Your Healthcare Provider
        </div>
        <div class="notes-lines"></div>
        <div class="notes-lines"></div>
        <div class="notes-lines"></div>
        <div class="notes-lines"></div>
        <div class="notes-lines"></div>
      </div>
      
      <!-- Disclaimer -->
      <div class="disclaimer">
        <div class="disclaimer-title">
          <span>⚠️</span> Important Medical Disclaimer
        </div>
        <div class="disclaimer-text">
          This cardiovascular risk assessment is generated by an AI-powered tool using a Random Forest algorithm 
          with 73.4% accuracy on validation data. This report is for <strong>educational and informational purposes only</strong> 
          and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified 
          healthcare professionals for medical decisions. Individual results may vary based on factors not captured in this assessment.
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="footer-logo">CardioPredict</div>
        <div>AI-Powered Cardiovascular Health Assessment Tool</div>
        <div class="footer-note">
          This document is confidential and intended for personal health tracking purposes.
          <br>Report generated on ${date} at ${time}
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  return htmlContent;
};

export const downloadPDF = (prediction, formData = null) => {
  const htmlContent = generatePDFContent(prediction, formData);
  const reportDate = new Date().toISOString().split('T')[0];
  const reportId = `CPR-${Date.now().toString(36).toUpperCase()}`;

  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=900,height=700');

  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.document.title = `CardioPredict_Report_${reportDate}`;

    // Wait for content and fonts to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  } else {
    // Fallback: create downloadable HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CardioPredict_Report_${reportDate}_${reportId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export default downloadPDF;
