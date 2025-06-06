const modal = document.getElementById("modal")
const span = document.getElementById("close")
const playlistFormModal = document.getElementById("playlist-form-modal")
const closeFormBtn = document.getElementById("close-form")
const addPlaylistBtn = document.getElementById("add-playlist-btn")
const addSongBtn = document.getElementById("add-song-btn")
const playlistForm = document.getElementById("playlist-form")
const cancelPlaylistBtn = document.getElementById("cancel-playlist-btn")

let playlistData = data.playlists
let isEditMode = false
// start at 1 because we already have song-0 in the html
let songCounter = 1

// render songs
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
    let cardContainer = document.getElementsByClassName("playlist-cards")[0]
    cardContainer.innerHTML = ''

    if (!playlistData || playlistData.length === 0) {
        return
    }

    playlistData.forEach(playlist => {
        const playlistDiv = document.createElement('div')
        playlistDiv.className = 'playlist'
        playlistDiv.dataset.playlistId = playlist.playlistID

        const coverImg = document.createElement('img');
        coverImg.className = 'playlist-cover';
        coverImg.src = playlist.playlist_art;
        playlistDiv.appendChild(coverImg);

        const titleElement = document.createElement('h3');
        titleElement.className = 'playlist-title';
        titleElement.innerText = playlist.playlist_name;
        playlistDiv.appendChild(titleElement);

        const creatorElement = document.createElement('p');
        creatorElement.className = 'playlist-creator';
        creatorElement.innerText = playlist.playlist_creator;
        playlistDiv.appendChild(creatorElement);

        const likeCountElement = document.createElement('p');
        likeCountElement.className = 'like-count';
        likeCountElement.innerText = playlist.likeCount;
        playlistDiv.appendChild(likeCountElement);

        const cardActionsDiv = document.createElement('div');
        cardActionsDiv.className = 'card-actions';

        const likeIcon = document.createElement('i');
        likeIcon.className = 'fa-regular fa-heart';
        likeIcon.id = `like-${playlist.playlistID}`;

        likeIcon.addEventListener('click', function(event) {
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

            likeCountElement.innerText = playlist.likeCount;
        });

        cardActionsDiv.appendChild(likeIcon);

        // Edit button
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-solid fa-pencil edit-btn';
        editIcon.id = `edit-${playlist.playlistID}`;

        editIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            openEditPlaylistForm(playlist);
        });

        cardActionsDiv.appendChild(editIcon);

        // delete feature
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash-can';
        deleteIcon.id = `delete-${playlist.playlistID}`;

        deleteIcon.addEventListener('click', function(event) {
            event.stopPropagation();

            const index = playlistData.findIndex(p => p.playlistID === playlist.playlistID);
            if (index !== -1) {
                playlistData.splice(index, 1);
            }

            playlistDiv.remove();
        });

        cardActionsDiv.appendChild(deleteIcon);
        playlistDiv.appendChild(cardActionsDiv);

        playlistDiv.addEventListener("click", function() {
            const playlistId = parseInt(this.dataset.playlistId);
            openModal(playlistData, playlistId);
        });

        cardContainer.appendChild(playlistDiv);
    });
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
const submitButton = document.getElementById("submit")

// Function to perform search
const performSearch = () => {
    const searchTerm = searchBar.value.toLowerCase()
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
}

submitButton.addEventListener("click", (e) => {
    e.preventDefault()
    performSearch()
})

searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        performSearch()
    }
})

// sort feature
const sortPlaylists = (sortBy) => {
    if (sortBy == "name") playlistData.sort((a,b) => a.playlist_name.localeCompare(b.playlist_name))
    else if (sortBy == "likes") playlistData.sort((a,b) => b.likeCount - a.likeCount)
    else playlistData.sort((a,b) => {
        if (!a.dateAdded && !b.dateAdded) return 0;
        if (!a.dateAdded) return 1;
        if (!b.dateAdded) return -1;
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    })
}

const sortOptions = document.getElementById("sort-options")

sortOptions.addEventListener("change", (event) => {
    const sortBy = event.target.value
    sortPlaylists(sortBy)
    renderCards()
})

// add/edit Playlist Feature
const openAddPlaylistForm = () => {
    isEditMode = false;
    document.getElementById("form-title").innerText = "Add New Playlist";
    document.getElementById("playlist-id").value = "";
    playlistForm.reset();

    const songsList = document.getElementById("songs-list");
    songsList.innerHTML = `
        <div class="song-input">
            <div class="form-group">
                <label for="song-name-0">Song Name:</label>
                <input type="text" class="song-name" id="song-name-0" required>
            </div>
            <div class="form-group">
                <label for="song-artist-0">Artist:</label>
                <input type="text" class="song-artist" id="song-artist-0" required>
            </div>
            <div class="form-group">
                <label for="song-album-0">Album:</label>
                <input type="text" class="song-album" id="song-album-0" required>
            </div>
            <div class="form-group">
                <label for="song-cover-0">Cover URL:</label>
                <input type="text" class="song-cover" id="song-cover-0" required>
            </div>
            <div class="form-group">
                <label for="song-duration-0">Duration:</label>
                <input type="text" class="song-duration" id="song-duration-0" placeholder="e.g. 3:45" required>
            </div>
        </div>
    `;
    songCounter = 1;

    playlistFormModal.style.display = "block";
}

addPlaylistBtn.addEventListener("click", openAddPlaylistForm);

// close the modal(add playlist pop up form) when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === playlistFormModal) {
        playlistFormModal.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    renderCards();
});
