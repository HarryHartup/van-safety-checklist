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

};

let results = {};

function setInspection(type){

document.getElementById("inspectionType").value=type

document.getElementById("preBtn").classList.remove("active")
document.getElementById("postBtn").classList.remove("active")

if(type==="Pre"){
document.getElementById("preBtn").classList.add("active")
}else{
document.getElementById("postBtn").classList.add("active")
}

}

function setSafe(value){

document.getElementById("safeToDrive").value=value?"Yes":"No"

document.getElementById("safeBtn").classList.remove("active")
document.getElementById("unsafeBtn").classList.remove("active")

if(value){
document.getElementById("safeBtn").classList.add("active")
}else{
document.getElementById("unsafeBtn").classList.add("active")
}

}

function buildChecklist(){

const container=document.getElementById("checklist")

Object.keys(checklist).forEach(section=>{

const sec=document.createElement("div")
sec.className="section"

sec.innerHTML=`<h3>${section}</h3>`

checklist[section].forEach(item=>{

const row=document.createElement("div")
row.className="item"

row.innerHTML=`

<span>${item}</span>

<div class="buttons">

<button class="pass" onclick="record('${item}','Pass')">PASS</button>

<button class="fail" onclick="record('${item}','Fail')">FAIL</button>

</div>
`

sec.appendChild(row)

})

container.appendChild(sec)

})

}

function record(item,result){

results[item]={

result:result,

time:new Date().toLocaleString()

}

}

async function exportPDF(){

const { jsPDF } = window.jspdf

const doc=new jsPDF()

let y=10

doc.text("Vehicle Inspection Report",10,y)

y+=10

const reg=document.getElementById("reg").value
const mileage=document.getElementById("mileage").value
const safe=document.getElementById("safeToDrive").value
const type=document.getElementById("inspectionType").value

doc.text(`Inspection Type: ${type}`,10,y)
y+=8
doc.text(`Vehicle Reg: ${reg}`,10,y)
y+=8
doc.text(`Mileage: ${mileage}`,10,y)
y+=8
doc.text(`Safe To Drive: ${safe}`,10,y)
y+=10

Object.keys(results).forEach(item=>{

doc.text(`${item} - ${results[item].result} (${results[item].time})`,10,y)

y+=7

if(y>270){
doc.addPage()
y=10
}

})

const notes=document.getElementById("notes").value

if(notes){

doc.addPage()

doc.text("Notes:",10,10)

doc.text(notes,10,20)

}

doc.save(`inspection_${reg}.pdf`)

}

buildChecklist()
