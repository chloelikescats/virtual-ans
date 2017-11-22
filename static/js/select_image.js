let publicImages = document.getElementById('publicImages');
let userImages = document.getElementById('userImages');
let publicPlayables = document.getElementById('public-playables');
let userPlayables = document.getElementById('user-playables');

if (publicImages) {
  publicImages.onclick = function() {
    publicPlayables.style.display = "block";
    userPlayables.style.display = "none";
  }
}
if (userImages) {
  userImages.onclick = function() {
    userPlayables.style.display = "block";
    publicPlayables.style.display = "none";
  }
}
  $('.playables').on('click', function() {
      selectImageModal.style.display = "none";
      //get image id, load image in interface, pass image id to hidden input
      let queueImg = document.querySelector("#queue");
      let imgSrc = $(this).attr("src")
      queueImg.setAttribute('src', imgSrc);
      let imgId = $(this).attr("id");
      $("#img_id_in").val(imgId);
  });

// Get the modal
let selectImageModal = document.getElementById('selectImageModal');

// Get the button that opens the modal
let selectImageBtn = document.getElementById("selectImageBtn");

// Get the <span> element that closes the modal
let spanSelect = document.getElementById("closeSelect");

// Get the play button
let selectPlayButton = document.getElementById("play");

// When the user clicks on the button, open the modal 
selectImageBtn.onclick = function() {
    selectImageModal.style.display = "block";
    selectPlayButton.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanSelect.onclick = function() {
    selectImageModal.style.display = "none";
}