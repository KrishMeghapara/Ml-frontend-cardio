import React, { useState, useEffect, useRef } from 'react';
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
  // eslint-disable-next-line no-unused-vars
  const [isVisible, setIsVisible] = useState({});
  const formRef = useRef(null);
  const totalSteps = 3;

  // Initialize form with initial data if editing
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [currentStep]);

  const steps = [
    { id: 1, label: 'Personal', icon: 'user', description: 'Basic information' },
    { id: 2, label: 'Medical', icon: 'heart', description: 'Health vitals' },
    { id: 3, label: 'Lifestyle', icon: 'activity', description: 'Daily habits' }
  ];

  const stepFields = {
    1: ['age', 'gender', 'height', 'weight'],
    2: ['ap_hi', 'ap_lo', 'cholesterol', 'gluc'],
    3: ['smoke', 'alco', 'active']
  };

  // Watch height and weight for unit conversion (used for reactive updates)
  // eslint-disable-next-line no-unused-vars
  const watchHeight = watch('height');
  // eslint-disable-next-line no-unused-vars
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
      let errorMessage = '';
      let isServerWakingUp = false;

      if (error.response) {
        // Server responded with an error
        const serverError = error.response.data?.error;
        if (serverError?.details && Array.isArray(serverError.details)) {
          errorMessage = serverError.details.join(', ');
        } else {
          errorMessage = serverError?.message || `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // No response received - likely server is sleeping (Render free tier)
        isServerWakingUp = true;
        errorMessage = `⏳ Server is waking up!\n\nOur backend is hosted on Render's free tier, which puts the server to sleep after periods of inactivity.\n\n🔄 What to do:\n• Please wait 30-60 seconds and try again\n• The first request wakes up the server\n• Subsequent requests will be much faster\n\nThank you for your patience!`;
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        isServerWakingUp = true;
        errorMessage = `⏳ Request timed out - Server is starting up!\n\nOur backend is hosted on Render's free tier and may take a moment to start.\n\n🔄 Please try again in 30-60 seconds.\n\nThe server needs to wake up from sleep mode. Thank you for your patience!`;
      } else {
        errorMessage = `Connection error: ${error.message}`;
      }

      setApiError({ message: errorMessage, isServerWakingUp });
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

  const getIcon = (name, size = 20) => {
    const icons = {
      back: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      ),
      forward: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      ),
      search: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
      info: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      alert: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      heartPulse: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      )
    };
    return icons[name] || null;
  };

  // ECG Line Component for form header
  const ECGLine = () => (
    <div className="form-ecg-container" aria-hidden="true">
      <svg className="form-ecg-line" viewBox="0 0 400 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="formEcgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--primary-400)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="form-ecg-path"
          d="M0,30 L80,30 L100,30 L110,10 L120,50 L130,20 L140,40 L150,30 L200,30 L220,30 L230,8 L240,52 L250,30 L280,30 L300,30 L320,30 L330,12 L340,48 L350,22 L360,38 L370,30 L400,30"
          fill="none"
          stroke="url(#formEcgGradient)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );

  return (
    <div className="health-form-container-v2" ref={formRef}>
      {/* Background decorations */}
      <div className="form-bg-decoration" aria-hidden="true">
        <div className="form-orb form-orb-1"></div>
        <div className="form-orb form-orb-2"></div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="health-form-v2"
        aria-label="Health assessment form"
        noValidate
      >
        {/* Form Header */}
        <div className="form-header-v2">
          <button
            type="button"
            onClick={onBack}
            className="btn-back-v2"
            disabled={loading}
            aria-label="Go back to home page"
          >
            {getIcon('back', 18)}
            <span>Back</span>
          </button>

          <div className="form-title-section">
            <div className="form-badge">
              <span className="badge-dot"></span>
              <span>Step {currentStep} of {totalSteps}</span>
            </div>
            <h2 id="form-title">Health Assessment</h2>
            <p className="form-subtitle">Provide accurate information for reliable risk assessment</p>
          </div>

          <ECGLine />
        </div>

        {/* Unit Toggle */}
        <div className="unit-toggle-container-v2">
          <div className="unit-toggle-wrapper">
            <span className="unit-label">Measurement System</span>
            <div className="unit-toggle-group-v2" role="group" aria-label="Unit system selection">
              <button
                type="button"
                className={`unit-toggle-btn-v2 ${useMetric ? 'active' : ''}`}
                onClick={() => useMetric || toggleUnits()}
                aria-pressed={useMetric}
              >
                <span className="toggle-icon">📏</span>
                Metric
              </button>
              <button
                type="button"
                className={`unit-toggle-btn-v2 ${!useMetric ? 'active' : ''}`}
                onClick={() => !useMetric || toggleUnits()}
                aria-pressed={!useMetric}
              >
                <span className="toggle-icon">📐</span>
                Imperial
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-container-v2" role="navigation" aria-label="Form progress">
          <div className="progress-steps-v2">
            <div className="progress-line-v2" aria-hidden="true">
              <div
                className="progress-line-fill-v2"
                style={{ width: `${getProgressWidth()}%` }}
              ></div>
            </div>
            {steps.map((step) => (
              <button
                type="button"
                key={step.id}
                className={`progress-step-v2 ${currentStep === step.id ? 'active' : ''} ${isStepComplete(step.id) && currentStep > step.id ? 'completed' : ''}`}
                onClick={() => goToStep(step.id)}
                aria-current={currentStep === step.id ? 'step' : undefined}
                aria-label={`Step ${step.id}: ${step.label}${isStepComplete(step.id) ? ' (completed)' : ''}`}
              >
                <div className="step-indicator-v2" aria-hidden="true">
                  <span className="step-icon">
                    {isStepComplete(step.id) && currentStep > step.id
                      ? getIcon('check', 18)
                      : getStepIcon(step.icon)
                    }
                  </span>
                </div>
                <div className="step-info">
                  <span className="step-label-v2">{step.label}</span>
                  <span className="step-description">{step.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API Error */}
        {/* API Error */}
        {apiError && (
          <div className={`form-error-v2 ${apiError.isServerWakingUp ? 'waking-up' : ''}`} role="alert" aria-live="assertive">
            <div className="error-icon">{getIcon(apiError.isServerWakingUp ? 'refresh' : 'alert', 22)}</div>
            <div className="error-content">
              <h4>{apiError.isServerWakingUp ? 'Server Waking Up' : 'Assessment Error'}</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{apiError.message || apiError}</p>
            </div>
          </div>
        )}

        {/* Step 1: Personal Information */}
        <fieldset
          className={`form-section-v2 ${currentStep !== 1 ? 'hidden' : ''} animate-section`}
          aria-hidden={currentStep !== 1}
          id="step-1"
        >
          <div className="section-header-v2">
            <div className="section-icon-v2 personal" aria-hidden="true">
              {getStepIcon('user')}
            </div>
            <div className="section-title-v2">
              <legend>Personal Information</legend>
              <p>Tell us about yourself</p>
            </div>
          </div>

          <div className="form-grid-v2">
            <div className={`form-group-v2 ${errors.age ? 'has-error' : ''}`}>
              <label htmlFor="age">
                <span className="label-text">Age</span>
                <span className="label-required" aria-hidden="true">*</span>
              </label>
              <div className="input-wrapper-v2">
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
                <span className="input-unit-v2" aria-hidden="true">years</span>
                <div className="input-focus-ring"></div>
              </div>
              {errors.age && <span id="age-error" className="error-v2" role="alert">{errors.age.message}</span>}
            </div>

            <div className={`form-group-v2 ${errors.gender ? 'has-error' : ''}`}>
              <label htmlFor="gender">
                <span className="label-text">Gender</span>
                <span className="label-required" aria-hidden="true">*</span>
              </label>
              <div className="select-wrapper-v2">
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
                <div className="select-arrow"></div>
              </div>
              {errors.gender && <span className="error-v2" role="alert">{errors.gender.message}</span>}
            </div>

            {useMetric ? (
              <>
                <div className={`form-group-v2 ${errors.height ? 'has-error' : ''}`}>
                  <label htmlFor="height">
                    <span className="label-text">Height</span>
                    <span className="label-required" aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrapper-v2">
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
                    <span className="input-unit-v2" aria-hidden="true">cm</span>
                    <div className="input-focus-ring"></div>
                  </div>
                  {errors.height && <span className="error-v2" role="alert">{errors.height.message}</span>}
                </div>

                <div className={`form-group-v2 ${errors.weight ? 'has-error' : ''}`}>
                  <label htmlFor="weight">
                    <span className="label-text">Weight</span>
                    <span className="label-required" aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrapper-v2">
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
                    <span className="input-unit-v2" aria-hidden="true">kg</span>
                    <div className="input-focus-ring"></div>
                  </div>
                  {errors.weight && <span className="error-v2" role="alert">{errors.weight.message}</span>}
                </div>
              </>
            ) : (
              <>
                <div className="form-group-v2 height-imperial">
                  <label>
                    <span className="label-text">Height</span>
                    <span className="label-required" aria-hidden="true">*</span>
                  </label>
                  <div className="input-group-imperial-v2">
                    <div className="input-wrapper-v2">
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
                      <span className="input-unit-v2" aria-hidden="true">ft</span>
                      <div className="input-focus-ring"></div>
                    </div>
                    <div className="input-wrapper-v2">
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
                      <span className="input-unit-v2" aria-hidden="true">in</span>
                      <div className="input-focus-ring"></div>
                    </div>
                  </div>
                  {(errors.heightFeet || errors.heightInches) && (
                    <span className="error-v2" role="alert">{errors.heightFeet?.message || errors.heightInches?.message}</span>
                  )}
                </div>

                <div className={`form-group-v2 ${errors.weightLbs ? 'has-error' : ''}`}>
                  <label htmlFor="weightLbs">
                    <span className="label-text">Weight</span>
                    <span className="label-required" aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrapper-v2">
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
                    <span className="input-unit-v2" aria-hidden="true">lbs</span>
                    <div className="input-focus-ring"></div>
                  </div>
                  {errors.weightLbs && <span className="error-v2" role="alert">{errors.weightLbs.message}</span>}
                </div>
              </>
            )}
          </div>
        </fieldset>

        {/* Step 2: Medical Information */}
        <fieldset
          className={`form-section-v2 ${currentStep !== 2 ? 'hidden' : ''} animate-section`}
          aria-hidden={currentStep !== 2}
          id="step-2"
        >
          <div className="section-header-v2">
            <div className="section-icon-v2 medical" aria-hidden="true">
              {getStepIcon('heart')}
            </div>
            <div className="section-title-v2">
              <legend>Medical Information</legend>
              <p>Your health vitals and lab results</p>
            </div>
          </div>

          <div className="form-grid-v2">
            <div className={`form-group-v2 ${errors.ap_hi ? 'has-error' : ''}`}>
              <label htmlFor="ap_hi">
                <span className="label-text">Systolic Blood Pressure</span>
                <span className="label-required" aria-hidden="true">*</span>
                <span className="label-hint">(Top number)</span>
              </label>
              <div className="input-wrapper-v2">
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
                <span className="input-unit-v2" aria-hidden="true">mmHg</span>
                <div className="input-focus-ring"></div>
              </div>
              {errors.ap_hi && <span className="error-v2" role="alert">{errors.ap_hi.message}</span>}
            </div>

            <div className={`form-group-v2 ${errors.ap_lo ? 'has-error' : ''}`}>
              <label htmlFor="ap_lo">
                <span className="label-text">Diastolic Blood Pressure</span>
                <span className="label-required" aria-hidden="true">*</span>
                <span className="label-hint">(Bottom number)</span>
              </label>
              <div className="input-wrapper-v2">
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
                <span className="input-unit-v2" aria-hidden="true">mmHg</span>
                <div className="input-focus-ring"></div>
              </div>
              {errors.ap_lo && <span className="error-v2" role="alert">{errors.ap_lo.message}</span>}
            </div>

            <div className={`form-group-v2 ${errors.cholesterol ? 'has-error' : ''}`}>
              <label htmlFor="cholesterol">
                <span className="label-text">Cholesterol Level</span>
                <span className="label-required" aria-hidden="true">*</span>
              </label>
              <div className="select-wrapper-v2">
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
                <div className="select-arrow"></div>
              </div>
              {errors.cholesterol && <span className="error-v2" role="alert">{errors.cholesterol.message}</span>}
            </div>

            <div className={`form-group-v2 ${errors.gluc ? 'has-error' : ''}`}>
              <label htmlFor="gluc">
                <span className="label-text">Glucose Level</span>
                <span className="label-required" aria-hidden="true">*</span>
              </label>
              <div className="select-wrapper-v2">
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
                <div className="select-arrow"></div>
              </div>
              {errors.gluc && <span className="error-v2" role="alert">{errors.gluc.message}</span>}
            </div>
          </div>

          <div className="info-card-v2" role="note">
            <div className="info-icon">{getIcon('info', 20)}</div>
            <div className="info-content">
              <h5>Reference Values</h5>
              <ul>
                <li><strong>Normal BP:</strong> Around 120/80 mmHg</li>
                <li><strong>Ideal Cholesterol:</strong> Below 200 mg/dL</li>
              </ul>
            </div>
          </div>
        </fieldset>

        {/* Step 3: Lifestyle Information */}
        <fieldset
          className={`form-section-v2 ${currentStep !== 3 ? 'hidden' : ''} animate-section`}
          aria-hidden={currentStep !== 3}
          id="step-3"
        >
          <div className="section-header-v2">
            <div className="section-icon-v2 lifestyle" aria-hidden="true">
              {getStepIcon('activity')}
            </div>
            <div className="section-title-v2">
              <legend>Lifestyle Information</legend>
              <p>Your daily habits and activities</p>
            </div>
          </div>

          <div className="form-grid-v2 lifestyle-grid">
            <div className={`form-group-v2 lifestyle-card ${errors.smoke ? 'has-error' : ''}`}>
              <div className="lifestyle-icon smoke">🚬</div>
              <label htmlFor="smoke">
                <span className="label-text">Do you smoke?</span>
                <span className="label-required" aria-hidden="true">*</span>
              </label>
              <div className="select-wrapper-v2">
                <select
                  id="smoke"
                  aria-required="true"
                  aria-invalid={errors.smoke ? 'true' : 'false'}
                  {...register('smoke', { required: 'Smoking status is required' })}
                  defaultValue=""
                >
                  <option value="" disabled>Select status</option>
                  <option value="0">No, I don't smoke</option>
                  <option value="1">Yes, I smoke</option>
                </select>
                <div className="select-arrow"></div>
              </div>
              {errors.smoke && <span className="error-v2" role="alert">{errors.smoke.message}</span>}
            </div>

            <div className={`form-group-v2 lifestyle-card ${errors.alco ? 'has-error' : ''}`}>
              <div className="lifestyle-icon alcohol">🍷</div>
              <label htmlFor="alco">
                <span className="label-text">Do you drink alcohol?</span>
                <span className="label-required" aria-hidden="true">*</span>
              </label>
              <div className="select-wrapper-v2">
                <select
                  id="alco"
                  aria-required="true"
                  aria-invalid={errors.alco ? 'true' : 'false'}
                  {...register('alco', { required: 'Alcohol consumption status is required' })}
                  defaultValue=""
                >
                  <option value="" disabled>Select status</option>
                  <option value="0">No, I don't drink</option>
                  <option value="1">Yes, I drink</option>
                </select>
                <div className="select-arrow"></div>
              </div>
              {errors.alco && <span className="error-v2" role="alert">{errors.alco.message}</span>}
            </div>

            <div className={`form-group-v2 lifestyle-card ${errors.active ? 'has-error' : ''}`}>
              <div className="lifestyle-icon active">🏃</div>
              <label htmlFor="active">
                <span className="label-text">Are you physically active?</span>
                <span className="label-required" aria-hidden="true">*</span>
              </label>
              <div className="select-wrapper-v2">
                <select
                  id="active"
                  aria-required="true"
                  aria-invalid={errors.active ? 'true' : 'false'}
                  {...register('active', { required: 'Physical activity status is required' })}
                  defaultValue=""
                >
                  <option value="" disabled>Select status</option>
                  <option value="0">No, not very active</option>
                  <option value="1">Yes, I exercise regularly</option>
                </select>
                <div className="select-arrow"></div>
              </div>
              {errors.active && <span className="error-v2" role="alert">{errors.active.message}</span>}
            </div>
          </div>

          <div className="info-card-v2 success" role="note">
            <div className="info-icon">{getIcon('heartPulse', 20)}</div>
            <div className="info-content">
              <h5>Healthy Lifestyle Benefits</h5>
              <ul>
                <li>Regular exercise reduces heart disease risk by <strong>up to 35%</strong></li>
                <li>Quitting smoking improves cardiovascular health within months</li>
              </ul>
            </div>
          </div>
        </fieldset>

        {/* Form Actions */}
        <div className="form-actions-v2">
          <div className="actions-left">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn-nav-v2 prev"
                disabled={loading}
                aria-label="Go to previous step"
              >
                {getIcon('back', 18)}
                <span>Previous</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="btn-reset-v2"
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
              className="btn-next-v2"
              aria-label="Go to next step"
            >
              <span>Continue</span>
              {getIcon('forward', 18)}
            </button>
          ) : (
            <button
              type="submit"
              className={`btn-submit-v2 ${loading ? 'loading' : ''}`}
              disabled={loading}
              aria-label={loading ? 'Analyzing your data' : 'Submit form and analyze risk'}
              aria-busy={loading}
            >
              <span className="btn-text-v2">
                {getIcon('search', 20)}
                <span>Analyze Risk</span>
              </span>
              <span className="btn-loading-v2" aria-hidden={!loading}>
                <span className="loading-spinner-v2"></span>
                <span>Analyzing...</span>
              </span>
              <span className="btn-shimmer-v2"></span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HealthForm;