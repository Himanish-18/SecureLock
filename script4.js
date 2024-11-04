document.addEventListener("DOMContentLoaded", fetchPasswordHistory);

async function fetchPasswordHistory() {
    try {
        const response = await fetch("http://localhost:3000/password-history", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            populatePasswordHistoryTable(data);
        } else {
            console.error("Failed to fetch password history");
        }
    } catch (error) {
        console.error("Error fetching password history:", error);
    }
}

function populatePasswordHistoryTable(data) {
    const tableBody = document.getElementById("passwordHistoryBody");

    data.forEach((entry, index) => {
        const row = document.createElement("tr");

        // Site cell
        const siteCell = document.createElement("td");
        siteCell.textContent = entry.site;
        
        // Password cell (dotted by default)
        const passwordCell = document.createElement("td");
        passwordCell.classList.add("hidden-password");
        passwordCell.textContent = "•".repeat(10);
        
        // Action cell (view and copy icons)
        const actionCell = document.createElement("td");
        const actionDiv = document.createElement("div");
        actionDiv.classList.add("action-icons");

        // View button
        const viewBtn = document.createElement("button");
        viewBtn.classList.add("icon-btn");
        viewBtn.textContent = "👁️";
        viewBtn.onclick = () => togglePasswordVisibility(passwordCell, entry.password);
        
        // Copy button
        const copyBtn = document.createElement("button");
        copyBtn.classList.add("icon-btn");
        copyBtn.textContent = "📋";
        copyBtn.onclick = () => copyToClipboard(entry.password);

        actionDiv.appendChild(viewBtn);
        actionDiv.appendChild(copyBtn);
        actionCell.appendChild(actionDiv);

        row.appendChild(siteCell);
        row.appendChild(passwordCell);
        row.appendChild(actionCell);
        
        tableBody.appendChild(row);
    });
}

// Toggle password visibility
function togglePasswordVisibility(passwordCell, password) {
    if (passwordCell.textContent === "•".repeat(10)) {
        passwordCell.textContent = password;
    } else {
        passwordCell.textContent = "•".repeat(10);
    }
}

// Copy password to clipboard
function copyToClipboard(password) {
    navigator.clipboard.writeText(password).then(() => {
        alert("Password copied to clipboard!");
    }).catch(err => {
        console.error("Could not copy password:", err);
    });
}
