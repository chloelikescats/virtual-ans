// Get the modal
let uploadFormModal = document.getElementById('uploadFormModal');

// Get the button that opens the modal
let uploadFormBtn = document.getElementById("uploadFormBtn");

// Get the <span> element that closes the modal
let spanUpload = document.getElementById("closeUpload");

// Get the play button
let uploadPlayButton = document.getElementById("play");

// When the user clicks on the button, open the modal 
uploadFormBtn.onclick = function() {
    uploadFormModal.style.display = "block";
    uploadPlayButton.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanUpload.onclick = function() {
    uploadFormModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == uploadFormModal) {
        uploadFormModal.style.display = "none";
    }
}

let imgFile;
$("#image-file").on('change', function(evt) {
    imgFile = evt.target.files;
});

$("#uploadImage").on('click', function(evt) {
    evt.preventDefault();

    let formData = new FormData();
    formData.append('img_file', imgFile[0]);
    //This should be fine...
    let privacy = $("input[name='privacy']:checked").val();
    formData.append('privacy', privacy);

    $.ajax({
            type: 'POST',
            url: '/process-image.json',
            data: formData,
            contentType: false,
            processData: false,
            success: function(results) {
                let queueImg = document.querySelector("#queue");
                let imgSrc = results['url'];
                queueImg.setAttribute('src', imgSrc);
                let imgId = results['id'];
                $("#img_id_in").val(imgId);
        }
    });
})
