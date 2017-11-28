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

