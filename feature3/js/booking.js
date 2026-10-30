document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const form = document.getElementById("bookingForm");
  const nameInput = document.getElementById("customerName");
  const emailInput = document.getElementById("customerEmail");
  const phoneInput = document.getElementById("customerPhone");
  const movieInput = document.getElementById("movieSelect");
  const cinemaInput = document.getElementById("cinemaSelect");
  const dateInput = document.getElementById("showDate");
  const timeInput = document.getElementById("showTime");
  const dateError = document.getElementById("showDateError");
  const timeError = document.getElementById("showTimeError");
  const dateMark = document.getElementById("showDateMark");
  const timeMark = document.getElementById("showTimeMark");
  const seatMap = document.getElementById("seatMap");
  const seatError = document.getElementById("seatError");
  const status = document.getElementById("formStatus");
  const subtotalOutput = document.getElementById("ticketSubtotal");
  const feeOutput = document.getElementById("convenienceFee");
  const totalOutput = document.getElementById("totalPrice");
  const countOutput = document.getElementById("seatCountLabel");

  const STORAGE_BOOKINGS = "cinebookDemoBookings";
  const STORAGE_LATEST = "movieBooking";
  const CONVENIENCE_FEE = 30;
  const MAX_TICKETS = 8;
  const ROWS = ["A", "B", "C", "D", "E"];
  const SEATS_PER_ROW = 8;
  const selectedSeats = new Set();
  const touched = new Set();

  const movies = {
    avengers: {
      title: "Avengers: Endgame", rating: "8.4",
      posterSrc: "https://i.ebayimg.com/images/g/LHEAAOSwjhlgm8oc/s-l1200.jpg",
      year: "2019", genre: "Action", duration: "3h 1m", language: "English",
      description: "After the devastating events of Infinity War, the Avengers assemble for one final stand to restore balance to the universe."
    },
    spiderverse: {
      title: "Spider-Man: Across the Spider-Verse", rating: "8.6",
      posterSrc: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      year: "2023", genre: "Animation", duration: "2h 20m", language: "English",
      description: "Miles Morales swings into a multiverse-spanning adventure alongside a new team of Spider-People."
    },
    dune: {
      title: "Dune: Part Two", rating: "8.5",
      posterSrc: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      year: "2024", genre: "Sci-Fi", duration: "2h 46m", language: "English",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
    },
    batman: {
      title: "The Batman", rating: "7.8",
      posterSrc: "https://resizing.flixster.com/HUwAlW1QAya1vlIePUDv3kdzhIE%3D/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzc1OGFlMDI0LTE1ZTEtNDE4ZS04Y2RmLWNjYzcyOWQyZmMyNi5qcGc=",
      year: "2022", genre: "Action / Crime", duration: "2h 56m", language: "English",
      description: "Batman investigates corruption in Gotham City and follows a trail of clues left by a mysterious killer."
    },
    inception: {
      title: "Inception", rating: "8.8",
      posterSrc: "https://artofthemovies.co.uk/cdn/shop/files/inception_advance_SD18120_B-731214_920c5dfe-8d66-47c7-af74-11b98a83ebbf_1024x1024%402x.jpg?v=1737545739",
      year: "2010", genre: "Sci-Fi / Thriller", duration: "2h 28m", language: "English",
      description: "A skilled thief enters people's dreams to steal secrets, then takes on a seemingly impossible mission to plant an idea."
    },
    interstellar: {
      title: "Interstellar", rating: "8.7",
      posterSrc: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      year: "2014", genre: "Sci-Fi / Drama", duration: "2h 49m", language: "English",
      description: "A team of explorers travels beyond this galaxy to discover whether humankind has a future among the stars."
    },
    oppenheimer: {
      title: "Oppenheimer", rating: "8.3",
      posterSrc: "https://image.tmdb.org/t/p/original/mgjKNDzFINGvNFtHSqzfUZ4pk6Y.jpg",
      year: "2023", genre: "Drama / History", duration: "3h", language: "English",
      description: "A portrait of J. Robert Oppenheimer and the scientific, moral and personal consequences of developing the atomic bomb."
    },
    insideout2: {
      title: "Inside Out 2", rating: "7.6",
      posterSrc: "https://thewaltdisneycompany.com/app/uploads/2024/06/IO2_Payoff_Squish_1s_v8.1_Mech5_FS-1440x2133.jpg",
      year: "2024", genre: "Animation / Comedy", duration: "1h 36m", language: "English",
      description: "As Riley enters her teenage years, familiar emotions face a new set of feelings inside her mind."
    },
    deadpoolwolverine: {
      title: "Deadpool & Wolverine", rating: "7.5",
      posterSrc: "https://cdn.marvel.com/content/2x/dp3_1sht_digital_srgb_ka_swords_v5_resized.jpg",
      year: "2024", genre: "Action / Comedy", duration: "2h 8m", language: "English",
      description: "Deadpool recruits a reluctant Wolverine for a chaotic multiverse adventure."
    },
    joker: {
      title: "Joker", rating: "8.4",
      posterSrc: "https://image.tmdb.org/t/p/w780/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
      year: "2019", genre: "Crime / Drama", duration: "2h 2m", language: "English",
      description: "A struggling comedian's isolation and hardship lead him down a dark path in Gotham City."
    }
  };

  const rowPrices = { A: 220, B: 220, C: 280, D: 280, E: 350 };
  const rowCategories = { A: "Silver", B: "Silver", C: "Gold", D: "Gold", E: "Recliner" };
  const categoryClasses = { A: "standard", B: "standard", C: "prime", D: "prime", E: "recliner" };
  const seedSoldPatterns = [
    ["A4", "B5", "C3", "D7", "E2"],
    ["A7", "B2", "C6", "D4", "E8"],
    ["A2", "B8", "C5", "D1", "E6"]
  ];

  const money = amount => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(amount);

  const localDateString = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const todayString = localDateString(today);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);
  dateInput.min = todayString;
  dateInput.max = localDateString(maxDate);
  const defaultDate = new Date(today);
  defaultDate.setDate(defaultDate.getDate() + 1);
  dateInput.value = localDateString(defaultDate);

  const validators = {
    customerName(value) {
      const text = value.trim();
      if (!text) return "Please enter your full name.";
      if (text.length < 2) return "Name must contain at least 2 characters.";
      if (!/^[\p{L}][\p{L}\s.'’-]*$/u.test(text)) return "Use letters, spaces, apostrophes or hyphens only.";
      return "";
    },
    customerEmail(value) {
      const email = value.trim();
      if (!email) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Enter a valid email, such as name@example.com.";
      return "";
    },
    customerPhone(value) {
      const phone = value.trim();
      if (!phone) return "Please enter your mobile number.";
      if (!/^[6-9]\d{9}$/.test(phone)) return "Enter a valid 10-digit Indian mobile number.";
      return "";
    }
  };

  function setFieldState(input, message, showValid = true) {
    const group = input.closest(".field-group");
    const mark = group?.querySelector(".field-mark");
    const error = group?.querySelector(".field-error");
    input.classList.remove("invalid", "valid");
    mark?.classList.remove("error", "success");
    if (mark) mark.textContent = "";
    if (error) error.textContent = message;
    input.removeAttribute("aria-invalid");

    if (message) {
      input.classList.add("invalid");
      mark?.classList.add("error");
      if (mark) mark.textContent = "✕";
      input.setAttribute("aria-invalid", "true");
      return false;
    }
    if (showValid && input.value.trim()) {
      input.classList.add("valid");
      mark?.classList.add("success");
      if (mark) mark.textContent = "✓";
      input.setAttribute("aria-invalid", "false");
    }
    return true;
  }

  function validateField(input) {
    return setFieldState(input, validators[input.id](input.value), true);
  }

  [nameInput, emailInput, phoneInput].forEach(input => {
    input.addEventListener("blur", () => {
      touched.add(input.id);
      validateField(input);
    });
    input.addEventListener("input", () => {
      if (touched.has(input.id)) validateField(input);
      status.textContent = "";
    });
  });
  phoneInput.addEventListener("input", () => {
    const cleaned = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    if (cleaned !== phoneInput.value) phoneInput.value = cleaned;
    if (touched.has(phoneInput.id)) validateField(phoneInput);
  });

  function formatShowDate(isoDate) {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day, 12).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric"
    });
  }

  function setDateState(message, valid) {
    dateInput.classList.remove("invalid", "valid");
    dateMark.classList.remove("error", "success");
    dateMark.textContent = "";
    dateError.textContent = message;
    dateInput.removeAttribute("aria-invalid");
    if (message) {
      dateInput.classList.add("invalid");
      dateMark.classList.add("error");
      dateMark.textContent = "✕";
      dateInput.setAttribute("aria-invalid", "true");
      return false;
    }
    if (valid) {
      dateInput.classList.add("valid");
      dateMark.classList.add("success");
      dateMark.textContent = "✓";
      dateInput.setAttribute("aria-invalid", "false");
    }
    return true;
  }

  function validateDate(showMark = true) {
    const value = dateInput.value;
    if (!value) return setDateState("Please select a show date.", false);
    if (value < todayString) return setDateState("You cannot book a show in the past.", false);
    if (value > dateInput.max) return setDateState("Choose a date within the next 30 days.", false);
    return setDateState("", showMark);
  }

  function setTimeState(message, valid) {
    timeInput.classList.remove("invalid", "valid");
    timeMark.classList.remove("error", "success");
    timeMark.textContent = "";
    timeError.textContent = message;
    timeInput.removeAttribute("aria-invalid");
    if (message) {
      timeInput.classList.add("invalid");
      timeMark.classList.add("error");
      timeMark.textContent = "✕";
      timeInput.setAttribute("aria-invalid", "true");
      return false;
    }
    if (valid) {
      timeInput.classList.add("valid");
      timeMark.classList.add("success");
      timeMark.textContent = "✓";
      timeInput.setAttribute("aria-invalid", "false");
    }
    return true;
  }

  function validateTime(showMark = true) {
    if (!dateInput.value || dateInput.value < todayString) {
      return setTimeState("Choose a valid show date first.", false);
    }
    const match = timeInput.value.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
    if (!match) return setTimeState("Please select a valid show time.", false);
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === "PM") hour += 12;
    const minute = Number(match[2]);
    const selectedDateTime = new Date(`${dateInput.value}T00:00:00`);
    selectedDateTime.setHours(hour, minute, 0, 0);
    if (dateInput.value === localDateString(new Date()) && selectedDateTime <= new Date()) {
      return setTimeState("This show has already started. Choose a later time.", false);
    }
    return setTimeState("", showMark);
  }

  function getBookings() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_BOOKINGS) || "[]");
      return Array.isArray(parsed) ? parsed.filter(item => item && Array.isArray(item.seats) && item.screenKey) : [];
    } catch {
      return [];
    }
  }

  function getScreenKey() {
    return [movieInput.value, cinemaInput.value, dateInput.value, timeInput.value].join("::");
  }

  function getSeededSoldSeats(screenKey) {
    let hash = 0;
    for (let index = 0; index < screenKey.length; index++) {
      hash = (hash * 31 + screenKey.charCodeAt(index)) >>> 0;
    }
    return new Set(seedSoldPatterns[hash % seedSoldPatterns.length]);
  }

  function getSoldSeats(screenKey) {
    const sold = getSeededSoldSeats(screenKey);
    getBookings().filter(booking => booking.screenKey === screenKey).forEach(booking => {
      booking.seats.forEach(seat => sold.add(seat));
    });
    return sold;
  }

  function currentSeatPrice(seatName) {
    return rowPrices[seatName.charAt(0)] || rowPrices.A;
  }

  function renderSeatMap() {
    const soldSeats = getSoldSeats(getScreenKey());
    seatMap.replaceChildren();
    ROWS.forEach(row => {
      const rowElement = document.createElement("div");
      rowElement.className = "seat-row";
      const rowLabel = document.createElement("span");
      rowLabel.className = "row-label";
      rowLabel.textContent = row;
      rowElement.appendChild(rowLabel);

      for (let number = 1; number <= SEATS_PER_ROW; number++) {
        const seatName = `${row}${number}`;
        const button = document.createElement("button");
        const isSold = soldSeats.has(seatName);
        button.type = "button";
        button.className = `seat ${categoryClasses[row]}${isSold ? " occupied" : ""}`;
        button.dataset.seat = seatName;
        button.dataset.price = String(rowPrices[row]);
        button.textContent = String(number);
        button.disabled = isSold;
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", isSold ? `Seat ${seatName}, sold` : `Seat ${seatName}, ${rowCategories[row]}, ${money(rowPrices[row])}, available`);
        if (number === 5) button.style.marginLeft = "clamp(3px, .65vw, 8px)";
        button.addEventListener("click", () => toggleSeat(seatName, button));
        rowElement.appendChild(button);
      }
      seatMap.appendChild(rowElement);
    });
  }

  function toggleSeat(seatName, button) {
    if (selectedSeats.has(seatName)) {
      selectedSeats.delete(seatName);
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    } else {
      if (selectedSeats.size >= MAX_TICKETS) {
        seatError.textContent = `You can select up to ${MAX_TICKETS} seats in one demo booking.`;
        return;
      }
      selectedSeats.add(seatName);
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
    }
    seatError.textContent = "";
    status.textContent = "";
    updatePrice();
  }

  function updatePrice() {
    const seatNames = [...selectedSeats];
    const subtotal = seatNames.reduce((sum, seatName) => sum + currentSeatPrice(seatName), 0);
    const fee = seatNames.length ? CONVENIENCE_FEE : 0;
    subtotalOutput.textContent = money(subtotal);
    feeOutput.textContent = money(fee);
    totalOutput.textContent = money(subtotal + fee);
    countOutput.textContent = seatNames.length
      ? `${seatNames.length} seat${seatNames.length === 1 ? "" : "s"} selected`
      : "No seats selected";
  }

  function resetSelectedSeats() {
    selectedSeats.clear();
    seatError.textContent = "";
    status.textContent = "";
    renderSeatMap();
    updatePrice();
  }

  function updateMovieDetails() {
    const movie = movies[movieInput.value] || movies.avengers;
    document.getElementById("moviePanelHeading").textContent = movie.title;
    document.getElementById("movieRating").textContent = `★ ${movie.rating}`;
    document.getElementById("posterRating").textContent = `★ ${movie.rating}`;
    const posterImage = document.getElementById("moviePosterImage");
    posterImage.src = movie.posterSrc;
    posterImage.alt = `${movie.title} movie poster`;
    document.getElementById("movieDescription").textContent = movie.description;
    document.getElementById("movieMetadata").replaceChildren();
    [movie.year, movie.genre, movie.duration, movie.language].forEach((value, index) => {
      if (index) {
        const separator = document.createElement("i");
        separator.setAttribute("aria-hidden", "true");
        document.getElementById("movieMetadata").appendChild(separator);
      }
      const item = document.createElement("span");
      item.textContent = value;
      document.getElementById("movieMetadata").appendChild(item);
    });
    const poster = document.getElementById("moviePoster");
    poster.dataset.movie = movieInput.value;
    poster.dataset.title = movie.title;
  }

  function handleScreenChange() {
    resetSelectedSeats();
    if (touched.has("showDate")) validateDate(true);
    if (touched.has("showTime")) validateTime(true);
  }

  movieInput.addEventListener("change", () => {
    updateMovieDetails();
    handleScreenChange();
  });
  cinemaInput.addEventListener("change", handleScreenChange);
  dateInput.addEventListener("change", () => {
    touched.add("showDate");
    touched.add("showTime");
    validateDate(true);
    validateTime(true);
    handleScreenChange();
  });
  dateInput.addEventListener("blur", () => {
    touched.add("showDate");
    validateDate(true);
  });
  timeInput.addEventListener("change", () => {
    touched.add("showTime");
    validateTime(true);
    handleScreenChange();
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    status.textContent = "";
    [nameInput, emailInput, phoneInput].forEach(input => touched.add(input.id));
    touched.add("showDate");
    touched.add("showTime");
    const fieldsValid = [nameInput, emailInput, phoneInput].map(validateField).every(Boolean);
    const dateValid = validateDate(true);
    const timeValid = validateTime(true);
    let otherValid = true;

    if (!dateValid || !timeValid) otherValid = false;
    if (selectedSeats.size === 0) {
      seatError.textContent = "Please select at least one available seat.";
      otherValid = false;
    }

    if (!fieldsValid || !otherValid) {
      status.textContent = "Please fix the highlighted fields and select your seats before confirming.";
      const firstInvalid = [nameInput, emailInput, phoneInput].find(input => validators[input.id](input.value));
      if (firstInvalid) firstInvalid.focus();
      else if (!dateValid) dateInput.focus();
      else if (!timeValid) timeInput.focus();
      else seatMap.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const screenKey = getScreenKey();
    const soldSeats = getSoldSeats(screenKey);
    const noLongerAvailable = [...selectedSeats].filter(seat => soldSeats.has(seat));
    if (noLongerAvailable.length) {
      resetSelectedSeats();
      seatError.textContent = `These seats are no longer available: ${noLongerAvailable.join(", ")}. Please choose again.`;
      status.textContent = "Seat availability changed. Please select available seats again.";
      return;
    }

    const bookingSeats = [...selectedSeats].sort((a, b) => a.localeCompare(b));
    const subtotal = bookingSeats.reduce((sum, seatName) => sum + currentSeatPrice(seatName), 0);
    const fee = bookingSeats.length ? CONVENIENCE_FEE : 0;
    const movie = movies[movieInput.value] || movies.avengers;
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `CB-${dateInput.value.replaceAll("-", "")}-${String(Date.now()).slice(-4)}${randomPart}`;

    const booking = {
      customerName: nameInput.value.trim(),
      customerEmail: emailInput.value.trim(),
      customerPhone: phoneInput.value.trim(),
      movieId: movieInput.value,
      movie: movie.title,
      movieMeta: `${movie.year} · ${movie.genre} · ${movie.language}`,
      theater: cinemaInput.value,
      date: formatShowDate(dateInput.value),
      dateISO: dateInput.value,
      time: timeInput.value,
      seats: bookingSeats,
      seatDetails: bookingSeats.map(seat => ({ name: seat, category: rowCategories[seat.charAt(0)], price: currentSeatPrice(seat) })),
      ticketPrice: null,
      subtotal,
      convenienceFee: fee,
      amount: subtotal + fee,
      bookingId,
      screenKey,
      bookedAt: new Date().toISOString(),
      status: "Demo confirmed"
    };

    let previousBookings = null;
    let previousLatest = null;
    try {
      previousBookings = localStorage.getItem(STORAGE_BOOKINGS);
      previousLatest = localStorage.getItem(STORAGE_LATEST);
      const bookings = getBookings();
      bookings.push(booking);
      localStorage.setItem(STORAGE_BOOKINGS, JSON.stringify(bookings));
      localStorage.setItem(STORAGE_LATEST, JSON.stringify(booking));
      window.location.href = "ticket.html";
    } catch (error) {
      // Roll back a partial localStorage write so a failed confirmation doesn't reserve seats accidentally.
      try {
        if (previousBookings === null) localStorage.removeItem(STORAGE_BOOKINGS);
        else localStorage.setItem(STORAGE_BOOKINGS, previousBookings);
        if (previousLatest === null) localStorage.removeItem(STORAGE_LATEST);
        else localStorage.setItem(STORAGE_LATEST, previousLatest);
      } catch { /* Storage is unavailable; show the friendly error below. */ }
      status.textContent = "Your browser could not save this demo booking. Check that site storage is enabled and try again.";
    }
  });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_BOOKINGS) {
      resetSelectedSeats();
      status.textContent = "Seat availability has updated in another tab. Please review the available seats.";
    }
  });

  const featuredImage = document.getElementById("moviePosterImage");
  const featuredPoster = document.getElementById("moviePoster");
  featuredImage.addEventListener("error", () => featuredPoster.classList.add("image-error"));
  featuredImage.addEventListener("load", () => featuredPoster.classList.remove("image-error"));
  updateMovieDetails();
  renderSeatMap();
  updatePrice();
});
