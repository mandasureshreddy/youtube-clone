// ================ AUTHENTICATION FUNCTIONS ================
function showPopup() {
    document.getElementById('popupBox').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closePopup() {
    document.getElementById('popupBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close modal when clicking outside
document.getElementById('overlay').addEventListener('click', closePopup);

// ================ SEARCH FUNCTIONALITY ================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("input[name='search']");
    const videoCards = document.querySelectorAll(".video-card");
    const notFoundMsg = document.getElementById("not_found");
    const videoGallery = document.querySelector(".video-gallery");

    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        let matchFound = false;

        videoCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const channel = card.dataset.channel.toLowerCase();

            if (title.includes(query) || channel.includes(query)) {
                card.style.display = "flex";
                matchFound = true;
            } else {
                card.style.display = "none";
            }
        });

        notFoundMsg.style.display = matchFound ? "none" : "block";
        videoGallery.style.display = matchFound || query === "" ? "block" : "none";

        if (query === "") {
            videoCards.forEach(card => card.style.display = "flex");
            notFoundMsg.style.display = "none";
            videoGallery.style.display = "block";
        }
    }

    searchInput.addEventListener("input", debounce(handleSearch, 300));
});

// Debounce function to limit search frequency
function debounce(func, delay) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// ================ PAGE NAVIGATION ================
const homeSection = document.querySelector('.content-section');
const trendingSection = document.getElementById('trending-section');

// Function to show Home section
function home() {
    homeSection.style.display = 'block';
    trendingSection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    resetVideoDisplay(); // If you have this function already
}

// Function to show Trending section
function trending() {
    homeSection.style.display = 'none';
    trendingSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    subscriptions(); // To make sure buttons look right
}

// Reset function (assuming it's needed for Home section)
function resetVideoDisplay() {
    const videoCards = document.querySelectorAll(".video-card");
    videoCards.forEach(card => card.style.display = "flex");
    const notFound = document.getElementById("not_found");
    if (notFound) notFound.style.display = "none";
}
window.addEventListener('DOMContentLoaded', () => {
    home();
});

// =============== SUBSCRIPTION MANAGEMENT ================
function subscribe(button) {
    const card = button.closest('.video-card');
    const channelName = card.dataset.channel;
    const isSubscribed = button.value === 'Subscribed';

    button.value = isSubscribed ? 'Subscribe' : 'Subscribed';
    button.classList.toggle('subscribed', !isSubscribed);

    if (isSubscribed) {
        removeSubscribedChannel(channelName);
    } else {
        saveSubscribedChannel(channelName);
    }
}

// Storage functions
function saveSubscribedChannel(channel) {
    const subscribed = getSubscribedChannels();
    if (!subscribed.includes(channel)) {
        subscribed.push(channel);
        localStorage.setItem('subscribedChannels', JSON.stringify(subscribed));
    }
}

function removeSubscribedChannel(channel) {
    let subscribed = getSubscribedChannels();
    subscribed = subscribed.filter(name => name !== channel);
    localStorage.setItem('subscribedChannels', JSON.stringify(subscribed));
}

function getSubscribedChannels() {
    return JSON.parse(localStorage.getItem('subscribedChannels')) || [];
}

// Initialize subscription buttons on page load
function initSubscriptions() {
    const subscribedChannels = getSubscribedChannels();
    document.querySelectorAll('.video-card').forEach(card => {
        const channelName = card.dataset.channel;
        const button = card.querySelector('.subscribe-button');

        if (subscribedChannels.includes(channelName)) {
            button.value = 'Subscribed';
            button.classList.add('subscribed');
        }
    });
}

// Subscriptions view
function showSubscriptions() {
    const subscribed = getSubscribedChannels();
    const videoCards = document.querySelectorAll(".video-card");
    let hasSubscriptions = false;

    videoCards.forEach(card => {
        const channelName = card.dataset.channel;
        if (subscribed.includes(channelName)) {
            card.style.display = 'flex';
            hasSubscriptions = true;
        } else {
            card.style.display = 'none';
        }
    });

    if (!hasSubscriptions) {
        document.getElementById('not_found').textContent = 'You are not subscribed to any channels yet!';
        document.getElementById('not_found').style.display = 'block';
    } else {
        document.getElementById('not_found').style.display = 'none';
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initSubscriptions();

    // Add event listener for subscriptions button
    const subscriptionsBtn = document.querySelector('[onclick="subscriptions()"]');
    if (subscriptionsBtn) {
        subscriptionsBtn.addEventListener('click', showSubscriptions);
    }
});



// ================ SIDEBAR NAVIGATION ================
document.querySelectorAll('aside ul li').forEach(item => {
    item.addEventListener('click', function () {
        // Remove active class from all items
        document.querySelectorAll('aside ul li').forEach(li => {
            li.classList.remove('active');
        });

        // Add active class to clicked item
        this.classList.add('active');

        // Handle different menu items
        if (this.textContent.includes('Home')) home();
        if (this.textContent.includes('Trending')) trending();
        if (this.textContent.includes('Subscriptions')) showSubscriptions();
    });
});

// Elements
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');
const videos = document.querySelector('.video-card');

// Store watched videos (max: 3)
let watchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];

// Track when a video is played
videos.forEach(video => {
    video.addEventListener('play', () => {
        const videoTitle = video.getAttribute('id') || `Video ${watchedVideos.length + 1}`;

        // Add to history (avoid duplicates)
        if (!watchedVideos.includes(videoTitle)) {
            watchedVideos.unshift(videoTitle); // Add to beginning
            if (watchedVideos.length > 3) {
                watchedVideos.pop(); // Keep only last 3
            }
            localStorage.setItem('watchedVideos', JSON.stringify(watchedVideos));
            updateHistoryUI();
        }
    });
});
