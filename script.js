const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const signupSubmitBtn = document.getElementById('signupSubmitBtn');
const welcomeMessage = document.getElementById('welcomeMessage');
const authButtons = document.getElementById('authButtons');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const restrictedLinks = document.querySelectorAll('.restricted');

let isLoggedIn = false;

// Open Sign In modal
loginBtn.onclick = () => {
    loginModal.style.display = 'flex';
};

// Open Sign Up modal
signupBtn.onclick = () => {
    signupModal.style.display = 'flex';
};

// Close Sign In modal
closeLoginModal.onclick = () => {
    loginModal.style.display = 'none';
};

// Close Sign Up modal
closeSignupModal.onclick = () => {
    signupModal.style.display = 'none';
};

// Handle Sign In
loginSubmitBtn.onclick = async () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (username && password) {
        try {
            const response = await fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.status === 200) {
                isLoggedIn = true;
                showWelcomeMessage(username);
                closeModals();
                enableRestrictedLinks();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert("Please fill in all fields.");
    }
};

// Handle Sign Up
signupSubmitBtn.onclick = async () => {
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (username && email && password) {
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.status === 200) {
                isLoggedIn = true;
                showWelcomeMessage(username);
                closeModals();
                enableRestrictedLinks();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert("Please fill in all fields.");
    }
};


// Close both modals
function closeModals() {
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
}

// Show welcome message
function showWelcomeMessage(username) {
    welcomeMessage.style.display = 'block';
    welcomeMessage.textContent = `Welcome, ${username}!`;
    authButtons.style.display = 'none';
}

// Enable restricted links
function enableRestrictedLinks() {
    restrictedLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
    });
}
