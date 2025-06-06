let playlistData = data.playlists

const renderSongs = (playlistArray) => {
    let songElement = document.getElementById("song-container")
    console.log(playlistArray.songs)

    playlistArray.songs.forEach(song => {
        const songCard = document.createElement("div")
        songCard.innerHTML = `
        <div class="song">
            <div class="songImage">
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
    });
}

const renderRandomCard = (randomPlaylistId) => {
    let cardElement = document.getElementsByClassName("playlist")[0]

    let playlist = playlistData[randomPlaylistId]

    cardElement.children[0].src = playlist.playlist_art
    cardElement.children[1].innerText = playlist.playlist_name
    cardElement.children[2].innerText = playlist.playlist_creator

    renderSongs(playlist)
}

const randomPlaylistCard = () => {
    for (let i = playlistData.length - 1; i >= 0; i--) {
        const randIdx = Math.floor(Math.random() * (i + 1))
        const temp = playlistData[i]
        playlistData[i] = playlistData[randIdx]
        playlistData[randIdx] = temp
    }

    let randIdx = Math.floor(Math.random() * playlistData.length - 1)
    renderRandomCard(randIdx)
}

randomPlaylistCard()
