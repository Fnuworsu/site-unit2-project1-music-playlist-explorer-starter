const modal = document.getElementsByClassName("modal")[0];
const span = document.getElementsByClassName("close")[0];

let playlistData = data.playlists

const renderCards = () => {
    let cardTemplate = document.getElementsByTagName("template")[0]
    let cardContainer = document.getElementsByClassName("playlist-cards")[0]

    playlistData.forEach(playlist => {
        let cardElement = cardTemplate.content.cloneNode(true)
        cardElement.children[0].children[0].src = playlist.playlist_art
        cardElement.children[0].children[1].innerText = playlist.playlist_name
        cardElement.children[0].children[2].innerText = playlist.playlist_creator
        cardElement.children[0].children[3].innerText = playlist.likeCount

        cardContainer.appendChild(cardElement)
    })
}

renderCards()


const openModal = (playlist) => {
    let songTemplate = document.getElementsByTagName("template")[1]
    let songContainer = document.getElementsByClassName("modal")[0]
    modal.style.display = "block"
}

openModal()

// span.onclick = function() {
//     modal.style.display = "none";
//  }
//  window.onclick = function(event) {
//     if (event.target == modal) {
//        modal.style.display = "none";
//     }
//  }
