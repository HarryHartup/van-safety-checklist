const checklist = {

"Lights & Visibility":[
"Headlights (dipped & main)",
"Side lights",
"Brake lights",
"Indicators",
"Hazard lights",
"Reverse light",
"Number plate lights",
"Lights clean and secure",
"Windscreen clear of cracks",
"Windscreen clean inside",
"Mirrors clean and secure"
],

"Tyres & Wheels":[
"Tread above legal limit",
"No cuts or bulges",
"Correct tyre pressures",
"Wheel nuts present",
"No damaged wheels",
"Spare wheel or repair kit"
],

"Brakes & Steering":[
"Foot brake responsive",
"Handbrake holds vehicle",
"Steering free from play",
"No unusual noises"
],

"Bodywork & Doors":[
"No sharp edges",
"Doors open and close securely",
"Sliding/rear doors latch correctly",
"Vehicle locks correctly",
"No visible fluid leaks"
],

"Cab & Controls":[
"Seat secure",
"Seatbelt working",
"Horn works",
"Wipers working",
"Washers working",
"Heater/demister working",
"No warning lights showing",
"Fuel card present in van"
],

"Safety Equipment":[
"First aid kit",
"Fire extinguisher (if required)",
"Hi-vis vest"
],

"Load Area":[
"Load secure",
"Bulkhead secure",
"No loose items",
"Vehicle not overloaded"
]

}

let results = {}



/* -------------------------
INSPECTION TYPE
------------------------- */

function setInspection(type){

document.getElementById("inspectionType").value = type

document.getElementById("preBtn").classList.remove("active")
document.getElementById("postBtn").classList.remove("active")

if(type === "Pre"){
document.getElementById("preBtn").classList.add("active")
}else{
document.getElementById("postBtn").classList.add("active")
}

}



/* -------------------------
SAFE TO DRIVE
------------------------- */

function setSafe(value){

document.getElementById("safeToDrive").value = value ? "Yes" : "No"

document.getElementById("safeBtn").classList.remove("active")
document.getElementById("unsafeBtn").classList.remove("active")

if(value){
document.getElementById("safeBtn").classList.add("active")
}else{
document.getElementById("unsafeBtn").classList.add("active")
}

}



/* -------------------------
BUILD CHECKLIST
------------------------- */

function buildChecklist(){

const container = document.getElementById("checklist")

Object.keys(checklist).forEach(section => {

const sectionDiv = document.createElement("div")
sectionDiv.className = "section"

const title = document.createElement("h3")
title.textContent = section

sectionDiv.appendChild(title)

checklist[section].forEach(item => {

const row = document.createElement("div")
row.className = "item"

const label = document.createElement("span")
label.textContent = item

const buttons = document.createElement("div")
buttons.className = "buttons"

const passBtn = document.createElement("button")
passBtn.textContent = "PASS"
passBtn.className = "pass"
passBtn.onclick = () => record(item,"Pass")

const failBtn = document.createElement("button")
failBtn.textContent = "FAIL"
failBtn.className = "fail"
failBtn.onclick = () => record(item,"Fail")

buttons.appendChild(passBtn)
buttons.appendChild(failBtn)

row.appendChild(label)
row.appendChild(buttons)

sectionDiv.appendChild(row)

})

container.appendChild(sectionDiv)

})

}



/* -------------------------
RECORD RESULT + TIMESTAMP
------------------------- */

function record(item,result){

if(!results[item]){

results[item] = {
result: result,
time: new Date().toLocaleString()
}

}else{

results[item].result = result

}

}



/* -------------------------
EXPORT PDF
------------------------- */

async function exportPDF(){

const { jsPDF } = window.jspdf
const doc = new jsPDF()

let y = 15

const reg = document.getElementById("reg").value
const mileage = document.getElementById("mileage").value
const safe = document.getElementById("safeToDrive").value
const type = document.getElementById("inspectionType").value
const notes = document.getElementById("notes").value



doc.setFontSize(18)
doc.text("Vehicle Inspection Report",10,y)

y+=10
doc.setFontSize(12)

doc.text(`Inspection Type: ${type}`,10,y)
y+=7
doc.text(`Vehicle Registration: ${reg}`,10,y)
y+=7
doc.text(`Mileage: ${mileage}`,10,y)
y+=7
doc.text(`Safe To Drive: ${safe}`,10,y)

y+=10



Object.keys(checklist).forEach(section => {

doc.setFontSize(14)
doc.text(section.toUpperCase(),10,y)

y+=6
doc.setFontSize(11)

checklist[section].forEach(item => {

if(results[item]){

let symbol = results[item].result === "Pass" ? "✔" : "✖"

let line = `${symbol} ${item} – ${results[item].result.toUpperCase()} – ${results[item].time}`

doc.text(line,12,y)

y+=6

if(y > 270){
doc.addPage()
y = 15
}

}

})

y+=4

})



if(notes){

doc.addPage()

doc.setFontSize(14)
doc.text("NOTES",10,15)

doc.setFontSize(11)
doc.text(notes,10,25)

}



doc.save(`inspection_${reg}.pdf`)

}



/* -------------------------
INITIALISE APP
------------------------- */

buildChecklist()
