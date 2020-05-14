//my name is dilan and i like to code lol

var version = "0.5";

var canvas = document.getElementById("canvasMain");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyPressEvent, false);
document.addEventListener("keyup", keyReleaseEvent, false);


//0 - start, 1 - playing, 2 - game over, 3 - options, 4 - credits
var game_stage = 0;
var game_stage_trigger = false;
var game_score = 0;
var game_highScore = localStorage.getItem("interestingNumber");
var game_keys = true;
var game_oneTime = false;

const title_x_original = canvas.width - 25;
var title_x = title_x_original;
var title_vx = 0;
const title_ax = -0.1;
const title_vx_max = -10;
const title_internal_vx = -15;
var title_selected = 0;
const title_selected_max = 2;

const gameOver_y_original = -50;
var gameOver_y = gameOver_y_original;
const gameOver_menu_y_original = canvas.height + 100;
var gameOver_menu_y = gameOver_menu_y_original;
const gameOver_internal_vy = 5;
var gameOver_selected = 0;
var gameOver_selected_max = 1;
var gameOver_oneTime = false;

var square_dim = 32;
var square_x = 100;
var square_y = canvas.height/2 - (square_dim/2);
var square_vx = 0;
var square_vy = 0;
var square_vjump = -5;

var gravity = 0.2;
var gravity_max = 10;

var walls = [];
var wall_dimx = 72;
var wall_dimy = 500;
var wall_vx = -5;
var wall_spawningInterval = 64;
var wall_separation = 150;
var wall_currentSpawningInterval = 0;

var intersect_padding = 4;

function reload(){
	
	if (!game_oneTime){
		if (game_highScore == null){
			game_highScore = 0;
			localStorage.setItem("interestingNumber", 0);
		}
		game_oneTime = true;
	}
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	tick();

	if (title_x > -5) renderTitleScreen();

	renderSquare();
	renderScore();
	renderTickWalls();
	if (game_stage == 2) renderGameOverScreen();
	
	renderHighScore();
	renderOutline();

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
	if (game_stage == 1){
		wall_currentSpawningInterval++;

		if (title_vx <= title_vx_max) title_vx = title_vx_max;
		else title_vx += title_ax;

		if (title_x > -5) title_x += title_vx;

	}

}

function renderTitleScreen(){
	ctx.beginPath();
	ctx.fillStyle = "rgb(0, 255, 0)";
	ctx.font = "90px Impact";
	ctx.textAlign = "right";
	ctx.fillText("FlapXD", title_x, 150);
	ctx.font = "35px Arial";

	rts_colorSet(0, title_selected, false);
	ctx.fillText("Play", title_x - 25, 225);

	rts_colorSet(1, title_selected, false);
	ctx.fillText("Options", title_x - 25, 275);

	rts_colorSet(2, title_selected, false);
	ctx.fillText("Credits", title_x - 25, 325);

	rts_colorSet(-1, title_selected, false);
	ctx.font = "20px Arial";
	ctx.fillText("[space] jump/enter", title_x - 25, 400);
	ctx.fillText("[up/down] select", title_x - 25, 425);

	if (game_stage == 4){

		ctx.fillStyle = "rgb(0, 255, 0)";
		ctx.font = "90px Impact";
		ctx.fillText("Credits", title_x + 325, 150);
		ctx.font = "24px Arial";
		rts_colorSet(0, title_selected, true);
		ctx.fillText("Created by Dilan ;)", title_x + 300, 225);
		ctx.fillText("blockhead7360.com/flapxd", title_x + 300, 275);

		rts_colorSet(1, title_selected, true);
		ctx.font = "35px Arial";
		ctx.fillText("Back", title_x + 300, 325);
		if ((title_x > title_x_original - 325) && !game_stage_trigger){
			title_x += title_internal_vx;
		}

		if (game_stage_trigger){
			if (title_x < title_x_original) title_x -= title_internal_vx;
			else{
				game_stage = 0;
				game_stage_trigger = false;
			}
		}

	}

	ctx.closePath();
}

function rts_colorSet(current, actual, selected){

	if (selected){
		if (current == 0){
			ctx.fillStyle = "rgb(255, 255, 255)";
		}
		if (current == 1){
			ctx.fillStyle = "rgb(255, 255, 0)";
		}
	}

	else{
		if (game_stage != 0 && game_stage != 2){

			ctx.fillStyle = "gray";
		}

		else if (current == actual){
			ctx.fillStyle = "rgb(255, 255, 0)";
		}else{
			ctx.fillStyle = "rgb(255, 255, 255)";
		}
	}
}

function renderGameOverScreen(){
	ctx.beginPath();
	ctx.fillStyle = "rgb(255, 0, 0)";
	ctx.font = "100px Impact";
	ctx.textAlign = "center";
	ctx.fillText("Loser!", canvas.width/2, gameOver_y);

	ctx.font = "24px Arial";
	rts_colorSet(0, gameOver_selected, false);
	ctx.fillText("Play again", canvas.width/2, gameOver_menu_y);
	rts_colorSet(1, gameOver_selected, false);
	ctx.fillText("Return to main menu", canvas.width/2, gameOver_menu_y + 50);

	ctx.closePath();

	if (!gameOver_oneTime){
		setHighScore();
		gameOver_oneTime = true;
	}

	if (gameOver_y < 100){
		game_keys = false;
		gameOver_y += gameOver_internal_vy;
	}else{
		if (gameOver_menu_y > canvas.height - 100){
			game_keys = true;
			gameOver_menu_y -= gameOver_internal_vy;
		}
	}

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
	ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
	ctx.font = "250px Arial";
	ctx.textAlign = "center";
	if (game_stage == 1 || game_stage == 2) ctx.fillText("" + game_score, canvas.width/2, canvas.height/2 + 75);
	else ctx.fillText("", canvas.width/2, canvas.height/2 + 75);
	
	ctx.closePath();
}

function renderHighScore(){
	ctx.beginPath();
	ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
	ctx.fillRect(canvas.width - 200, canvas.height - 30, 200, 30);
	
	ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
	ctx.font = "20px Arial";
	ctx.textAlign = "center";
	ctx.fillText("High score: " + game_highScore, canvas.width - 100, canvas.height - 8);
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

	if (game_keys){
		if (game_stage == 0){
			if (e.key == "Down" || e.key == "ArrowDown"){
				if (title_selected < title_selected_max){
					title_selected++;
				}
			}
			if (e.key == "Up" || e.key == "ArrowUp"){
				if (title_selected > 0){
					title_selected--;
				}
			}

			if (e.key == " "){
				if (title_selected == 0){
					game_stage = 1;
					square_vy = square_vjump;
				}
				if (title_selected == 1){

				}
				if (title_selected == 2){
					game_stage = 4;
				}
			}

		}

		else if (game_stage == 1){
			if (e.key == " ") square_vy = square_vjump;
		}
		else if (game_stage == 2){
			if (e.key == "Down" || e.key == "ArrowDown"){
				if (gameOver_selected < gameOver_selected_max){
					gameOver_selected++;
				}
			}
			if (e.key == "Up" || e.key == "ArrowUp"){
				if (gameOver_selected > 0){
					gameOver_selected--;
				}
			}
			if (e.key == " "){
				if (gameOver_selected == 0){
					resetGame(1);				
				}
			}
		}

		else if (game_stage == 4){
			if (e.key == " ") game_stage_trigger = true;
		}
	}
}

function keyReleaseEvent(e){

}

function setHighScore(){

	if (game_score > game_highScore){
		game_highScore = game_score;
		localStorage.setItem("interestingNumber", game_score);
	}
	
}

function resetGame(state){
	game_score = 0;
	walls = [];
	gameOver_y = gameOver_y_original;
	gameOver_menu_y = gameOver_menu_y_original;
	gameOver_selected = 0;
	gameOver_oneTime = false;
	square_vy = square_vjump;
	game_stage = state;
}