//allison :)

const version = "1.0";
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
var game_color_square = "rgb(255, 255, 255)";
var game_color_square_1 = "";
var game_color_square_2 = "";
var game_color_square_3 = "";
var game_color_square_4 = "";
var game_color_wall_id = localStorage.getItem("colorWall");
var game_color_wall = "rgb(0, 255, 0)";
var game_keys = true;
var game_keysPressed = [];
var game_oneTime = false;
var game_lastRun_jumps = [];
var game_lastRun_jumps_index = 0;
var game_lastRun_walls = [];
var game_lastRun_walls_index = 0;
var game_lastRun_watching = false;
var game_replayMode_enabled_storage = localStorage.getItem("replayMode");
var game_replayMode_enabled = false;
var game_tick = 0;

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
var title_options = false;

const gameOver_y_original = -50;
var gameOver_y = gameOver_y_original;
const gameOver_menu_y_original = canvas.height + 100;
var gameOver_menu_y = gameOver_menu_y_original;
const gameOver_internal_vy = 5;
var gameOver_selected = 0;
var gameOver_selected_max = 2;
var gameOver_oneTime = false;

var square_dim = 32;
var square_x = 100;
var square_y_original = canvas.height/2 - (square_dim/2);
var square_y = square_y_original;
var square_y_starting = square_y_original;
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
var wall_dimx = 50;
var wall_dimy = 30;
var wall_vx = -3;
const wall_vx_base = -3;
const wall_vx_increment = -0.5;
//-5, 64, every 50
var wall_spawningInterval = 80;
const wall_spawningInterval_base = 60;
const wall_spawningInterval_increment = -2;
var wall_separation = 150;
var wall_currentSpawningInterval = 0;
const wall_speedUpScoreInterval = 50;

var intersect_padding = 4;

var image_current = 1;
var image_max = 25;

var music;

function reload(){

	if (!game_oneTime){

		music = new sound("marriedlife.mp3");

		game_color_square_1 = colorGet(4);
		game_color_square_2 = colorGet(0);
		game_color_square_3 = colorGet(3);
		game_color_square_4 = colorGet(2);


		game_oneTime = true;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	tick();

	if (title_x > -5) renderTitleScreen();

	if (game_tick > 750) renderScore();
	renderSquare();
	renderTickWalls();
	if (game_stage == 2) renderGameOverScreen();

	renderOutline();

}
setInterval(reload, 10);

function tick(){

	if (game_stage == 1){


		game_tick++;
		ctx.beginPath();

		if (game_tick == 50){
			music.play();
		}
		
		if (game_tick >= 150 && game_tick <= 650){


			if (game_tick >= 150 && game_tick <= 250){

				ctx.fillStyle = "rgba(255, 255, 255, " + ((game_tick-150)/100);

			}else if (game_tick > 250 && game_tick < 550){
				ctx.fillStyle = "rgba(255, 255, 255, 1)";
			}else{
				ctx.fillStyle = "rgba(255, 255, 255, " + (((100 - (game_tick - 550))/100))
			}

			ctx.font = "24px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Happy 5 months Allison", canvas.width/2, canvas.height/2);


		}

		if (game_tick > 1000 && image_current <= image_max){


			let now = game_tick - 1000 - (600 * (image_current - 1));
			var img = document.getElementById("" + image_current);

			if (now == 600){
				image_current++;
			}

			ctx.drawImage(img, canvas.width/2 - img.width/2, canvas.height/2 - img.height/2, img.width, img.height);

		}
		if (image_current > image_max){
			let now = game_tick - 1000 - (600 * (image_current - 1));
			

			if (now >= 150 && now <= 250){

				ctx.fillStyle = "rgba(255, 255, 255, " + ((now-150)/100);

			}else if (now > 250){
				ctx.fillStyle = "rgba(255, 255, 255, 1)";
			}
			ctx.font = "24px Arial";
			ctx.textAlign = "center";
			if (now >= 150) ctx.fillText("You've reached the end of the pictures...", canvas.width/2, canvas.height/2 - 20);
			
			if (now >= 750 && now <= 850){

				ctx.fillStyle = "rgba(255, 255, 255, " + ((now-750)/100);

			}else if (now > 850){
				ctx.fillStyle = "rgba(255, 255, 255, 1)";
			}
			if (now >= 750) ctx.fillText("...but my love will go on forever :)", canvas.width/2, canvas.height/2 + 20);
		}

		ctx.closePath();

		square_vy += gravity;

		if (square_playing) square_y += square_vy;


		if (square_y + square_dim >= canvas.height){
			square_y = canvas.height - square_dim;
			square_vy = 0;
		}
		if (square_y <= 0){
			square_y = 0;
			square_vy = 0;
		}



	}

	if (game_tick > 750){
		if (wall_currentSpawningInterval >= wall_spawningInterval){
			let wy = Math.floor(Math.random() * (475 - 25)) + 25;

			walls[walls.length] = {x: 750, y:wy, top: true, score: false, score2: false, score3: false, score4: false};
			wall_currentSpawningInterval = 0;
		}
	}


	if (game_stage == 1){
		wall_currentSpawningInterval++;

		if (title_vx <= title_vx_max) title_vx = title_vx_max;
		else title_vx += title_ax;

		if (title_players_y < canvas.height + 35) title_players_y += title_players_vy;

		if (title_x > -5) title_x += title_vx;

	}

}

function renderTitleScreen(){
	ctx.beginPath();
	ctx.fillStyle = "rgb(255, 0, 0)";
	ctx.font = "90px Impact";
	ctx.textAlign = "right";
	ctx.fillText("AllisonXD", title_x, 150);
	ctx.font = "35px Arial";

	rts_colorSet(0, title_selected, false);
	ctx.fillText("Play", title_x - 25, 260);

	ctx.font = "20px Arial";
	rts_colorSet(-1, title_selected, false);
	ctx.fillText("[space] jump/enter", title_x - 25, 350);
	ctx.fillText("There is music. Set your volume reasonably.", title_x - 25, 385);

	ctx.textAlign = "left";

	if (title_options){

		if (game_replayMode_enabled){
			ctx.fillStyle = "rgb(0, 255, 0)";
			ctx.fillText("[1] Replay mode enabled", title_x - canvas.width + 55, 50);
		}else{
			ctx.fillStyle = "rgb(255, 0, 0)";
			ctx.fillText("[1] Replay mode disabled", title_x - canvas.width + 55, 50);
		}

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

	if (game_stage == 2){
		if (current == actual){
			ctx.fillStyle = "rgb(255, 255, 0)";
		}else{
			ctx.fillStyle = "rgb(255, 255, 255)";
		}
		if (current == 1){
			ctx.fillStyle = "gray";
		}
		return;

	}

	if (current > 0){
		ctx.fillStyle = "gray";
		return;
	}else{
		ctx.fillStyle = "rgb(255, 255, 0)";
	}

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
		else if (game_stage == 2 && game_playerCount > 1 && current == 1){
			ctx.fillStyle = "gray";
		}
		else if (game_stage == 2 && !game_replayMode_enabled && current == 1){
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
	ctx.fillText("Play again", canvas.width/2, gameOver_menu_y - 50);
	rts_colorSet(1, gameOver_selected, false);
	ctx.fillText("Watch last run", canvas.width/2, gameOver_menu_y);
	rts_colorSet(2, gameOver_selected, false);
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
			gameOver_menu_y -= gameOver_internal_vy;
		}else{
			game_keys = true;
		}
	}

}

function renderOutline(){
	ctx.beginPath();
	ctx.strokeStyle = "rgb(255, 0, 0)";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.textAlign = "left";
	ctx.font = "12px Arial";
	ctx.fillStyle = "gray";
	ctx.fillText("AllisonXD! version " + version + " created by Dilan", 10, 20);	

	if (debug){
		ctx.fillText("debug:"
				+ " g_t: " + game_tick
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
		ctx.fillStyle = "rgb(217, 217, 217)";
		ctx.font = "20px Arial";
		ctx.textAlign = "left";
		ctx.fillText("(love)", walls[i].x, walls[i].y + 23);
		ctx.closePath();
		if (game_stage == 1) walls[i].x += wall_vx;

		if (intersectEvent(square_x, square_y, square_dim, square_dim, walls[i].x, walls[i].y, wall_dimx, wall_dimy)){
			if (!walls[i].score){
				game_score_overall++;
				if (square_playing) game_score++;
				walls[i].score = true;
				walls.splice(i, 1);
				i--;
			}
		}
		else if (walls[i].x <= -wall_dimx){
			walls.splice(i, 1);
			i--;
		}
	}
}

function renderScore(){
	ctx.beginPath();

	if (game_playerCount == 1){
		ctx.fillStyle = "rgb(217, 217, 217)";
		ctx.font = "20px Arial";
		ctx.textAlign = "right";
		if (game_stage == 1 || game_stage == 2) ctx.fillText("Love collected: " + game_score, canvas.width - 25, 35);
		else ctx.fillText("", canvas.width - 50, 50);
		ctx.textAlign = "center";
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

			if (e.key == " "){
				if (title_selected == 0){
					square_y_starting = square_y;
					game_stage = 1;
					if (game_playerCount == 1) square_vy = square_vjump;
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

					if (game_lastRun_watching) return;

					square_vy = square_vjump;
					game_jumpCount++;
					if (game_replayMode_enabled) game_lastRun_jumps[game_lastRun_jumps.length] = game_tick;
				}
			}
		}
		else if (game_stage == 2){

			if (e.key == "Down" || e.key == "ArrowDown"){
				if (gameOver_selected < gameOver_selected_max){
					gameOver_selected += 2;
				}
			}
			if (e.key == "Up" || e.key == "ArrowUp"){
				if (gameOver_selected > 0){
					gameOver_selected -= 2;
				}
			}

			if (e.key == " "){
				if (gameOver_selected == 0){
					resetGame(1);				
				}
				if (gameOver_selected == 1){
					resetGame(2);
				}
				if (gameOver_selected == 2){
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


	}
}

function keyReleaseEvent(e){
	if (game_keysPressed.includes(e.key)) game_keysPressed.splice(game_keysPressed.indexOf(e.key), 1);

}

function setHighScore(){


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
	game_tick = 0;
	game_lastRun_watching = false;
	game_lastRun_jumps_index = 0;
	game_lastRun_walls_index = 0;
	if (state == 0){
		title_x = title_x_original;
		title_vx = 0;
		title_players_y = title_players_y_original;
		game_stage = 0;
		game_lastRun_jumps = [];
		game_lastRun_walls = [];
	}else if (state == 1){
		square_y_starting = square_y;
		if (game_playerCount == 1) square_vy = square_vjump;
		game_stage = 1;
		game_lastRun_jumps = [];
		game_lastRun_walls = [];
	}else if (state == 2){
		square_y = square_y_starting;
		square_vy = square_vjump;
		game_lastRun_watching = true;
		gameOver_selected = 1;
		game_stage = 1;
	}
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

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
}

function debugFunction(){
	debug = true;
}