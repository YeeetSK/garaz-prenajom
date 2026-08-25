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
  dimensions: "5,50 × 2,80 m",
  area: "15,4 m²",
  length: "5,50 m",
  width: "2,80 m",
  gateHeight: "2,00 m",
  availability: "Ihneď",

  // Add real photo paths here later, for example: "assets/fotka-1.jpg".
  photos: [
    { src: "", label: "Fotka bude doplnená" },
    { src: "", label: "Interiér bude doplnený" },
    { src: "", label: "Vjazd bude doplnený" },
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

const callButton = document.getElementById("call-button");
if (callButton) {
  callButton.href = `tel:${GARAGE_LISTING.phoneNumber.replace(/\s/g, "")}`;
}

const mainPhoto = document.getElementById("main-photo");
const mainPhotoImg = document.getElementById("main-photo-img");
const mainPhotoEmpty = document.getElementById("main-photo-empty");
const thumbs = document.getElementById("thumbs");

const showPhoto = (photo) => {
  if (!mainPhoto || !mainPhotoImg || !mainPhotoEmpty) return;

  mainPhoto.setAttribute("aria-label", photo.label);
  if (photo.src) {
    mainPhotoImg.src = photo.src;
    mainPhotoImg.alt = photo.label;
    mainPhotoImg.hidden = false;
    mainPhotoEmpty.hidden = true;
  } else {
    mainPhotoImg.removeAttribute("src");
    mainPhotoImg.alt = "";
    mainPhotoImg.hidden = true;
    mainPhotoEmpty.textContent = photo.label;
    mainPhotoEmpty.hidden = false;
  }
};

GARAGE_LISTING.photos.forEach((photo, index) => {
  const button = document.createElement("button");
  button.className = `thumb${index === 0 ? " is-active" : ""}`;
  button.type = "button";
  button.setAttribute("aria-label", photo.label);

  if (photo.src) {
    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = "";
    button.append(image);
  } else {
    const span = document.createElement("span");
    span.textContent = photo.label;
    button.append(span);
  }

  button.addEventListener("click", () => {
    showPhoto(photo);
    thumbs.querySelectorAll(".thumb").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });

  thumbs.append(button);
});

showPhoto(GARAGE_LISTING.photos[0]);
