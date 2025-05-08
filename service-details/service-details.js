document.addEventListener('DOMContentLoaded', function() {
    // Get service type from URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    
    // Update page content based on service type
    updateServiceContent(serviceId);
    
    // Form navigation
    const form = document.getElementById('applicationForm');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Handle next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const currentStepNumber = parseInt(currentStep.dataset.step);
            
            // Validate current step
            if (validateStep(currentStepNumber)) {
                // Move to next step
                currentStep.classList.remove('active');
                steps[currentStepNumber].classList.add('active');
                
                // Update step indicators
                stepIndicators[currentStepNumber - 1].classList.remove('active');
                stepIndicators[currentStepNumber].classList.add('active');
                
                // If moving to review step, update review content
                if (currentStepNumber === 2) {
                    updateReviewContent();
                }
            }
        });
    });
    
    // Handle previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const currentStepNumber = parseInt(currentStep.dataset.step);
            
            // Move to previous step
            currentStep.classList.remove('active');
            steps[currentStepNumber - 2].classList.add('active');
            
            // Update step indicators
            stepIndicators[currentStepNumber - 1].classList.remove('active');
            stepIndicators[currentStepNumber - 2].classList.add('active');
        });
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(3)) {
            submitApplication();
        }
    });
    
    // Validate each step
    function validateStep(stepNumber) {
        const currentStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        const inputs = currentStep.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('error');
                
                // Add error message if not exists
                if (!input.nextElementSibling?.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.style.color = '#e74c3c';
                    errorMessage.style.fontSize = '0.9rem';
                    errorMessage.style.marginTop = '0.5rem';
                    errorMessage.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                const errorMessage = input.nextElementSibling;
                if (errorMessage?.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        });
        
        return isValid;
    }
    
    // Update review content
    function updateReviewContent() {
        const personalInfoReview = document.getElementById('personalInfoReview');
        const documentsReview = document.getElementById('documentsReview');
        
        // Personal Information
        const personalInfo = {
            'First Name': document.getElementById('firstName').value,
            'Last Name': document.getElementById('lastName').value,
            'Email': document.getElementById('email').value,
            'Phone': document.getElementById('phone').value,
            'Address': document.getElementById('address').value
        };
        
        let personalInfoHTML = '<div class="review-grid">';
        for (const [key, value] of Object.entries(personalInfo)) {
            personalInfoHTML += `
                <div class="review-item">
                    <strong>${key}:</strong>
                    <span>${value}</span>
                </div>
            `;
        }
        personalInfoHTML += '</div>';
        personalInfoReview.innerHTML = personalInfoHTML;
        
        // Documents
        const documents = {
            'ID Document': document.getElementById('idDocument').files[0]?.name || 'Not uploaded',
            'Proof of Address': document.getElementById('proofOfAddress').files[0]?.name || 'Not uploaded',
            'Passport Photo': document.getElementById('photo').files[0]?.name || 'Not uploaded'
        };
        
        let documentsHTML = '<div class="review-grid">';
        for (const [key, value] of Object.entries(documents)) {
            documentsHTML += `
                <div class="review-item">
                    <strong>${key}:</strong>
                    <span>${value}</span>
                </div>
            `;
        }
        documentsHTML += '</div>';
        documentsReview.innerHTML = documentsHTML;
    }
    
    // Submit application
    function submitApplication() {
        const submitButton = document.querySelector('.submit-application');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.style.backgroundColor = '#2ecc71';
            successMessage.style.color = 'white';
            successMessage.style.padding = '1rem';
            successMessage.style.borderRadius = '5px';
            successMessage.style.marginBottom = '1rem';
            successMessage.style.textAlign = 'center';
            successMessage.innerHTML = `
                <h3>Application Submitted Successfully!</h3>
                <p>Your application has been received. We will process it and contact you soon.</p>
                <p>Application Reference: ${generateReferenceNumber()}</p>
            `;
            
            form.innerHTML = '';
            form.appendChild(successMessage);
        }, 1500);
    }
    
    // Generate reference number
    function generateReferenceNumber() {
        const prefix = 'APP';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }
    
    // Update service content based on type
    function updateServiceContent(serviceId) {
        const serviceIcon = document.getElementById('serviceIcon');
        const serviceTitle = document.getElementById('serviceTitle');
        
        switch (serviceId) {
            case 'id-card':
                serviceIcon.className = 'fas fa-id-card';
                serviceTitle.textContent = 'Government ID Card Application';
                break;
            case 'passport':
                serviceIcon.className = 'fas fa-passport';
                serviceTitle.textContent = 'Passport Application';
                break;
            case 'license':
                serviceIcon.className = 'fas fa-car';
                serviceTitle.textContent = 'Driver\'s License Application';
                break;
            default:
                window.location.href = 'services.html';
        }
    }
}); 