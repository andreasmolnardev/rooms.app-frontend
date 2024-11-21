export function getPublicIpV4() {
    return new Promise((resolve, reject) => {
        fetch('https://api.ipify.org?format=json')
            .then(response => {
                if (response.ok) {
                    resolve(response.json())
                } else {
                    reject("error")
                }
            })
    })
}

export function savePublicIpV4() {
    return new Promise((resolve, reject) => {
        getPublicIpV4().then(ipObj => {
            localStorage.setItem("public-ipv4", ipObj.ip)
            resolve(ipObj.ip)
        }).catch(error => {
            console.error("Error getting public ip v4")
        })
    })
}