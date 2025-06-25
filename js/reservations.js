// Simple Reservation Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('reservationForm');
  var successMessage = document.getElementById('successMessage');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous error messages
    clearErrors();
    
    // Get form values
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var date = document.getElementById('date').value.trim();
    var time = document.getElementById('time').value.trim();
    
    var isValid = true;
    
    // Validate name
    if (name === '') {
      showError('nameError', 'Name is required');
      document.getElementById('name').classList.add('error');
      isValid = false;
    }
    
    // Validate email
    if (email === '') {
      showError('emailError', 'Email is required');
      document.getElementById('email').classList.add('error');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError('emailError', 'Please enter a valid email address');
      document.getElementById('email').classList.add('error');
      isValid = false;
    }
    
    // Validate phone
    if (phone === '') {
      showError('phoneError', 'Phone number is required');
      document.getElementById('phone').classList.add('error');
      isValid = false;
    } else if (!isValidPhone(phone)) {
      showError('phoneError', 'Phone number must be at least 10 digits');
      document.getElementById('phone').classList.add('error');
      isValid = false;
    }
    
    // Validate date
    if (date === '') {
      showError('dateError', 'Date is required');
      document.getElementById('date').classList.add('error');
      isValid = false;
    } else if (!isValidDate(date)) {
      showError('dateError', 'Date must be in YYYY-MM-DD format');
      document.getElementById('date').classList.add('error');
      isValid = false;
    }
    
    // Validate time
    if (time === '') {
      showError('timeError', 'Time is required');
      document.getElementById('time').classList.add('error');
      isValid = false;
    } else if (!isValidTime(time)) {
      showError('timeError', 'Time must be in HH:MM format (24-hour)');
      document.getElementById('time').classList.add('error');
      isValid = false;
    }
    
    // If all validations pass
    if (isValid) {
      // Hide form and show success message
      form.style.display = 'none';
      successMessage.style.display = 'block';
      
      // You can add code here to send data to server
      console.log('Reservation submitted:', {
        name: name,
        email: email,
        phone: phone,
        date: date,
        time: time
      });
    }
  });
  
  // Clear error messages and styles
  function clearErrors() {
    var errorMessages = document.querySelectorAll('.error-message');
    var inputs = document.querySelectorAll('input');
    
    for (var i = 0; i < errorMessages.length; i++) {
      errorMessages[i].textContent = '';
    }
    
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].classList.remove('error');
    }
  }
  
  // Show error message
  function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
  }
  
  // Email validation
  function isValidEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  // Phone validation (only digits, at least 10 characters)
  function isValidPhone(phone) {
    var phonePattern = /^\d{10,}$/;
    return phonePattern.test(phone);
  }
  
  // Date validation (YYYY-MM-DD format)
  function isValidDate(date) {
    var datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      return false;
    }
    
    // Check if it's a valid date
    var parts = date.split('-');
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var day = parseInt(parts[2]);
    
    if (month < 1 || month > 12) {
      return false;
    }
    
    if (day < 1 || day > 31) {
      return false;
    }
    
    // Check for valid date using Date object
    var dateObj = new Date(year, month - 1, day);
    return dateObj.getFullYear() === year && 
           dateObj.getMonth() === month - 1 && 
           dateObj.getDate() === day;
  }
  
  // Time validation (HH:MM format in 24-hour)
  function isValidTime(time) {
    var timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timePattern.test(time);
  }
});