const checklist = {
  "Lights & Visibility": [
    "Headlights (dipped & main)",
    "Side lights",
    "Brake lights",
    "Indicators",
    "Hazard lights",
    "Reverse light",
    "Number plate lights",
    "Lights clean and secure",
    "Windscreen clear of cracks",
    "Mirrors clean and secure"
  ],
  "Tyres & Wheels": [
    "Tread above legal limit",
    "No cuts or bulges",
    "Correct tyre pressures",
    "Wheel nuts present",
    "No damaged wheels",
    "Spare wheel or repair kit"
  ],
  "Brakes & Steering": [
    "Foot brake responsive",
    "Handbrake holds vehicle",
    "Steering free from play",
    "No unusual noises"
  ],
  "Bodywork & Doors": [
    "No sharp edges",
    "Doors open and close securely",
    "Sliding/rear doors latch correctly",
    "No visible fluid leaks"
  ],
  "Cab & Controls": [
    "Seat secure",
    "Seatbelt working",
    "Horn works",
    "Wipers working",
    "Washers working",
    "Heater/demister working",
    "No warning lights showing"
  ],
  "Safety Equipment": [
    "First aid kit",
    "Fire extinguisher (if required)",
    "Warning triangle",
    "Hi-vis vest"
  ],
  "Load Area": [
    "Load secure",
    "Bulkhead secure",
    "No loose items",
    "Vehicle not overloaded"
  ]
};

const state = {};
const photos = [];
const checklistEl = document.getElementById("checklist");

for (const section in checklist) {
  const sectionDiv = document.createElement("div");
  sectionDiv.className = "section";
  sectionDiv.innerHTML = `<h2>${section}</h2>`;

  checklist[section].forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    const label = document.createElement("p");
    label.textContent = item;

    const buttons = document.createElement("div");
    buttons.className = "buttons";

    const pass = document.createElement("button");
    pass.textContent = "PASS";
    pass.className = "pass";

    const fail = document.createElement("button");
    fail.textContent = "FAIL";
    fail.className = "fail";

    const time = document.createElement("small");

    const setStatus = status => {
      const timestamp = new Date().toLocaleString();
      state[item] = { status, timestamp };
      time.textContent = `${status.toUpperCase()} at ${timestamp}`;
    };

    pass.onclick = () => setStatus("pass");
    fail.onclick = () => setStatus("fail");

    buttons.append(pass, fail);
    div.append(label, buttons, time);
    sectionDiv.appendChild(div);
  });

  checklistEl.appendChild(sectionDiv);
}

document.getElementById("photos").onchange = e => {
  [...e.target.files].forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => photos.push(ev.target.result);
    reader.readAsDataURL(file);
  });
};

document.getElementById("export").onclick = () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let y = 10;

  const reg = document.getElementById("reg").value || "N/A";
  const mileage = document.getElementById("mileage").value || "N/A";
  const safe = document.getElementById("safe").value;
  const mot = document.getElementById("mot").value || "N/A";
  const tax = document.getElementById("tax").value || "N/A";

  pdf.setFontSize(14);
  pdf.text(`Vehicle Reg: ${reg}`, 10, y); y += 7;
  pdf.text(`Mileage: ${mileage}`, 10, y); y += 7;
  pdf.text(`Safe to Drive: ${safe}`, 10, y); y += 7;
  pdf.text(`MOT: ${mot}`, 10, y); y += 7;
  pdf.text(`Tax: ${tax}`, 10, y); y += 10;

  pdf.setFontSize(11);
  for (const [item, data] of Object.entries(state)) {
    pdf.text(`${item}: ${data.status.toUpperCase()} (${data.timestamp})`, 10, y);
    y += 5;
    if (y > 270) { pdf.addPage(); y = 10; }
  }

  y += 10;
  pdf.text("Notes:", 10, y);
  y += 6;
  pdf.text(pdf.splitTextToSize(
    document.getElementById("notes").value || "None",
    180
  ), 10, y);

  photos.forEach(img => {
    pdf.addPage();
    pdf.text("Photo Evidence", 10, 10);
    pdf.addImage(img, "JPEG", 10, 20, 180, 120);
  });

  pdf.save(`van-inspection-${reg}.pdf`);
};
