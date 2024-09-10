// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '40px Helvetica';
let gameSpeed = 1;
let gameOver = false;
let firstClick=false;
let gameRestarted = false;

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}

//mouse click start
canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});
//tap equivalent
canvas.addEventListener('touchstart', function(event){
    mouse.click = true;

});
//click end listener
canvas.addEventListener('mouseup', function(){
    mouse.click = false;
});
//tap equivalent
canvas.addEventListener('touchend', function(){
    mouse.click = false;
});

// Player
const playerLeft = new Image();
playerLeft.src = 'raccoon_eat.png';
const playerRight = new Image();
playerRight.src = 'raccoon_eat_flipped2.png';

class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 2000;
        this.spriteHeight = 2000;
    }
    update(){

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        //console.log(theta);
        this.angle = theta;
        if(mouse.x != this.x){
            this.x -= dx/20;
        }
        if(mouse.y != this.y){
            this.y -= dy/20;
        }
    }

    draw(){
        if (mouse.click){
            if (firstClick==false){
                firstClick=true;
            }
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radius, 10);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 80, 0 - 90, this.spriteWidth/12, this.spriteHeight/12);
        }else{
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0-80, 0-90, this.spriteWidth/12, this.spriteHeight/12);
        }
        ctx.restore();
        
    }
}
const player = new Player();

// Food
const foodArray = [];
const burgerImage = new Image();
burgerImage.src = 'burger1.png';
const juiceboxImage = new Image();
juiceboxImage.src = 'juicebox1.png';

class Food {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 4 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.floor(Math.random() * 3) + 1;
        this.foodType = Math.round(Math.random());
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        let image = burgerImage;
        if (this.foodType === 1) {
        image = juiceboxImage;
        }
        ctx.drawImage(image, this.x-65, this.y-65, this.radius*2.6, this.radius*2.6);
    }
}

const foodEat1 = document.createElement('audio');
foodEat1.src = 'sound1.mp3';
const foodEat2 = document.createElement('audio');
foodEat2.src = 'sound2.mp3';
const foodEat3 = document.createElement('audio');
foodEat3.src = 'sound3.mp3';

function handleFood(){
    if (gameFrame % 160 == 0){
        foodArray.push(new Food());
    }
    for(let i = 0; i < foodArray.length; i++){
        foodArray[i].update();
        foodArray[i].draw();

        if(foodArray[i].y < 0 - this.radius * 2){
            foodArray.splice(i, 1);
            i--;
        }else if(foodArray[i].distance < foodArray[i].radius + player.radius){
            if (!foodArray[i].counted){
                if (foodArray[i].sound == 1){
                    foodEat1.play();
                }else if(foodArray[i].sound == 2){
                    foodEat2.play();
                }else{
                    foodEat3.play();
                }
                score ++;
                foodArray[i].counted = true;
                foodArray.splice(i,1);
                i--;
            }
        }
        
    }

    for(let i = 0; i < foodArray.length; i++){
        
    }
}

// Repeating backgrounds
const background = new Image();
background.src = 'background4.png';

function handleBackground(){
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

// Enemies
const enemyImage = new Image();
enemyImage.src = 'roberto2.png';

class Enemy {
    constructor(){
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 1000;
        this.spriteHeight = 1000;
    }
    draw(){
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        // ctx.fill();
        ctx.drawImage(enemyImage,this.x-88, this.y-91.5, this.spriteWidth/6, this.spriteHeight/6);
    }

    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.radius *2){
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }
        // collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx+dy*dy);
        if(distance < this.radius + player.radius){
            handleGameOver();
        }
    }
}
const enemy1 = new Enemy();
function handleEnemies(){

        enemy1.draw();
        enemy1.update();
    
}

const death = document.createElement('audio');
death.src = 'punch1.mp3';
function handleGameOver(){
    death.play();
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, you reached the score: '  + score, 60, 450);
    gameOver = true;
}

function resetGame() {
    score = 0;
    gameFrame = 0;
    gameOver = false;
    firstClick = false;
    foodArray.length = 0; // Clear the food array
    enemy1.x = canvas.width + 200; // Reset enemy position
    enemy1.y = Math.random() * (canvas.height - 150) + 90;
    enemy1.speed = Math.random() * 2 + 2;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    gameOver = false;
    gameRestarted = true;
    animate();

}

const restartButton = document.getElementById('restartButton');
// restartButton.addEventListener('click', resetGame);

// Animation Loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();

    player.update();
    player.draw();
    if(firstClick==true){
        handleFood();
        handleEnemies();
        gameFrame++;
        document.getElementById('clicktostart').style.visibility='hidden';
    }
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    if(!gameOver){
        requestAnimationFrame(animate);
    }
}
animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});