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
      'img_id': $(this).attr("id"),
    };
    if ($(this).css("color") === "rgb(255, 0, 0)") {
      let that = this;
      $.post('/unheart-image', formInputs, function() {
      $(that).attr("style", "color: pink;");
      img_id = formInputs['img_id'];
      $(("#" + String(img_id))).remove();
      $(that).remove();
      $()
    })}

      //Remove image from fave-imgs div
  
         //   $.post('/unheart-image', formInputs, $(document).ajaxComplete(function(data) {
         //     //Remove image from fave-imgs div
         //     let imgID = $(that).attr("id"); //Also needs to be in faved-img div
         //     let selector = '.faved-playables' + String(imgID); 
         //     // $(selector).css('display', 'none');
         //     $(selector).hide();
         //     console.log(selector);
         // });

      // $.post('/unheart-image', formInputs, function(data) {
      //   $(that).attr("style", "color: pink;");
      //   //Remove image from fave-imgs div
      //   let imgID = $(that).attr("id"); //Also needs to be in faved-img div
      //   let selector = 'img.faved-playables' + String(imgID); 
      //   // $(selector).css('display', 'none');
      //   $(selector).hide();
      //   console.log(selector);
      //   $(selector).remove();
      // });

    // $.ajax({
      //   type: 'POST',
      //   url: '/unheart-image',
      //   data: formInputs,
      //   contentType: false,
      //   processData: false,
      //   success: function() {
      //     $(that).attr("style", "color: pink;");
      //     let imgID = $(that).attr("id"); //Also needs to be in faved-img div
      //     let selector = '.faved-playables' + String(imgID); 
      //     console.log(selector);
      //     console.log($(selector))
      //     $(selector).remove();
      //   }
      // });

     else {
      let that = this;
      $.post('/heart-image', formInputs, function() {
      $(that).attr("style", "color: red;");
      let imgID = $(that).attr("id");
      let imgURL = $(that).data("imgUrl");
        let newImg = `<div class="image-container">
        <img src= ${ imgURL } class="playables faved-playables"+${ imgID } id= ${ imgID } height="200px">
        <button class="heart-button" data-review-id='${ imgID }'>
        <span id='${ imgID }' class="heart glyphicon glyphicon-heart" aria-hidden="true" style="color: red;"></span>
        </button>
        </div>`
        $('#faved-playables').append($(newImg));
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
    if (privacy == true || privacy == 'private') {
      $('#user-playables').append($(newImg));
    } else {
      $('#user-playables').append($(newImg));
      $('#public-playables').append($(newImg));
    }
  }
