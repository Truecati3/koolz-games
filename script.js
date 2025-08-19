// Array of game data
const games = [
  {
    name: "Game 1",
    url: "https://1v1.lol/", // Game URL
    icon: "https://play.google.com/store/apps/details?id=lol.onevone&hl=en_NZ" // Icon image
  },
  {
    name: "Game 2",
    url: "https://newgame2url.com",
    icon: "games/new-game2-icon.png"
  }
  // Add more games here
];

// Function to create game icons dynamically
function loadGames() {
  const container = document.getElementById('gamesContainer');
  games.forEach(game => {
    const gameDiv = document.createElement('div');
    gameDiv.classList.add('game-icon');
    gameDiv.onclick = () => openGame(game.url);

    const gameImage = document.createElement('img');
    gameImage.src = game.icon;
    gameImage.alt = game.name;

    const gameName = document.createElement('p');
    gameName.textContent = game.name;

    gameDiv.appendChild(gameImage);
    gameDiv.appendChild(gameName);
    container.appendChild(gameDiv);
  });
}

// Function to open the iframe modal (full-screen)
function openGame(url) {
  var modal = document.getElementById('gameModal');
  var iframe = document.getElementById('gameFrame');
  var closeBtn = document.getElementById('closeBtn');

  // Set iframe source
  iframe.src = url;

  // Show the modal
  modal.style.display = 'flex';

  // Close the modal when the X button is clicked
  closeBtn.onclick = function() {
    modal.style.display = 'none';
    iframe.src = ''; // Stop the game from running when closed
  };

  // Close the modal if clicked outside the iframe
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      iframe.src = '';
    }
  };

  // Make sure the iframe takes up the full screen
  iframe.style.width = '100%';
  iframe.style.height = '100%';

  // Focus the iframe so that it captures keyboard events
  iframe.focus();
}

// Load games when the page loads
window.onload = loadGames;

// Allow WASD (and other) keyboard events to work inside the iframe
window.addEventListener('keydown', function(event) {
  const iframe = document.getElementById('gameFrame');
  if (iframe.style.display === 'flex') {
    // You can add specific code here for keydown events, or just let the iframe handle it
    if (event.key === 'w') {
      console.log('W key pressed');
    } else if (event.key === 'a') {
      console.log('A key pressed');
    } else if (event.key === 's') {
      console.log('S key pressed');
    } else if (event.key === 'd') {
      console.log('D key pressed');
    }
  }
});
