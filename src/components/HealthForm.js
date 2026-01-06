import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { kgToLbs, lbsToKg, cmToFeetInches, feetInchesToCm } from '../utils/unitConversion';
import './HealthForm.css';

const HealthForm = ({ onPrediction, onError, onLoading, loading, onBack, initialData }) => {
  const { register, handleSubmit, formState: { errors }, reset, trigger, getValues, setValue, watch } = useForm({
    mode: 'onChange',
    defaultValues: initialData || {}
  });
  const [apiError, setApiError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [useMetric, setUseMetric] = useState(true);
  const totalSteps = 3;

  // Initialize form with initial data if editing
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  const steps = [
    { id: 1, label: 'Personal', icon: 'user' },
    { id: 2, label: 'Medical', icon: 'heart' },
    { id: 3, label: 'Lifestyle', icon: 'activity' }
  ];

  const stepFields = {
    1: ['age', 'gender', 'height', 'weight'],
    2: ['ap_hi', 'ap_lo', 'cholesterol', 'gluc'],
    3: ['smoke', 'alco', 'active']
  };

  // Watch height and weight for unit conversion
  const watchHeight = watch('height');
  const watchWeight = watch('weight');

  const toggleUnits = () => {
    const currentHeight = getValues('height');
    const currentWeight = getValues('weight');

    if (useMetric) {
      // Converting to imperial
      if (currentHeight) {
        const { feet, inches } = cmToFeetInches(parseFloat(currentHeight));
        setValue('heightFeet', feet);
        setValue('heightInches', inches);
      }
      if (currentWeight) {
        setValue('weightLbs', kgToLbs(parseFloat(currentWeight)));
      }
    } else {
      // Converting to metric
      const feet = getValues('heightFeet') || 0;
      const inches = getValues('heightInches') || 0;
      if (feet || inches) {
        setValue('height', feetInchesToCm(parseInt(feet), parseInt(inches)));
      }
      const lbs = getValues('weightLbs');
      if (lbs) {
        setValue('weight', lbsToKg(parseFloat(lbs)));
      }
    }

    setUseMetric(!useMetric);
  };

  const onSubmit = async (data) => {
    setApiError(null);
    onLoading(true);

    try {
      // Convert imperial to metric if needed
      let height = parseFloat(data.height);
      let weight = parseFloat(data.weight);

      if (!useMetric) {
        height = feetInchesToCm(parseInt(data.heightFeet || 0), parseInt(data.heightInches || 0));
        weight = lbsToKg(parseFloat(data.weightLbs));
      }

      const formattedData = {
        age: parseFloat(data.age),
        gender: parseInt(data.gender),
        height: height,
        weight: weight,
        ap_hi: parseInt(data.ap_hi),
        ap_lo: parseInt(data.ap_lo),
        cholesterol: parseInt(data.cholesterol),
        gluc: parseInt(data.gluc),
        smoke: parseInt(data.smoke),
        alco: parseInt(data.alco),
        active: parseInt(data.active)
      };

      // Use environment variable for API URL in production
      const API_URL = process.env.REACT_APP_API_URL || '';
      const response = await axios.post(`${API_URL}/predict`, formattedData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data.success) {
        onPrediction(response.data.prediction, formattedData);
      } else {
        const errorMsg = response.data.error?.message || 'Prediction failed';
        setApiError(errorMsg);
        onError(errorMsg);
      }
    } catch (error) {
      let errorMessage = 'Unable to connect to the prediction service. ';

      if (error.response) {
        const serverError = error.response.data?.error;
        if (serverError?.details && Array.isArray(serverError.details)) {
          errorMessage = serverError.details.join(', ');
        } else {
          errorMessage = serverError?.message || `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage += 'Please check your internet connection and try again.';
      } else {
        errorMessage += error.message;
      }

      setApiError(errorMessage);
      onError(errorMessage);
    } finally {
      onLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setApiError(null);
    setCurrentStep(1);
  };

  const handleNextStep = async () => {
    const fields = stepFields[currentStep];
    const isValid = await trigger(fields);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      // Focus first input of next step
      setTimeout(() => {
        const nextStepFields = stepFields[currentStep + 1];
        if (nextStepFields && nextStepFields[0]) {
          const input = document.getElementById(nextStepFields[0]);
          if (input) input.focus();
        }
      }, 100);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = async (stepId) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    } else if (stepId > currentStep) {
      for (let i = currentStep; i < stepId; i++) {
        const fields = stepFields[i];
        const isValid = await trigger(fields);
        if (!isValid) return;
      }
      setCurrentStep(stepId);
    }
  };

  const isStepComplete = (stepId) => {
    const fields = stepFields[stepId];
    const values = getValues();
    return fields.every(field => values[field] !== undefined && values[field] !== '');
  };

  const getProgressWidth = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  const getStepIcon = (iconName) => {
    const icons = {
      user: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      heart: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      activity: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  return (
    <div className="health-form-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="health-form"
        aria-label="Health assessment form"
        noValidate
      >
        {/* Form Header */}
        <div className="form-header">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary btn-back"
            disabled={loading}
            aria-label="Go back to home page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Home
          </button>
          <h2 id="form-title">Health Assessment Form</h2>
          <p className="form-subtitle">Please provide accurate information for the most reliable risk assessment</p>
        </div>

        {/* Unit Toggle */}
        <div className="unit-toggle-container">
          <span className="unit-label">Units:</span>
          <div className="unit-toggle-group" role="group" aria-label="Unit system selection">
            <button
              type="button"
              className={`unit-toggle-btn ${useMetric ? 'active' : ''}`}
              onClick={() => useMetric || toggleUnits()}
              aria-pressed={useMetric}
            >
              Metric (cm, kg)
            </button>
            <button
              type="button"
              className={`unit-toggle-btn ${!useMetric ? 'active' : ''}`}
              onClick={() => !useMetric || toggleUnits()}
              aria-pressed={!useMetric}
            >
              Imperial (ft, lbs)
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-container" role="navigation" aria-label="Form progress">
          <div className="progress-steps">
            <div className="progress-line" aria-hidden="true">
              <div
                className="progress-line-fill"
                style={{ width: `${getProgressWidth()}%` }}
              ></div>
            </div>
            {steps.map((step) => (
              <button
                type="button"
                key={step.id}
                className={`progress-step ${currentStep === step.id ? 'active' : ''} ${isStepComplete(step.id) && currentStep > step.id ? 'completed' : ''}`}
                onClick={() => goToStep(step.id)}
                aria-current={currentStep === step.id ? 'step' : undefined}
                aria-label={`Step ${step.id}: ${step.label}${isStepComplete(step.id) ? ' (completed)' : ''}`}
              >
                <div className="step-indicator" aria-hidden="true">
                  <span className="step-number">{getStepIcon(step.icon)}</span>
                </div>
                <span className="step-label">{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="form-error" role="alert" aria-live="assertive">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{apiError}</p>
          </div>
        )}

        {/* Step 1: Personal Information */}
        <fieldset
          className={`form-section ${currentStep !== 1 ? 'hidden' : ''}`}
          aria-hidden={currentStep !== 1}
        >
          <div className="section-header">
            <div className="section-icon personal" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="section-title">
              <legend>Personal Information</legend>
              <p>Tell us about yourself</p>
            </div>
          </div>

          <div className="form-grid">
            <div className={`form-group ${errors.age ? 'has-error' : ''}`}>
              <label htmlFor="age">
                Age <span className="label-required" aria-hidden="true">*</span>
                <span className="tooltip-trigger" tabIndex="0" role="button" aria-describedby="age-tooltip">?</span>
                <span id="age-tooltip" className="tooltip-content" role="tooltip">Your age in years (18-100)</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="age"
                  aria-required="true"
                  aria-invalid={errors.age ? 'true' : 'false'}
                  aria-describedby={errors.age ? 'age-error' : undefined}
                  {...register('age', {
                    required: 'Age is required',
                    min: { value: 18, message: 'Age must be at least 18' },
                    max: { value: 100, message: 'Age must be less than 100' }
                  })}
                  placeholder="Enter your age"
                />
                <span className="input-unit" aria-hidden="true">years</span>
              </div>
              {errors.age && <span id="age-error" className="error" role="alert">{errors.age.message}</span>}
            </div>

            <div className={`form-group ${errors.gender ? 'has-error' : ''}`}>
              <label htmlFor="gender">
                Gender <span className="label-required" aria-hidden="true">*</span>
              </label>
              <select
                id="gender"
                aria-required="true"
                aria-invalid={errors.gender ? 'true' : 'false'}
                {...register('gender', { required: 'Gender is required' })}
                defaultValue=""
              >
                <option value="" disabled>Select your gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
              {errors.gender && <span className="error" role="alert">{errors.gender.message}</span>}
            </div>

            {useMetric ? (
              <>
                <div className={`form-group ${errors.height ? 'has-error' : ''}`}>
                  <label htmlFor="height">
                    Height <span className="label-required" aria-hidden="true">*</span>
                    <span className="tooltip-trigger" tabIndex="0" role="button" aria-describedby="height-tooltip">?</span>
                    <span id="height-tooltip" className="tooltip-content" role="tooltip">Your height in centimeters (120-220)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="height"
                      aria-required="true"
                      aria-invalid={errors.height ? 'true' : 'false'}
                      {...register('height', {
                        required: 'Height is required',
                        min: { value: 120, message: 'Height must be at least 120 cm' },
                        max: { value: 220, message: 'Height must be less than 220 cm' }
                      })}
                      placeholder="Enter your height"
                    />
                    <span className="input-unit" aria-hidden="true">cm</span>
                  </div>
                  {errors.height && <span className="error" role="alert">{errors.height.message}</span>}
                </div>

                <div className={`form-group ${errors.weight ? 'has-error' : ''}`}>
                  <label htmlFor="weight">
                    Weight <span className="label-required" aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="weight"
                      aria-required="true"
                      aria-invalid={errors.weight ? 'true' : 'false'}
                      {...register('weight', {
                        required: 'Weight is required',
                        min: { value: 30, message: 'Weight must be at least 30 kg' },
                        max: { value: 200, message: 'Weight must be less than 200 kg' }
                      })}
                      placeholder="Enter your weight"
                    />
                    <span className="input-unit" aria-hidden="true">kg</span>
                  </div>
                  {errors.weight && <span className="error" role="alert">{errors.weight.message}</span>}
                </div>
              </>
            ) : (
              <>
                <div className="form-group height-imperial">
                  <label>
                    Height <span className="label-required" aria-hidden="true">*</span>
                  </label>
                  <div className="input-group-imperial">
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id="heightFeet"
                        aria-label="Height in feet"
                        {...register('heightFeet', {
                          required: 'Feet is required',
                          min: { value: 3, message: 'Min 3 feet' },
                          max: { value: 7, message: 'Max 7 feet' }
                        })}
                        placeholder="Feet"
                      />
                      <span className="input-unit" aria-hidden="true">ft</span>
                    </div>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id="heightInches"
                        aria-label="Height in inches"
                        {...register('heightInches', {
                          min: { value: 0, message: 'Min 0' },
                          max: { value: 11, message: 'Max 11' }
                        })}
                        placeholder="Inches"
                      />
                      <span className="input-unit" aria-hidden="true">in</span>
                    </div>
                  </div>
                  {(errors.heightFeet || errors.heightInches) && (
                    <span className="error" role="alert">{errors.heightFeet?.message || errors.heightInches?.message}</span>
                  )}
                </div>

                <div className={`form-group ${errors.weightLbs ? 'has-error' : ''}`}>
                  <label htmlFor="weightLbs">
                    Weight <span className="label-required" aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="weightLbs"
                      aria-required="true"
                      {...register('weightLbs', {
                        required: 'Weight is required',
                        min: { value: 66, message: 'Weight must be at least 66 lbs' },
                        max: { value: 441, message: 'Weight must be less than 441 lbs' }
                      })}
                      placeholder="Enter your weight"
                    />
                    <span className="input-unit" aria-hidden="true">lbs</span>
                  </div>
                  {errors.weightLbs && <span className="error" role="alert">{errors.weightLbs.message}</span>}
                </div>
              </>
            )}
          </div>
        </fieldset>

        {/* Step 2: Medical Information */}
        <fieldset
          className={`form-section ${currentStep !== 2 ? 'hidden' : ''}`}
          aria-hidden={currentStep !== 2}
        >
          <div className="section-header">
            <div className="section-icon medical" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div className="section-title">
              <legend>Medical Information</legend>
              <p>Your health vitals and lab results</p>
            </div>
          </div>

          <div className="form-grid">
            <div className={`form-group ${errors.ap_hi ? 'has-error' : ''}`}>
              <label htmlFor="ap_hi">
                Systolic Blood Pressure <span className="label-required" aria-hidden="true">*</span>
                <span className="tooltip-trigger" tabIndex="0" role="button" aria-describedby="bp-tooltip">?</span>
                <span id="bp-tooltip" className="tooltip-content" role="tooltip">The top number in a BP reading (e.g., 120 in 120/80)</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="ap_hi"
                  aria-required="true"
                  aria-invalid={errors.ap_hi ? 'true' : 'false'}
                  {...register('ap_hi', {
                    required: 'Systolic blood pressure is required',
                    min: { value: 80, message: 'Must be at least 80 mmHg' },
                    max: { value: 250, message: 'Must be less than 250 mmHg' }
                  })}
                  placeholder="e.g., 120"
                />
                <span className="input-unit" aria-hidden="true">mmHg</span>
              </div>
              {errors.ap_hi && <span className="error" role="alert">{errors.ap_hi.message}</span>}
            </div>

            <div className={`form-group ${errors.ap_lo ? 'has-error' : ''}`}>
              <label htmlFor="ap_lo">
                Diastolic Blood Pressure <span className="label-required" aria-hidden="true">*</span>
                <span className="tooltip-trigger" tabIndex="0" role="button" aria-describedby="bp-lo-tooltip">?</span>
                <span id="bp-lo-tooltip" className="tooltip-content" role="tooltip">The bottom number in a BP reading (e.g., 80 in 120/80)</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="ap_lo"
                  aria-required="true"
                  aria-invalid={errors.ap_lo ? 'true' : 'false'}
                  {...register('ap_lo', {
                    required: 'Diastolic blood pressure is required',
                    min: { value: 50, message: 'Must be at least 50 mmHg' },
                    max: { value: 150, message: 'Must be less than 150 mmHg' }
                  })}
                  placeholder="e.g., 80"
                />
                <span className="input-unit" aria-hidden="true">mmHg</span>
              </div>
              {errors.ap_lo && <span className="error" role="alert">{errors.ap_lo.message}</span>}
            </div>

            <div className={`form-group ${errors.cholesterol ? 'has-error' : ''}`}>
              <label htmlFor="cholesterol">
                Cholesterol Level <span className="label-required" aria-hidden="true">*</span>
              </label>
              <select
                id="cholesterol"
                aria-required="true"
                aria-invalid={errors.cholesterol ? 'true' : 'false'}
                {...register('cholesterol', { required: 'Cholesterol level is required' })}
                defaultValue=""
              >
                <option value="" disabled>Select cholesterol level</option>
                <option value="1">Normal (below 200 mg/dL)</option>
                <option value="2">Above Normal (200-239 mg/dL)</option>
                <option value="3">Well Above Normal (240+ mg/dL)</option>
              </select>
              {errors.cholesterol && <span className="error" role="alert">{errors.cholesterol.message}</span>}
            </div>

            <div className={`form-group ${errors.gluc ? 'has-error' : ''}`}>
              <label htmlFor="gluc">
                Glucose Level <span className="label-required" aria-hidden="true">*</span>
              </label>
              <select
                id="gluc"
                aria-required="true"
                aria-invalid={errors.gluc ? 'true' : 'false'}
                {...register('gluc', { required: 'Glucose level is required' })}
                defaultValue=""
              >
                <option value="" disabled>Select glucose level</option>
                <option value="1">Normal (below 100 mg/dL)</option>
                <option value="2">Above Normal (100-125 mg/dL)</option>
                <option value="3">Well Above Normal (126+ mg/dL)</option>
              </select>
              {errors.gluc && <span className="error" role="alert">{errors.gluc.message}</span>}
            </div>
          </div>

          <div className="quick-tips" role="note">
            <h5>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Quick Tips
            </h5>
            <ul>
              <li>Normal blood pressure is typically around 120/80 mmHg</li>
              <li>Ideal cholesterol is below 200 mg/dL total</li>
            </ul>
          </div>
        </fieldset>

        {/* Step 3: Lifestyle Information */}
        <fieldset
          className={`form-section ${currentStep !== 3 ? 'hidden' : ''}`}
          aria-hidden={currentStep !== 3}
        >
          <div className="section-header">
            <div className="section-icon lifestyle" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="section-title">
              <legend>Lifestyle Information</legend>
              <p>Your daily habits and activities</p>
            </div>
          </div>

          <div className="form-grid">
            <div className={`form-group ${errors.smoke ? 'has-error' : ''}`}>
              <label htmlFor="smoke">
                Do you smoke? <span className="label-required" aria-hidden="true">*</span>
              </label>
              <select
                id="smoke"
                aria-required="true"
                aria-invalid={errors.smoke ? 'true' : 'false'}
                {...register('smoke', { required: 'Smoking status is required' })}
                defaultValue=""
              >
                <option value="" disabled>Select smoking status</option>
                <option value="0">No, I don't smoke</option>
                <option value="1">Yes, I smoke</option>
              </select>
              {errors.smoke && <span className="error" role="alert">{errors.smoke.message}</span>}
            </div>

            <div className={`form-group ${errors.alco ? 'has-error' : ''}`}>
              <label htmlFor="alco">
                Do you consume alcohol? <span className="label-required" aria-hidden="true">*</span>
              </label>
              <select
                id="alco"
                aria-required="true"
                aria-invalid={errors.alco ? 'true' : 'false'}
                {...register('alco', { required: 'Alcohol consumption status is required' })}
                defaultValue=""
              >
                <option value="" disabled>Select alcohol consumption</option>
                <option value="0">No, I don't drink</option>
                <option value="1">Yes, I drink</option>
              </select>
              {errors.alco && <span className="error" role="alert">{errors.alco.message}</span>}
            </div>

            <div className={`form-group ${errors.active ? 'has-error' : ''}`}>
              <label htmlFor="active">
                Are you physically active? <span className="label-required" aria-hidden="true">*</span>
                <span className="tooltip-trigger" tabIndex="0" role="button" aria-describedby="active-tooltip">?</span>
                <span id="active-tooltip" className="tooltip-content" role="tooltip">Regular exercise or physical activity at least 3x per week</span>
              </label>
              <select
                id="active"
                aria-required="true"
                aria-invalid={errors.active ? 'true' : 'false'}
                {...register('active', { required: 'Physical activity status is required' })}
                defaultValue=""
              >
                <option value="" disabled>Select activity level</option>
                <option value="0">No, I'm not very active</option>
                <option value="1">Yes, I exercise regularly</option>
              </select>
              {errors.active && <span className="error" role="alert">{errors.active.message}</span>}
            </div>
          </div>

          <div className="quick-tips" role="note">
            <h5>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Healthy Habits
            </h5>
            <ul>
              <li>Regular physical activity can reduce heart disease risk by up to 35%</li>
              <li>Quitting smoking significantly improves cardiovascular health within months</li>
            </ul>
          </div>
        </fieldset>

        {/* Form Actions */}
        <div className="form-actions">
          <div className="form-actions-left">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn btn-secondary btn-nav prev"
                disabled={loading}
                aria-label="Go to previous step"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={loading}
              aria-label="Reset the form"
            >
              Reset
            </button>
          </div>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn btn-primary btn-nav next"
              aria-label="Go to next step"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              className={`btn btn-primary btn-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
              aria-label={loading ? 'Analyzing your data' : 'Submit form and analyze risk'}
              aria-busy={loading}
            >
              <span className="btn-text">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Analyze Risk
              </span>
              <span className="btn-loading-content" aria-hidden={!loading}>
                <span className="loading-spinner"></span>
                Analyzing...
              </span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HealthForm;