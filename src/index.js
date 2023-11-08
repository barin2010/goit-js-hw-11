// import { galleryItems } from "./gallery_items";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
let page = 1; // Current page number
const perPage = 40; // Number of images per page

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchQuery = form.searchQuery.value.trim(); // Remove leading/trailing white spaces
    if (searchQuery.length < 2) {
      alert("Please enter at least two characters for the search.");
      return;
    }
    
    page = 1; // Reset page on a new search
    gallery.innerHTML = ""; // Clear existing images
    searchImages(searchQuery, page);
    loadMoreBtn.style.display = "block";
});

// Function to search images
async function searchImages(query, page) {
    const apiKey = "40555904-676fe49c75520c90cb2144395";
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.hits.length > 0) {
          data.hits.forEach((image) => {
            renderImageCard(image);
          });
          if (data.totalHits <= page * perPage) {
            loadMoreBtn.style.display = "none"; // Hide the button when there are no more images to load
          }
        } else {
          // Handle the case when no images are found
          gallery.innerHTML = "Sorry, there are no images matching your search query. Please try again.";
          loadMoreBtn.style. display = "none";
        }
      } else {
        // Handle the case when the API request fails
        console.error("API request failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    
    // Call initializeLightbox to refresh the lightbox with the new images
    initializeLightbox();
}

let isLargeImage = false;

function initializeLightbox() {
  const lightbox = new SimpleLightbox(".gallery a");
  lightbox.on("show.simplelightbox", function () {
    isLargeImage = !isLargeImage; // Toggle the state on each click
    const images = document.querySelectorAll(".gallery a img");

    images.forEach((image) => {
      if (isLargeImage) {
        // Set the image source to the large version
        const largeImageUrl = image.parentNode.href;
        image.src = largeImageUrl;
      } else {
        // Set the image source to the small version
        const smallImageUrl = image.parentNode.querySelector("img").src;
        image.src = smallImageUrl;
      }
    });
  });
}

function renderImageCard(image) {
  const card = document.createElement("div");
  card.classList.add("photo-card");

  const img = document.createElement("img");
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = "lazy";

  // Create an anchor tag (link) around the image
  const link = document.createElement("a");
  link.href = image.largeImageURL;
  link.appendChild(img);

  const info = document.createElement("div");
  info.classList.add("info");

  const infoItems = [
    { label: "Likes", value: image.likes },
    { label: "Views", value: image.views },
    { label: "Comments", value: image.comments },
    { label: "Downloads", value: image.downloads },
  ];

  infoItems.forEach((item) => {
    const p = document.createElement("p");
    p.classList.add("info-item");
    p.innerHTML = `<b>${item.label}:</b> ${item.value}`;
    info.appendChild(p);
  });

  card.appendChild(link); // Add the link with the image
  card.appendChild(info);
  gallery.appendChild(card);
}
