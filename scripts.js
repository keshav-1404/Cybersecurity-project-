// ================= Password Strength Checker =================
const passwordInput = document.getElementById('password-input');
const strengthMessage = document.getElementById('strength-message');
const strengthBar = document.getElementById('strength-bar');
const passwordForm = document.getElementById('password-form');

passwordInput?.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    if (strength === 0) {
        strengthMessage.textContent = 'Enter a password';
        strengthBar.style.width = '0';
        strengthBar.style.backgroundColor = 'transparent';
    } else if (strength <= 2) {
        strengthMessage.textContent = 'Weak';
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = '#e74c3c';
    } else if (strength === 3) {
        strengthMessage.textContent = 'Medium';
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = '#f1c40f';
    } else if (strength === 4) {
        strengthMessage.textContent = 'Strong';
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#2ecc71';
    }
});

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
}

passwordForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);

    if (strength < 3) {
        alert('Your password is too weak! Please choose a stronger password.');
    } else {
        alert('Your password is strong enough! Proceeding...');
    }
});


// ================= Brute Force Simulator =================
console.log("Script loaded ✅");

const bruteInput = document.getElementById("brute-password");
const bruteBtn = document.getElementById("simulate-btn");
const bruteResult = document.getElementById("brute-result");

console.log("Brute Input:", bruteInput);
console.log("Brute Button:", bruteBtn);
console.log("Brute Result:", bruteResult);


bruteInput?.addEventListener("input", () => {
    bruteBtn.style.display = bruteInput.value.length > 0 && bruteInput.value.length <= 6 ? "inline-block" : "none";
});

bruteBtn?.addEventListener("click", () => {
    bruteResult.innerHTML = "⏳ Running simulation...";

    fetch("http://127.0.0.1:5000/brute-force", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            password: bruteInput.value,
            digits: true,
            symbols: true
        })
    })
    .then(res => res.json())
    .then(data => {
        bruteResult.innerHTML = `<strong>${data.result}</strong><br>⏱️ Time Taken: ${data.time_taken}`;
    })
    .catch(err => {
        bruteResult.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    });
});
