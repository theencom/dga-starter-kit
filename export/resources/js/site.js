import Swiper from "swiper";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import Alpine from "alpinejs";
// Alpine.start();

Swiper.use([Navigation, Pagination, EffectFade]);

document.addEventListener("DOMContentLoaded", function () {



    var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
    }

    var themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn.addEventListener('click', function () {

        // toggle icons inside button
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }

            // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }

    });


    // Swiper for Hero section
    var heroSwiper = new Swiper(".hero-slider", {
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        effect: "fade", // Use fade effect
        fadeEffect: {
            crossFade: true, // Optional: Smooth crossfade between slides
        },
        speed: 1000, // Transition speed in milliseconds
        on: {
            slideChangeTransitionStart: function () {
                updatePaginationDots();
            }
        }
    });

    // Function to update pagination dots
    function updatePaginationDots() {
        const activeIndex = heroSwiper.realIndex; // Get the real active index
        const paginationDots = document.querySelectorAll(".swiper-pagination .swiper-pagination-bullet");
        paginationDots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add("swiper-pagination-bullet-active");
            } else {
                dot.classList.remove("swiper-pagination-bullet-active");
            }
        });
    }



    // Swiper for services action
    var serviceSwiper = new Swiper(".service-slider", {
        loop: true,
        slidesPerView: 4,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
        },
        pagination: {
            el: ".services-swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className} custom-pagination-bullet"></span>`;
            },
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 5,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 16,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 16,
            },
        },
    });

    // Swiper for articles section
    var articlesSwiper = new Swiper(".articles-slider", {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: false,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className} custom-pagination-bullet"></span>`;
            },
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 5,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 16,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 16,
            },
        },
    });




    // Function to show current user weather

    // Function to fetch weather data and city name
    async function fetchWeather(lat, lon) {
        // Check if the website direction is RTL
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

        // Set the language parameter based on the website direction
        const lang = isRTL ? 'ar' : 'en'; // Use Arabic if RTL, otherwise English

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // console.log('API Response:', data); // Debugging: Log the API response

            if (data.cod === 200) {
                // Update the weather icon
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                console.log('Icon URL:', iconUrl); // Debugging: Log the icon URL

                const weatherIconElement = document.querySelector('.weatherIcon');
                weatherIconElement.src = iconUrl;
                weatherIconElement.alt = data.weather[0].description;

                // Update the weather text (only description, no temperature)
                document.querySelector('.weatherText').textContent = data.weather[0].description;

                // Update the city name
                document.getElementById("visitor-city").textContent = data.name || "Unknown City";
            } else {
                console.error('Error fetching weather data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    // Function to get the user's location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeather(lat, lon);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    // Function to format the current date
    function getCurrentDate() {
        const today = new Date();
        const locale = document.documentElement.dir === "rtl" ? "ar-EG" : "en-UK";
        return today.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    // Function to get the current time
    function getCurrentTime() {
        const now = new Date();
        const locale = document.documentElement.dir === "rtl" ? "ar-EG" : "en-US";
        return now.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    // Function to update dynamic content
    async function updateDynamicContent() {
        document.getElementById("current-date").textContent = getCurrentDate();
        document.getElementById("current-time").textContent = getCurrentTime();
    }

    // Call functions on page load
    getLocation();
    updateDynamicContent();

    // Update time every minute
    setInterval(() => {
        document.getElementById("current-time").textContent = getCurrentTime();
    }, 60000);



    // Check if the browser supports the SpeechRecognition API
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert(
            "Your browser does not support speech recognition. Please try a different browser."
        );
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Set the language (you can change this based on your requirements)
    recognition.interimResults = false; // Set to true to get partial results while speaking

    const voiceButton = document.querySelector(".click-to-voice");
    const searchInput = document.querySelector(".search-input");
    const clearBtn = document.getElementById('clear-btn');


    // Show the clear button when typing
    searchInput.addEventListener('input', function () {
        if (searchInput.value) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    });

    // Clear the input when the clear button is clicked
    clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        clearBtn.classList.add('hidden');
    });

    // Add the blinking animation on the button when recognition starts
    recognition.addEventListener("start", () => {
        voiceButton.style.animation = "blink 1s infinite"; // Start blinking when listening
    });

    // Remove the blinking effect when recognition ends
    recognition.addEventListener("end", () => {
        voiceButton.style.animation = ""; // Stop blinking when not listening
    });

    voiceButton.addEventListener("click", () => {
        recognition.start(); // Start listening to the user's voice
    });

    recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript; // Get the transcribed text
        searchInput.value = transcript; // Set the transcribed text in the search input field
    });

    recognition.addEventListener("end", () => {
        console.log("Speech recognition stopped.");
    });

    recognition.addEventListener("error", (event) => {
        console.error("Speech recognition error:", event.error);
    });




    const form = document.getElementById("contactForm");
    const responseDiv = document.getElementById("formResponse");
    const formFieldsDiv = document.querySelector(".form_fields"); // Select the form_fields div

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest", // Identify the request as AJAX
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Parse response depending on its format
            const contentType = response.headers.get("Content-Type");

            if (contentType && contentType.includes("application/json")) {
                // If the response is JSON
                const result = await response.json();

                if (result.success) {
                    responseDiv.innerHTML = `<div class="bg-primaryGreen-600 text-white p-2">Form submitted successfully!</div>`;
                    if (formFieldsDiv) {
                        formFieldsDiv.classList.add("hidden"); // Hide the form_fields div
                    }
                } else if (result.error) {
                    responseDiv.innerHTML = `<div class="bg-red-300 text-white p-2">${result.error}</div>`;
                } else {
                    responseDiv.innerHTML = `<div class="bg-red-300 text-white p-2">Unexpected response from the server.</div>`;
                }
            } else {
                // Handle non-JSON response (e.g., plain text or boolean)
                const resultText = await response.text();

                if (resultText.trim() === "true") {
                    // Handle a plain "true" response
                    responseDiv.innerHTML = `<div class="bg-green-600 text-white p-2">Form submitted successfully!</div>`;
                    if (formFieldsDiv) {
                        formFieldsDiv.classList.add("hidden"); // Hide the form_fields div
                    }
                } else if (resultText.trim() === "false") {
                    // Handle a plain "false" response
                    responseDiv.innerHTML = `<div class="bg-red-300 text-white p-2">Form submission failed. Please try again.</div>`;
                } else {
                    responseDiv.innerHTML = `<div class="bg-red-300 text-white p-2">Unexpected response: ${resultText}</div>`;
                }
            }

            responseDiv.classList.remove("hidden");
            form.reset(); // Reset the form if submission was successful
        } catch (error) {
            responseDiv.innerHTML = `<div class="bg-red-300 text-white p-2">${error.message || "Something went wrong. Please try again later."}</div>`;
            responseDiv.classList.remove("hidden");
        }
    });


 

    





});

//================ MOBILE NAVBAR STARTS ===============//


// Function to hide both mobile navs
function hideMobileNavs() {
    const mobileNav = document.querySelector("#mobile-nav");
    const mobileNavAr = document.querySelector("#mobile-nav-ar");

    if (mobileNav) {
        mobileNav.classList.add("left-[-300px]");
        mobileNav.classList.remove("left-0");
    }

    if (mobileNavAr) {
        mobileNavAr.classList.add("right-[-300px]");
        mobileNavAr.classList.remove("right-0");
    }
}

// Open Mobile Navbar
document.querySelector("#hamburger-btn")?.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the click from propagating to the document

    const mobileNav = document.querySelector("#mobile-nav");
    const mobileNavAr = document.querySelector("#mobile-nav-ar");

    if (mobileNav) {
        mobileNav.classList.add("left-0");
        mobileNav.classList.remove("left-[-300px]");
    }

    if (mobileNavAr) {
        mobileNavAr.classList.add("right-0");
        mobileNavAr.classList.remove("right-[-300px]");
    }
});

// Close Mobile Navbar when close button is clicked
document.querySelector("#mobile-nav-close")?.addEventListener("click", () => {
    hideMobileNavs();
});

// Close Mobile Navbar when clicking anywhere outside the nav
document.addEventListener("click", (event) => {
    const mobileNav = document.querySelector("#mobile-nav");
    const mobileNavAr = document.querySelector("#mobile-nav-ar");
    const hamburgerBtn = document.querySelector("#hamburger-btn");

    // Check if the elements exist and if the click is outside of the mobile navs and hamburger button
    if (
        (!mobileNav || !mobileNav.contains(event.target)) &&
        (!mobileNavAr || !mobileNavAr.contains(event.target)) &&
        (!hamburgerBtn || !hamburgerBtn.contains(event.target))
    ) {
        hideMobileNavs();
    }
});


// Mobile navbar menu items selected or activated //
const links = document.querySelectorAll(".mobile-menu-link"); // Select all menu links

links.forEach((link) => {
    link.addEventListener("click", function () {
        links.forEach((link) => link.classList.remove("activated")); // Remove 'selected' from all
        this.classList.add("activated"); // Add 'selected' to the clicked link
    });
});

// Select the mobile toggle link and submenu //
// const toggleMenu = document.querySelector("#toggle-menu");
// const submenu = document.querySelector('[data-toggle="submenu"]');

// // Add click event listener to the menu link
// toggleMenu.addEventListener("click", (event) => {
//     event.preventDefault(); // Prevent default link behavior

//     // Toggle the visibility of the submenu
//     submenu.classList.toggle("hidden"); // Tailwind's `hidden` class

//     document.querySelectorAll(".arrow-icon").forEach((icon) => {
//         icon.classList.toggle("rotate-180");
//     });

// });
//================ MOBILE NAVBAR ENDS ===============//

//================ NAVBAR MENU ITEMS SELECTED STARTS ===============//
document.addEventListener("DOMContentLoaded", () => {
    const allItems = document.querySelectorAll(".nav-menu-link , .nav-button");

    allItems.forEach((item) =>
        item.addEventListener("click", () => {
            // Remove 'selected' class and filter from all items
            allItems.forEach((el) => {
                el.classList.remove("selected");
                const icon = el.querySelector("img");
                if (icon) icon.style.filter = "";
            });

            // Add 'selected' class and filter to clicked item
            item.classList.add("selected");
            const icon = item.querySelector("img");
            if (icon) icon.style.filter = "brightness(0) invert(1)";
        })
    );
});
//================ NAVBAR MENU ITEMS SELECTED ENDS ===============//

//================ SEARCH BAR FUNCTIONALITY STARTS =================//
const searchBtn = document.getElementById("search-btn");
const searchBar = document.getElementById("search-bar");
const closeBtn = document.getElementById("close-btn");

searchBtn.addEventListener("click", () => {
    searchBar.style.display = "block"; // Show the search bar
});

closeBtn.addEventListener("click", () => {
    searchBar.style.display = "none"; // Hide the search bar
    document.querySelectorAll('.nav-button').forEach((btn) => {

        btn.classList.remove("selected")
        const icon = btn.querySelector("img");
        if (icon) icon.style.filter = "";
    })

});

document.querySelectorAll(".suggestion").forEach((suggestion) => {
    suggestion.addEventListener("click", function () {
        const spanText = this.querySelector("span").textContent;

        document.querySelector(".search-input").value = spanText;
    });
});


document.getElementById('search-btn-mobile').addEventListener('click', function () {
    document.getElementById('search-bar').style.display = "block";
    document.getElementById('mobile-nav').classList.add("left-[-300px]");
    document.getElementById('mobile-nav-ar').classList.add("right-[-300px]");
});



//================ SEARCH BAR FUNCTIONALITY ENDS =================//

let isSpeaking = false;

document.querySelector(".transcribe").addEventListener("click", () => {
    const transcribeButton = document.querySelector(".transcribe");

    if (isSpeaking) {
        speechSynthesis.cancel(); // Stop any ongoing speech
        isSpeaking = false;
        transcribeButton.classList.remove("active"); // Remove red background and blinking
    } else {
        const contentElement = document.getElementById("content");
        let content = "";
        let lang = "en-US"; // Default to English

        // Get all text content, including any Arabic
        const paragraphs = contentElement.querySelectorAll("p");
        paragraphs.forEach((paragraph) => {
            content += paragraph.innerText + " ";
            lang = paragraph.getAttribute("data-lang") || lang; // Use language attribute from <p> element
        });

        const speech = new SpeechSynthesisUtterance(content);
        speech.lang = lang; // Set language dynamically based on the content

        speech.onend = () => {
            isSpeaking = false; // Reset state when speech ends
            transcribeButton.classList.remove("active"); // Remove red background and blinking
        };

        speechSynthesis.speak(speech);
        isSpeaking = true;
        transcribeButton.classList.add("active"); // Add red background and blinking
    }
});

//=============== Feedback Section functionality ==============//
// Get elements
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const feedbackOptions = document.getElementById("feedback-options");
const yesOptions = document.getElementById("yes-options");
const noOptions = document.getElementById("no-options");
const closeButton = document.getElementById("close-button");
const submitButton = document.getElementById("submit-button");
const confirmationMessage = document.getElementById("confirmation-message");
// const feedbackSection = document.getElementById("feedback-section");
// const questionText = document.getElementById("question-text");
// const yesNoButtons = document.getElementById("yes-no-buttons");
const surveyText = document.getElementById("survey");
// const confirmSurveyText = document.getElementById("corfirmation-survey");
// const questionBar = document.getElementById("question-bar");
const usefulField = document.getElementById("was_this_page_useful");

// // Show options based on selection
yesButton.addEventListener("click", () => {
    feedbackOptions.classList.remove("hidden");
    yesOptions.classList.remove("hidden");
    noOptions.classList.add("hidden");
    confirmationMessage.classList.add("hidden");
    surveyText.classList.add("hidden");
    closeButton.classList.remove("hidden");
    closeButton.classList.add("flex");
    usefulField.value = "Yes";
});

noButton.addEventListener("click", () => {
    feedbackOptions.classList.remove("hidden");
    noOptions.classList.remove("hidden");
    yesOptions.classList.add("hidden");
    confirmationMessage.classList.add("hidden");
    surveyText.classList.add("hidden");
    closeButton.classList.remove("hidden");
    closeButton.classList.add("inline-flex");
    usefulField.value = "No";
});

// Close the feedback section
closeButton.addEventListener("click", () => {
    feedbackOptions.classList.add("hidden");
    closeButton.classList.add("hidden");
    surveyText.classList.remove("hidden");
});

// Submit feedback
submitButton.addEventListener("click", () => {
    feedbackOptions.classList.add("hidden");
    questionBar.classList.add("hidden");
    confirmationMessage.classList.remove("hidden");
    confirmationMessage.classList.add("sm:flex-row");
});

document
    .getElementById("feedbackForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const form = event.target;
        const actionUrl = form.action; // The URL defined in the form's action attribute

        // Gather form data
        const formData = new FormData(form);

        try {
            // Send the form data using fetch
            const response = await fetch(actionUrl, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("An error occurred while submitting the form.");
            }

            // If submission is successful, hide feedback options and show the confirmation message
            feedbackOptions.classList.add("hidden");
            confirmationMessage.classList.remove("hidden");
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit the form. Please try again later.");
        }
    });

// Get the buttons and content element
const zoomInBtn = document.querySelector('.zoomin');
const zoomOutBtn = document.querySelector('.zoomout');
const content = document.getElementById('content');

// Initialize the scale factor and counters
let currentScale = 1;
const maxZoomCount = 1;
let zoomCount = 0; // Tracks the net zoom level

// Function to update the text size
function updateTextSize() {
    content.style.fontSize = `${currentScale}rem`;
}

// Add click event for zoom in
zoomInBtn.addEventListener('click', () => {
    if (zoomCount < maxZoomCount) {
        currentScale *= 1.5;
        zoomCount++;
        updateTextSize();
    }
});

// Add click event for zoom out
zoomOutBtn.addEventListener('click', () => {
    if (zoomCount > -maxZoomCount) {
        currentScale /= 1.5;
        zoomCount--;
        updateTextSize();
    }
});


document.querySelector('.grayscaler').addEventListener('click', function () {
    document.body.classList.toggle('grayscale');
});



// Get all elements
const popup = document.getElementById('videoPopup');
const videoFrame = document.getElementById('videoFrame');
const closeButton2 = document.getElementById('closePopup');
const triggers = document.querySelectorAll('.video-popup-trigger');

// Add click handlers to all trigger buttons
triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const videoUrl = trigger.dataset.videoUrl;
        videoFrame.src = videoUrl;
        popup.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
});

// Close popup handler
const closePopup = () => {
    popup.classList.add('hidden');
    videoFrame.src = ''; // Stop video playback
    document.body.style.overflow = ''; // Restore scrolling
};

// Add close button click handler
closeButton2.addEventListener('click', closePopup);

// Close on backdrop click
popup.addEventListener('click', (e) => {
    if (e.target != popup) {
        closePopup();
    }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePopup();
    }
});






// Function to make elements keyboard accessible

function makeElementsKeyboardAccessible() {
    // Select all text elements from h1 to p, plus links and buttons
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');

    // Add a style tag for focus-visible styling
    if (!document.getElementById('keyboard-focus-styles')) {
        const style = document.createElement('style');
        style.id = 'keyboard-focus-styles';
        style.textContent = `
            h1:focus-visible, 
            h2:focus-visible, 
            h3:focus-visible, 
            h4:focus-visible, 
            h5:focus-visible, 
            h6:focus-visible, 
            p:focus-visible, 
            a:focus-visible, 
            button:focus-visible {
                outline: 2px solid #4A90E2;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    elements.forEach(element => {
        // Handle different element types
        if (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'button') {
            // Links and buttons should already be focusable, but ensure they have proper attributes
            element.setAttribute('tabindex', '0');

            // Ensure proper role
            if (element.tagName.toLowerCase() === 'a' && !element.getAttribute('href')) {
                element.setAttribute('role', 'button');
            }

            // Add keyboard event listeners for activation
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        } else {
            // For text elements that should be focusable but aren't interactive
            if (!element.getAttribute('tabindex') && 
                (element.textContent.trim().length > 0)) {
                element.setAttribute('tabindex', '0');
                element.setAttribute('role', 'text');
            }
        }

        // Ensure elements have proper aria-label if they don't have visible text
        if (!element.textContent.trim()) {
            const ariaLabel = element.getAttribute('aria-label');
            if (!ariaLabel) {
                element.setAttribute('aria-label', 'Interactive element');
            }
        }
    });
}

// Auto-run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', makeElementsKeyboardAccessible);

// Also expose the function for manual calling
window.makeElementsKeyboardAccessible = makeElementsKeyboardAccessible;
window.addEventListener("load", function () {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://muneer.cx/static/v1/css/muneer.min.css";
    link.media = "all"; // Keep "all" so it applies to all media types
    document.head.appendChild(link);
  });


  function displayLastNumber() {
    const spans = document.querySelectorAll('.numOfYes');
  
    spans.forEach(span => {
      const textWithRegularSpaces = span.textContent.replace(/\u00A0/g, ' ');
      const numbers = textWithRegularSpaces.trim().split(/\s+/);
  
      if (numbers.length > 0) {
        const lastNumber = numbers[numbers.length - 1];
  
        // *** Key change: Clear the span's content first, then add the last number ***
        span.textContent = ""; // Clear existing content
        span.appendChild(document.createTextNode(lastNumber)); // Add the last number as a text node
  
      } else {
        span.textContent = ""; // Or your default value
      }
    });
  }
  
  window.addEventListener('DOMContentLoaded', displayLastNumber);