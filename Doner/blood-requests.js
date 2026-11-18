// Sample data
let requests = [
  { id: 1, group: "B+", place: "City Care Hospital, Mirpur", units: 2, within: "6 hours", ago: "12 min ago", urgency: "High", type: "Direct", name: "Rahim U.", phone: "01800-000001" },
  { id: 2, group: "B+", place: "Green Life Clinic, Mirpur", units: 1, within: "24 hours", ago: "1 hr ago", urgency: "Medium", type: "Area-wide", name: "Sadia A.", phone: "01800-000002" },
  { id: 3, group: "B+", place: "Popular Diagnostic, Mirpur", units: 1, within: "3 days", ago: "3 hrs ago", urgency: "Low", type: "Area-wide", name: "Imran H.", phone: "01800-000003" },
  { id: 4, group: "B+", place: "Square Hospital, Mirpur", units: 2, within: "24 hours", ago: "5 hrs ago", urgency: "Medium", type: "Area-wide", name: "Nusrat J.", phone: "01800-000004" }
];

let accepted = [
  { group: "O-", place: "Green Life Clinic, Mirpur", name: "Rahim U.", phone: "01800-000000" }
];

let urgencyOrder = { High: 1, Medium: 2, Low: 3 };
let currentTab = "All";

// ---------- Functions ----------

// Change the tab
function setTab(tab) {
  currentTab = tab;
  document.getElementById("tabAll").classList.remove("activeTab");
  document.getElementById("tabDirect").classList.remove("activeTab");
  document.getElementById("tabArea").classList.remove("activeTab");

  if (tab === "All") {
    document.getElementById("tabAll").classList.add("activeTab");
  } else if (tab === "Direct") {
    document.getElementById("tabDirect").classList.add("activeTab");
  } else {
    document.getElementById("tabArea").classList.add("activeTab");
  }
  showRequests();
}

// Count requests of one type
function countType(type) {
  return requests.filter(function (r) {
    return r.type === type;
  }).length;
}

// Show open requests (most urgent first)
function showRequests() {
  let list = document.getElementById("requestList");
  list.innerHTML = "";

  let shown = requests.filter(function (r) {
    return currentTab === "All" || r.type === currentTab;
  });

  shown.sort(function (a, b) {
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  if (shown.length === 0) {
    list.innerHTML = "<p class='sub'>No open requests in this tab.</p>";
  }

  shown.forEach(function (r) {
    let typeTag = '<span class="tag medium">Area-wide</span>';
    if (r.type === "Direct") {
      typeTag = '<span class="tag blue">Direct to you</span>';
    }

    list.innerHTML +=
      '<div class="req-row">' +
      '<div class="group-circle">' + r.group + '</div>' +
      '<div class="req-info">' + r.place +
      '<span>' + r.units + ' units &middot; within ' + r.within + ' &middot; ' + r.ago + '</span></div>' +
      '<span class="tag ' + r.urgency.toLowerCase() + '">' + r.urgency + ' urgency</span>' +
      typeTag +
      '<button onclick="acceptRequest(' + r.id + ')">Accept</button>' +
      '<button class="light" onclick="declineRequest(' + r.id + ')">Decline</button>' +
      '</div>';
  });

  document.getElementById("tabAll").innerHTML = "All (" + requests.length + ")";
  document.getElementById("tabDirect").innerHTML = "Direct to me (" + countType("Direct") + ")";
  document.getElementById("tabArea").innerHTML = "Area-wide (" + countType("Area-wide") + ")";
  document.getElementById("navBadge").innerHTML = requests.length;
  document.getElementById("bellCount").innerHTML = requests.length;
}

// Show accepted requests with the recipient contact
function showAccepted() {
  let list = document.getElementById("acceptedList");
  list.innerHTML = "";

  if (accepted.length === 0) {
    list.innerHTML = "<p class='sub'>You have not accepted any request yet.</p>";
  }

  accepted.forEach(function (a) {
    list.innerHTML +=
      '<div class="req-row">' +
      '<div class="group-circle">' + a.group + '</div>' +
      '<div class="req-info">' + a.place +
      '<span>Recipient: ' + a.name + ' &middot; contact: ' + a.phone + '</span></div>' +
      '<button onclick="callRecipient(\'' + a.phone + '\')">Call recipient</button>' +
      '</div>';
  });

  document.getElementById("activeCount").innerHTML = accepted.length + " active";
}

// Call the recipient
function callRecipient(phone) {
  alert("Calling " + phone);
}

// Accept a request (phone number is revealed after accepting)
function acceptRequest(id) {
  let r = requests.find(function (item) {
    return item.id === id;
  });
  accepted.push({ group: r.group, place: r.place, name: r.name, phone: r.phone });
  requests = requests.filter(function (item) {
    return item.id !== id;
  });
  showRequests();
  showAccepted();
}

// Decline a request
function declineRequest(id) {
  requests = requests.filter(function (item) {
    return item.id !== id;
  });
  showRequests();
}

showRequests();
showAccepted();
