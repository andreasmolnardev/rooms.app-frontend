//Modal and children
const changelogModal = document.getElementById('changelog-modal');
const changesList = document.getElementById('changes-ul');
const versionHeading = document.getElementById('version');

export function showChangelogModal(newVersion) {
    console.log(newVersion)

    versionHeading.textContent = `Willkommen bei Version ${newVersion.tag}!`;

    newVersion.features.forEach(change => {
        changesList.insertAdjacentHTML(`beforeend`, `<p>- ${change}</p>`);
    })

    changelogModal.showModal();
}