
context = document.getElementById('canvas').getContext("2d");
context.fillStyle="black";
let colorBlack = "black";
let colorWhite = "white";
let curColor = colorWhite;
let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();
let clickColor = new Array();
let paint;

$('#canvas').mousedown(function(e){
  let mousePosition = getMousePosition(document.getElementById('canvas'), e);
  let mouseX = mousePosition.x;
  let mouseY = mousePosition.y;
        
  paint = true;

  addClick(mouseX, mouseY, false, curColor);
  redraw();
});

$('#canvas').mousemove(function(e){
  let mousePosition = getMousePosition(document.getElementById('canvas'), e);
  let mouseX = mousePosition.x;
  let mouseY = mousePosition.y;

  if(paint){
    addClick(mouseX, mouseY, true, curColor);

    redraw();
  }
});

function getMousePosition(canvas, e) {
  let rect = canvas.getBoundingClientRect();
  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

$('#canvas').mouseup(function(e){
  paint = false;
});

$('#canvas').mouseleave(function(e){
  paint = false;
});

function addClick(x, y, dragging, color){
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(color);
}

function redraw(){
  context.lineJoin = "square";
  context.lineWidth = 3;
            
  for(let i=0; i < clickX.length; i++) {        
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.strokeStyle = clickColor[i];
     context.lineTo(clickX[i], clickY[i]);
     context.stroke();
     context.closePath();
  }
}

// ***************************************************************** 
// Event Listeners:

// Clear Canvas:
document.getElementById('clearCanvas').addEventListener('click', function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    context.beginPath();
});

// Select Eraser Tool:
document.getElementById('eraser').addEventListener('click', function() {
    curColor = colorBlack;
});

// Select Pen Tool:
document.getElementById('pen').addEventListener('click', function() {
    curColor = colorWhite;
});


// Save Canvas (get URL to pass to app route):
document.getElementById('saveCanvas').addEventListener('click', function(){
    let canvas = document.getElementById('canvas');
        let dataUrl = canvas.toDataURL('image/jpeg');
        let blobBin = atob(dataUrl.split(',')[1]);
        let array = [];
        for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        let file = new Blob([new Uint8Array(array)], {type: 'image/jpg'});
        let formData = new FormData();
        formData.append("myFileName", file);

        $.ajax({
            type: 'POST',
            url: '/process-canvas',
            data: formData,
            contentType: false,
            processData: false,
            success: function(){
              console.log("I saved it!")
            }
        });
});

// Get the modal
let canvasModal = document.getElementById('myCanvasModal');

// Get the button that opens the modal
let canvasBtn = document.getElementById("canvasBtn");

// Get the <span> element that closes the modal
let spanCanvas = document.getElementById("closeCanvas");

// When the user clicks on the button, open the modal 
canvasBtn.onclick = function() {
    canvasModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanCanvas.onclick = function() {
    canvasModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//       if (event.target.type !== "submit") {
//         $(".modal").hide();
//       }
// }