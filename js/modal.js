function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
}

// Close modal when clicking (x) or outside
document.querySelectorAll('.close, .modal').forEach(element => {
    element.onclick = function(event) {
        if (event.target === element) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = "none";
            });
        }
    }
});