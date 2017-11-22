// Get the modal
let uploadFormModal = document.getElementById('uploadFormModal');

// Get the button that opens the modal
let uploadFormBtn = document.getElementById("uploadFormBtn");

// Get the <span> element that closes the modal
let spanUpload = document.getElementById("closeUpload");

// When the user clicks on the button, open the modal 
uploadFormBtn.onclick = function() {
    uploadFormModal.style.display = "block";
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