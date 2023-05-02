function calculateStats() {
  const albumCovers = Array.from(document.querySelectorAll('.album-cover'));
  const artistAlbumCounts = {};
  const artistRatingPoints = {};
  const genreCounts = {};

  albumCovers.forEach(albumCover => {
    const artistName = albumCover.dataset.artistName;
    const rating = parseInt(albumCover.querySelector('img').dataset.rating, 10);
    const genres = albumCover.dataset.genres.split(',');
    let count = artistAlbumCounts[artistName] || 0;
    let points = artistRatingPoints[artistName] || 0;

    artistAlbumCounts[artistName] = count + 1;
    artistRatingPoints[artistName] = points + rating;

    genres.forEach(genre => {
      let count = genreCounts[genre] || 0;
      genreCounts[genre] = count + 1;
    });
  });

  const sortedAlbumCounts = Object.entries(artistAlbumCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([artist, count]) => count > 1)
    .slice(0, 50);
  const sortedRatingPoints = Object.entries(artistRatingPoints)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);
  const sortedGenreCounts = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  return { sortedAlbumCounts, sortedRatingPoints, sortedGenreCounts };
}

document.addEventListener("DOMContentLoaded", function () {
  const stats = calculateStats();
  
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
});

