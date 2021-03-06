
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
document.getElementById('clearCanvas').addEventListener('click', clearCanvas);

function clearCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    context.beginPath();
    $("#pen").removeAttr("disabled");
    $("#eraser").removeAttr("disabled");
}

// Select Eraser Tool:
document.getElementById('eraser').addEventListener('click', function() {
    curColor = colorBlack;
    $("#eraser").attr('disabled', 'disabled');
    $("#pen").removeAttr("disabled");
});

// Select Pen Tool:
document.getElementById('pen').addEventListener('click', function() {
    curColor = colorWhite;
});


// Save Canvas (get URL to pass to app route):
document.getElementById('saveCanvas').addEventListener('click', function(){
    $('.canvas-modal').modal('hide');
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
    let privacy = $("input[name='privacy1']:checked").val();
    formData.append('privacy', privacy);
    debugger;

    $.ajax({
        type: 'POST',
        url: '/process-canvas.json',
        data: formData,
        contentType: false,
        processData: false,
        success: function(results) {
            let queueImg = document.querySelector("#queue");
            let imgSrc = results['url'];
            queueImg.setAttribute('src', imgSrc);
            let imgId = results['id'];
            $("#img_id_in").val(imgId);
            addImageToModal(imgSrc, imgId, privacy);
        }
    });
    clearCanvas();
});
