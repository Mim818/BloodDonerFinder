// Sample data
let requests = [
  { id: 1, group: "B+", place: "City Care Hospital, Mirpur", units: 2, within: "6 hours", ago: "12 min ago", urgency: "High", phone: "01800-000001" },
  { id: 2, group: "B+", place: "Green Life Clinic, Mirpur", units: 1, within: "24 hours", ago: "1 hr ago", urgency: "Medium", phone: "01800-000002" },
  { id: 3, group: "B+", place: "Popular Diagnostic, Mirpur", units: 1, within: "3 days", ago: "3 hrs ago", urgency: "Low", phone: "01800-000003" }
];

let donations = [
  { date: "2026-06-14", place: "City Care Hospital", status: "Verified" },
  { date: "2026-02-02", place: "Green Life Clinic", status: "Verified" },
  { date: "2025-10-10", place: "Donation camp, Mirpur", status: "Verified" },
  { date: "2025-05-21", place: "Popular Diagnostic", status: "Pending" },
  { date: "2025-01-03", place: "City Care Hospital", status: "Verified" }
];

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let urgencyOrder = { High: 1, Medium: 2, Low: 3 };

// Greeting
let hour = new Date().getHours();
let word = "Good evening";
if (hour < 12) {
  word = "Good morning";
} else if (hour < 18) {
  word = "Good afternoon";
}
document.getElementById("greeting").innerHTML = word + ", Karim";

// Availability switch
document.getElementById("availToggle").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("availText").innerHTML = "Available to donate";
  } else {
    document.getElementById("availText").innerHTML = "Not available";
  }
});

// ---------- Functions ----------

// Format date like 14 Jun 2026
function formatDate(text) {
  let d = new Date(text);
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}

// Donations sorted newest first
function sortedDonations() {
  return donations.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
}

// Show matching requests (most urgent first)
function showRequests() {
  let list = document.getElementById("requestList");
  list.innerHTML = "";

  requests.sort(function (a, b) {
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  if (requests.length === 0) {
    list.innerHTML = "<p class='sub'>No matching requests right now.</p>";
  }

  requests.forEach(function (r) {
    list.innerHTML +=
      '<div class="req-row">' +
      '<div class="group-circle">' + r.group + '</div>' +
      '<div class="req-info">' + r.place +
      '<span>' + r.units + ' units &middot; within ' + r.within + ' &middot; ' + r.ago + '</span></div>' +
      '<span class="tag ' + r.urgency.toLowerCase() + '">' + r.urgency + ' urgency</span>' +
      '<button onclick="acceptRequest(' + r.id + ')">Accept</button>' +
      '<button class="light" onclick="declineRequest(' + r.id + ')">Decline</button>' +
      '</div>';
  });

  document.getElementById("newCount").innerHTML = requests.length + " new";
  document.getElementById("navBadge").innerHTML = requests.length;
  document.getElementById("bellCount").innerHTML = requests.length;
}

// Accept a request
function acceptRequest(id) {
  let r = requests.find(function (item) {
    return item.id === id;
  });
  alert("Request accepted! Recipient contact: " + r.phone);
  requests = requests.filter(function (item) {
    return item.id !== id;
  });
  document.getElementById("answered").innerHTML =
    Number(document.getElementById("answered").innerHTML) + 1;
  showRequests();
}

// Decline a request
function declineRequest(id) {
  requests = requests.filter(function (item) {
    return item.id !== id;
  });
  showRequests();
}

// Donation history timeline (last 3 donations)
function showTimeline() {
  let box = document.getElementById("timeline");
  box.innerHTML = "";
  sortedDonations().slice(0, 3).forEach(function (d) {
    box.innerHTML +=
      '<div class="timeline-item"><b>' + formatDate(d.date) + '</b>' +
      '<span>' + d.place + ' <span class="tag ' + d.status.toLowerCase() + '">' + d.status + '</span></span></div>';
  });
}

// Total donations and eligibility (3 months after the last verified donation)
function showEligibility() {
  document.getElementById("totalDonations").innerHTML = donations.length;

  let verified = sortedDonations().filter(function (d) {
    return d.status === "Verified";
  });

  document.getElementById("lastNote").innerHTML = "Last: " + formatDate(verified[0].date);

  let next = new Date(verified[0].date);
  next.setMonth(next.getMonth() + 3);

  if (next <= new Date()) {
    document.getElementById("eligibility").innerHTML = "Eligible now";
    document.getElementById("eligibleNote").innerHTML = "Over 3 months since last donation";
  } else {
    document.getElementById("eligibility").innerHTML = "Not yet";
    document.getElementById("eligibleNote").innerHTML = "Next eligible: " + formatDate(next);
  }
}

showRequests();
showTimeline();
showEligibility();
