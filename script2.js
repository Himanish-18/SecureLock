document.getElementById('lockerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const site = document.getElementById('site').value;
    const password = document.getElementById('sitePassword').value;

    try {
        const response = await fetch('http://localhost:3000/addPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ site, password }),
        });

        const result = await response.json();
        alert(result.message);
        document.getElementById('lockerForm').reset();  

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the password.');
    }
});
