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
}
