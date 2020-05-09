let publicImages = document.getElementById('publicImages');
let userImages = document.getElementById('userImages');
let favedImages = document.getElementById('favedImages');
let publicPlayables = document.getElementById('public-playables');
let userPlayables = document.getElementById('user-playables');
let favedPlayables = document.getElementById('faved-playables');

if (publicImages) {
  publicImages.onclick = function() {
    publicPlayables.style.display = "block";
    favedPlayables.style.display = "none";
    userPlayables.style.display = "none";
  }
}
if (userImages) {
  userImages.onclick = function() {
    userPlayables.style.display = "block";
    favedPlayables.style.display = "none";
    publicPlayables.style.display = "none";
  }
}
if (favedImages) {
    favedImages.onclick = function() {
    favedPlayables.style.display = "block";
    userPlayables.style.display = "none";
    publicPlayables.style.display = "none";
  }
}

$(document).on('click', '.playables', function() {
    $('.select-image-modal').modal('hide');
    //get image id, load image in interface, pass image id to hidden input
    let queueImg = document.querySelector("#queue");
    let imgId = $(this).attr("data-img-id");
    let imgSrc = $(this).attr("src");
    queueImg.setAttribute('src', imgSrc);
    $("#img_id_in").val(imgId);
});


  // Processes hearts on images
  function handleClickLike(evt) {
    evt.preventDefault();
    // add class unheart to button
    let formInputs = {
      'img_id': $(this).attr("id"),
    };
    if ($(this).css("color") === "rgb(255, 0, 0)") {
      let that = this;
      $.post('/unheart-image', formInputs, function() {
      $(that).attr("style", "color: pink;");
      });
    } else {
      let that = this;
      $.post('/heart-image', formInputs, function() {
      $(that).attr("style", "color: red;");
      });
    }
  }
  $(document).on('click', '.heart', handleClickLike);


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
