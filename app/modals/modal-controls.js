
const addMembersButton = document.getElementById("add-members-button");
const addRoomButton = document.getElementById("add-room-button")
const createUsergroupButton = document.getElementById("create-usergroup-button")

addMembersButton.addEventListener("click", () => {showComboModal("add", "member")})
addRoomButton.addEventListener("click", () => {showComboModal("add", "room")});
createUsergroupButton.addEventListener("click", () => {showComboModal("add", "user-group")});
