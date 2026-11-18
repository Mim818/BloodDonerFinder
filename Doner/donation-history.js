const form = document.getElementById("myForm");

// Sample data
let donations = [
  { date: "2026-06-14", place: "City Care Hospital", by: "Rafiq Hasan", status: "Verified" },
  { date: "2026-02-02", place: "Green Life Clinic", by: "Salma Khatun", status: "Verified" },
  { date: "2025-10-10", place: "Donation camp, Mirpur", by: "Rafiq Hasan", status: "Verified" },
  { date: "2025-05-21", place: "Popular Diagnostic", by: "-", status: "Pending" },
  { date: "2025-01-03", place: "City Care Hospital", by: "Rafiq Hasan", status: "Verified" }
];

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Today's date in yyyy-mm-dd format
let today = new Date().toISOString().split("T")[0];

form.addEventListener("submit", function (event) {
  event.preventDefault();   // stops page reload on submit
  clearErrors();

  let date = document.getElementById("donationDate");
  let hospital = document.getElementById("hospital");

  let valid = true;

  // Date validation
  if (date.value === "") {
    showError(date, "dateError", "Donation date is required.");
    valid = false;
  } else if (date.value > today) {
    showError(date, "dateError", "Date cannot be in the future.");
    valid = false;
  } else {
    showSuccess(date);
  }

  // Hospital validation
  if (hospital.value === "") {
    showError(hospital, "hospitalError", "Please select a hospital or camp.");
    valid = false;
  } else {
    showSuccess(hospital);
  }

  // Success
  if (valid) {
    donations.push({ date: date.value, place: hospital.value, by: "-", status: "Pending" });
    alert("Donation added! Hospital staff will verify it.");
    form.reset();
    clearErrors();
    showDonations();
  }
});

// ---------- Functions ----------

// Format date like 14 Jun 2026
function formatDate(text) {
  let d = new Date(text);
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}

// Show the table and the summary cards
function showDonations() {
  let body = document.getElementById("donationTable");
  body.innerHTML = "";

  donations.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  donations.forEach(function (d) {
    body.innerHTML +=
      "<tr><td>" + formatDate(d.date) + "</td><td>" + d.place + "</td><td>" + d.by +
      '</td><td><span class="tag ' + d.status.toLowerCase() + '">' + d.status + "</span></td></tr>";
  });

  let verified = donations.filter(function (d) {
    return d.status === "Verified";
  });

  document.getElementById("total").innerHTML = donations.length;
  document.getElementById("totalNote").innerHTML =
    verified.length + " verified, " + (donations.length - verified.length) + " pending";

  if (verified.length === 0) {
    document.getElementById("lastDate").innerHTML = "None";
    document.getElementById("lastPlace").innerHTML = "";
    document.getElementById("nextDate").innerHTML = "Eligible now";
    return;
  }

  document.getElementById("lastDate").innerHTML = formatDate(verified[0].date);
  document.getElementById("lastPlace").innerHTML = verified[0].place;

  // Next eligible date is 3 months after the last verified donation
  let next = new Date(verified[0].date);
  next.setMonth(next.getMonth() + 3);

  if (next <= new Date()) {
    document.getElementById("nextDate").innerHTML = "Eligible now";
  } else {
    document.getElementById("nextDate").innerHTML = formatDate(next);
  }
}

// Show error
function showError(input, errorId, message) {
  input.classList.add("errorBorder");
  input.classList.remove("successBorder");
  document.getElementById(errorId).innerHTML = message;
}

// Show success
function showSuccess(input) {
  input.classList.remove("errorBorder");
  input.classList.add("successBorder");
}

// Clear all errors
function clearErrors() {
  let errors = document.querySelectorAll(".error");
  errors.forEach(function (item) {
    item.innerHTML = "";
  });

  let fields = document.querySelectorAll("input, select, textarea");
  fields.forEach(function (field) {
    field.classList.remove("errorBorder");
    field.classList.remove("successBorder");
  });
}

showDonations();
