//my name is dilan and i like to code lol

/*
 * TODO
 * 
 * - different messages for when you die
 * - add music
 * 
 */

const version = "0.24";
var debug = false;

var canvas = document.getElementById("canvasMain");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyPressEvent, false);
document.addEventListener("keyup", keyReleaseEvent, false);


//0 - start, 1 - playing, 2 - game over, 3 - options, 4 - credits
var game_stage = 0;
var game_stage_trigger = false;
var game_playerCount = 1;
var game_score_overall = 0;
var game_score = 0;
var game_score2 = 0;
var game_score3 = 0;
var game_score4 = 0;
var game_highScore = localStorage.getItem("highScore");
var game_gameCount = localStorage.getItem("gameCount");
var game_jumpCount = localStorage.getItem("jumpCount");
var game_multiJumpCount = localStorage.getItem("multiJumpCount");
var game_scoreTracker_enabled = false;
var game_scoreTracker = [0, 0, 0, 0];
var game_color_square_id = localStorage.getItem("colorSquare");
var game_color_square = "rgb(255, 0, 0)";
var game_color_square_1 = "";
var game_color_square_2 = "";
var game_color_square_3 = "";
var game_color_square_4 = "";
var game_color_wall_id = localStorage.getItem("colorWall");
var game_color_wall = "rgb(0, 255, 0)";
var game_keys = true;
var game_keysPressed = [];
var game_oneTime = false;

const title_x_original = canvas.width - 25;
var title_x = title_x_original;
var title_vx = 0;
const title_ax = -0.1;
const title_vx_max = -10;
const title_internal_vx = -15;
var title_selected = 0;
const title_selected_max = 3;
var title_color_vselected = 2;
const title_color_vselected_max = 3;
var title_color_hselected = 8;
const title_color_hselected_max = 8;
var title_color_spacing = 75;
const title_players_y_original = canvas.height - 30;
var title_players_y = title_players_y_original;
const title_players_vy = 2;
var title_players_color = "rgba(0, 125, 255, 0.5)";

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
var square2_x = 68;
var square2_y_destination = canvas.height + 5;
var square2_y = square2_y_destination;
var square3_x = 36;
var square3_y_destination = -5 - square_dim;
var square3_y = square3_y_destination;
var square4_x = 4;
var square4_y_destination = canvas.height + 5;
var square4_y = square4_y_destination;
var square_y_title_vreset = 8;
var square_vy = 0;
var square2_vy = 0;
var square3_vy = 0;
var square4_vy = 0;
var square_playing = true;
var square2_playing = true;
var square3_playing = true;
var square4_playing = true;
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
		}else{
			game_highScore = parseInt(game_highScore);
		}
		if (game_gameCount == null){
			game_gameCount = 0;
			localStorage.setItem("gameCount", 0);
		}else{
			game_gameCount = parseInt(game_gameCount);
		}
		if (game_jumpCount == null){
			game_jumpCount = 0;
			localStorage.setItem("jumpCount", 0);
		}else{
			game_jumpCount = parseInt(game_jumpCount);
		}
		if (game_multiJumpCount == null){
			game_multiJumpCount = 0;
			localStorage.setItem("multiJumpCount", 0);
		}else{
			game_multiJumpCount = parseInt(game_multiJumpCount);
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

		game_color_square_1 = colorGet(4);
		game_color_square_2 = colorGet(0);
		game_color_square_3 = colorGet(3);
		game_color_square_4 = colorGet(2);


		game_oneTime = true;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	tick();

	if (title_x > -5) renderTitleScreen();

	renderScore();
	renderSquare();
	renderTickWalls();
	if (game_stage == 2) renderGameOverScreen();

	renderHighScore();
	renderOutline();

}
setInterval(reload, 10);



function tick(){

	if (game_stage == 1){
		if (game_playerCount > 1){
			if (game_playerCount > 2){
				if (game_playerCount > 3){
					square4_vy += gravity;

				}
				square3_vy += gravity;
			}
			square2_vy += gravity;
		}
		square_vy += gravity;
	}
	if (square_vy >= gravity_max){
		square_vy = gravity_max;
	}
	if (square2_vy >= gravity_max){
		square2_vy = gravity_max;
	}
	if (square3_vy >= gravity_max){
		square3_vy = gravity_max;
	}
	if (square4_vy >= gravity_max){
		square4_vy = gravity_max;
	}

	if (game_stage == 1){
		if (square_playing) square_y += square_vy;
		if (square2_playing) square2_y += square2_vy;
		if (square3_playing) square3_y += square3_vy;
		if (square4_playing) square4_y += square4_vy;

		if (game_playerCount == 4 && !square_playing && !square2_playing && !square3_playing && !square4_playing){
			game_stage = 2;
		}
		if (game_playerCount == 3 && !square_playing && !square2_playing && !square3_playing){
			game_stage = 2;
		}
		if (game_playerCount == 2 && !square_playing && !square2_playing){
			game_stage = 2;
		}

		if (game_playerCount > 3){
			if (square4_y + square_dim >= canvas.height){
				square4_y = canvas.height - square_dim;
				square4_vy = 0;
			}
			if (square4_y <= 0){
				square4_y = 0;
				square4_vy = 0;
			}
		}
		if (game_playerCount > 2){
			if (square3_y + square_dim >= canvas.height){
				square3_y = canvas.height - square_dim;
				square3_vy = 0;
			}
			if (square3_y <= 0){
				square3_y = 0;
				square3_vy = 0;
			}
		}

		if (game_playerCount > 1){
			if (square2_y + square_dim >= canvas.height){
				square2_y = canvas.height - square_dim;
				square2_vy = 0;
			}
			if (square2_y <= 0){
				square2_y = 0;
				square2_vy = 0;
			}

		}
		if (square_y + square_dim >= canvas.height){
			square_y = canvas.height - square_dim;
			square_vy = 0;
		}
		if (square_y <= 0){
			square_y = 0;
			square_vy = 0;
		}



	}
	if (wall_currentSpawningInterval >= wall_spawningInterval){
		let wy = Math.floor(Math.random() * (476 - 25 - wall_separation)) + 25 + wall_separation;

		walls[walls.length] = {x: 750, y:-wy, top: true, score: false, score2: false, score3: false, score4: false};
		walls[walls.length] = {x: 750, y:-wy + wall_dimy + wall_separation, top: false, score: false, score2: false, score3: false, score4: false};
		wall_currentSpawningInterval = 0;
	}
	if (game_stage == 1){
		wall_currentSpawningInterval++;

		if (title_vx <= title_vx_max) title_vx = title_vx_max;
		else title_vx += title_ax;

		if (title_players_y < canvas.height + 35) title_players_y += title_players_vy;

		if (title_x > -5) title_x += title_vx;

	}

	let multiplier = Math.floor(game_score_overall/wall_speedUpScoreInterval);

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
	ctx.fillText("FlapXD", title_x, 100);
	ctx.font = "35px Arial";

	rts_colorSet(0, title_selected, false);
	ctx.fillText("Play", title_x - 25, 150);

	rts_colorSet(1, title_selected, false);
	ctx.fillText("Change Colors", title_x - 25, 200);

	rts_colorSet(2, title_selected, false);
	if (game_playerCount == 1) ctx.fillText("Local Multiplayer", title_x - 25, 250);
	if (game_playerCount == 2 || game_playerCount == 3) ctx.fillText("Add a Player", title_x - 25, 250);
	if (game_playerCount == 4) ctx.fillText("Singleplayer", title_x - 25, 250);

	rts_colorSet(3, title_selected, false);
	ctx.fillText("About", title_x - 25, 300);

	ctx.font = "15px Arial";
	rts_colorSet(-1, title_selected, false);
	ctx.fillText("[arrows] select", title_x - 25, 350);
	if (game_playerCount > 1){
		ctx.fillText("[space] enter", title_x - 25, 375);
		ctx.fillStyle = colorGet(4);
		ctx.fillText("[1] jump", title_x - 25, 400);
		ctx.fillStyle = colorGet(0);
		ctx.fillText("[=] jump", title_x - 25, 425);
		if (game_playerCount > 2){
			ctx.fillStyle = colorGet(3);
			ctx.fillText("[V] jump", title_x - 25, 450);
		}
		if (game_playerCount > 3){
			ctx.fillStyle = colorGet(2);
			ctx.fillText("[,] jump", title_x - 25, 475);
		}
	}else{
		ctx.fillText("[space] jump/enter", title_x - 25, 375);
	}

	ctx.fillStyle = title_players_color;
	ctx.fillRect(0, title_players_y, 200, 30);

	ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
	ctx.font = "20px Arial";
	ctx.textAlign = "center";
	if (game_playerCount == 1) ctx.fillText("One Player", 100, title_players_y + 22);
	if (game_playerCount == 2) ctx.fillText("Two Players", 100, title_players_y + 22);
	if (game_playerCount == 3) ctx.fillText("Three Players", 100, title_players_y + 22);
	if (game_playerCount == 4) ctx.fillText("Four Players", 100, title_players_y + 22);

	ctx.textAlign = "right";


	if (square_y > square_y_original && game_stage == 0){
		if (square_y - square_y_original < square_y_title_vreset) square_y = square_y_original;
		square_y -= square_y_title_vreset;
	}
	if (square_y < square_y_original && game_stage == 0){
		if (square_y_original - square_y < square_y_title_vreset) square_y = square_y_original;
		square_y += square_y_title_vreset;
	}

	if (game_playerCount > 1){
		square2_y_destination = square_y_original;
	}else{
		square2_y_destination = canvas.height + 5;
	}
	if (game_playerCount > 2){
		square3_y_destination = square_y_original;
	}else{
		square3_y_destination = -5 - square_dim;
	}
	if (game_playerCount > 3){
		square4_y_destination = square_y_original;
	}else{
		square4_y_destination = canvas.height + 5;
	}

	if (square2_y > square2_y_destination && game_stage == 0){
		if (square2_y - square2_y_destination < square_y_title_vreset) square2_y = square2_y_destination;
		square2_y -= square_y_title_vreset;
	}
	if (square2_y < square2_y_destination && game_stage == 0){
		if (square2_y_destination - square2_y < square_y_title_vreset) square2_y = square2_y_destination;
		square2_y += square_y_title_vreset;
	}

	if (square3_y > square3_y_destination && game_stage == 0){
		if (square3_y - square3_y_destination < square_y_title_vreset) square3_y = square3_y_destination;
		square3_y -= square_y_title_vreset;
	}
	if (square3_y < square3_y_destination && game_stage == 0){
		if (square3_y_destination - square3_y < square_y_title_vreset) square3_y = square3_y_destination;
		square3_y += square_y_title_vreset;
	}

	if (square4_y > square4_y_destination && game_stage == 0){
		if (square4_y - square4_y_destination < square_y_title_vreset) square4_y = square4_y_destination;
		square4_y -= square_y_title_vreset;
	}
	if (square4_y < square4_y_destination && game_stage == 0){
		if (square4_y_destination - square4_y < square_y_title_vreset) square4_y = square4_y_destination;
		square4_y += square_y_title_vreset;
	}

	if (square2_y > canvas.height + 5) square2_y = canvas.height + 5;
	if (square2_y < -5 - square_dim) square2_y = -5 - square_dim;
	if (square3_y > canvas.height + 5) square3_y = canvas.height + 5;
	if (square3_y < -5 - square_dim) square3_y = -5 - square_dim;
	if (square4_y > canvas.height + 5) square4_y = canvas.height + 5;
	if (square4_y < -5 - square_dim) square4_y = -5 - square_dim;

	if (game_stage == 3){

		ctx.fillStyle = "rgb(0, 255, 0)";
		ctx.font = "90px Impact";
		ctx.fillText("Colors", title_x + 500, 100);
		ctx.font = "20px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillText("square", title_x + 480, 150);
		ctx.fillText("walls", title_x + 480, 150 + title_color_spacing);
		ctx.textAlign = "right";

		rts_colorSelected();
		rts_colorSelecting();

		rts_colorSet(0, title_selected, true);

		for (i = 0; i < 2; i++){
			ctx.fillStyle = colorGet(0);
			ctx.fillRect(title_x + 100, 165 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(1);
			ctx.fillRect(title_x + 148, 165 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(2);
			ctx.fillRect(title_x + 196, 165 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(3);
			ctx.fillRect(title_x + 244, 165 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(4);
			ctx.fillRect(title_x + 292, 165 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(5);
			ctx.fillRect(title_x + 340, 165 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(6);
			ctx.fillRect(title_x + 388, 165 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(7);
			ctx.fillRect(title_x + 436, 165 + (title_color_spacing*i), 32, 32);

			ctx.fillStyle = colorGet(8);
			ctx.fillRect(title_x + 484, 165 + (title_color_spacing*i), 32, 32);
		}
		rts_color_colorSet(2);
		ctx.font = "35px Arial";
		ctx.fillText("Back", title_x + 484, 350);

		rts_color_colorSet(3);
		ctx.font = "20px Arial";
		ctx.fillText("Reset to default", title_x + 484, 400);

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
		ctx.fillText("About", title_x + 325, 100);
		
		ctx.font = "24px Arial";
		

		
		ctx.fillStyle = "rgb(255, 0, 100)";

		ctx.fillText("" + game_gameCount, title_x + 350, 150);
		ctx.fillText("" + game_jumpCount, title_x + 350, 200);
		ctx.fillText("" + game_multiJumpCount, title_x + 350, 225);
		
		rts_colorSet(0, title_selected, true);
		
		ctx.fillText("Games played: ", title_x + 260, 150);
		ctx.fillText("Times jumped (sp): ", title_x + 260, 200);
		ctx.fillText("Times jumped (mp): ", title_x + 260, 225);
		
		ctx.font = "20px Arial";
		ctx.fillText("FlapXD!!!!!!!!!!!!!!!!!!!", title_x + 300, 300)
		ctx.fillText("version " + version, title_x + 300, 325);
		ctx.fillText("created by Dilan :)", title_x + 300, 350);
		ctx.fillText("blockhead7360.com/flapxd", title_x + 300, 375);


		rts_colorSet(1, title_selected, true);
		ctx.font = "35px Arial";
		ctx.fillText("Back", title_x + 300, 425);
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
	ctx.strokeRect(title_x + 92 + (48 * game_color_square_id), 157, 48, 48);
	ctx.strokeRect(title_x + 92 + (48 * game_color_wall_id), 157 + title_color_spacing, 48, 48);
}

function rts_colorSelecting(){
	if (title_color_vselected < 2){
		ctx.strokeStyle = "rgb(255, 255, 0)";

		ctx.strokeRect(title_x + 92 + (48 * title_color_hselected), 157 + (title_color_spacing * title_color_vselected), 48, 48);

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
		else if (game_stage == 0 && game_playerCount > 1 && current == 1){
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
	ctx.font = "15px Arial";
	ctx.textAlign = "left";
	
	let bonusText = "";
	
	if (game_stage == 0 && game_playerCount > 1){
		bonusText += "| Score tracker: Toggle [S] ";
		
	}
	if (game_scoreTracker_enabled){
		bonusText += "Control [T]+[1-4]+[Up/Down] ";
		ctx.fillStyle = colorGet(4);
		ctx.fillText("" + game_scoreTracker[0], 10, 40);
		ctx.fillStyle = colorGet(0);
		ctx.fillText("" + game_scoreTracker[1], 10, 60);
		ctx.fillStyle = colorGet(3);
		ctx.fillText("" + game_scoreTracker[2], 10, 80);
		ctx.fillStyle = colorGet(2);
		ctx.fillText("" + game_scoreTracker[3], 10, 100);
	}
	ctx.font = "12px Arial";
	ctx.fillStyle = "gray";
	ctx.fillText("FlapXD! version " + version + " " + bonusText, 10, 20);

	
	
	
	if (debug){
		ctx.fillText("debug:"
				+ " w_vx: " + wall_vx
				+ " w_sI: " + wall_spawningInterval
				+ " ws_l: " + walls.length
				+ " gr: " + gravity
				+ " s_vj: " + square_vjump
				+ " g_gC: " + game_gameCount
				+ " g_jC: " + game_jumpCount
				+ " g_mJC: " + game_multiJumpCount
				, 10, canvas.height - 10);
	}

	ctx.closePath();
}

function renderSquare(){
	ctx.beginPath();

	if (game_stage == 0){
		if (square4_y != canvas.height + 5){
			ctx.fillStyle = game_color_square_4;
			ctx.fillRect(square4_x, square4_y, square_dim, square_dim);
		}
		if (square3_y != -5 - square_dim){
			ctx.fillStyle = game_color_square_3;
			ctx.fillRect(square3_x, square3_y, square_dim, square_dim);
		}
		if (square2_y != canvas.height + 5){
			ctx.fillStyle = game_color_square_2;
			ctx.fillRect(square2_x, square2_y, square_dim, square_dim);
		}
		if (game_playerCount > 1) ctx.fillStyle = game_color_square_1;
		else ctx.fillStyle = game_color_square;
		ctx.fillRect(square_x, square_y, square_dim, square_dim);

	}else{

		if (game_playerCount > 1){
			ctx.fillStyle = game_color_square_2;
			ctx.fillRect(square2_x, square2_y, square_dim, square_dim);

			ctx.fillStyle = game_color_square_1;
			ctx.fillRect(square_x, square_y, square_dim, square_dim);

		}else{
			ctx.fillStyle = game_color_square;
			ctx.fillRect(square_x, square_y, square_dim, square_dim);
		}
		if (game_playerCount > 2){
			ctx.fillStyle = game_color_square_3;
			ctx.fillRect(square3_x, square3_y, square_dim, square_dim);
		}
		if (game_playerCount > 3){
			ctx.fillStyle = game_color_square_4;
			ctx.fillRect(square4_x, square4_y, square_dim, square_dim);
		}

	}



	ctx.closePath();
}

function renderTickWalls(){
	for (i = 0; i < walls.length; i++){
		ctx.beginPath();
		ctx.fillStyle = game_color_wall;
		ctx.fillRect(walls[i].x, walls[i].y, wall_dimx, wall_dimy);
		ctx.closePath();
		if (game_stage == 1) walls[i].x += wall_vx;

		if (walls[i].top && walls[i].x <= square_x - wall_dimx){
			if (!walls[i].score){

				game_score_overall++;
				if (square_playing) game_score++;
				walls[i].score = true;
			}

		}

		if (game_playerCount > 1 && square2_playing){
			if (game_playerCount > 1 && walls[i].top && walls[i].x <= square2_x - wall_dimx){
				if (!walls[i].score2){
					game_score2++;
					walls[i].score2 = true;
				}

			}
		}
		if (game_playerCount > 2 && square3_playing){
			if (walls[i].top && walls[i].x <= square3_x - wall_dimx){
				if (!walls[i].score3){
					game_score3++;
					walls[i].score3 = true;
				}

			}
		}
		if (game_playerCount > 3 && square4_playing){
			if (game_playerCount > 3 && walls[i].top && walls[i].x <= square4_x - wall_dimx){
				if (!walls[i].score4){
					game_score4++;
					walls[i].score4 = true;
				}

			}
		}

		if (intersectEvent(square_x + intersect_padding, square_y + intersect_padding, square_dim - intersect_padding, square_dim - intersect_padding, walls[i].x, walls[i].y, wall_dimx, wall_dimy)){
			if (game_playerCount == 1) game_stage = 2;
			else{
				square_playing = false;
				game_color_square_1 = "rgba(0, 125, 255, 0.25)";
			}
		}
		if (game_playerCount > 1 && intersectEvent(square2_x + intersect_padding, square2_y + intersect_padding, square_dim - intersect_padding, square_dim - intersect_padding, walls[i].x, walls[i].y, wall_dimx, wall_dimy)){
			square2_playing = false;
			game_color_square_2 = "rgba(255, 0, 0, 0.25)";
		}
		if (game_playerCount > 2 && intersectEvent(square3_x + intersect_padding, square3_y + intersect_padding, square_dim - intersect_padding, square_dim - intersect_padding, walls[i].x, walls[i].y, wall_dimx, wall_dimy)){
			square3_playing = false;
			game_color_square_3 = "rgba(0, 255, 0, 0.25)";
		}
		if (game_playerCount > 3 && intersectEvent(square4_x + intersect_padding, square4_y + intersect_padding, square_dim - intersect_padding, square_dim - intersect_padding, walls[i].x, walls[i].y, wall_dimx, wall_dimy)){
			square4_playing = false;
			game_color_square_4 = "rgba(255, 255, 0, 0.25)";
		}


		if (walls[i].x <= -wall_dimx){
			walls.splice(i, 1);
			i--;
		}
	}
}

function renderScore(){
	ctx.beginPath();

	if (game_playerCount == 1){
		ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
		ctx.font = "250px Arial";
		ctx.textAlign = "center";
		if (game_stage == 1 || game_stage == 2) ctx.fillText("" + game_score, canvas.width/2, canvas.height/2 + 75);
		else ctx.fillText("", canvas.width/2, canvas.height/2 + 75);
	}
	if (game_playerCount == 2){
		ctx.font = "175px Arial";
		ctx.textAlign = "center";
		if (game_stage == 1 || game_stage == 2){
			ctx.fillStyle = "rgba(0, 125, 255, 0.75)";
			ctx.fillText("" + game_score, canvas.width/2 - 200, canvas.height/2 + 75);
			ctx.fillStyle = "rgba(255, 0, 0, 0.75)";
			ctx.fillText("" + game_score2, canvas.width/2 + 200, canvas.height/2 + 75);
		}
	}
	if (game_playerCount > 2){
		ctx.font = "175px Arial";
		ctx.textAlign = "center";
		if (game_stage == 1 || game_stage == 2){
			ctx.fillStyle = "rgba(0, 125, 255, 0.75)";
			ctx.fillText("" + game_score, canvas.width/2 - 200, canvas.height/2 - 50);
			ctx.fillStyle = "rgba(255, 0, 0, 0.75)";
			ctx.fillText("" + game_score2, canvas.width/2 + 200, canvas.height/2 - 50);
			ctx.fillStyle = "rgba(0, 255, 0, 0.75)";
			ctx.fillText("" + game_score3, canvas.width/2 - 200, canvas.height - 50);
			if (game_playerCount > 3){
				ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
				ctx.fillText("" + game_score4, canvas.width/2 + 200, canvas.height - 50);
			}
		}
	}
	ctx.closePath();
}

function renderHighScore(){
	if (game_playerCount == 1){
		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
		ctx.fillRect(canvas.width - 200, canvas.height - 30, 200, 30);

		ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
		ctx.font = "20px Arial";
		ctx.textAlign = "center";
		ctx.fillText("High score: " + game_highScore, canvas.width - 100, canvas.height - 8);
		ctx.closePath();
	}
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

	if (!game_keysPressed.includes(e.key)) game_keysPressed[game_keysPressed.length] = e.key;
		
	if (game_keys){
		if (game_stage == 0){
			if (e.key == "Down" || e.key == "ArrowDown"){
				if (title_selected < title_selected_max){
					title_selected++;
					if (title_selected == 1 && game_playerCount > 1) title_selected++;
				}
			}
			if (e.key == "Up" || e.key == "ArrowUp"){
				if (title_selected > 0){
					title_selected--;
					if (title_selected == 1 && game_playerCount > 1) title_selected--;
				}
			}
			
			
			if (game_keysPressed.includes("t") && game_scoreTracker_enabled){
				if (game_keysPressed.includes("1")){
					if (game_keysPressed.includes("Up") || game_keysPressed.includes("ArrowUp")){
						game_scoreTracker[0]++;
					}else if (game_keysPressed.includes("Down") || game_keysPressed.includes("ArrowDown")){
						game_scoreTracker[0]--;
					}
				}
				if (game_keysPressed.includes("2")){
					if (game_keysPressed.includes("Up") || game_keysPressed.includes("ArrowUp")){
						game_scoreTracker[1]++;
					}else if (game_keysPressed.includes("Down") || game_keysPressed.includes("ArrowDown")){
						game_scoreTracker[1]--;
					}
				}
				if (game_keysPressed.includes("3")){
					if (game_keysPressed.includes("Up") || game_keysPressed.includes("ArrowUp")){
						game_scoreTracker[2]++;
					}else if (game_keysPressed.includes("Down") || game_keysPressed.includes("ArrowDown")){
						game_scoreTracker[2]--;
					}
				}
				if (game_keysPressed.includes("4")){
					if (game_keysPressed.includes("Up") || game_keysPressed.includes("ArrowUp")){
						game_scoreTracker[3]++;
					}else if (game_keysPressed.includes("Down") || game_keysPressed.includes("ArrowDown")){
						game_scoreTracker[3]--;
					}
				}
			}
			
			if (e.key == "s" && game_playerCount > 1){
				if (game_scoreTracker_enabled){
					game_scoreTracker_enabled = false;
				}else{
					game_scoreTracker = [0, 0, 0, 0];
					game_scoreTracker_enabled = true;
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
					if (game_playerCount == 1){
						game_playerCount = 2;
						title_players_color = "rgba(255, 0, 0, 0.75)";
					}else if (game_playerCount == 2){
						game_playerCount = 3;
						title_players_color = "rgba(0, 255, 0, 0.75)";
					}else if (game_playerCount == 3){
						game_playerCount = 4;
						title_players_color = "rgba(255, 255, 0, 0.75)";
					}else if (game_playerCount == 4){
						game_playerCount = 1;
						title_players_color = "rgba(0, 125, 255, 0.75)";
						if (game_scoreTracker_enabled){
							game_scoreTracker_enabled = false;
						}
					}
					if (game_playerCount > 1) game_color_wall = colorGet(8);
					else game_color_wall = colorGet(game_color_wall_id);

				}
				if (title_selected == 3){
					game_stage = 4;
				}
			}

		}

		else if (game_stage == 1){
			//q ] v ,
			if (game_playerCount > 1){
				if (e.key == "1"){
					square_vy = square_vjump;
					game_multiJumpCount++;
				}
				if (e.key == "="){
					square2_vy = square_vjump;
					game_multiJumpCount++;
				}
				if (e.key == "v"){
					square3_vy = square_vjump;
					game_multiJumpCount++;
				}
				if (e.key == ","){
					square4_vy = square_vjump;
					game_multiJumpCount++;
				}
			}
			else{
				if (e.key == " "){
					square_vy = square_vjump;
					game_jumpCount++;
				}
			}
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
	if (game_keysPressed.includes(e.key)) game_keysPressed.splice(game_keysPressed.indexOf(e.key), 1);

}

function setHighScore(){

	game_gameCount++;
	localStorage.setItem("gameCount", game_gameCount);
	
	localStorage.setItem("jumpCount", game_jumpCount);
	localStorage.setItem("multiJumpCount", game_multiJumpCount);
	
	if (game_playerCount == 1){
		if (game_score > game_highScore){
			game_highScore = game_score;
			localStorage.setItem("highScore", game_score);
		}
	}

}

function resetGame(state){
	game_score_overall = 0;
	game_score = 0;
	game_score2 = 0;
	game_score3 = 0;
	game_score4 = 0;
	square_playing = true;
	square2_playing = true;
	square3_playing = true;
	square4_playing = true;
	game_color_square_1 = colorGet(4);
	game_color_square_2 = colorGet(0);
	game_color_square_3 = colorGet(3);
	game_color_square_4 = colorGet(2);
	walls = [];
	gameOver_y = gameOver_y_original;
	gameOver_menu_y = gameOver_menu_y_original;
	gameOver_selected = 0;
	gameOver_oneTime = false;
	square_vy = square_vjump;
	if (state == 0){
		title_x = title_x_original;
		title_vx = 0;
		title_players_y = title_players_y_original;
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
	case 4: color = "rgb(0, 125, 255)"; break;
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