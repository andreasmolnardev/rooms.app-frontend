import {
  getUser
} from "../../db-scripts/app/get-username.js";

let roomOccModal = document.getElementById('room-occupation-details');

export function openRoomOccupationDetailsModal(completionEl, userId) {

  roomOccModal.innerHTML = `<h2 title="Titel der Raumbesetzung">Titel</h2>
            <span class="close-modal" data-target="room-occupation-details">
                <i class="vf-ic_fluent_dismiss_circle_24_fille"></i>
            </span>
            <p id="occupation-datetime">Datum, von 14:00 bis 15:00</p>
            <section id="participants">  
                <p>Teilnehmer</p>
                <div class="participants-wrapper wrapper center"></div>
            </section>
            <section id="notes-section">
            <p>Notiz</p>
            <div class="center"><p id="occupation-notes"></p></div>
            </section>`;

  const eventDate = new Date(completionEl.dataset.date);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  let titleEl = roomOccModal.querySelector("h2");
  titleEl.innerText = completionEl.dataset.title;

  let datetime = roomOccModal.querySelector("#occupation-datetime")
  datetime.innerText = `${eventDate.toLocaleDateString('de-DE', options)} von ${completionEl.dataset.timeFrom} bis ${completionEl.dataset.timeTo}`

  let participantsContainer = roomOccModal.querySelector(".participants-wrapper");

  let participantIDs = completionEl.dataset.afiliatedUsers.split("+");


  for (let index = 0; index < participantIDs.length; index++) {
    const id = participantIDs[index];


    if (id != userId) {
      getUser(id).then(user => {
        participantsContainer.insertAdjacentHTML('beforeend', `
                    <div class="item">
                       <i class="vf-ic_fluent_person_24_filled"></i>
                        <a class="name link center">${user.name}</a>
                        <div class="tools">
                            <span> <i class="vf-ic_fluent_comment_multiple_24_filled"></i></span>
                        </div>
                    </div>
                `);
      })
    } else if (id == userId) {
      participantsContainer.insertAdjacentHTML('beforeend', `
        <div class="item">
           <i class="vf-ic_fluent_person_24_filled"></i>
            <a class="name link center">ich</a>
        </div>`);

    }

  }

  let notesTextfield = roomOccModal.querySelector("#occupation-notes");

  if (completionEl.dataset.notes) {
    notesTextfield.innerText = completionEl.dataset.notes;
  }

  if (userId == completionEl.dataset.creator) {
    roomOccModal.insertAdjacentHTML('beforeend', '<button>Bearbeiten <i class="fa-solid fa-flask"></i> </button>');
  } else {
    roomOccModal.insertAdjacentHTML('beforeend', '<button>Änderungen vorschlagen <i class="fa-solid fa-flask"></i> </button>');
  }

  roomOccModal.showModal();

}