
let imgFile;
$("#image-file").on('change', function(evt) {
    imgFile = evt.target.files;
});

$("#uploadImage").on('click', function(evt) {
    evt.preventDefault();

    //Close Modal
    $('.upload-image-modal').modal('hide');

    //Package formData
    let formData = new FormData();
    formData.append('img_file', imgFile[0]);
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
