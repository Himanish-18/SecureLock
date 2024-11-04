const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const passwordOutput = document.getElementById('passwordOutput');

generateBtn.onclick = generatePassword;
copyBtn.onclick = copyPassword;

function generatePassword() {
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSpecialChars = document.getElementById('specialChars').checked;
    const length = parseInt(document.getElementById('length').value) || 12;

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecialChars) charset += '!@#_';

    if (!charset) {
        alert('Please select at least one option to generate a password.');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    passwordOutput.value = password;
}

function copyPassword() {
    if (passwordOutput.value) {
        passwordOutput.select();
        document.execCommand('copy');
        alert('Password copied to clipboard!');
    } else {
        alert('Please generate a password first.');
    }
}
