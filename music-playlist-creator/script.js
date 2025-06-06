const modal = document.getElementById("modal")
const span = document.getElementById("close")

let playlistData = data.playlists

//  render songs
const renderSongs = (playlistArray) => {
    let songElement = document.querySelector('.songs-container')
    songElement.innerHTML = ``

    playlistArray.songs.forEach(song => {
        const songCard = document.createElement("div")
        songCard.innerHTML = `
        <div class="song">
            <div id="songImage">
                <img src="${song.cover_art}" alt="song cover" class="song-cover" width="70px" height="70px">
            </div>
            <div class="modal-text">
                <p>${song.title}</p>
                <p>${song.artist}</p>
                <p>${song.album}</p>
            </div>
            <div class="song-duration">
                <p>${song.duration}</p>
            </div>
        </div>
        `
        songElement.appendChild(songCard)
    })
}

const openModal = (playlists, playlistId) => {
    // Find the playlist by playlistId
    let playlist = playlists.find(p => p.playlistID === playlistId);

    document.getElementById("header-image").src = playlist.playlist_art
    document.getElementById("playlist-title").innerText = playlist.playlist_name
    document.getElementById("creator-name").innerText = playlist.playlist_creator

    modal.style.display = "block"
    renderSongs(playlist)

    let shuffleButton = document.getElementById("shuffle")

    const newShuffleButton = shuffleButton.cloneNode(true)
    shuffleButton.parentNode.replaceChild(newShuffleButton, shuffleButton)
    shuffleButton = newShuffleButton

    // shuffle feature
    shuffleButton.addEventListener("click", () => {
        shuffleSongs(playlist)
    })
}

span.onclick = () => {
    modal.style.display = "none"
}

// render playlist cards
const renderCards = () => {
    let cardTemplate = document.getElementsByTagName("template")[0]
    let cardContainer = document.getElementsByClassName("playlist-cards")[0]
    let i = 0

    playlistData.forEach(playlist => {
        let cardElement = cardTemplate.content.cloneNode(true)

        const coverImg = cardElement.querySelector('.playlist-cover')
        if (coverImg) {
            coverImg.src = playlist.playlist_art
        }

        cardElement.querySelector('.playlist-title').innerText = playlist.playlist_name
        cardElement.querySelector('.playlist-creator').innerText = playlist.playlist_creator
        cardElement.querySelector('.like-count').innerText = playlist.likeCount

        // uninque like-id per card rendered
        const likeIcon = cardElement.querySelector('#like');
        if (likeIcon) {
            likeIcon.id = `like-${playlist.playlistID}`;

            likeIcon.addEventListener('click', function(event) {
                // Prevent triggering the playlist click event
                event.stopPropagation();

                if (this.classList.contains('fa-regular')) {
                    this.classList.remove('fa-regular');
                    this.classList.add('fa-solid');
                    this.classList.add('liked');
                    playlist.likeCount++;
                } else {
                    this.classList.remove('fa-solid');
                    this.classList.remove('liked');
                    this.classList.add('fa-regular');
                    playlist.likeCount--;
                }

                // update like count
                const likeCountElement = this.parentElement.parentElement.querySelector('.like-count');
                if (likeCountElement) {
                    likeCountElement.innerText = playlist.likeCount;
                }
            });
        }

        // unique delete id per card rendered
        const deleteIcon = cardElement.querySelector('#delete');
        if (deleteIcon) {
            deleteIcon.id = `delete-${playlist.playlistID}`;

            deleteIcon.addEventListener('click', function(event) {
                event.stopPropagation();

                const index = playlistData.findIndex(p => p.playlistID === playlist.playlistID);
                if (index !== -1) {
                    playlistData.splice(index, 1);
                }

                const playlistCard = this.closest('.playlist');
                if (playlistCard) {
                    playlistCard.remove();
                }
            });
        }

        const playlistDiv = cardElement.querySelector('.playlist')
        playlistDiv.dataset.playlistId = playlist.playlistID

        playlistDiv.addEventListener("click", function() {
            const playlistId = parseInt(this.dataset.playlistId)
            openModal(playlistData, playlistId)
        })

        cardContainer.appendChild(cardElement)
        i++
    })
}

// shuffle songs
const shuffleSongs = (playlist) => {
    for (let i = playlist.songs.length - 1; i >= 0; i--) {
        const randIdx = Math.floor(Math.random() * (i + 1))
        const temp = playlist.songs[i]
        playlist.songs[i] = playlist.songs[randIdx]
        playlist.songs[randIdx] = temp
    }
    renderSongs(playlist)
}

// search feature
const searchBar = document.getElementById("search-space")
searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const allPlaylists = document.querySelectorAll(".playlist")

    allPlaylists.forEach(playlist => {
        const playlistName = playlist.querySelector(".playlist-title").textContent.toLowerCase()
        const playlistAuthor = playlist.querySelector(".playlist-creator").textContent.toLowerCase()

        if (playlistName.includes(searchTerm) || playlistAuthor.includes(searchTerm)) {
            playlist.style.display = "block"
        } else {
            playlist.style.display = "none"
        }
    })
})

renderCards()
