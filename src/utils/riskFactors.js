/**
 * Risk factor analysis utilities
 * Based on the model's feature importance from training
 */

// Feature importance weights from the trained model (approximate)
const FEATURE_IMPORTANCE = {
    age: 0.261,
    ap_hi: 0.166,
    bmi: 0.160,
    weight: 0.116,
    height: 0.111,
    ap_lo: 0.089,
    cholesterol: 0.041,
    gluc: 0.023,
    gender: 0.015,
    active: 0.009,
    smoke: 0.005,
    alco: 0.004
};

// Risk thresholds and scoring
const RISK_THRESHOLDS = {
    age: { low: 35, medium: 50, high: 65 },
    ap_hi: { low: 120, medium: 140, high: 160 },
    ap_lo: { low: 80, medium: 90, high: 100 },
    bmi: { low: 25, medium: 30, high: 35 },
    cholesterol: { low: 1, medium: 2, high: 3 },
    gluc: { low: 1, medium: 2, high: 3 }
};

// Population averages for comparison
export const POPULATION_AVERAGES = {
    overallRisk: 35, // Average CVD risk percentage
    age: 45,
    bmi: 26.5,
    ap_hi: 125,
    ap_lo: 82,
    cholesterol: 1.5, // Average between normal and above normal
    gluc: 1.3
};

/**
 * Calculate individual risk contribution for each factor
 */
export const calculateRiskFactors = (formData) => {
    const bmi = formData.weight / Math.pow(formData.height / 100, 2);

    const factors = [];

    // Age factor
    const ageScore = calculateFactorScore(formData.age, RISK_THRESHOLDS.age);
    factors.push({
        name: 'Age',
        value: `${formData.age} years`,
        importance: FEATURE_IMPORTANCE.age,
        riskLevel: getRiskLevel(ageScore),
        contribution: Math.round(FEATURE_IMPORTANCE.age * ageScore * 100),
        recommendation: getAgeRecommendation(formData.age),
        icon: 'calendar'
    });

    // Blood Pressure (Systolic)
    const bpScore = calculateFactorScore(formData.ap_hi, RISK_THRESHOLDS.ap_hi);
    factors.push({
        name: 'Blood Pressure',
        value: `${formData.ap_hi}/${formData.ap_lo} mmHg`,
        importance: FEATURE_IMPORTANCE.ap_hi + FEATURE_IMPORTANCE.ap_lo,
        riskLevel: getRiskLevel(bpScore),
        contribution: Math.round((FEATURE_IMPORTANCE.ap_hi + FEATURE_IMPORTANCE.ap_lo) * bpScore * 100),
        recommendation: getBPRecommendation(formData.ap_hi),
        icon: 'heart'
    });

    // BMI
    const bmiScore = calculateFactorScore(bmi, RISK_THRESHOLDS.bmi);
    factors.push({
        name: 'BMI',
        value: bmi.toFixed(1),
        importance: FEATURE_IMPORTANCE.bmi + FEATURE_IMPORTANCE.weight + FEATURE_IMPORTANCE.height,
        riskLevel: getRiskLevel(bmiScore),
        contribution: Math.round((FEATURE_IMPORTANCE.bmi + FEATURE_IMPORTANCE.weight) * bmiScore * 100),
        recommendation: getBMIRecommendation(bmi),
        icon: 'scale'
    });

    // Cholesterol
    const cholScore = calculateFactorScore(formData.cholesterol, RISK_THRESHOLDS.cholesterol);
    factors.push({
        name: 'Cholesterol',
        value: ['Normal', 'Above Normal', 'Well Above Normal'][formData.cholesterol - 1],
        importance: FEATURE_IMPORTANCE.cholesterol,
        riskLevel: getRiskLevel(cholScore),
        contribution: Math.round(FEATURE_IMPORTANCE.cholesterol * cholScore * 100),
        recommendation: getCholesterolRecommendation(formData.cholesterol),
        icon: 'droplet'
    });

    // Glucose
    const glucScore = calculateFactorScore(formData.gluc, RISK_THRESHOLDS.gluc);
    factors.push({
        name: 'Glucose',
        value: ['Normal', 'Above Normal', 'Well Above Normal'][formData.gluc - 1],
        importance: FEATURE_IMPORTANCE.gluc,
        riskLevel: getRiskLevel(glucScore),
        contribution: Math.round(FEATURE_IMPORTANCE.gluc * glucScore * 100),
        recommendation: getGlucoseRecommendation(formData.gluc),
        icon: 'activity'
    });

    // Lifestyle factors
    const lifestyleRisk = (formData.smoke ? 1 : 0) + (formData.alco ? 0.5 : 0) + (formData.active ? 0 : 0.5);
    factors.push({
        name: 'Lifestyle',
        value: getLifestyleSummary(formData),
        importance: FEATURE_IMPORTANCE.smoke + FEATURE_IMPORTANCE.alco + FEATURE_IMPORTANCE.active,
        riskLevel: lifestyleRisk > 1 ? 'high' : lifestyleRisk > 0.5 ? 'medium' : 'low',
        contribution: Math.round((FEATURE_IMPORTANCE.smoke + FEATURE_IMPORTANCE.alco + FEATURE_IMPORTANCE.active) * lifestyleRisk * 50),
        recommendation: getLifestyleRecommendation(formData),
        icon: 'user'
    });

    // Sort by contribution (highest first)
    factors.sort((a, b) => b.contribution - a.contribution);

    return factors;
};

const calculateFactorScore = (value, thresholds) => {
    if (value <= thresholds.low) return 0.2;
    if (value <= thresholds.medium) return 0.5;
    if (value <= thresholds.high) return 0.8;
    return 1.0;
};

const getRiskLevel = (score) => {
    if (score <= 0.3) return 'low';
    if (score <= 0.6) return 'medium';
    return 'high';
};

const getLifestyleSummary = (data) => {
    const items = [];
    if (data.smoke) items.push('Smoker');
    if (data.alco) items.push('Alcohol');
    if (data.active) items.push('Active');
    else items.push('Inactive');
    return items.join(', ');
};

// Factor-specific recommendations
const getAgeRecommendation = (age) => {
    if (age < 40) return 'Continue preventive care and healthy habits';
    if (age < 55) return 'Consider annual cardiovascular screenings';
    return 'Regular monitoring and check-ups are essential';
};

const getBPRecommendation = (systolic) => {
    if (systolic < 120) return 'Blood pressure is in optimal range';
    if (systolic < 130) return 'Monitor regularly, consider lifestyle changes';
    if (systolic < 140) return 'Consult doctor about blood pressure management';
    return 'Medical consultation for hypertension management recommended';
};

const getBMIRecommendation = (bmi) => {
    if (bmi < 18.5) return 'Consider nutritional consultation for healthy weight gain';
    if (bmi < 25) return 'Maintain current healthy weight';
    if (bmi < 30) return 'Modest weight reduction may benefit heart health';
    return 'Weight management program recommended';
};

const getCholesterolRecommendation = (level) => {
    if (level === 1) return 'Maintain heart-healthy diet';
    if (level === 2) return 'Consider dietary modifications and exercise';
    return 'Discuss cholesterol management with your doctor';
};

const getGlucoseRecommendation = (level) => {
    if (level === 1) return 'Blood sugar levels are in healthy range';
    if (level === 2) return 'Monitor blood sugar and reduce simple carbs';
    return 'Consult doctor about diabetes screening';
};

const getLifestyleRecommendation = (data) => {
    if (data.smoke) return 'Quitting smoking significantly reduces heart disease risk';
    if (!data.active) return 'Regular exercise can reduce CVD risk by up to 35%';
    if (data.alco) return 'Limiting alcohol supports heart health';
    return 'Excellent lifestyle choices - keep it up!';
};

/**
 * Compare user's risk to population average
 */
export const getComparisonToAverage = (percentage) => {
    const diff = percentage - POPULATION_AVERAGES.overallRisk;
    const percentDiff = Math.abs(Math.round((diff / POPULATION_AVERAGES.overallRisk) * 100));

    if (diff < -10) {
        return {
            text: `${percentDiff}% below average`,
            status: 'better',
            description: 'Your risk is significantly lower than the population average.'
        };
    } else if (diff < 0) {
        return {
            text: `${percentDiff}% below average`,
            status: 'better',
            description: 'Your risk is below the population average.'
        };
    } else if (diff < 10) {
        return {
            text: `${percentDiff}% above average`,
            status: 'average',
            description: 'Your risk is close to the population average.'
        };
    } else {
        return {
            text: `${percentDiff}% above average`,
            status: 'worse',
            description: 'Your risk is above the population average. Consider lifestyle changes.'
        };
    }
};

export default {
    calculateRiskFactors,
    getComparisonToAverage,
    POPULATION_AVERAGES
};
