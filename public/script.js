document.addEventListener("DOMContentLoaded", () => {
    const tributeContainer = document.querySelector(".tribute-carousel");
    let tributes = [];
    let currentIndex = 0;

    // Function to fetch tributes from the server
    async function fetchTributes() {
        try {
            const response = await fetch("/api/tributes");
            tributes = await response.json();
            renderTributes();
        } catch (error) {
            console.error("Failed to fetch tributes:", error);
        }
    }

    // Function to submit a new tribute
    async function submitTribute(event) {
        event.preventDefault();
        const name = event.target.querySelector("input").value;
        const text = event.target.querySelector("#tributeText").value;

        try {
            const response = await fetch("/api/tributes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, text }),
            });
            const data = await response.json();
            tributes = data.tributes;
            renderTributes();
            event.target.reset();
        } catch (error) {
            console.error("Failed to submit tribute:", error);
        }
    }

    // Function to render tributes
    function renderTributes() {
        tributeContainer.innerHTML = tributes
            .map(
                (tribute, index) =>
                    `<div class="tribute ${index === currentIndex ? "active" : ""}">
                        <blockquote>"${tribute.text}"</blockquote>
                        <div class="author">- ${tribute.name}</div>
                    </div>`
            )
            .join("");
    }

    // Function to cycle through tributes
    function cycleTributes() {
        if (tributes.length > 0) {
            currentIndex = (currentIndex + 1) % tributes.length;
            renderTributes();
        }
    }

    // Set an interval to cycle tributes every 5 seconds
    setInterval(cycleTributes, 5000);

    // Fetch tributes on page load
    fetchTributes();

    // Expose submitTribute to the form
    window.submitTribute = submitTribute;
});

const galleryImages = document.querySelectorAll(".gallery-image");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let currentImageIndex = 0;

// Open lightbox and display image
galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => {
        lightbox.style.display = "flex";
        lightboxImage.src = image.src;
        currentImageIndex = index;
    });
});

// Close lightbox when clicking outside the image
lightbox.addEventListener("click", (e) => {
    if (e.target !== lightboxImage && e.target !== prevButton && e.target !== nextButton) {
        lightbox.style.display = "none";
    }
});

// Show previous image
prevButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
});

// Show next image
nextButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
});

// Swipe gestures for touch devices
let startX = 0;

lightboxImage.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

lightboxImage.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
        nextButton.click(); // Swipe left
    } else if (endX - startX > 50) {
        prevButton.click(); // Swipe right
    }
});

