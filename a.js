var canvas = document.getElementById('mycanvas');
var context = canvas.getContext('2d');
var triangles = [];
var imgData;
var x1=0;
var x2=100;
var x3=(x2-x1)/2;
var y1=75;
var y2=y1;
var y3=25;
var flag=0,flagDrag=0;
var colorValue;

document.getElementById("mycanvas").onmousedown = function() {mouseDown(event)};
document.getElementById("mycanvas").onmouseup = function() {mouseUp(event)};
document.getElementById("mycanvas").onmousemove = function() {mouseMove(event)};
document.getElementById("clear").addEventListener("click", clearCanvas);
document.getElementById("mycanvas").addEventListener("dblclick", deleteTriangle);
//to clear all created triangle
function clearCanvas() {
  triangles=[];
  context.clearRect(0, 0, canvas.width, canvas.height);
}
//to check whether the point lies inside exisiting triangle
function checkpoint(e){
    var mx = parseInt(e.clientX-offsetX);
    var my = parseInt(e.clientY-offsetY);
    for (var i = 0; i < triangles.length; i++) {
        var r = triangles[i];        
        if (ptInTriangle(mx,my,r.x1,r.y1,r.x2,r.y2,r.x3,r.y3)) {
            return true;
        }
    }
    return false;
}
function mouseDown(event){
  event.preventDefault();
  event.stopPropagation();
  flag=1;
  if (!checkpoint(event)) {    
    x1 = event.clientX-offsetX;     
    y3 = event.clientY-offsetY; 
    imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    colorValue='#'+Math.floor(Math.random()*16777215).toString(16);
  }
  else{
    flagDrag=1;
    myDown(event)
  }
}

function mouseUp(event) {
  event.preventDefault();
  event.stopPropagation();
  flag=0; 
  if (!checkpoint(event)) {     
    
    x2= event.clientX-offsetX;     
    y1 = event.clientY-offsetY; 
    y2=y1;
    x3=((x2-x1)/2)+x1;
    draw(x1, y1, x2, y2,x3,y3,colorValue)  
    triangles.push({x1:x1,y1:y1,x2:x2,y2:y2,x3:x3,y3:y3,colorValue:colorValue,isDragging:false,order:0});
   
  }
  else{
    flagDrag=0;
    myUp(event)
  }
} 
//to delete traingle from array
function deleteTriangle(event){
  if(checkpoint(event)){
    var mx = parseInt(event.clientX-offsetX);
    var my = parseInt(event.clientY-offsetY);
    for (var i = 0; i < triangles.length; i++) {
        var r = triangles[i];        
        if (ptInTriangle(mx,my,r.x1,r.y1,r.x2,r.y2,r.x3,r.y3)) {
          triangles.splice(i,1);
          drawDrag()
        }
    }
  }

}
function mouseMove(event) {
  event.preventDefault();
  event.stopPropagation();
  if(flag==1){ 
    if (!checkpoint(event)) {        
        context.putImageData(imgData, 0, 0);
        x2= event.clientX-offsetX;     
        y1 = event.clientY-offsetY; 
        y2=y1;
        x3=((x2-x1)/2)+x1;
        draw(x1, y1, x2, y2,x3,y3,colorValue)
      }  
    else if(flagDrag==1){
      myMove(event)
    }
  }
}

var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// drag related variables
var dragok = false;
var startX;
var startY;

function draw(x1, y1, x2, y2,x3,y3,colorValue) {
  context.beginPath();
  context.moveTo(x3,y3);
  context.lineTo(x1,y1);
  context.lineTo(x2,y2);          
  context.closePath();
  context.strokeStyle="#000000";
  context.stroke();
  context.fillStyle = colorValue;
  context.fill();
}

// clear the canvas
function clear() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function drawDrag() {
    clear();
   
    // redraw each triangle in the triangles array
    for (var i = 0; i < triangles.length; i++) {
        var r = triangles[i];
       
        draw(r.x1, r.y1, r.x2, r.y2,r.x3,r.y3,r.colorValue);
    }
}
// Select Top Triangles
function SelectTopTriangle(){
    var result = triangles.filter(obj => {
        return obj.isDragging == true;
      })
    for (var i = 0; i < result.length; i++) {
        var r = result[i];
        if(r.isDragging==true && i!=result.length-1){
            triangles[r.order].isDragging=false;
            triangles[r.order].order=0;
        }
       
    } 
}

// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX-offsetX);
    var my = parseInt(e.clientY-offsetY);

    // test each triangle to see if mouse is inside
    dragok = false;
    for (var i = 0; i < triangles.length; i++) {
        var r = triangles[i];
        
            // if yes, set that triangle isDragging=true
        if (ptInTriangle(mx,my,r.x1,r.y1,r.x2,r.y2,r.x3,r.y3)) {
            dragok = true;
            r.isDragging = true;
            r.order=i;
        }
    }
    SelectTopTriangle();
    // save the current mouse position
    startX = mx;
    startY = my;
}
//function to check where the point in triangle
function ptInTriangle(mx,my,x1,y1,x2,y2,x3,y3) {
  var A = 1/2 * (-y2 * x3 + y1 * (-x2 +x3) + x1 * (y2 - y3) + x2 * y3);
  var sign = A < 0 ? -1 : 1;
  var s = (y1 * x3 - x1 * y3 + (y3 - y1) * mx + (x1 - x3) * my) * sign;
  var t = (x1 * y2 - y1 * x2 + (y1 - y2) * mx + (x2 - x1) * my) * sign;
  
  return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

// handle mouseup events
function myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < triangles.length; i++) {
      triangles[i].isDragging = false;
      triangles[i].order=0;
    }
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {

        e.preventDefault();
        e.stopPropagation();
        var mx = parseInt(e.clientX-offsetX);
        var my = parseInt(e.clientY-offsetY);
        var dx = mx - startX;
        var dy = my - startY;

        for (var i = 0; i < triangles.length; i++) {
            var r = triangles[i];
            
            if (r.isDragging) {
                
                r.x1 += dx;
                r.y1 += dy;
                r.x2 += dx;
                r.y2 += dy;
                r.x3 = ((r.x2-r.x1)/2)+r.x1;
                r.y3 += dy;
            }
        }
        drawDrag();
        startX = mx;
        startY = my;

    }
}