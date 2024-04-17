import { db} from "./firebase.js";
import { doc, getDoc, setDoc} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';


const loggedOutLinks=document.querySelectorAll('.logged-out')
const loggedInLinks=document.querySelectorAll('.logged-in')
const accountDetails=document.querySelector(".account-details")
const makeAdminForm=document.querySelector("#admin-form")
const setupUIIndex=(user, makeAdmin, isUserAdmin)=>{
  if(user){
    const html=`<div>Logged in as ${user.email}</div>`
      accountDetails.innerHTML=html
    isUserAdmin(user).then((isAdmin) => {
      if (isAdmin) {
        console.log(isAdmin);
        loggedInLinks.forEach((item) => (item.style.display = 'block'));
        loggedOutLinks.forEach((item) => (item.style.display = 'none'));
        makeAdminForm.addEventListener("submit", (event)=>{
          event.preventDefault()
          const userEmail=makeAdminForm['account-make-admin'].value
          makeAdmin(userEmail)
          const modal = document.querySelector("#modal-account");
          M.Modal.getInstance(modal).close();
          makeAdminForm.reset();
        })
        makeAdminForm.style.display='block'
      }
      else{loggedInLinks.forEach((item) => {
        if (item.id === 'admin') {
          item.style.display = 'none';
        } else {
          item.style.display = 'block';
        }
      });
      loggedOutLinks.forEach((item) => (item.style.display = 'none'));}})
      makeAdminForm.style.display="none"
  }
  else{
    accountDetails.innerHTML=''
    loggedInLinks.forEach(item => item.style.display='none')
    loggedOutLinks.forEach(item=> item.style.display='block')
    makeAdminForm.style.display="none"
  }
}


const eventList=document.querySelector(".event")
//setup events
let html='';
const setupEvents=(data, id)=>{
  if(data==null ||id==null){
    const li=`<div class="card"><p>Ther is no data</p><div>`;
    html+=li;
    eventList.innerHTML=html
  }
  else{
    if(data.deleted==false){
  const li=`
      <div class="col s12 m6 l3" >
      <div class="card large" >
        <div class="card-image">
          <img src="${data.url}" width="500" height="300">
          <span class="card-title black white-text" >${data.name}</span>
        </div>
        <div class="card-content">
          <p>${data.performer}</p>
          <p>${data.date}</p>
          <p>${data.type}</p>
          <p>${data.location}</p>
        </div>
        <div class="card-action">
        <a id="link-button-${id}" class="link-button" data-id="${id}">More info</a>
        </div>
      </div>
  </div>
      `;
      html+=li;
      eventList.innerHTML=html
      const linkButtons = document.getElementsByClassName("link-button");
      Array.from(linkButtons).forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          const id = button.dataset.id;
          localStorage.setItem("setId", id)
          const url = `./EventPage.html?id=${id}`;
          window.location.href = url;
        });
      });}
 
}}

  
document.addEventListener('DOMContentLoaded', function() {
    // Init all modals
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    // Init all collapsibles
    var collapsibles = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsibles);
})


export{setupEvents, setupUIIndex}