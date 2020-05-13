//my name is dilan and i like to code lol

var version = "beta1";

var canvas = document.getElementById("canvasMain");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyPressEvent, false);
document.addEventListener("keyup", keyReleaseEvent, false);



//0 - start, 1 - playing, 2 - game over
var game_stage = 0;

var walls = [];

var square_dim = 32;
var square_x = 100;
var square_y = canvas.height/2 - (square_dim/2);
var square_vx = 0;
var square_vy = 0;
var square_vjump = -5;

var gravity = 0.2;
var gravity_max = 10;

var wall_dimx = 72;
var wall_dimy = 500;
var wall_vx = -5;
var wall_spawningInterval = 64;
var wall_separation = 150;
var wall_currentSpawningInterval = 0;

function reload(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	tick();
	
	renderOutline();
	renderSquare();
	renderTickWalls();

}
setInterval(reload, 10);



function tick(){

	square_vy += gravity;
	if (square_vy >= gravity_max){
		square_vy = gravity_max;
	}
	
	if (game_stage == 1){
		square_x += square_vx;
		square_y += square_vy;
				
	}

	
	if (square_y + square_dim >= canvas.height){
		square_y = canvas.height - square_dim;
	}
	
	if (wall_currentSpawningInterval >= wall_spawningInterval){
		let wy = Math.floor(Math.random() * (476 - 25 - wall_separation)) + 25 + wall_separation;
		
		walls[walls.length] = {x: 750, y:-wy, top: true};
		walls[walls.length] = {x: 750, y:-wy + wall_dimy + wall_separation, top: false};
		wall_currentSpawningInterval = 0;
	}
	if (game_stage == 1) wall_currentSpawningInterval++;
	
}


function renderOutline(){
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "white";
	ctx.stroke();
	ctx.fillStyle = "gray";
	ctx.font = "15px Arial";
	ctx.fillText("FlapXD! version " + version, 10, 20);
	ctx.closePath();
}

function renderSquare(){
	ctx.beginPath();
	ctx.rect(square_x, square_y, square_dim, square_dim);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function renderTickWalls(){
	for (i = 0; i < walls.length; i++){
		ctx.beginPath();
		ctx.fillStyle = "rgb(0, 255, 0)";
		ctx.fillRect(walls[i].x, walls[i].y, wall_dimx, wall_dimy);
		ctx.closePath();
		walls[i].x += wall_vx;
		
		if (walls[i].x <= -wall_dimx){
			walls.splice(i, 1);
			i--;
		}
	}
}

function keyPressEvent(e){
	if (e.key == " "){
		if (game_stage == 0){
			game_stage = 1;
		}
		square_vy = square_vjump;
	}
}

function keyReleaseEvent(e){
	
}