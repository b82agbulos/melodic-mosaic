document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".album-cover img[data-rating]");
  const container = document.querySelector(".container");
  const sortByReleaseDateBtn = document.getElementById("sort-release-date");
  const sortByArtistNameBtn = document.getElementById("sort-artist-name");
  const sortByAlbumNameBtn = document.getElementById("sort-album-name");
  const sortByRatingBtn = document.getElementById("sort-rating");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const albumCovers = Array.from(document.querySelectorAll(".album-cover"));
  let stats = calculateStats(albumCovers);  // Changed to let
  const totalAlbums = countTotalAlbums(albumCovers);
  const totalAlbumsElement = document.querySelector('#total-albums');
  totalAlbumsElement.textContent = `Total Albums: ${totalAlbums}`;

  // Display initial stats
  displayStats(stats);

  albumCovers.forEach((albumCover) => {
    albumCover.addEventListener("click", () => displayAlbumInfo(albumCover));
  });

  function replaceSymbols(query) {
    return query.replace(/&/g, "and");
  }
    
  function filterAlbumCovers(query) {
    const updatedQuery = replaceSymbols(query);
    const regex = new RegExp(updatedQuery, "i");

    albumCovers.forEach((albumCover) => {
      const artistName = albumCover.dataset.artistName;
      const albumName = albumCover.dataset.albumName;
      const releaseDate = albumCover.dataset.releaseDate;
      const genre = albumCover.dataset.genres
        .split(',')
        .map((g) => replaceSymbols(g))
        .join(',');

      if (
        regex.test(artistName) ||
        regex.test(albumName) ||
        regex.test(releaseDate) ||
        regex.test(genre)
      ) {
        albumCover.style.display = "flex";
      } else {
        albumCover.style.display = "none";
      }
    });

    const filteredAlbumCovers = albumCovers.filter(albumCover => albumCover.style.display !== "none");

    // Calculate statistics based on currently visible album covers
    stats = calculateStats(filteredAlbumCovers);  // Changed to update existing stats variable

    // Display the new statistics
    displayStats(stats);
  }
  
  function displayStats(stats) {
    // Clear current statistics
    document.querySelector('#most-albums ul').innerHTML = '';
    document.querySelector('#most-rating-points ul').innerHTML = '';
    document.querySelector('#most-genres ul').innerHTML = '';
  
    // Display new statistics
    const mostAlbums = document.querySelector('#most-albums ul');
    stats.sortedAlbumCounts.forEach(([artist, count]) => {
      const li = document.createElement('li');
      li.textContent = `${artist} (${count} albums)`;
      mostAlbums.appendChild(li);
    });
    
    const mostRatingPoints = document.querySelector('#most-rating-points ul');
    stats.sortedRatingPoints.forEach(([artist, points]) => {
      const li = document.createElement('li');
      li.textContent = `${artist} (${points} points)`;
      mostRatingPoints.appendChild(li);
    });
    
    const mostGenres = document.querySelector('#most-genres ul');
    stats.sortedGenreCounts.forEach(([genre, count]) => {
      const li = document.createElement('li');
      li.textContent = `${genre} (${count} entries)`;
      mostGenres.appendChild(li);
    });
  }
    
    
  function displayAlbumInfo(albumCover) {
    const infoDisplay = albumCover.querySelector(".album-info");
    const isVisible = infoDisplay.style.opacity === '1';
  
    if (isVisible) {
      infoDisplay.style.opacity = '0';
      albumCover.classList.remove('info-displayed');
      container.classList.remove('info-displayed');
      infoDisplay.innerHTML = ''; // Clear the contents of the infoDisplay element
    } else {
      const artistName = albumCover.dataset.artistName;
      const albumName = albumCover.dataset.albumName;
      const releaseDate = new Date(albumCover.dataset.releaseDate).getFullYear();
      const spotifyUri = albumCover.dataset.spotifyUri;
  
      // Construct the album information HTML
      let albumInfoHTML = `
        <p><strong>Artist:</strong> ${artistName}</p>
        <p><strong>Album:</strong> ${albumName}</p>
        <p><strong>Year:</strong> ${releaseDate}</p>
      `;
  
      // Add Spotify widget iframe if a Spotify URI is available
      if (spotifyUri) {
        const spotifyId = spotifyUri.split(':').pop();
        albumInfoHTML += `
          <iframe src="https://open.spotify.com/embed/album/${spotifyId}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
      }
  
      // Update the info-display div with the album information
      infoDisplay.innerHTML = albumInfoHTML;
  
      infoDisplay.style.opacity = '1';
      albumCover.classList.add('info-displayed');
      container.classList.add('info-displayed');
    }
  }

    // To search as you type
    searchInput.addEventListener("input", () => filterAlbumCovers(searchInput.value));

  images.forEach((img) => {
    const rating = parseInt(img.dataset.rating, 10);
    const newSize = 150 + (rating * 10); // Base size: 150px + 10px per rating point
    img.style.width = `${newSize}px`;
    img.style.height = "auto";
  });
    
  function sortAlbumCovers(compareFunction) {
    console.log("Sorting album covers...");
    const albumCovers = Array.from(
      document.querySelectorAll(".album-cover")
    ).sort(compareFunction);

    container.innerHTML = "";
    albumCovers.forEach((albumCover) => container.appendChild(albumCover));
  }
  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    // Shuffle albums on page load
    sortAlbumCovers((a, b) => {
      const albumCovers = Array.from(document.querySelectorAll(".album-cover"));
      const shuffledAlbumCovers = shuffleArray(albumCovers);
      return shuffledAlbumCovers.indexOf(a) - shuffledAlbumCovers.indexOf(b);
    });

  function sortByReleaseDate(a, b, reverse = false) {
      const order = reverse ? -1 : 1;
      return order * (new Date(a.dataset.releaseDate) - new Date(b.dataset.releaseDate));
  }

  function sortByArtistName(a, b, reverse = false) {
      const artistNameA = a.dataset.artistName.toLowerCase();
      const artistNameB = b.dataset.artistName.toLowerCase();
      const ignoreArticles = ["the", "a"];
      let nameA = artistNameA;
      let nameB = artistNameB;

      ignoreArticles.forEach((article) => {
          if (artistNameA.startsWith(`${article} `)) {
              nameA = artistNameA.substr(article.length + 1);
          }
          if (artistNameB.startsWith(`${article} `)) {
              nameB = artistNameB.substr(article.length + 1);
          }
      });

      const artistComparison = nameA.localeCompare(nameB);
      const order = reverse ? -1 : 1;

      if (artistComparison === 0) {
          return order * (new Date(a.dataset.releaseDate) - new Date(b.dataset.releaseDate));
      }

      return order * artistComparison;
  }

  function sortByAlbumName(a, b, reverse = false) {
      const albumNameA = a.dataset.albumName.toLowerCase();
      const albumNameB = b.dataset.albumName.toLowerCase();
      const ignoreArticles = ["the", "a"];
      let nameA = albumNameA;
      let nameB = albumNameB;

      ignoreArticles.forEach((article) => {
          if (albumNameA.startsWith(`${article} `)) {
              nameA = albumNameA.substr(article.length + 1);
          }
          if (albumNameB.startsWith(`${article} `)) {
              nameB = albumNameB.substr(article.length + 1);
          }
      });

      const albumComparison = nameA.localeCompare(nameB);
      const order = reverse ? -1 : 1;

      return order * albumComparison;

          }

let sortByReleaseDateDescending = true;
let sortByArtistNameDescending = true;
let sortByAlbumNameDescending = true;
let sortByRatingDescending = true;

sortByReleaseDateBtn.addEventListener("click", () => {
  sortByReleaseDateDescending = !sortByReleaseDateDescending;
  sortAlbumCovers((a, b) => sortByReleaseDate(a, b, sortByReleaseDateDescending));
});

sortByArtistNameBtn.addEventListener("click", () => {
  sortByArtistNameDescending = !sortByArtistNameDescending;
  sortAlbumCovers((a, b) => sortByArtistName(a, b, sortByArtistNameDescending));
});

sortByAlbumNameBtn.addEventListener("click", () => {
  sortByAlbumNameDescending = !sortByAlbumNameDescending;
  sortAlbumCovers((a, b) => sortByAlbumName(a, b, sortByAlbumNameDescending));
});

sortByRatingBtn.addEventListener("click", () => {
  sortByRatingDescending = !sortByRatingDescending;
  sortAlbumCovers((a, b) => {
    const aRating = parseInt(a.querySelector("img").dataset.rating, 10);
    const bRating = parseInt(b.querySelector("img").dataset.rating, 10);
    const order = sortByRatingDescending ? -1 : 1;
    return order * (bRating - aRating);
        });
      });
});

function countTotalAlbums(albumCovers) {
  return albumCovers.length;
}
// Function to capitalize the first letter of each word in a string
function titleCase(str) {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Function to fetch and display the last song played from Last.fm API
function fetchLastSong() {
  const apiKey = 'efb001211a1a43834081d3889119e0b9'; // Replace with your Last.fm API key
  const username = 'bagbulos82'; // Replace with your Last.fm username

  // Last.fm API endpoint to get recent tracks for a user
  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

  // Make a GET request to the Last.fm API using fetch()
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching last song:', response.status);
      }
      return response.json();
    })
    .then(data => {
      // Handle the API response and display the last song played on the page
      const lastSong = data.recenttracks.track[0];
      const lastSongContainer = document.getElementById('last-song-container');

      // Create HTML elements to display the last song played
      const songInfo = document.createElement('div');
      songInfo.classList.add('song-info');

      const title = document.createElement('span');
      title.textContent = "Title: ";
      const songName = document.createElement('span');
      songName.textContent = titleCase(lastSong.name);
      title.append(songName);

      const titleBreak = document.createElement('br');

      const artistLabel = document.createElement('span');
      artistLabel.textContent = "Artist: ";
      const artistName = document.createElement('span');
      artistName.textContent = titleCase(lastSong.artist['#text']);
      artistLabel.append(artistName);

      const breakLine = document.createElement('br');

      const albumLabel = document.createElement('span');
      albumLabel.textContent = "Album: ";
      const albumName = document.createElement('span');
      albumName.textContent = titleCase(lastSong.album['#text']);
      albumLabel.append(albumName);

      const albumImage = document.createElement('img');
      albumImage.src = lastSong.image[2]['#text']; // Assumes medium-sized image is available, change the index as needed
      albumImage.alt = "Album Art";

      const playButton = document.createElement('button');
      playButton.textContent = "Play";
      playButton.addEventListener('click', () => {
        // Open a new tab or window to play the song using your preferred music player or service
        window.open(lastSong.url, '_blank');
      });

      songInfo.append(title, titleBreak, artistLabel, breakLine, albumLabel, albumImage, playButton);

      // Append the song info to the container
      lastSongContainer.appendChild(songInfo);
    })
    .catch(error => {
      console.error('Error fetching last song:', error);
    });
}

// Call the fetchLastSong function to retrieve and display the last song played
fetchLastSong();
