document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.querySelector('.toggle-password');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Email validation
    emailInput.addEventListener('input', function() {
        validateEmail();
    });

    emailInput.addEventListener('blur', function() {
        validateEmail();
    });

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '') {
            showError(emailError, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailError, 'Please enter a valid email address');
            return false;
        } else {
            clearError(emailError);
            return true;
        }
    }

    // Password validation
    passwordInput.addEventListener('input', function() {
        validatePassword();
    });

    passwordInput.addEventListener('blur', function() {
        validatePassword();
    });

    function validatePassword() {
        const password = passwordInput.value.trim();

        if (password === '') {
            showError(passwordError, 'Password is required');
            return false;
        } else if (password.length < 8) {
            showError(passwordError, 'Password must be at least 8 characters long');
            return false;
        } else {
            clearError(passwordError);
            return true;
        }
    }

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            const loginButton = loginForm.querySelector('.login-button');
            loginButton.classList.add('loading');
            loginButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Here you would typically make an API call to your backend
                console.log('Login attempt with:', {
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    remember: document.getElementById('remember').checked
                });

                // For demo purposes, we'll just show a success message
                alert('Login successful!');
                
                // Reset form
                loginForm.reset();
                loginButton.classList.remove('loading');
                loginButton.disabled = false;
            }, 1500);
        }
    });

    // Helper functions
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function clearError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    // Remember me functionality
    const rememberCheckbox = document.getElementById('remember');
    
    // Check if there's a saved email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }

    // Save email when checkbox is checked
    rememberCheckbox.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem('rememberedEmail', emailInput.value.trim());
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    });
}); 