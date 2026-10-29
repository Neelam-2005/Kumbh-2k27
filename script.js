/* ================= RUN AFTER PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", function () {

/* ================= NAVBAR SCROLL ================= */

window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
});


/* ================= MOBILE MENU ================= */

const navLinks = document.getElementById("navLinks");

window.toggleMenu = function(){
    if(navLinks){
        navLinks.classList.toggle("active");
    }
};

document.querySelectorAll(".nav-links a").forEach(link=>{
    link.addEventListener("click",()=>{
        if(navLinks){
            navLinks.classList.remove("active");
        }
    });
});


/* ================= LOGIN + ADMIN ================= */

const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
const userSection = document.getElementById("userSection");

if(loggedUser && userSection){
    userSection.innerHTML =
    `<span style="color:white;font-weight:500;">👤 Welcome, ${loggedUser.name}</span>
     <button onclick="logoutUser()" style="margin-left:10px;padding:6px 12px;border:none;border-radius:15px;background:#ff7a00;color:white;cursor:pointer;">Logout</button>`;
}

if(loggedUser && loggedUser.email === "admin@kumbh.com" && navLinks){
    const adminLink = document.createElement("li");
    adminLink.innerHTML = `<a href="admin.html">Admin</a>`;
    navLinks.appendChild(adminLink);
}

/* ================= COUNTDOWN ================= */

const eventDate = new Date("August 15, 2027 00:00:00").getTime();

setInterval(()=>{

    const daysEl = document.getElementById("days");
    if(!daysEl) return;

    const now = new Date().getTime();
    const diff = eventDate - now;

    document.getElementById("days").innerText =
        Math.floor(diff/(1000*60*60*24));

    document.getElementById("hours").innerText =
        Math.floor((diff/(1000*60*60))%24);

    document.getElementById("minutes").innerText =
        Math.floor((diff/(1000*60))%60);

    document.getElementById("seconds").innerText =
        Math.floor((diff/1000)%60);

},1000);


/* ================= LOST & FOUND ================= */

const photoInput = document.getElementById("photoUpload");
const preview = document.getElementById("preview");

if(photoInput){

photoInput.addEventListener("change",function(){

    const file = this.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload=function(e){
            preview.src=e.target.result;
            preview.style.display="block";
        }

        reader.readAsDataURL(file);

    }

});

}

const lostForm = document.getElementById("lostForm");

if(lostForm){

lostForm.addEventListener("submit",function(e){

    e.preventDefault();

    const item=document.getElementById("itemName").value;
    const desc=document.getElementById("description").value;
    const image=preview ? preview.src : "";

    const reports=JSON.parse(localStorage.getItem("lostReports"))||[];

    reports.push({item,desc,image});

    localStorage.setItem("lostReports",JSON.stringify(reports));

    alert("Report Submitted Successfully!");

});

}

});


/* ================= LOGOUT ================= */

function logoutUser(){
    localStorage.removeItem("loggedInUser");
    window.location.href="auth.html";
}



/* ================= BOOKING ================= */

let selectedPrice = 0;

function openBooking(name,price){
    selectedPrice = price;

    const title=document.getElementById("hotelTitle");
    const modal=document.getElementById("bookingModal");

    if(title) title.innerText = name;
    if(modal) modal.style.display = "flex";
}

function closeBooking(){
    const modal=document.getElementById("bookingModal");
    if(modal) modal.style.display="none";
}


function calculateTotal(e){

    e.preventDefault();

    const name=document.getElementById("customerName").value;
    const days=parseInt(document.getElementById("bookingDays").value);
    const people=document.getElementById("bookingPeople").value;
    const roomType=document.getElementById("roomType").value;
    const bookingdate=document.getElementById("bookingDate").value;

    let extraCharge=0;

    if(roomType==="Deluxe") extraCharge=500;
    if(roomType==="Suite") extraCharge=1000;

    const total=(selectedPrice+extraCharge)*days;

    const hotelName=document.getElementById("hotelTitle").innerText;

    const bookingData={
        bookingID:"KM2027-"+Math.floor(Math.random()*9000+1000),
        name:name,
        hotel:hotelName,
        roomType:roomType,
        booking_date:bookingdate,
        days:days,
        total:total
    };

    localStorage.setItem("bookingData",JSON.stringify(bookingData));


    fetch("http://127.0.0.1:8000/api/save-booking/",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            name:name,
            hotel:hotelName,
            days:days,
            people:people,
            booking_date:bookingdate,
            roomType:roomType,
            total:total
        })

    })
    .then(res=>res.json())
    .then(data=>{
        console.log("Saved:",data);
        window.location.href="payment.html";
    })
    .catch(err=>{
        console.log(err);
        alert("Server not connected");
    });
/* redirect anyway */

window.location.href="payment.html";
}



/* ================= IMAGE POPUP ================= */

function openImage(src){
    const modal=document.getElementById("imageModal");
    const img=document.getElementById("expandedImg");

    if(modal) modal.style.display="flex";
    if(img) img.src=src;
}

function closeImage(){
    const modal=document.getElementById("imageModal");
    if(modal) modal.style.display="none";
}



/* ================= SNAN POPUP ================= */

function openSnanPopup(){
    const modal=document.getElementById("snanModal");
    if(modal) modal.style.display="flex";
}

function closeSnanPopup(){
    const modal=document.getElementById("snanModal");
    if(modal) modal.style.display="none";
}



/* ================= EMERGENCY ================= */

function openEmergency(){
    const modal=document.getElementById("emergencyModal");
    if(modal) modal.style.display="flex";
}

function closeEmergency(){
    const modal=document.getElementById("emergencyModal");
    if(modal) modal.style.display="none";
}



/* ================= CHATBOT ================= */

function toggleChat(){

const box=document.getElementById("chatBox");

if(box){
if(box.style.display==="flex"){
box.style.display="none";
}else{
box.style.display="flex";
}
}

}


function sendMessage(){

const input=document.getElementById("userInput");
if(!input) return;

const message=input.value.trim();

if(message==="") return;

const chatBody=document.getElementById("chatBody");

chatBody.innerHTML+=`<div class="chat-message user-msg">${message}</div>`;

input.value="";

setTimeout(()=>generateBotReply(message.toLowerCase()),800);

}


function generateBotReply(message){

let reply="Please visit help desk for more information.";

if(message.includes("snan"))
reply="🛕 Next Shahi Snan is on 26 January 2027.";

else if(message.includes("hotel"))
reply="🏨 You can book hotels in the Stay section.";

else if(message.includes("route"))
reply="📍 Click on any Ghat marker in map to get navigation route.";

else if(message.includes("emergency"))
reply="🚑 Click emergency icon for nearest hospital route.";

const chatBody=document.getElementById("chatBody");

chatBody.innerHTML+=`<div class="chat-message bot-msg">${reply}</div>`;

}



/* ================= MAP SYSTEM ================= */

/* ================= MAP SYSTEM ================= */
/* ================= MAP SYSTEM ================= */

let map;
let userLat = null;
let userLng = null;
let routingControl = null;
let transportMode = "foot"; // default

document.addEventListener("DOMContentLoaded", function(){

const mapDiv = document.getElementById("map");
if(!mapDiv) return;

map = L.map('map').setView([19.9975, 73.7898], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© OpenStreetMap'
}).addTo(map);


/* ================= USER LOCATION ================= */

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(function(position){

    userLat = position.coords.latitude;
    userLng = position.coords.longitude;

    L.marker([userLat,userLng])
    .addTo(map)
    .bindPopup("📍 You are here")
    .openPopup();

    map.setView([userLat,userLng],14);

});

}


/* ================= GHAT LOCATIONS ================= */

const ghats = [

{name:"Ramkund Ghat",lat:19.9975,lng:73.7898},
{name:"Kapaleshwar Ghat",lat:20.0020,lng:73.7850},
{name:"Godavari Ghat",lat:19.9900,lng:73.8000}

];


/* ================= ADD MARKERS ================= */

ghats.forEach(g=>{

L.marker([g.lat,g.lng])
.addTo(map)
.bindPopup(
`🛕 <b>${g.name}</b><br>
<button onclick="routeToGhat(${g.lat},${g.lng})">Get Route</button>`
);

});

});


/* ================= TRANSPORT MODE ================= */
/* ================= TRANSPORT MODE ================= */

function setTransport(type){
    transportMode = type;

    const info = document.getElementById("routeInfo");
    info.innerHTML = `🚦 Selected Mode: <b>${type.toUpperCase()}</b>`;
}

/* ================= ROUTE FUNCTION ================= */

function routeToGhat(lat,lng){

if(!userLat){
alert("Waiting for your location...");
return;
}

if(routingControl){
map.removeControl(routingControl);
}

/* Transport profile (kept same) */
let profile = "foot";
if(transportMode === "bike") profile = "car";
if(transportMode === "car") profile = "car";

routingControl = L.Routing.control({

waypoints:[
L.latLng(userLat,userLng),
L.latLng(lat,lng)
],

router:L.Routing.osrmv1({
serviceUrl:"https://router.project-osrm.org/route/v1",
profile: profile
}),

routeWhileDragging:false,
addWaypoints:false,
show: false

}).addTo(map);


/* AFTER ROUTE FOUND */
routingControl.on('routesfound', function(e){

const route = e.routes[0];

const distanceKm = (route.summary.totalDistance / 1000);

/* ✅ FIX: CUSTOM TIME BASED ON MODE */
let speed = 5; // walking speed

if(transportMode === "bike") speed = 30;
if(transportMode === "car") speed = 50;

const time = ((distanceKm / speed) * 60).toFixed(1);
const distance = distanceKm.toFixed(2);

/* ✅ MOBILE FRIENDLY POPUP */
const info = document.getElementById("routeInfo");

info.innerHTML = `
<div style="
background:white;
padding:12px;
border-radius:12px;
box-shadow:0 4px 15px rgba(0,0,0,0.2);
text-align:center;
margin-top:10px;
width:90%;
max-width:320px;
margin-left:auto;
margin-right:auto;
font-size:14px;
">

<h3 style="color:#ff7a00; font-size:16px;">📍 Route Details</h3>

<p style="margin:6px 0;">🚦 Mode: <b>${transportMode.toUpperCase()}</b></p>

<p style="margin:6px 0;">📏 Distance: <b>${distance} km</b></p>

<p style="margin:6px 0;">⏱ Time: <b>${time} mins</b></p>

</div>
`;

});

}


/* ================= EMERGENCY ROUTE ================= */
/* ================= EMERGENCY ROUTE ================= */

function showEmergencyRoute(){

if(!userLat){
showPopup("📍 Waiting for your location...");
return;
}

/* Example: nearest hospital */
const hospitalLat = 19.9950;
const hospitalLng = 73.7900;

routeToGhat(hospitalLat, hospitalLng);

/* Show modern popup */
showPopup("🚨 Showing route to nearest hospital");

}


/* ================= UNIVERSAL POPUP FUNCTION ================= */

function showPopup(message){

let popup = document.getElementById("customPopup");

/* create if not exists */
if(!popup){
popup = document.createElement("div");
popup.id = "customPopup";
document.body.appendChild(popup);
}

/* set content */
popup.innerHTML = message;

/* style (responsive for mobile + desktop) */
popup.style.position = "fixed";
popup.style.bottom = "20px";
popup.style.left = "50%";
popup.style.transform = "translateX(-50%)";
popup.style.background = "linear-gradient(45deg,#ff7a00,#ff4500)";
popup.style.color = "white";
popup.style.padding = "12px 18px";
popup.style.borderRadius = "25px";
popup.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
popup.style.fontSize = "14px";
popup.style.fontWeight = "500";
popup.style.textAlign = "center";
popup.style.zIndex = "9999";
popup.style.width = "90%";
popup.style.maxWidth = "320px";
popup.style.opacity = "0";
popup.style.transition = "0.3s ease";

/* show animation */
setTimeout(()=>{
popup.style.opacity = "1";
popup.style.bottom = "30px";
},50);

/* hide after 3 sec */
setTimeout(()=>{
popup.style.opacity = "0";
popup.style.bottom = "20px";
},3000);

}