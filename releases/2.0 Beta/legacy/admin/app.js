import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../db-scripts/config.js"
import { getContactRequests } from "../db-scripts/contact-requests/get-requests.js";


function checkUserAuthentication() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Unsubscribe vom onAuthStateChanged-Ereignis, sobald es ausgelöst wurde
            resolve(user); // Das Promise mit dem user-Wert auflösen
        });
    });
}


checkUserAuthentication().then((user) => {
    if (user ){     
        const userId = user.uid;
        
        const userRightsRef = ref(database, 'users/' + userId + '/isAdmin');
        let isAdmin;
        onValue(userRightsRef, (snapshot)=>{
          
            if(snapshot.val() == true){
              const contactRequestSection = document.getElementById('contact-requests');


                 getContactRequests().then((contactRequests)=>{
                    console.log(contactRequests)
                    contactRequests.forEach(contactRequest => {
                        contactRequestSection.innerHTML += `
                        <div class="request">

                        <h2>${contactRequest.title}</h2>
                        <div class="space-between">
                            <h3>${contactRequest.email}</h3>
                            <p>${contactRequest.date}</p>
                        </div>
                      
                        <p class="text">${contactRequest.text}
                    </div>
                        `
                    });
                 })
                 
            } else {
                   alert('Zugriff verweigert');
                window.location.replace('../');
            }
        })
    } else {
        alert('Zugriff verweigert');
        window.location.replace('../');
    }
})