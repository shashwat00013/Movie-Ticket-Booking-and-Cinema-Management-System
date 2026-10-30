document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const status = document.getElementById("ticketStatus");
  const ticketCard = document.getElementById("printableTicket");
  const successHeading = document.querySelector(".success-heading");
  const ticketActions = document.querySelector(".ticket-actions");
  const printButton = document.getElementById("printTicket");
  let saved = null;
  try {
    saved = localStorage.getItem("movieBooking");
  } catch {
    showMissingBooking("Browser storage is unavailable. Please open this site with VS Code Live Server and try again.");
    return;
  }

  const showMissingBooking = message => {
    status.textContent = message;
    ticketCard.hidden = true;
    successHeading.hidden = true;
    ticketActions.hidden = true;
  };

  if (!saved) {
    showMissingBooking("No booking was found in this browser. Return to the booking page to create a booking.");
    return;
  }

  let booking;
  try {
    booking = JSON.parse(saved);
  } catch {
    showMissingBooking("The saved booking could not be read. Please make a new booking.");
    return;
  }

  if (!booking || !Array.isArray(booking.seats) || booking.seats.length === 0 || !booking.bookingId || !booking.movie) {
    showMissingBooking("The saved booking is incomplete. Please return to booking and try again.");
    return;
  }

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value == null || value === "" ? "—" : String(value);
  };
  const money = amount => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(Number(amount) || 0);

  setText("ticketMovie", booking.movie);
  setText("ticketMovieMeta", booking.movieMeta || "Cinema experience");
  setText("ticketBookingId", booking.bookingId);
  setText("ticketReference", booking.bookingId);
  setText("ticketName", booking.customerName);
  setText("ticketEmail", booking.customerEmail);
  setText("ticketPhone", booking.customerPhone ? `+91 ${booking.customerPhone}` : "—");
  setText("ticketTheater", booking.theater);
  setText("ticketDate", booking.date);
  setText("ticketTime", booking.time);
  setText("ticketSeats", booking.seats.join(", "));
  setText("ticketSubtotal", money(booking.subtotal));
  setText("ticketFee", money(booking.convenienceFee));
  setText("ticketAmount", money(booking.amount));

  // Generate a booking-specific QR for every movie in the 10-movie catalogue.
  // Deliberately exclude customer name, email and phone from the QR payload.
  const qrImage = document.getElementById("ticketQr");
  const qrPlaceholder = document.getElementById("ticketQrPlaceholder");
  const qrStatus = document.getElementById("ticketQrStatus");
  if (qrImage && qrStatus) {
    const qrPayload = [
      "CINEBOOK BOOKING",
      `Booking ID: ${booking.bookingId}`,
      `Movie: ${booking.movie}`,
      `Cinema: ${booking.theater}`,
      `Date: ${booking.date}`,
      `Show: ${booking.time}`,
      `Seats: ${booking.seats.join(", ")}`,
      `Total: ${money(booking.amount)}`
    ].join("\n");

    // The QR is created as an image by an online QR endpoint, so an internet
    // connection is required for the QR image (the booking itself remains local).
    const qrUrl = new URL("https://api.qrserver.com/v1/create-qr-code/");
    qrUrl.search = new URLSearchParams({
      size: "220x220",
      format: "png",
      margin: "8",
      data: qrPayload
    }).toString();

    qrImage.addEventListener("load", () => {
      qrImage.hidden = false;
      if (qrPlaceholder) qrPlaceholder.hidden = true;
      qrStatus.textContent = "QR ready · Scan to view booking details.";
    }, { once: true });
    qrImage.addEventListener("error", () => {
      qrImage.hidden = true;
      if (qrPlaceholder) qrPlaceholder.hidden = false;
      qrStatus.textContent = "QR image could not load. Check your internet connection and refresh this ticket.";
    }, { once: true });
    qrImage.src = qrUrl.toString();
  }

  const printTicket = () => window.print();
  printButton.addEventListener("click", printTicket);
});
