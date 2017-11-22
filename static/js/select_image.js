
  $('.playables').on('click', function() {
      //get image id, load image in interface, pass image id to hidden input
      let queueImg = document.querySelector("#queue");
      let getSrc = $(this).attr("src")
      queueImg.setAttribute('src', getSrc);
      let imgId = $(this).attr("id");
      $("#img_id_in").val(imgId);
  });

// Get the modal
let selectImageModal = document.getElementById('selectImageModal');

// Get the button that opens the modal
let selectImageBtn = document.getElementById("selectImageBtn");

// Get the <span> element that closes the modal
let spanSelect = document.getElementById("closeSelect");

let playButton = document.getElementById("play");

// When the user clicks on the button, open the modal 
selectImageBtn.onclick = function() {
    selectImageModal.style.display = "block";
    playButton.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanSelect.onclick = function() {
    selectImageModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == selectImageModal) {
//         selectImageModal.style.display = "none";
//     }
// }