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
    // Find the playlist by ID instead of using index
    let playlist = playlists.find(p => p.playlistID === playlistId);

    if (!playlist) {
        console.error("Playlist not found with ID:", playlistId);
        return;
    }

    document.getElementById("header-image").src = playlist.playlist_art
    document.getElementById("playlist-title").innerText = playlist.playlist_name
    document.getElementById("creator-name").innerText = playlist.playlist_creator

    modal.style.display = "block"
    renderSongs(playlist)
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

        // Set playlist data
        const coverImg = cardElement.querySelector('.playlist-cover')
        if (coverImg) {
            coverImg.src = playlist.playlist_art
        }

        cardElement.querySelector('.playlist-title').innerText = playlist.playlist_name
        cardElement.querySelector('.playlist-creator').innerText = playlist.playlist_creator
        cardElement.querySelector('.like-count').innerText = playlist.likeCount
        // Change the ID of the like icon to make it unique for each playlist
        const likeIcon = cardElement.querySelector('#like');
        if (likeIcon) {
            likeIcon.id = `like-${playlist.playlistID}`;

            // Add click event listener to handle liking a playlist
            likeIcon.addEventListener('click', function(event) {
                // Prevent triggering the playlist click event
                event.stopPropagation();

                // Toggle heart icon between filled and outline
                if (this.classList.contains('fa-regular')) {
                    this.classList.remove('fa-regular');
                    this.classList.add('fa-solid');
                    playlist.likeCount++;
                } else {
                    this.classList.remove('fa-solid');
                    this.classList.add('fa-regular');
                    playlist.likeCount--;
                }

                // Update the like count display
                const likeCountElement = this.parentElement.parentElement.querySelector('.like-count');
                if (likeCountElement) {
                    likeCountElement.innerText = playlist.likeCount;
                }
            });
        }

        // Change the ID of the delete icon to make it unique for each playlist
        const deleteIcon = cardElement.querySelector('#delete');
        if (deleteIcon) {
            deleteIcon.id = `delete-${playlist.playlistID}`;

            // Add click event listener to handle deleting a playlist
            deleteIcon.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent triggering the playlist click event

                // Remove the playlist from the data array
                const index = playlistData.findIndex(p => p.playlistID === playlist.playlistID);
                if (index !== -1) {
                    playlistData.splice(index, 1);
                }

                // Remove the playlist card from the DOM
                const playlistCard = this.closest('.playlist');
                if (playlistCard) {
                    playlistCard.remove();
                }
            });
        }

        // Add event listener to the playlist div
        const playlistDiv = cardElement.querySelector('.playlist')
        // Store the playlist ID as a data attribute
        playlistDiv.dataset.playlistId = playlist.playlistID

        playlistDiv.addEventListener("click", function() {
            const playlistId = parseInt(this.dataset.playlistId)
            openModal(playlistData, playlistId)
        })

        cardContainer.appendChild(cardElement)
        i++
    })
}
renderCards()
