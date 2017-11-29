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

  $(document).on('click', '.playables', function() {
      $('.select-image-modal').modal('hide');
      //get image id, load image in interface, pass image id to hidden input
      let queueImg = document.querySelector("#queue");
      let imgSrc = $(this).attr("src")
      queueImg.setAttribute('src', imgSrc);
      let imgId = $(this).attr("id");
      $("#img_id_in").val(imgId);
  });


  // Processes hearts on images
  function handleClick(evt) {
    evt.preventDefault();
    let formInputs = {
      'img_id': $(this).attr("id"),
    };
    let that = this;
    $.post('/heart-image', formInputs, function() {
      $(that).prop('disabled', true);    
      $(that).attr("style", "color: red;");
    });

  }
  $(document).on('click', '.heart', handleClick);

  function addImageToModal(imgURL, imgID, privacy) {
    let newImg = `<div class="image-container">
    <img src= ${ imgURL } class="playables" id= ${ imgID } height="200px">
        <button class="heart-button" data-review-id='${ imgID }'>
        <span id='${ imgID }' class="heart glyphicon glyphicon-heart" aria-hidden="true" style="color: pink;"></span>
        </button>
    </div>`
    if (privacy == true) {
      $('#user-playables').append($(newImg));
    } else {
      $('#public-playables').append($(newImg));
    }
  }
