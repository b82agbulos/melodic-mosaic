document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".album-cover img[data-rating]");
    const container = document.querySelector(".container");
    const sortByReleaseDateBtn = document.getElementById("sort-release-date");
    const sortByArtistNameBtn = document.getElementById("sort-artist-name");
    const sortByAlbumNameBtn = document.getElementById("sort-album-name");
    const sortByRatingBtn = document.getElementById("sort-rating");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const albumCovers = document.querySelectorAll(".album-cover");
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
      }
      
 
      function displayAlbumInfo(albumCover) {
        const infoDisplay = albumCover.querySelector(".album-info");
        const isVisible = infoDisplay.style.opacity === '1';
    
        if (isVisible) {
            infoDisplay.style.opacity = '0';
            albumCover.classList.remove('info-displayed');
            container.classList.remove('info-displayed');
        } else {
            const artistName = albumCover.dataset.artistName;
            const albumName = albumCover.dataset.albumName;
            const releaseDate = new Date(albumCover.dataset.releaseDate).getFullYear();
    
            // Update the info-display div with the album information
            infoDisplay.innerHTML = `
                <p><strong>Artist:</strong> ${artistName}</p>
                <p><strong>Album:</strong> ${albumName}</p>
                <p><strong>Year:</strong> ${releaseDate}</p>
            `;
    
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
  