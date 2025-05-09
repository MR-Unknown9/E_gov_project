document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('taxForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const submitBtn = document.querySelector('.submit-btn');
    let currentStep = 1;

    // Format currency input
    const currencyInputs = document.querySelectorAll('input[type="number"]');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            if (value) {
                value = parseFloat(value).toFixed(2);
                e.target.value = value;
            }
        });
    });

    // Format SSN input
    const ssnInput = document.getElementById('ssn');
    ssnInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 5) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5, 9);
            }
        }
        e.target.value = value;
    });

    // Add SSN validation on blur
    ssnInput.addEventListener('blur', function(e) {
        const value = e.target.value;
        const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
        if (value && !ssnPattern.test(value)) {
            showError(ssnInput, 'Please enter a valid SSN (XXX-XX-XXXX)');
        } else {
            clearError(ssnInput);
        }
    });

    // Add SSN validation on paste
    ssnInput.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const cleanedValue = pastedText.replace(/\D/g, '');
        if (cleanedValue.length > 0) {
            let formattedValue = '';
            if (cleanedValue.length <= 3) {
                formattedValue = cleanedValue;
            } else if (cleanedValue.length <= 5) {
                formattedValue = cleanedValue.slice(0, 3) + '-' + cleanedValue.slice(3);
            } else {
                formattedValue = cleanedValue.slice(0, 3) + '-' + cleanedValue.slice(3, 5) + '-' + cleanedValue.slice(5, 9);
            }
            e.target.value = formattedValue;
        }
    });

    // Navigation functions
    function showStep(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
            if (step.dataset.step == stepNumber) {
                step.classList.add('active');
            }
        });

        progressSteps.forEach(step => {
            step.classList.remove('active', 'completed');
            if (step.dataset.step < stepNumber) {
                step.classList.add('completed');
            } else if (step.dataset.step == stepNumber) {
                step.classList.add('active');
            }
        });

        // Update buttons
        prevBtn.style.display = stepNumber > 1 ? 'flex' : 'none';
        nextBtn.style.display = stepNumber < steps.length ? 'flex' : 'none';
        submitBtn.style.display = stepNumber === steps.length ? 'flex' : 'none';
    }

    // Next button click handler
    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
            if (currentStep === steps.length) {
                updateReviewSection();
            }
        }
    });

    // Previous button click handler
    prevBtn.addEventListener('click', function() {
        currentStep--;
        showStep(currentStep);
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Simulate form submission
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show success message
                const taxContainer = document.querySelector('.tax-container');
                taxContainer.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h2>Tax Return Submitted Successfully!</h2>
                        <p>Your tax return has been submitted and is being processed.</p>
                        <p>You will receive a confirmation email shortly.</p>
                        <a href="index.html" class="home-btn">Return to Home</a>
                    </div>
                `;
            }, 2000);
        }
    });

    // Validation function
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            } else {
                clearError(input);
            }

            // Additional validation for specific fields
            if (input.id === 'ssn' && input.value) {
                const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
                if (!ssnPattern.test(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid SSN (XXX-XX-XXXX)');
                }
            }

            if (input.type === 'number' && input.value) {
                const value = parseFloat(input.value);
                if (value < 0) {
                    isValid = false;
                    showError(input, 'Please enter a positive number');
                }
            }
        });

        return isValid;
    }

    // Error handling functions
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorDiv);
        }
        
        input.classList.add('error');
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
    }

    // Update review section
    function updateReviewSection() {
        const reviewPersonal = document.getElementById('reviewPersonal');
        const reviewIncome = document.getElementById('reviewIncome');
        const reviewDeductions = document.getElementById('reviewDeductions');

        // Personal Information
        const personalInfo = {
            'Full Name': document.getElementById('fullName').value,
            'SSN': document.getElementById('ssn').value,
            'Date of Birth': document.getElementById('dob').value,
            'Filing Status': document.getElementById('filingStatus').value
        };

        // Income Details
        const incomeInfo = {
            'W-2 Income': formatCurrency(document.getElementById('w2Income').value),
            'Self-Employment Income': formatCurrency(document.getElementById('selfEmployed').value),
            'Interest Income': formatCurrency(document.getElementById('interestIncome').value),
            'Dividend Income': formatCurrency(document.getElementById('dividendIncome').value)
        };

        // Deductions
        const deductionsInfo = {
            'Mortgage Interest': formatCurrency(document.getElementById('mortgageInterest').value),
            'Charitable Donations': formatCurrency(document.getElementById('charitableDonations').value),
            'Medical Expenses': formatCurrency(document.getElementById('medicalExpenses').value),
            'Education Expenses': formatCurrency(document.getElementById('educationExpenses').value)
        };

        // Update review sections
        reviewPersonal.innerHTML = createReviewHTML(personalInfo);
        reviewIncome.innerHTML = createReviewHTML(incomeInfo);
        reviewDeductions.innerHTML = createReviewHTML(deductionsInfo);
    }

    // Helper function to create review HTML
    function createReviewHTML(data) {
        return Object.entries(data)
            .map(([label, value]) => `
                <div class="review-item">
                    <span class="review-label">${label}</span>
                    <span class="review-value">${value || 'N/A'}</span>
                </div>
            `)
            .join('');
    }

    // Helper function to format currency
    function formatCurrency(value) {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }

    // Initialize the form
    showStep(1);
}); 