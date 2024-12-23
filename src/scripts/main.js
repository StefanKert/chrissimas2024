document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('maintenance-message');
    const countdownElement = document.getElementById('countdown-timer');

    // Set the date we're counting down to
    const countDownDate = new Date("Dec 25, 2023 00:00:00").getTime();

    // Update the countdown every 1 second
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the countdown element
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // If the countdown is over, display a message
        if (distance < 0) {
            clearInterval(countdownInterval);
            messageElement.innerHTML = "Merry Christmas! The site is live!";
            countdownElement.innerHTML = "";
        }
    }, 1000);
});