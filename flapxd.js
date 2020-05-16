//my name is dilan and i like to code lol

/*
 * TODO
 * 
 * - different messages for when you die
 * - add music
 * 
 */

const version = "0.17";
var debug = false;

var canvas = document.getElementById("canvasMain");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyPressEvent, false);
document.addEventListener("keyup", keyReleaseEvent, false);


//0 - start, 1 - playing, 2 - game over, 3 - options, 4 - credits
var game_stage = 0;
var game_stage_trigger = false;
var game_playerCount = 1;
var game_score = 0;
var game_highScore = localStorage.getItem("highScore");
var game_color_square_id = localStorage.getItem("colorSquare");
var game_color_square = "rgb(255, 0, 0)";
var game_color_wall_id = localStorage.getItem("colorWall");
var game_color_wall = "rgb(0, 255, 0)";
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
var title_color_vselected = 2;
const title_color_vselected_max = 3;
var title_color_hselected = 8;
const title_color_hselected_max = 8;
var title_color_spacing = 75;

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
var square_y_original = canvas.height/2 - (square_dim/2);
var square_y = square_y_original;
var square_y_title_vreset = 3;
var square_vx = 0;
var square_vy = 0;
var square_vjump = -5;
const square_vjump_base = -5;
const square_vjump_increment = -0.2;

var gravity = 0.2;
var gravity_max = 10;
const gravity_base = 0.2;
const gravity_increment = 0.03;

var walls = [];
var wall_dimx = 72;
var wall_dimy = 500;
var wall_vx = -5;
const wall_vx_base = -5;
const wall_vx_increment = -0.5;
//-5, 64, every 50
var wall_spawningInterval = 60;
const wall_spawningInterval_base = 60;
const wall_spawningInterval_increment = -2;
var wall_separation = 150;
var wall_currentSpawningInterval = 0;
const wall_speedUpScoreInterval = 50;

var intersect_padding = 4;

function reload(){

	if (!game_oneTime){
		if (game_highScore == null){
			game_highScore = 0;
			localStorage.setItem("highScore", 0);
		}
		if (game_color_square_id == null){
			game_color_square_id = 0;
			localStorage.setItem("colorSquare", 0);
		}else{
			game_color_square_id = parseInt(game_color_square_id);
			game_color_square = colorGet(game_color_square_id);
		}
		
		if (game_color_wall_id == null){
			game_color_wall_id = 3;
			localStorage.setItem("colorWall", 3);
		}else{
			game_color_wall_id = parseInt(game_color_wall_id);
			game_color_wall = colorGet(game_color_wall_id);
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

	let multiplier = Math.floor(game_score/wall_speedUpScoreInterval);

	wall_vx = wall_vx_base + (multiplier * wall_vx_increment);
	wall_spawningInterval = wall_spawningInterval_base + (multiplier * wall_spawningInterval_increment);
	gravity = gravity_base + (multiplier * gravity_increment);
	square_vjump = square_vjump_base + (multiplier * square_vjump_increment);

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
	ctx.fillText("Change Colors", title_x - 25, 275);

	rts_colorSet(2, title_selected, false);
	ctx.fillText("About", title_x - 25, 325);

	ctx.font = "20px Arial";
	rts_colorSet(-1, title_selected, false);
	ctx.fillText("[space] jump/enter", title_x - 25, 400);
	ctx.fillText("[arrows] select", title_x - 25, 425);
	
	if (square_y > square_y_original && game_stage == 0){
		if (square_y - square_y_original < square_y_title_vreset) square_y = square_y_original;
		square_y -= square_y_title_vreset;
	}
	if (square_y < square_y_original && game_stage == 0){
		if (square_y_original - square_y < square_y_title_vreset) square_y = square_y_original;
		square_y += square_y_title_vreset;
	}
	
	if (game_stage == 3){

		ctx.fillStyle = "rgb(0, 255, 0)";
		ctx.font = "90px Impact";
		ctx.fillText("Colors", title_x + 500, 150);
		ctx.font = "20px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillText("square", title_x + 480, 200);
		ctx.fillText("walls", title_x + 480, 200 + title_color_spacing);
		ctx.textAlign = "right";
		
		rts_colorSelected();
		rts_colorSelecting();
		
		rts_colorSet(0, title_selected, true);
		
		for (i = 0; i < 2; i++){
			ctx.fillStyle = colorGet(0);
			ctx.fillRect(title_x + 100, 215 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(1);
			ctx.fillRect(title_x + 148, 215 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(2);
			ctx.fillRect(title_x + 196, 215 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(3);
			ctx.fillRect(title_x + 244, 215 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(4);
			ctx.fillRect(title_x + 292, 215 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(5);
			ctx.fillRect(title_x + 340, 215 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(6);
			ctx.fillRect(title_x + 388, 215 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(7);
			ctx.fillRect(title_x + 436, 215 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(8);
			ctx.fillRect(title_x + 484, 215 + (title_color_spacing*i), 32, 32);
		}
		rts_color_colorSet(2);
		ctx.font = "35px Arial";
		ctx.fillText("Back", title_x + 484, 400);
		
		rts_color_colorSet(3);
		ctx.font = "20px Arial";
		ctx.fillText("Reset to default", title_x + 484, 450);
		
		if ((title_x > title_x_original - 500) && !game_stage_trigger){
			title_x += title_internal_vx;
		}

		
		if (game_stage_trigger){
			if (title_x < title_x_original) title_x -= title_internal_vx;
			else{
				game_stage_trigger = false;
				game_stage = 0;
			}
		}

	}

	if (game_stage == 4){

		ctx.fillStyle = "rgb(0, 255, 0)";
		ctx.font = "90px Impact";
		ctx.fillText("About", title_x + 325, 150);
		ctx.font = "20px Arial";
		rts_colorSet(0, title_selected, true);
		ctx.fillText("FlapXD!!!!!!!!!!!!!!!!!!!", title_x + 300, 200)
		ctx.fillText("version " + version, title_x + 300, 225);
		ctx.fillText("created by Dilan :)", title_x + 300, 250);
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
				game_stage_trigger = false;
				game_stage = 0;
			}
		}

	}

	ctx.closePath();
}

function rts_colorSelected(){
	ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.strokeRect(title_x + 92 + (48 * game_color_square_id), 207, 48, 48);
	ctx.strokeRect(title_x + 92 + (48 * game_color_wall_id), 207 + title_color_spacing, 48, 48);
}

function rts_colorSelecting(){
	if (title_color_vselected < 2){
		ctx.strokeStyle = "rgb(255, 255, 0)";
		
		ctx.strokeRect(title_x + 92 + (48 * title_color_hselected), 207 + (title_color_spacing * title_color_vselected), 48, 48);
		
	}
	
}

function rts_color_colorSet(current){
	if (game_stage == 3){
		
		if (current == title_color_vselected){
			ctx.fillStyle = "rgb(255, 255, 0)";
		}else{
			ctx.fillStyle = "rgb(255, 255, 255)";
		}
		
		
	}
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

	if (debug){
		ctx.fillText("debug:"
				+ " w_vx: " + wall_vx
				+ " w_sI: " + wall_spawningInterval
				+ " ws_l: " + walls.length
				+ " g: " + gravity
				+ " s_vj: " + square_vjump
				+ " s_vy: " + square_vy
				, 10, canvas.height - 10);
	}

	ctx.closePath();
}

function renderSquare(){
	ctx.beginPath();
	ctx.rect(square_x, square_y, square_dim, square_dim);
	ctx.fillStyle = game_color_square;
	ctx.fill();
	ctx.closePath();
}

function renderTickWalls(){
	for (i = 0; i < walls.length; i++){
		ctx.beginPath();
		ctx.fillStyle = game_color_wall;
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
					game_stage = 3;
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
				if (gameOver_selected == 1){
					resetGame(0);
				}
			}
		}

		else if (game_stage == 3){
			
			if (e.key == "Down" || e.key == "ArrowDown"){
				if (title_color_vselected < title_color_vselected_max){
					title_color_vselected++;
				}
			}
			if (e.key == "Up" || e.key == "ArrowUp"){
				if (title_color_vselected > 0){
					title_color_vselected--;
				}
			}
			if (e.key == "Right" || e.key == "ArrowRight"){
				if (title_color_hselected < title_color_hselected_max){
					title_color_hselected++;
				}
			}
			if (e.key == "Left" || e.key == "ArrowLeft"){
				if (title_color_hselected > 0){
					title_color_hselected--;
				}
			}
			if (e.key == " "){
				if (title_color_vselected == 0){
					game_color_square_id = title_color_hselected;
					localStorage.setItem("colorSquare", title_color_hselected)
					game_color_square = colorGet(title_color_hselected);
					
				}
				if (title_color_vselected == 1){
					game_color_wall_id = title_color_hselected;
					localStorage.setItem("colorWall", title_color_hselected)
					game_color_wall = colorGet(title_color_hselected);
					
				}
				if (title_color_vselected == 2){
					game_stage_trigger = true;
				}
				if (title_color_vselected == 3){
					game_color_square_id = 0;
					localStorage.setItem("colorSquare", 0);
					game_color_square = colorGet(0);
					game_color_wall_id = 3;
					localStorage.setItem("colorWall", 3);
					game_color_wall = colorGet(3);
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
		localStorage.setItem("highScore", game_score);
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
	if (state == 0){
		title_x = title_x_original;
		title_vx = 0;
	}
	game_stage = state;
}

function colorGet(colorId){
	
	let color = "";
	
	
	
	switch(colorId){
	
	case 0: color = "rgb(255, 0, 0)"; break;
	case 1: color = "rgb(255, 155, 0)"; break;
	case 2: color = "rgb(255, 255, 0)"; break;
	case 3: color = "rgb(0, 255, 0)"; break;
	case 4: color = "rgb(0, 0, 255)"; break;
	case 5: color = "rgb(255, 155, 255)"; break;
	case 6: color = "rgb(180, 0, 180)"; break;
	case 7: color = "rgb(255, 255, 255)"; break;
	case 8: color = "rgb(180, 180, 180)"; break;
	default: color = "rgb(255, 0, 0)"; break;
	
	}

	return color;
	
}


function debugFunction(){
	debug = true;
}