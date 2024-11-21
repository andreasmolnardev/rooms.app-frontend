import { isDate1Later } from "../../ui-scripts/compare-dates.js";
import { get, ref, database, update } from "../config.js"

let invitationRef = ref(database, 'invitations/')

export function joinGroup(userId, invitationDataInput, fullname) {
    return new Promise((resolve, reject) => {
        get(invitationRef).then((snapshot) => {

            let invitationDataCollectionDB = snapshot.val();


            console.log(invitationDataCollectionDB)


            if (!invitationDataCollectionDB) {
                reject("keine Einladungen verfügbar")
            } else {
                console.log(invitationDataInput)
                let correspondingInvitation = invitationDataCollectionDB.find((invitation) => invitation.code.join("") == invitationDataInput[0] && invitation.pin.join("") == invitationDataInput[1]);
                let correspondingInvitationIndex = invitationDataCollectionDB.findIndex((invitation) => invitation.code.join("") == invitationDataInput[0] && invitation.pin.join("") == invitationDataInput[1]);
                let d = new Date();
                let currentTimeAsDatetime = d.getFullYear() + "-" + d.getMonth() + 1 + "-" + d.getDate() + "-" + d.getHours() + "-" + d.getMinutes();


                if (correspondingInvitation && ((
                    correspondingInvitation.expirement.type == "counter" &&
                    correspondingInvitation.usersJoinedCounter < correspondingInvitation.expirement.data) || (
                        correspondingInvitation.expirement.type == "datetime" &&
                        isDate1Later(currentTimeAsDatetime, correspondingInvitation.expirement.data.split("T")[0] + "-" + correspondingInvitation.expirement.data.split("T")[1].split(":")[0] + "-" + correspondingInvitation.expirement.data.split("T")[1].split(":")[1]) == false
                    ))) {


                    get(ref(database, 'groups/' + correspondingInvitation.destination)).then((data) => {


                        let members = data.val().members;

                        let name = data.val().name;

                        if (!members) {
                            members = [];
                        }

                        if (!members.find((member) => member.id == userId)) {
                            members.push({ id: userId, name: fullname, rights: correspondingInvitation.rights })
                            console.log(members)
                            update(ref(database, 'groups/' + correspondingInvitation.destination), {
                                members: members
                            })
                            get(ref(database, 'users/' + userId + '/groups')).then((groupsSnapshot) => {

                                let groups = groupsSnapshot.val();

                                if (!groups) {
                                    groups = {};
                                }

                                Object.assign(groups, { [correspondingInvitation.destination]: correspondingInvitation.rights })


                                update(ref(database, 'users/' + userId), {
                                    groups: groups
                                })

                                let incrementedCounter = invitationDataCollectionDB[correspondingInvitationIndex].usersJoinedCounter += 1
                                console.log(incrementedCounter)


                                update(ref(database, 'invitations/' + correspondingInvitationIndex), {
                                    usersJoinedCounter: incrementedCounter
                                });


                                resolve(name)








                            })

                        } else {
                            reject("Bereits Mitglied")
                        }



                    })



                } else {
                    reject("keine Einladung passend zu den eingebenen Daten gefunden.")

                }
            }

        })
    })
}