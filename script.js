document.getElementById('interest-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    var form = e.target;
    var data = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: data,
        mode: 'no-cors' // Important for Google Apps Script
    }).then(response => {
        form.style.display = 'none'; // Hide the form
        document.getElementById('form-success-message').style.display = 'block'; // Show success message
    }).catch(error => {
        console.error('Error!', error.message);
        // You could show an error message here
    });
});