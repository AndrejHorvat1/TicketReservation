//eventpage.js
import { db, auth } from "./firebase.js";
import { doc, getDoc,updateDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import{onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';



const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlId = urlParams.get('id');
var docRef
var docSnap
if(urlId){
 docRef = doc(db, "events", urlId);
 docSnap = await getDoc(docRef);
}
if (docSnap) {
  const data=docSnap.data()
const eventInfo=document.querySelector(".event-page")
let html=''
const getEvents=()=>{
    const li=`
    <div class="row">
  <div class="col s12 m6">
    <div class="card-image">
      <img src="${data.url}" class="responsive-img" style="padding-top:7px; object-fit: fill; width: 100%; height: 508px;">
    </div>
  </div>
  <div class="col s12 m6">
    <div class="card">
      <div class="card-content">
        <span class="card-title" style="font-size: 24px;">${data.name}</span>
        <p style="font-size: 18px;">Performer: ${data.performer}</p>
        <p style="font-size: 18px;">Date and time: ${data.date}</p>
        <p style="font-size: 18px;">Details: ${data.details}</p>
        <p style="font-size: 18px;">Price: ${data.price}€</p>
        <p style="font-size: 18px;">Select a seating section nad number of cards:</p>
        <div class="input-field">
          <select id="dropdown">
            <option value="" disabled selected>Select an option</option>
          </select>
        </div>
        <div class="input-field">
          <input placeholder="Number of tickets" id="ticket-number" type="number" class="validate">
          <label for="ticket-number">Number of tickets</label>    
        </div>
      </div>
      <div class="card-action" style="display: flex; justify-content: space-between;">
      <p class="logged-out" style="display: none;"> Log in to reserve tickets</p>
        <button id="submit-btn" class="btn waves-effect waves-light" type="none" name="action">Submit
          <i class="material-icons right">send</i>
        </button>
        <div>
          <button id="update-btn" class="btn waves-effect waves-light modal-trigger" data-target="modal-update" name="action">Update</button>
          <button id="delete-btn" class="btn waves-effect waves-light modal-trigger red" name="action">Delete</button>
        </div>
      </div>
    </div>
  </div>
</div>  
<style>
  img {
    height: 500px; /* Adjust the desired height */
  }
</style>
      <script> $(document).ready(function() {
        M.updateTextFields();
      });</script>
      `;
  html+=li;
  eventInfo.innerHTML=html  
}
getEvents()
const sections=data.sections 
console.log(sections)
const sectionsDropdown=document.getElementById("dropdown")   
for(let key in sections){
    let option=document.createElement("option")
    option.value = sections[key]; 
    option.textContent = sections[key]; 
    sectionsDropdown.appendChild(option);
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, option);
}
const submitBtn=document.getElementById("submit-btn")
async function getTickets(){
    var section
    var sectionPicked=document.getElementById('dropdown').value
    const docRef=doc(db, 'events', urlId)
    for(var i=0; i<data.sections.length;i++){
        if(data.sections[i]==sectionPicked){
            console.log(data.sections[i])
        section=i
        }
    }
    var ticketNumber=parseInt(document.getElementById('ticket-number').value)
    if(data.sectionstickets[section]-ticketNumber>=0){
        console.log(data.sectionstickets[section])
        var sectionsTicketsLocal=data.sectionstickets
        console.log(sectionsTicketsLocal)
        sectionsTicketsLocal[section]-=ticketNumber
       await updateDoc(docRef,{
            sectionstickets:sectionsTicketsLocal
        })
        console.log(ticketNumber)
        alert("You have reserved "+ ticketNumber+ " tikcets for section "+sectionPicked)
        location.reload()
    }
    else if(data.sectionstickets[section]-ticketNumber<0){
        alert("There is only"+data.sectionstickets[section]+"tickets left for that section")
    }
    else if(data.data.sectionstickets[section]==0){
        alert("There is no more tickets for that section")
    }
}
submitBtn.addEventListener("click", (event)=>{  
    getTickets()
})

const eventUpdateBtn=document.getElementById('update-btn')
eventUpdateBtn.addEventListener("click",(event)=>{
    eventUpdateForm()
})
async function eventUpdateForm(){
    const updateForm=document.querySelector('#update-form')
    document.getElementById('event-name-update').value=data.name
    document.getElementById('event-performer-update').value=data.performer
    document.getElementById('event-date-update').value=data.date
    document.getElementById('event-type-update').value=data.type
    document.getElementById('event-location-update').value=data.location
    document.getElementById('event-details-update').value=data.details
    document.getElementById('event-price-update').value=data.price
    document.getElementById('event-image-update').value=data.url
    document.getElementById('event-sections-update').value=data.sections
    document.getElementById('event-sections-tickets-update').value=data.sectionstickets

    updateForm.addEventListener("submit",(e)=>{
        e.preventDefault()
        eventUpdate()
        const modal=document.querySelector("#modal-update");
        M.Modal.getInstance(modal).close();   
    })
}


async function eventUpdate(){
    var nameUpdate, performerUpdate, dateUpdate, typeUpdate, locationUpdate, detailsUpdate, priceUpdate, urlUpdate, sectionsUpdate, sectionticketsUpdate
    nameUpdate=document.getElementById('event-name-update').value
    performerUpdate=document.getElementById('event-performer-update').value
    dateUpdate=document.getElementById('event-date-update').value
    typeUpdate=document.getElementById('event-type-update').value
    locationUpdate=document.getElementById('event-location-update').value
    detailsUpdate=document.getElementById('event-details-update').value
    priceUpdate=document.getElementById('event-price-update').value
    urlUpdate=document.getElementById('event-image-update').value
    sectionsUpdate=document.getElementById('event-sections-update').value.split(",")
    sectionticketsUpdate=document.getElementById('event-sections-tickets-update').value.split(",")
    
    await updateDoc(docRef,{
        name:nameUpdate,
        performer:performerUpdate,
        date:dateUpdate,
        type:typeUpdate,
        location:locationUpdate,
        details: detailsUpdate,
        price:priceUpdate,
        url:urlUpdate,
        sections:sectionsUpdate,
        sectionstickets:sectionticketsUpdate
    })
    alert("Event updated")
    location.reload()
}




const eventDeleteBtn=document.getElementById('delete-btn')
eventDeleteBtn.addEventListener("click",(event)=>{
  eventDelete()
})
async function eventDelete(){
  let confirmAction=confirm("Are you sure you whant to delete this event?")
  if(confirmAction){
  await updateDoc(docRef,{
    deleted:true
  })
  window.location.href="index.html"
  }
  else{
  alert("Deletion canceleds")
  }
}
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}

const loggedOutLinks=document.querySelectorAll('.logged-out')
const loggedInLinks=document.querySelectorAll('.logged-in')
const submitBtn = document.getElementById("submit-btn");
const updateBtn = document.getElementById("update-btn");
const accountDetails=document.querySelector(".account-details")
const deleteBtn=document.getElementById("delete-btn")
const createForm=document.querySelector('#create-form')
const makeAdminForm=document.querySelector("#admin-form")

const setupUIEventPage=(user,makeAdmin, isUserAdmin)=>{
    if(user){
      //toggle ui elements
      const html=`<div>Logged in as ${user.email}</div>`
      accountDetails.innerHTML=html
      isUserAdmin(user).then((isAdmin) => {
        if (isAdmin) {
          console.log(isAdmin);
          loggedInLinks.forEach((item) => (item.style.display = 'block'));
          loggedOutLinks.forEach((item) => (item.style.display = 'none'));
          deleteBtn.style.display = 'block';
          updateBtn.style.display = 'block';
          createForm.style.display = 'block';
          submitBtn.style.display = 'block';
          makeAdminForm.addEventListener("submit", (event)=>{
            event.preventDefault()
            const userEmail=makeAdminForm['account-make-admin'].value
            makeAdmin(userEmail)
            const modal = document.querySelector("#modal-account");
            M.Modal.getInstance(modal).close();
            makeAdminForm.reset();
          })
          makeAdminForm.style.display='block'
        } else {
          loggedInLinks.forEach((item) => {
            if (item.id === 'admin') {
              item.style.display = 'none';
            } else {
              item.style.display = 'block';
            }
          });
          loggedOutLinks.forEach((item) => (item.style.display = 'none'));
          submitBtn.style.display = 'block';
          deleteBtn.style.display = 'none';
          updateBtn.style.display = 'none';
          createForm.style.display = 'none';
          makeAdminForm.style.display="none"
        }
      });  
    }
    else{
        accountDetails.innerHTML=''
      loggedInLinks.forEach(item => item.style.display='none')
      loggedOutLinks.forEach(item=> item.style.display='block')
      submitBtn.style.display = 'none';
      
      deleteBtn.style.display='none'
      updateBtn.style.display = 'none'; 
      makeAdminForm.style.display="none"  
    }
  }


document.addEventListener('DOMContentLoaded', function() {
  
    // Init all modals
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    // Init all collapsibles
    var collapsibles = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsibles);
  
});
export{setupUIEventPage}








