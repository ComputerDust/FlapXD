//my name is dilan and i like to code lol

var version = "0.2";

var canvas = document.getElementById("canvasMain");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyPressEvent, false);
document.addEventListener("keyup", keyReleaseEvent, false);


//0 - start, 1 - playing, 2 - game over
var game_stage = 0;
var game_score = 0;

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

var intersect_padding = 4;

function reload(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	tick();
	
	renderOutline();
	renderSquare();
	renderScore();
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
		square_vy = 0;
	}
	if (square_y <= 0){
		square_y = 0;
		square_vy = 0;
	}
	
	if (wall_currentSpawningInterval >= wall_spawningInterval){
		let wy = Math.floor(Math.random() * (476 - 25 - wall_separation)) + 25 + wall_separation;
		
		walls[walls.length] = {x: 750, y:-wy, top: true, score: false};
		walls[walls.length] = {x: 750, y:-wy + wall_dimy + wall_separation, top: false, score: false};
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
	ctx.textAlign = "left";
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
		if (game_stage == 1) walls[i].x += wall_vx;
		
		if (walls[i].top && walls[i].x <= 100 - wall_dimx){
			if (!walls[i].score){
				game_score++;
				walls[i].score = true;
			}
			
		}
		
		if (intersectEvent(square_x + intersect_padding, square_y + intersect_padding, square_dim - intersect_padding, square_dim - intersect_padding, walls[i].x, walls[i].y, wall_dimx, wall_dimy)){
			game_stage = 2;
		}
		
		if (walls[i].x <= -wall_dimx){
			walls.splice(i, 1);
			i--;
		}
	}
}

function renderScore(){
	ctx.beginPath();
	//ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
	//ctx.fillRect(canvas.width - 85, 10, 75, 50);
	ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
	ctx.font = "250px Arial";
	ctx.textAlign = "center";
	//ctx.fillText("" + game_score, canvas.width - 85 + (75/2), 45);
	ctx.fillText("" + game_score, canvas.width / 2, canvas.height/2 + 75);
	ctx.closePath();
}

function intersectEvent(x1, y1, w1, h1, x2, y2, w2, h2){
	if ((x1 > x2 && x1 < x2 + w2) || (x1 + w1 > x2 && x1 + w1 < x2 + w2)){
		if ((y1 > y2 && y1 < y2 + h2) || (y1 + h1 > y2 && y1 + h1 < y2 + h2)){
			return true;
		}
	}
	return false;
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