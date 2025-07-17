document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // Show splash screen for 2 seconds
    setTimeout(() => {
        splashScreen.classList.add('fade-out'); // Start fade out animation
        // After fade out completes, hide splash and show main content
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.classList.add('fade-in'); // Start fade in for main content
            startCountdown(); // Start all countdowns once main content is visible
            startFooterCountdown(); // Start footer countdown
        }, { once: true }); // Ensure this listener runs only once
    }, 2000); // 2000 milliseconds = 2 seconds

    // --- Navigation Bar Functionality ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const ongoingContestsContent = document.getElementById('ongoing').innerHTML; // Get initial HTML of ongoing contests

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior

            // Remove 'active' class from all nav links
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Add 'active' class to the clicked link
            link.classList.add('active');

            const targetId = link.dataset.target; // Get the target section ID from data-target

            // Hide all page sections
            pageSections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none'; // Ensure it's hidden for smooth transition
            });

            // Show the target section with a fade effect
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.opacity = 0; // Start invisible
                targetSection.style.display = 'block'; // Make it block to enable opacity transition

                // Special handling for "Hackathons" nav link
                if (targetId === 'hackathons-page') {
                    const hackathonsPageContentDiv = document.getElementById('hackathons-page-content');
                    // Duplicate content from #ongoing
                    hackathonsPageContentDiv.innerHTML = ongoingContestsContent;
                    hackathonsPageContentDiv.style.display = 'grid'; // Ensure grid layout
                    startCountdown(); // Re-initialize countdowns for duplicated content
                }

                setTimeout(() => {
                    targetSection.classList.add('active');
                    targetSection.style.opacity = 1; // Fade in
                }, 10); // Small delay to ensure display:block applies before transition
            }
        });
    });

    // Set initial active nav link and section (Home)
    document.querySelector('.nav-link[data-target="home"]').click();


    // --- Contest Tabs Functionality ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' from all tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' to the clicked button
            button.classList.add('active');

            const targetTabId = button.dataset.tab;

            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.style.opacity = 0; // Reset opacity for fade-in
            });

            // Show the target tab content with a fade effect
            const targetTabContent = document.getElementById(targetTabId);
            if (targetTabContent) {
                // Determine display type based on content
                if (targetTabId === 'ongoing' || targetTabId === 'upcoming' || targetTabId === 'past-winners') {
                    targetTabContent.style.display = 'grid'; // For contest/hackathon/winner cards
                }
                else {
                    targetTabContent.style.display = 'block'; // For placeholder text
                }

                setTimeout(() => {
                    targetTabContent.style.opacity = 1; // Fade in
                    startCountdown(); // Re-initialize countdowns when a new tab with countdowns is shown
                }, 10); // Small delay to ensure display applies before transition
            }
        });
    });

    // Set initial active contest tab (Ongoing Contests)
    document.querySelector('.tab-button[data-tab="ongoing"]').click();


    // --- Button Actions (Open unstop.com) ---
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default form submission or navigation
            const url = button.dataset.url; // Get URL from data-url attribute
            if (url) {
                window.open(url, '_blank'); // Open in a new tab
            }
        });
    });

    // --- Live Countdown Functionality ---
    let countdownIntervals = []; // Array to store all setInterval IDs

    function startCountdown() {
        // Clear existing intervals to prevent multiple updates for the same element
        countdownIntervals.forEach(intervalId => clearInterval(intervalId));
        countdownIntervals = []; // Reset the array

        document.querySelectorAll('.time-remaining').forEach(countdownContainer => {
            const endTimeString = countdownContainer.dataset.endTime;
            if (!endTimeString) return; // Skip if no end time is defined

            const endTime = new Date(endTimeString).getTime();

            // Find specific time boxes within this container
            const daysBox = countdownContainer.querySelector('.time-box.days');
            const hoursBox = countdownContainer.querySelector('.time-box.hours');
            const minutesBox = countdownContainer.querySelector('.time-box.min');
            const secondsBox = countdownContainer.querySelector('.time-box.sec');

            const updateCountdown = () => {
                const now = new Date().getTime();
                const distance = endTime - now;

                if (distance < 0) {
                    // Time expired
                    if (countdownContainer.countdownInterval) {
                        clearInterval(countdownContainer.countdownInterval);
                    }
                    // For upcoming hackathons, just hide the countdown or show a "Registration Closed" message
                    // For general contests, you might show "Contest Ended"
                    if (countdownContainer.closest('.upcoming-card')) {
                        countdownContainer.innerHTML = '<h4>Registration Closed</h4><p style="color:red; font-weight:bold; font-size:0.9em;">This event has passed.</p>';
                    } else {
                        countdownContainer.innerHTML = '<h4>Time Expired</h4><p style="color:red; font-weight:bold; font-size:0.9em;">Contest has ended!</p>';
                    }
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (daysBox) daysBox.innerHTML = `${String(days).padStart(2, '0')}<span>Days</span>`;
                if (hoursBox) hoursBox.innerHTML = `${String(hours).padStart(2, '0')}<span>Hours</span>`;
                if (minutesBox) minutesBox.innerHTML = `${String(minutes).padStart(2, '0')}<span>Min</span>`;
                if (secondsBox) secondsBox.innerHTML = `${String(seconds).padStart(2, '0')}<span>Sec</span>`;
            };

            updateCountdown(); // Initial call
            const intervalId = setInterval(updateCountdown, 1000);
            countdownContainer.countdownInterval = intervalId;
            countdownIntervals.push(intervalId);
        });
    }

    // --- Footer Countdown Functionality ---
    function startFooterCountdown() {
        const footerCountdownContainer = document.getElementById('footer-countdown');
        const footerCountdownTarget = document.getElementById('footer-countdown-target');
        const endTimeString = footerCountdownTarget.dataset.endTime;

        if (!footerCountdownContainer || !endTimeString) return;

        const endTime = new Date(endTimeString).getTime();

        const daysBox = footerCountdownContainer.querySelector('.time-box.days');
        const hoursBox = footerCountdownContainer.querySelector('.time-box.hours');
        const minutesBox = footerCountdownContainer.querySelector('.time-box.min');
        const secondsBox = footerCountdownContainer.querySelector('.time-box.sec');

        const updateFooterCountdown = () => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(footerCountdownContainer.footerInterval);
                footerCountdownContainer.innerHTML = '<p style="color:#fff; font-weight:bold;">Event has started!</p>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (daysBox) daysBox.innerHTML = `${String(days).padStart(2, '0')}<span>Days</span>`;
            if (hoursBox) hoursBox.innerHTML = `${String(hours).padStart(2, '0')}<span>Hours</span>`;
            if (minutesBox) minutesBox.innerHTML = `${String(minutes).padStart(2, '0')}<span>Min</span>`;
            if (secondsBox) secondsBox.innerHTML = `${String(seconds).padStart(2, '0')}<span>Sec</span>`;
        };

        updateFooterCountdown();
        footerCountdownContainer.footerInterval = setInterval(updateFooterCountdown, 1000);
    }


    // --- Search Functionality ---
    const searchInput = document.getElementById('contest-search');
    const ongoingContestGrid = document.getElementById('ongoing');
    const upcomingContestGrid = document.getElementById('upcoming');
    const allContestCards = document.querySelectorAll('#ongoing .contest-card, #upcoming .contest-card');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        // If on Home page, filter both Ongoing and Upcoming tabs
        if (document.getElementById('home').classList.contains('active')) {
            filterCards(ongoingContestGrid, searchTerm);
            filterCards(upcomingContestGrid, searchTerm);
        } else if (document.getElementById('hackathons-page').classList.contains('active')) {
            // If on Hackathons page, filter the duplicated content
            const hackathonsPageContentDiv = document.getElementById('hackathons-page-content');
            filterCards(hackathonsPageContentDiv, searchTerm);
        }
    });

    function filterCards(container, searchTerm) {
        const cards = container.querySelectorAll('.contest-card');
        let found = false;
        cards.forEach(card => {
            const title = card.querySelector('.contest-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.contest-description')?.textContent.toLowerCase() || '';
            const technologies = card.querySelector('.technologies')?.textContent.toLowerCase() || '';

            if (title.includes(searchTerm) || description.includes(searchTerm) || technologies.includes(searchTerm)) {
                card.style.display = 'flex'; // Show card
                found = true;
            } else {
                card.style.display = 'none'; // Hide card
            }
        });

        // Optional: Show a "No results found" message if needed
        // For simplicity, we're just hiding cards.
    }
});