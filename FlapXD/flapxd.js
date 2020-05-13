var canvas = document.getElementById("canvasMain");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyPressEvent, false);
document.addEventListener("keyup", keyReleaseEvent, false);

var square_x = 100;
var square_y = canvas.height/2;
var square_vx = 0;
var square_vy = 0;

var gravity = 0.3;
var gravity_max = 10;

function reload(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	tick();
	renderSquare();
	
}
setInterval(reload, 10);



function tick(){
	//square gravity
	square_vy += gravity;
	if (square_vy >= gravity_max){
		square_vy = gravity_max;
	}
	
	square_x += square_vx;
	square_y += square_vy;
	
}

function renderSquare(){
	ctx.beginPath();
	ctx.rect(square_x, square_y, 32, 32);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}


function keyPressEvent(e){
	if (e.key == " "){
		square_vy = -8;
	}
}

function keyReleaseEvent(e){
	
}