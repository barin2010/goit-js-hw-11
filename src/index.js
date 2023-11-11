

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import axios from 'axios';


const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
let page = 1; 
const perPage = 40; 
let isLargeImage = false;

loadMoreBtn.style.display = "none";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchQuery = form.searchQuery.value.trim();
  if (searchQuery.length < 2) {
    alert("Please enter at least two characters for the search.");
    return;
  }

  page = 1;
  gallery.innerHTML = "";
  try {
    const data = await searchImages(searchQuery, page);
    renderImages(data);
  } catch (error) {
    console.error("An error occurred:", error);
    Notiflix.Notify.failure("Sorry, something went wrong. Please try again later.");
    loadMoreBtn.style.display = "none"; 
};
});
loadMoreBtn.addEventListener("click", async () => {
  page++;
  const searchQuery = form.searchQuery.value;
  try {
    const data = await searchImages(searchQuery, page);
    renderImages(data);
  } catch (error) {
    console.error("An error occurred:", error);
    Notiflix.Notify.failure("Sorry, something went wrong. Please try again later.");
    loadMoreBtn.style.display = "none"; 
  }
});


async function searchImages(query, page) {
  const apiKey = "40555904-676fe49c75520c90cb2144395";
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("API request failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw new Error("API request failed");
  }
}

function renderImages(data) {
  if (data.hits.length > 0) {
    data.hits.forEach((image) => {
      renderImageCard(image);
    });
    
    if (data.totalHits <= page * perPage) {
      loadMoreBtn.style.display = "none";
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.style.display = "block";
    }
  } else {
    gallery.innerHTML = "Sorry, there are no images matching your search query. Please try again.";
    Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
    loadMoreBtn.style.display = "none";
  }

  initializeLightbox();
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox(".gallery a");
  lightbox.on("show.simplelightbox", function () {
    isLargeImage = !isLargeImage;
    const images = document.querySelectorAll(".gallery a img");
    images.forEach((image) => {
      if (isLargeImage) {
        const largeImageUrl = image.parentNode.href;
        image.src = largeImageUrl;
      } else {
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

  card.appendChild(link); 
  card.appendChild(info);
  gallery.appendChild(card);
};

