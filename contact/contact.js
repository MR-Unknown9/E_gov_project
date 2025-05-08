document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate form submission
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate API call
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }, 1500);
    });
}); 