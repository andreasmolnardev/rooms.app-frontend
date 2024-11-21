import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../db-scripts/config.js"
import { showPage } from "../ui-scripts/page-loading.js";
import { components } from "../components/components.js";
import { getUser } from "../db-scripts/app/get-username.js";

sessionStorage.setItem("session", "change-password");

function checkUserAuthentication() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

checkUserAuthentication().then((user) => {

    showPage("change-password");
    if (user) {
        const userId = user.uid;
        getUser(userId).then(userData => {

            document.getElementById("cancel-button").addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = "../app";
            })

            let accountSelect = components["custom-select"].find(item => item.id == "select-account")
            
            accountSelect.addOption(userData.name, "user-" + userId, "user-select")
        
            accountSelect.selectItems.addEventListener('change', (event) => {
                event.preventDefault();              

                //remove the inactive class from select-method-section
                document.getElementById('select-method-section').classList.remove("inactive");

                //change .method-info text accordingly to selected method
                let selectMethodRadios = document.getElementsByName("select-reset-method");
                let methodInfoText = document.getElementsByClassName("method-info")[0];

                for (let index = 0; index < selectMethodRadios.length; index++) {
                    const radio = selectMethodRadios[index];
                    
                    radio.addEventListener('change', () => {
                        if(!methodInfoText.classList.contains("active")){
                            methodInfoText.classList.add("active");
                        }
                        methodInfoText.querySelector('p').innerText = radio.dataset.description;
                    })
                }

                //action when pressing the button: either send password reset link, then show notification
                document.getElementById("next-button").addEventListener("click", (event) => {
                    event.preventDefault();

                })
            })
        })

    }
})
