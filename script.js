const GARAGE_LISTING = {
  // Edit prices here. The yearly saving is calculated automatically.
  monthlyPrice: 120,
  yearlyPrice: 1320,

  // Edit phone number here. Spaces are fine.
  phoneNumber: "+421 905 308 966",

  listingType: "Bratislava, Ružinov",
  title: "Garáž na prenájom",
  description: "Jednoduchá garáž vhodná na parkovanie alebo uskladnenie vecí.",
  longDescription:
    "Garáž je vhodná pre osobné auto alebo ako skladový priestor. Má pohodlný vjazd, pevnú podlahu a uzamykateľnú bránu. Garáž je taktiež novo vymalovaná, a má elektrinu.",
  location: "Ružinov, Ďatelinová 5530/10",
  dimensions: "6,2 × 2,9 m",
  area: "18 m²",
  length: "6,2 m",
  width: "2,9 m",
  gateHeight: "1,85 m",
  availability: "Ihneď",
  mapUrl: "https://maps.app.goo.gl/UNv6bACKxQ9EnQM17?g_st=ic",
  mapEmbedQuery: "Ružinov, Ďatelinová 5530/10",

  // Add real photo paths here later, for example: "assets/fotka-1.jpg".
  photos: [
    { src: "assets/ingarage.jpeg", label: "Interiér garáže" },
    { src: "assets/looking-out.jpeg", label: "Interiér garáže smer von" },
    { src: "assets/street-view.jpeg", label: "Pohľad na garáže z ulice" },
  ],
};

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
};

setText("title", GARAGE_LISTING.title);
setText("listing-type", GARAGE_LISTING.listingType);
setText("description", GARAGE_LISTING.description);
setText("long-description", GARAGE_LISTING.longDescription);
setText("location", GARAGE_LISTING.location);
setText("dimensions", GARAGE_LISTING.dimensions);
setText("area", GARAGE_LISTING.area);
setText("length", GARAGE_LISTING.length);
setText("width", GARAGE_LISTING.width);
setText("gate-height", GARAGE_LISTING.gateHeight);
setText("availability", GARAGE_LISTING.availability);
setText("monthly-price", GARAGE_LISTING.monthlyPrice);
setText("yearly-price", GARAGE_LISTING.yearlyPrice);
setText("yearly-saving", GARAGE_LISTING.monthlyPrice * 12 - GARAGE_LISTING.yearlyPrice);
setText("phone-label", GARAGE_LISTING.phoneNumber);

const mapFrame = document.getElementById("map-frame");
if (mapFrame) {
  mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(GARAGE_LISTING.mapEmbedQuery)}&output=embed`;
}

const callButtons = document.querySelectorAll("[data-call-source]");
callButtons.forEach((button) => {
  button.href = `tel:${GARAGE_LISTING.phoneNumber.replace(/\s/g, "")}`;
  button.setAttribute("aria-label", `Zavolať ${GARAGE_LISTING.phoneNumber}`);
});

const trackEvent = (name, props = {}, options = {}) => {
  if (typeof window.plausible !== "function") return;

  window.plausible(name, {
    ...options,
    props: {
      listing: GARAGE_LISTING.title,
      location: GARAGE_LISTING.location,
      ...props,
    },
  });
};

callButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    let didOpenCallLink = false;
    const openCallLink = () => {
      if (didOpenCallLink) return;
      didOpenCallLink = true;
      window.location.href = button.href;
    };

    trackEvent("Call Click", {
      phone: GARAGE_LISTING.phoneNumber,
      source: button.dataset.callSource,
      monthly_price: GARAGE_LISTING.monthlyPrice,
      yearly_price: GARAGE_LISTING.yearlyPrice,
    }, {
      callback: openCallLink,
    });

    window.setTimeout(openCallLink, 450);
  });
});

const mainPhoto = document.getElementById("main-photo");
const mainPhotoImg = document.getElementById("main-photo-img");
const mainPhotoEmpty = document.getElementById("main-photo-empty");
const thumbs = document.getElementById("thumbs");
const prevPhotoButton = document.getElementById("prev-photo");
const nextPhotoButton = document.getElementById("next-photo");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeLightboxButton = document.getElementById("close-lightbox");
const lightboxPrevButton = document.getElementById("lightbox-prev");
const lightboxNextButton = document.getElementById("lightbox-next");

let currentPhotoIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;
let suppressNextPhotoClick = false;

const activePhotos = GARAGE_LISTING.photos.filter((photo) => photo.src || photo.label);

const setActiveThumb = () => {
  if (!thumbs) return;

  thumbs.querySelectorAll(".thumb").forEach((item, index) => {
    item.classList.toggle("is-active", index === currentPhotoIndex);
  });
};

const setPhotoRatio = (image, target) => {
  if (!image.naturalWidth || !image.naturalHeight || !target) return;
  target.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
};

const updateLightbox = () => {
  if (!lightboxImg) return;

  const photo = activePhotos[currentPhotoIndex];
  if (!photo?.src) return;

  lightboxImg.src = photo.src;
  lightboxImg.alt = photo.label;
};

const showPhoto = (index, source = "unknown") => {
  if (!mainPhoto || !mainPhotoImg || !mainPhotoEmpty) return;

  const previousPhotoIndex = currentPhotoIndex;
  currentPhotoIndex = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[currentPhotoIndex];

  mainPhoto.setAttribute("aria-label", photo.label);
  if (photo.src) {
    mainPhotoImg.src = photo.src;
    mainPhotoImg.alt = photo.label;
    mainPhotoImg.hidden = false;
    mainPhotoImg.onload = () => setPhotoRatio(mainPhotoImg, mainPhoto);
    mainPhotoEmpty.hidden = true;
  } else {
    mainPhotoImg.removeAttribute("src");
    mainPhotoImg.alt = "";
    mainPhotoImg.hidden = true;
    mainPhoto.style.aspectRatio = "4 / 3";
    mainPhotoEmpty.textContent = photo.label;
    mainPhotoEmpty.hidden = false;
  }

  setActiveThumb();
  updateLightbox();

  if (currentPhotoIndex !== previousPhotoIndex) {
    trackEvent("Photo Change", {
      photo_index: currentPhotoIndex + 1,
      photo_label: photo.label,
      source,
    });
  }
};

const goToPreviousPhoto = (source = "arrow") => showPhoto(currentPhotoIndex - 1, source);
const goToNextPhoto = (source = "arrow") => showPhoto(currentPhotoIndex + 1, source);

const handleSwipeStart = (event) => {
  const touch = event.changedTouches?.[0];
  if (!touch) return;

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchMoved = false;
};

const handleSwipeEnd = (event, source = "swipe") => {
  const touch = event.changedTouches?.[0];
  if (!touch) return;

  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  const isHorizontalSwipe = Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4;

  if (!isHorizontalSwipe) return;

  touchMoved = true;
  suppressNextPhotoClick = true;

  if (deltaX < 0) {
    goToNextPhoto(source);
  } else {
    goToPreviousPhoto(source);
  }

  window.setTimeout(() => {
    suppressNextPhotoClick = false;
  }, 250);
};

const openLightbox = () => {
  const photo = activePhotos[currentPhotoIndex];
  if (!lightbox || !lightboxImg || !photo?.src) return;

  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  closeLightboxButton?.focus();
  trackEvent("Photo Fullscreen Open", {
    photo_index: currentPhotoIndex + 1,
    photo_label: photo.label,
  });
};

const closeLightbox = () => {
  if (!lightbox) return;

  lightbox.hidden = true;
  document.body.style.overflow = "";
  mainPhoto?.focus();
};

activePhotos.forEach((photo, index) => {
  const button = document.createElement("button");
  button.className = `thumb${index === 0 ? " is-active" : ""}`;
  button.type = "button";
  button.setAttribute("aria-label", photo.label);

  if (photo.src) {
    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = "";
    image.onload = () => setPhotoRatio(image, button);
    button.append(image);
  } else {
    const span = document.createElement("span");
    span.textContent = photo.label;
    button.append(span);
  }

  button.addEventListener("click", () => {
    showPhoto(index, "thumbnail");
  });

  thumbs?.append(button);
});

prevPhotoButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  goToPreviousPhoto("main_arrow");
});

nextPhotoButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  goToNextPhoto("main_arrow");
});

mainPhoto?.addEventListener("click", () => {
  if (suppressNextPhotoClick || touchMoved) return;
  openLightbox();
});
mainPhoto?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openLightbox();
  }
});
mainPhoto?.addEventListener("touchstart", handleSwipeStart, { passive: true });
mainPhoto?.addEventListener("touchend", (event) => handleSwipeEnd(event, "main_swipe"), { passive: true });

closeLightboxButton?.addEventListener("click", closeLightbox);
lightboxPrevButton?.addEventListener("click", () => goToPreviousPhoto("fullscreen_arrow"));
lightboxNextButton?.addEventListener("click", () => goToNextPhoto("fullscreen_arrow"));
lightbox?.addEventListener("touchstart", handleSwipeStart, { passive: true });
lightbox?.addEventListener("touchend", (event) => handleSwipeEnd(event, "fullscreen_swipe"), {
  passive: true,
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!activePhotos.length) return;

  if (event.key === "ArrowLeft") {
    goToPreviousPhoto("keyboard");
  }

  if (event.key === "ArrowRight") {
    goToNextPhoto("keyboard");
  }

  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});

if (activePhotos.length) {
  showPhoto(0);
}
