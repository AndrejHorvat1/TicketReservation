//auth.js
import { auth, db } from "./firebase.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getDocs, collection, doc, addDoc,onSnapshot, setDoc, getDoc  } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import {setupEvents, setupUIIndex} from "./index.js"
import {setupUIEventPage } from "./eventpage.js";



//get data
const eventList=document.querySelector(".card")
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlId = urlParams.get('id');
const dbRef=collection(db, 'events')
if(!urlId){
const querySnapshot = await getDocs(collection(db, "events"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
    let data=(doc.id, " => ", doc.data())
    let id=doc.id
    setupEvents(data, id) 
});}


//listen for auth status changes
onAuthStateChanged(auth, user=>{
    async function makeAdmin(email){
        const userRef = doc(db, 'users', email);
        return setDoc(userRef, {
          admin: true
        });
      }
      async function isUserAdmin(user){
        const docRef = doc(db, "users", user.email);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data().admin)
        if(docSnap.data().admin==true){
          return true
        }
        else {
         return false
        }
      }
    if(urlId==null)
    {
    if(user){
        setupUIIndex(user, makeAdmin, isUserAdmin)      
    }
    else{
        setupUIIndex() 
    }
    }
    else{
        if(user){
            setupUIEventPage(user,makeAdmin, isUserAdmin)
        }
        else{
            setupUIEventPage()
        }
    }
}); 





//create new event
const createForm=document.querySelector('#create-form')
var itemSections,itemTickets,name,performer,details,date,location,price,url,type
createForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    var inputSections=document.getElementById("event-sections").value
    var inputTickets=document.getElementById("event-sections-tickets").value
    itemSections=inputSections.split(",");
    itemTickets=inputTickets.split(",");
    name= document.getElementById('event-name').value,
    performer= document.getElementById('event-performer').value,
    details= document.getElementById('event-details').value,
    date= document.getElementById('event-date').value,
    location= document.getElementById('event-location').value,
    price= document.getElementById('event-price').value,
    url= document.getElementById('event-image').value
    type=document.getElementById('event-type').value
    const modal=document.querySelector("#modal-create");
    M.Modal.getInstance(modal).close();
    createForm.reset();
    addDocument() 
})
async function addDocument(){
const docRef=await addDoc(collection(db, 'events'),{
    name: name,
    performer: performer,
    details: details,
    date: date,
    location: location,
    price: price,
    sections: itemSections, 
    sectionstickets: itemTickets, 
    url: url,
    type:type, 
    deleted:false
})
}

//signup
const signupForm=document.querySelector('#signup-form')
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get user info
    const email=signupForm['signup-email'].value
    const password=signupForm['signup-password'].value
    //sign up the user
createUserWithEmailAndPassword(auth, email, password).then(cred=>{
    const userUid = cred.user.uid;
    const userRef = doc(db, 'users', email);
    return setDoc(userRef, {
      admin: false
    });
  }).then(() => {
    const modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  }).catch((error) => {
    console.log(error);
  });
})

//logout
const logout=document.querySelector('#logout');
    logout.addEventListener('click', (e)=>{
        e.preventDefault();
        signOut(auth);
    });

//login
const loginForm=document.querySelector('#login-form')
loginForm.addEventListener('submit',(e)=>{
     e.preventDefault();
     //get user info
     const email=loginForm['login-email'].value;
     const password=loginForm['login-password'].value;
     signInWithEmailAndPassword(auth, email, password).then(cred => {
       
         //close the login modal and reset
         const modal=document.querySelector('#modal-login');
         M.Modal.getInstance(modal).close();
         loginForm.reset();
         
     });
 });

 
  
 