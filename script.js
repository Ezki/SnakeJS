window.onload = function()
{



	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var widthBlock = canvasWidth / blockSize;
	var heightBlock = canvasHeight / blockSize;
	var ctx;
	var score;
	var delay = 100;
	var snakee;
	var papple;
	var timeout;

	init();





	function init(){
		var canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "30px solid gray";
		canvas.style.margin = "50px auto"
		canvas.style.display = "block";
		canvas.style.backgroundColor = "#ccddcc" 
		
		
		
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		console.log(ctx);

		launchNewGame();



	}

	function launchNewGame(){
		snakee = new Snake ([[6,4], [5,4], [4,4]], "droite");
		papple = new Apple ([Math.round(Math.random() * (widthBlock - 1)), Math.round(Math.random() * (heightBlock - 1))]);
		score = 0;
		clearTimeout(timeout);
		refreshCanvas();
	}

	function refreshCanvas() {

		snakee.advance();
		if (snakee.checkCollision())
		{
			gameOver();
		}
		else
		{
			if(snakee.eatApple(papple))
			{
				do{
					papple.setNewPosition();
				} while (papple.isOnSnake(snakee))
			}

			ctx.clearRect(0,0, canvasWidth, canvasHeight);
				drawScore();
				snakee.draw();
				papple.draw();
				
				timeout = setTimeout(refreshCanvas,delay);
			}

		}
		
		function drawScore(){
			ctx.save()
			
			ctx.font = "bold 80px sans-serif";
			ctx.fillStyle = "gray"
			ctx.textAlign = "center"
			var centerX = canvasWidth / 2;
			var botY = canvasHeight - 10;
			ctx.fillText("Score is : " + score.toString(), centerX, botY);
			ctx.restore();
		}

		function gameOver(){
			ctx.save();
			
			ctx.font = "bold 100px sans-serif";
			ctx.fillStyle = "gray"
			ctx.textAlign = "center"
			var centerX = canvasWidth / 2;
			var centerY = canvasHeight / 2 ;
			ctx.fillText("Game Over ! ><", centerX, centerY -100);
			ctx.font = "bold 30px sans-serif";
			ctx.fillText("Appuyer sur la touche Space pour rejouer", centerX, centerY + 100)

			ctx.restore();
		}



		function drawBlock(ctx, positionBlock){
			var x = positionBlock[0] * blockSize
			var y = positionBlock[1] * blockSize
			ctx.fillRect(x,y, blockSize, blockSize)
		}


		function Snake(body, direction){
			this.body = body;
			this.direction = direction;
			this.ateApple = false;
			this.draw = function()
			{
				ctx.save();
				ctx.fillStyle = "#f00";
				for(var i = 0; i < this.body.length; i++)
				{
					drawBlock(ctx, this.body[i]);
					console.log(this.body[i])
				}
				ctx.restore();


			}

			console.log(this);

			this.advance= function()
			{
				var nextPosition = this.body[0].slice();
				switch(this.direction)
				{
					case "gauche" : nextPosition[0] -=1;
						break;
					case "droite" : nextPosition[0] +=1;
						break;
					case "haut" : nextPosition[1] -=1;
						break;
					case "bas" : nextPosition[1] +=1;
						break;
					default:
						throw("Invalid Direction");
				}
				this.body.unshift(nextPosition)
				if(!this.ateApple)
				{
					this.body.pop()
				}
				else
				{
					this.ateApple = false;
				}


			}

			this.checkCollision = function(){
				var nextPosition = this.body[0];
				var wallCollision = false;
				var snakeCollision = false;

				if(nextPosition[0] < 0 || nextPosition[0] > widthBlock-1 || nextPosition[1] < 0 || nextPosition[1] > heightBlock-1)
				{
					wallCollision = true;
				}

				for (var i = 1; i < this.body.length ; i++)
				{
					if (this.body[i][0] === nextPosition[0] && this.body[i][1] === nextPosition[1])
					{
						snakeCollision = true;
					}
				}

				if (wallCollision || snakeCollision)
				{
					return true;
				}
				else
				{
					return false
				}

			}

			this.eatApple = function(Pomme){
				var head = this.body[0];
				var position = Pomme.position;
				

				if (head[0] === position[0] && head[1] === position[1])
				{
					this.ateApple = true;
					score++;
					return true;
				}
				else
					return false;
			};


			this.setDirection = function (newDirection){
				var allowedDirections;
				switch(this.direction)
				{
					case "gauche" :	
					case "droite" : 
						allowedDirections = ["haut", "bas"];
						break;
					case "haut" : 
					case "bas" : 
						allowedDirections = ["gauche", "droite"]
						break;
					default:
						throw("Invalid Direction");	
				}
				if(allowedDirections.indexOf(newDirection) > -1)
					//indexOf permet de retourner l'index de la case du tableau égale à la valeur passée en paramètre, et - 1 sinon
				{
					this.direction = newDirection;
				}
			};


		}

		function Apple(position){
			this.position = position;
			this.draw = function()
			{
				ctx.save();
				ctx.fillStyle = "#33cccc";
				ctx.beginPath();
				var radius = blockSize/2;
				var x = this.position[0] * blockSize + radius;
				var y = this.position[1] * blockSize + radius;
				ctx.arc(x,y,radius, 0, Math.PI*2, true);
				ctx.fill();
				ctx.restore();
			}

			this.setNewPosition = function(){

				var newX = Math.round(Math.random() * (widthBlock - 1));
				var newY = Math.round(Math.random() * (heightBlock - 1));

				this.position = [newX, newY];
			};

			this.isOnSnake = function(snake){
				var collisionDetected = false;

				for (var snakeRing in snake.body)
				{
					if (this.position === snakeRing)
					{
						collisionDetected = true;
					}
				}
				return (collisionDetected)
			}

		}



		document.onkeydown = function handlekeyDown(e){
			var key = e.keyCode;
			var newDirection;
			switch(key)
			{
				case 27:
					window.close();
					break;

				case 32:
					launchNewGame();
					break;
				case 37:
					newDirection = "gauche";
					break;
				case 38:
					newDirection = "haut";
					break;
				case 39:
					newDirection = "droite";
					break;	
				case 40:
					newDirection = "bas";
					break;	
				default:
					return;	
			}

			snakee.setDirection(newDirection);

		}
	}


