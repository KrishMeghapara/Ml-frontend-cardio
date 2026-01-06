/**
 * Unit conversion utilities for health measurements
 */

// Height conversions
export const cmToFeetInches = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
};

export const feetInchesToCm = (feet, inches) => {
    const totalInches = (feet * 12) + inches;
    return Math.round(totalInches * 2.54);
};

// Weight conversions
export const kgToLbs = (kg) => {
    return Math.round(kg * 2.20462 * 10) / 10;
};

export const lbsToKg = (lbs) => {
    return Math.round(lbs / 2.20462 * 10) / 10;
};

// Format display values
export const formatHeight = (cm, isMetric) => {
    if (isMetric) {
        return `${cm} cm`;
    }
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet}'${inches}"`;
};

export const formatWeight = (kg, isMetric) => {
    if (isMetric) {
        return `${kg} kg`;
    }
    return `${kgToLbs(kg)} lbs`;
};

// Validation ranges for both systems
export const getHeightRange = (isMetric) => {
    if (isMetric) {
        return { min: 120, max: 220, unit: 'cm' };
    }
    return { min: 47, max: 87, unit: 'inches' }; // Total inches
};

export const getWeightRange = (isMetric) => {
    if (isMetric) {
        return { min: 30, max: 200, unit: 'kg' };
    }
    return { min: 66, max: 441, unit: 'lbs' };
};

export default {
    cmToFeetInches,
    feetInchesToCm,
    kgToLbs,
    lbsToKg,
    formatHeight,
    formatWeight,
    getHeightRange,
    getWeightRange
};
