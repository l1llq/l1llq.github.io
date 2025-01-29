function navigateTo(page) {
    window.location.href = page;
}
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('closed');
}

function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    const tableBody = document.getElementById('submissionsTable').querySelector('tbody');

    tableBody.innerHTML = ''; // Clear existing rows

    submissions.forEach((submission, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${submission.student}</td>
            <td>${submission.departure}</td>
            <td>${submission.destination}</td>
            <td>${submission.time}</td>
            <td>
                <input type="checkbox" id="approve-${index}" class="row-checkbox" onclick="approveRow(${index})">
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function approveRow(index) {
    const checkBox = document.getElementById(`approve-${index}`);
    const approveAllCheckbox = document.getElementById('approve-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox'); // Select all individual checkboxes

    if (checkBox.checked) {
        const row = checkBox.closest('tr');
        row.classList.add('highlight'); // Highlight the row when checked
        checkBox.disabled = true; // Disable the checkbox after checking
    }

    // Check if all checkboxes are selected
    const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
    approveAllCheckbox.checked = allChecked; // Sync the "Approve All" checkbox
}

document.addEventListener('DOMContentLoaded', loadSubmissions);

function approveAll() {
    const approveAllCheckbox = document.getElementById('approve-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const isChecked = approveAllCheckbox.checked;

    rowCheckboxes.forEach(checkbox => {
        if (!checkbox.disabled) { // Only update enabled checkboxes
            checkbox.checked = isChecked;

            if (isChecked) {
                const row = checkbox.closest('tr');
                row.classList.add('highlight'); // Highlight the row
                checkbox.disabled = true; // Disable the checkbox after checking
            } else {
                const row = checkbox.closest('tr');
                row.classList.remove('highlight'); // Remove highlight if unchecked
                checkbox.disabled = false; // Enable the checkbox (if "Approve All" is unchecked)
            }
        }
    });
}

function clearAll() {
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    const tableBody = document.getElementById('submissionsTable').querySelector('tbody');

    // Filter out unapproved rows
    const updatedSubmissions = [];
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach((row, index) => {
        const checkBox = row.querySelector('input[type="checkbox"]');
        if (checkBox && checkBox.checked) {
            tableBody.removeChild(row); // Remove approved rows
        } else {
            // Retain unapproved submissions
            updatedSubmissions.push(submissions[index]);
        }
    });

    // Update local storage with unapproved submissions only
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
}