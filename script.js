document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send a POST request to the backend
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Save the JWT token in localStorage
            localStorage.setItem('token', data.token);

            // Redirect to the home page
            window.location.href = '/home.html';
        } else {
            // Show an error message
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
});
