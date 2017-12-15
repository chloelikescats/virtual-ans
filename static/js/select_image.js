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
    $("#publicImages").attr('disabled', 'disabled');
    $("#userImages").removeAttr("disabled");
    $("#favedImages").removeAttr("disabled");
  }
}
if (userImages) {
  userImages.onclick = function() {
    userPlayables.style.display = "block";
    favedPlayables.style.display = "none";
    publicPlayables.style.display = "none";
    $("#userImages").attr('disabled', 'disabled');
    $("#publicImages").removeAttr("disabled");
    $("#favedImages").removeAttr("disabled");
  }
}
if (favedImages) {
    favedImages.onclick = function() {
    favedPlayables.style.display = "block";
    userPlayables.style.display = "none";
    publicPlayables.style.display = "none";
    $("#favedImages").attr('disabled', 'disabled');
    $("#publicImages").removeAttr("disabled");
    $("#userImages").removeAttr("disabled");
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
      let formInputs = {
        'img_id': $(this).attr("id"),
      };
      $.ajax({
        type: 'POST',
        url: '/analyze-queue-img',
        data: formInputs,
        contentType: false,
        processData: false,
        success: function(results) {
          console.log(results);
        }
    });
      // $.post("/analyze-queue-img", formInputs, function(results) {
      //   console.log(results);
      // });
  });


  // Processes hearts on images
  function handleClickLike(evt) {
    evt.preventDefault();
    // add class unheart to button
    let formInputs = {
      'img_id': $(this).data("img-id"),
    };
    // if color red
    if ($(this).css("color") === "rgb(255, 0, 0)") {
      let thisHeart = this;
      $.post('/unheart-image', formInputs, function() {

        let img_id = formInputs['img_id'];

        $(img_id).attr("style", "color: pink;");
        $("#your-" + img_id).attr("style", "color: pink;");
        $("#public-" + img_id).attr("style", "color: pink;");
        // If image in faved div, remove
        $(("#faved-div-" + img_id)).remove();
    })}

    else {
      let that = this;
      $.post('/heart-image', formInputs, function() {
      $(that).attr("style", "color: red;");
      let imgID = $(that).data("img-id");
      let imgURL = $(that).data("img-url");
        let newImg = `<div id='faved-div-${ imgID }' class="image-container">
                        <img src='${ imgURL }' class="playables" data-img-id='${ imgID }' height="200px">
                        <button class="heart-button" data-review-id='${ imgID }'>
                          <span id='faved-${ imgID }' data-img-id='${ imgID }' class="heart glyphicon glyphicon-heart" aria-hidden="true" style="color: red;"></span>
                        </button>
                      </div>`

        $('#faved-playables').append($(newImg));
      });
    }
  }

  $(document).on('click', '.heart', handleClickLike);


  function addImageToModal(imgURL, imgID, privacy) {
    let newImg = `<div class="image-container">
                    <img src='${ imgURL }' class="playables" data-img-id='${ imgID }' height="200px">
                    <button class="heart-button" data-review-id='${ imgID }'>
                      <span data-img-id='${ imgID }' class="heart glyphicon glyphicon-heart" aria-hidden="true" style="color: pink;"></span>
                    </button>
                  </div>`
    if (privacy == true || privacy == 'private') {
      $('#user-playables').append($(newImg));
    } else {
      $('#user-playables').append($(newImg));
      $('#public-playables').append($(newImg));
    }
  }
