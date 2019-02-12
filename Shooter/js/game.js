//Todo | Trajectoires differentes (fonction) | tableau de score 
// boss de fin | aptitudes suplémentaire : items | enemis qui tires

var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var tics = 0;
var _timeToBeAlive = 30;
var frameReq;

//Canvas
let divArena;
let canArena;
let canScore;
let conArena;
let conScore;
var buttons;
var ArenaWidth = 600;
var ArenaHeight = 700;

///////////////////////////////////
//Keys
var keys = {
    UP: 38,
    DOWN: 40,
    SPACE: 32,
    ENTER: 13,
    LEFT: 37,
    RIGHT: 39
};

var keyStatus = {};

function keyDownHandler(event) {
    "use strict"; 
    var keycode = event.keyCode, 
        key; 
    for (key in keys) {
        if (keys[key] === keycode) {
            keyStatus[keycode] = true;
            event.preventDefault();
        }
    }
}
function keyUpHandler(event) {
   var keycode = event.keyCode,
            key;
    for (key in keys) 
        if (keys[key] == keycode) {
            keyStatus[keycode] = false;
        }
        
    }
///////////////////////////////////


///////////////////
// une collection de projectiles
function ProjectileSet(tabTarget){
  this.tabTarget = tabTarget;
  this.score = 0;
  this.tabProjectiles = new Array();
  this.add = function (projectile) {
    this.tabProjectiles.push(projectile);  
  };
  this.remove = function () {  

       this.tabProjectiles.map(function(obj,index,array){
            if(obj.exists == false ||obj.x >ArenaWidth || obj.x<0){
                  delete array[index];
            }
        });

  };


 this.update = function(){
        this.remove();
        var score = 0;
        this.tabProjectiles.map(function(obj){
            obj.update();
            if(obj.exists == false) {//hit
                score = score +1;
            }
        });
        this.score = this.score + score;
    };
 this.clear = function(){
    this.tabProjectiles.map(function(obj){
         obj.clear();
    });
 };
 this.draw = function(){
    this.tabProjectiles.map(function(obj){
        obj.draw();
    });
     //console.log(this.tabProjectiles.length);
 };
    
};

////////////////////
// un objet Projectile
function Projectile(x,y,speed,height,width,color){
    this.x = x;
    this.y = y;
    this.ySpeed = speed;
    this.width = width;
    this.height = height;
    this.color = color;
    this.exists = true;
    this.collision = function(tabOfObjects){
        var hits = null;
        var index;
        for(index in tabOfObjects){

            if ((tabOfObjects[index].cptExplosion == 0) && this.x < tabOfObjects[index].x + tabOfObjects[index].width &&
                this.x + this.width > tabOfObjects[index].x &&
                this.y < tabOfObjects[index].y + tabOfObjects[index].height &&
                this.height + this.y > tabOfObjects[index].y) {
                    // collision detected!
                    hits = tabOfObjects[index];
                    break;
            }
        }
        return hits;  
    };
    this.draw = function(){
        if(this.exists){
            conArena.fillStyle = this.color;
            conArena.fillRect(this.x,this.y,this.width,this.height);
        }
    };
    this.clear = function(){
        if(this.exists){
            conArena.clearRect(this.x-1,this.y-1,this.width+2,this.height+2);
        }
    };
    this.update = function(){
        if(this.exists){
            this.y -=   this.ySpeed ;
            var tmp = this.collision([player].concat(enemies.tabEnemies));
            if(tmp != null){
                tmp.explodes();
                this.exists = false;
            }
        }
    };
}
/////////////////////////////////

/////////////////////////////////
// Enemies
var enemies = {
    init : function(){
        this.tabEnemies = new Array();
    },
    add : function (enemy) {
        this.tabEnemies.push(enemy);  
    },
    remove : function () {  
        this.tabEnemies.map(function(obj,index,array){
            if(obj.exists == false ||obj.x >ArenaWidth || obj.x<0){
                  delete array[index];
            }
        });
    },
    draw : function(){ 
        this.tabEnemies.map(function(obj){
            obj.draw();
        });
    },
    clear : function(){
       this.tabEnemies.map(function(obj){
            obj.clear();
        });
    },
    update : function(){

        this.tabEnemies.map(function(obj){
            obj.update();
        });
         this.remove();
    }
    
};
//Enemy
function Enemy(x,y,speed,type){
    this.xOrigine = x;
    this.x = this.xOrigine;
    this.y = y;
    this.ySpeed = speed;
    this.exists = true;
    this.height = 30;
    this.width = 40;
    this.img = new Image();
    if(type == 1){
        this.img.src = "./assets/Enemy/eSpritesheet_40x30.png";
    }
    if(type == 2){
        this.img.src = "./assets/Enemy/eSpritesheet_40x30_hue2.png";
    }
    this.cpt = 0;
    this.nbFire = 0;
    this.cptFire = 0;

    this.cptExplosion = 0;//10 images
    this.imgExplosion = new Image();
    this.imgExplosionHeight = 128;
    this.imgExplosionWidth = 128;
    this.imgExplosion.src = "./assets/Explosion/explosionSpritesheet_1280x128.png";

    this.projectileSet = new ProjectileSet();
    this.explodes = function(){
        this.cptExplosion = 1;
    };
    this.collision = function(tabOfObjects){
        var hits = null;
        var index;
        for(index in tabOfObjects){
            if (this.x < tabOfObjects[index].x + tabOfObjects[index].width &&
                this.x + this.width > tabOfObjects[index].x &&
                this.y < tabOfObjects[index].y + tabOfObjects[index].height &&
                this.height + this.y > tabOfObjects[index].y) {
                    // collision detected!
                    hits = tabOfObjects[index];
                    break;
            }
        }
        return hits;
    };
    this.fire = function (){
        if(type == 1){
            var tmp = new Projectile(this.x+16,this.y+this.height,-4,8,3,"rgb(255,255,51)");
        }if(type == 2){
            var tmp = new Projectile(this.x+16,this.y+this.height,-5,10,3,"rgb(228,53,248)");
        }
        this.projectileSet.add(tmp);
    };
    this.draw = function(){ 

        this.projectileSet.draw();

        if(this.cptExplosion!=0){
                conArena.drawImage(this.imgExplosion, this.cptExplosion*this.imgExplosionWidth, 0, this.imgExplosionWidth,this.imgExplosionHeight, this.x,this.y,this.width,this.height);
        }else{
            conArena.drawImage(this.img,  0,this.cpt*this.height,this.width,this.height, this.x,this.y,this.width,this.height);
        }
    };
    this.clear = function(){
        if(this.exists){
            conArena.clearRect(this.x,this.y,this.width,this.height);
        }
        this.projectileSet.clear();
    };
    this.update = function(){
       if(this.cptExplosion==0){//is not exploding
            if(type == 1){
                this.x =  this.x;
                this.y +=  this.ySpeed;
            }
            if(type == 2){

                var xtmp =  this.x + Math.floor(Math.random()*5*Math.cos(this.y/50));
                if(xtmp < 0){
                    this.x = 0;
                }
                if(xtmp > ArenaWidth){
                    this.x = ArenaWidth;
                }else{
                    this.x = xtmp;
                }    
                this.y +=  this.ySpeed;
            }
            var tmp = this.collision([player]);
                if(tmp != null){
                    tmp.explodes();
                    this.exists = false;
                }

            if(tics % 5 == 1) {
                this.cpt = (this.cpt + 1) % 6;
            }

            //1rst type of enemy////////////////////////////
            if(type == 1 && this.nbFire == 0){
                this.nbFire = 3;
            }
            if(tics % 20 == 1 && type == 1){ 
                this.cptFire++;
                if(this.nbFire>1){
                    this.fire();
                    this.nbFire--; 
                }if(this.cptFire>6){
                    this.nbFire = 3;
                    this.cptFire = 0;
                }
            }

            //2nd type of enemy
            if(type == 2 && this.nbFire == 0){
                this.nbFire = 6;
            }
            if(tics % 15 == 1 && type == 2){ 
                this.cptFire++;
                if(this.nbFire>1){
                    this.fire();
                    this.nbFire--; 
                }if(this.cptFire>6){
                    this.nbFire = 6;
                    this.cptFire = 0;
                }
            }

       }else{
            if(tics % 3 == 1) {
                this.cptExplosion++;
            }
            if(this.cptExplosion>10){//end of animation
                this.cptExplosion=0;
                this.exists = false;
            }
        }
        this.projectileSet.update();
    };
}

function randomTrajectory(x,y){
    var newY = y + Math.floor(Math.random())*Math.cos(x/10);
    //this.yOrigine+ ArenaHeight/3 * Math.sin(this.x / 100);
    return newY;
}

/////////////////////////////////

/////////////////////////////////
// Hero Player
var player = {
    init : function(){
        this.img = new Image();
        this.img.src = "./assets/Ship/Spritesheet_64x29_2.png";
        this.cpt = 0;
        this.cptExplosion = 0;//10 images
        this.imgExplosion = new Image();
        this.imgExplosionHeight = 128;
        this.imgExplosionWidth = 128;
        this.imgExplosion.src = "./assets/Explosion/explosionSpritesheet_1280x128.png";
        this.projectileSet = new ProjectileSet();
        this.fireMulti = false;
    },
    x : 280,
    ySpeed : 3,
    xSpeed : 5,
    y : 600,
    height : 64,
    width : 116/4,
    nbOfLives : 2,
    timeToBeAlive : 0,
    reload : 0,
    fires : function(){
        var tmp = new Projectile(this.x+this.width/2,this.y-4,6,10,3,"rgb(61, 203, 254)");
        this.projectileSet.add(tmp);
    },
    explodes : function(){
        if(this.timeToBeAlive == 0) {
            this.nbOfLives--;
            if(this.nbOfLives>0){
                this.timeToBeAlive = _timeToBeAlive;
                this.cptExplosion = 1;
            }else{
                //Game Over
                document.getElementById("dead").innerHTML = "GAME<br>OVER";
                clear();
            }
        }
    },
    clear : function(){
        conArena.clearRect(this.x,this.y,this.width,this.height);
        this.projectileSet.clear();
    },
    update :  function(){
        var keycode;
        if(tics % 10 == 1) {
                this.cpt = (this.cpt + 1) % 4;
            }
        if(this.timeToBeAlive>0) {
            this.timeToBeAlive --;
        }else{
            for (keycode in keyStatus) {
                if(keyStatus[keycode] == true){
                    if(keycode == keys.UP) {
                        this.goUP = true;
                    }
                    if(keycode == keys.DOWN) {
                        this.goDOWN = true;
                    }
                    if(keycode == keys.LEFT) {
                        this.goLEFT = true;
                    }
                    if(keycode == keys.RIGHT) {
                        this.goRIGHT = true;
                    }
                    if(keycode == keys.SPACE) {
                        //shoot
                        this.fire = true;
                        this.reload++;
                    }
                }
                if(keyStatus[keycode] == false){
                    if(keycode == keys.UP) {
                        this.goUP = false;
                    }
                    if(keycode == keys.DOWN) {
                        this.goDOWN = false;
                    }
                    if(keycode == keys.LEFT) {
                        this.goLEFT = false;
                    }
                    if(keycode == keys.RIGHT) {
                        this.goRIGHT = false;
                    }
                    if(keycode == keys.SPACE) {
                        this.fire = false;
                        this.fireMulti = false;
                        this.reload = 0;
                    }
                }
            }
        }
        if(this.goUP){
            this.y -= this.ySpeed;
            if(this.y<0) this.y=0;
        }if(this.goDOWN){
            this.y += this.ySpeed;
            if(this.y>ArenaHeight-this.height) this.y=ArenaHeight-this.height;
        }if(this.goRIGHT){
            this.x += this.xSpeed;
            if(this.x>ArenaWidth-this.width) this.x=ArenaWidth-this.width;
        }if(this.goLEFT){
            this.x -= this.xSpeed;
            if(this.x<0) this.x=0;

        //handle fires 
        }if(this.fire){
            if(!this.fireMulti){
                this.fires();
                this.fireMulti = true;
                this.fire = false;
            }
            if(this.reload >  20 ){
                this.fireMulti = false;
                this.reload = 0;
            }
        }
        this.projectileSet.update();
    },
    draw : function(){
        if(this.timeToBeAlive == 0) {
            conArena.drawImage(this.img, this.cpt*this.width,0,this.width,this.height, this.x,this.y,this.width,this.height);
        }else{
            //exploding
            if(this.cptExplosion!=0){
                conArena.drawImage(this.imgExplosion, this.cptExplosion*this.imgExplosionWidth, 0, this.imgExplosionWidth,this.imgExplosionHeight, this.x,this.y,this.width,this.height);
               if(tics % 3 == 1) {this.cptExplosion++;}
                if(this.cptExplosion>10) this.cptExplosion=0;
            }
        }
        this.projectileSet.draw();
    }
};


function updateItems() {
    "use strict"; 
    player.update();
    tics++;
    if(tics % 100 == 0) {
        var rand = Math.floor(Math.random() * ArenaWidth-32);
        enemies.add(new Enemy(rand,-100,3,1));
    }
    if(tics % 200 == 0) {
        var rand = Math.floor(Math.random() * ArenaWidth-200);
        enemies.add(new Enemy(rand,-100,2,2));
    }
    if(tics % 600 == 0) {
        var rand = Math.floor(Math.random() * ArenaWidth-32*2);
        enemies.add(new Enemy(rand,-100,2,1));
        enemies.add(new Enemy(rand+40,-100,2,1));
    }
    enemies.update();
}

function drawItems() {
    "use strict"; 
    player.draw();
    enemies.draw();
}

function clearItems() {
    "use strict"; 
    player.clear(); 
    enemies.clear();
}

function clearScore() {
    conScore.clearRect(0,0,300,50);
}
function drawScore() {
    conScore.fillText("Life : "+player.nbOfLives, 10, 20);
    conScore.fillText("Score : "+player.projectileSet.score, 150,20);
}
function updateGame() {
    "use strict"; 
    updateItems();
}
function clearGame() {
    "use strict"; 
    clearItems();
    clearScore();
}

function drawGame() {
    "use strict";
    drawScore();
    drawItems();    
}


function mainloop () {
    "use strict"; 
    clearGame();
    updateGame();
    drawGame();
}

function recursiveAnim () {
    "use strict"; 
    mainloop();
    frameReq = animFrame(recursiveAnim);
}
 
function init() {
    "use strict";

    divArena = document.getElementById("arena");
    canArena = document.createElement("canvas");

    canArena.setAttribute("id", "canArena");
    canArena.setAttribute("height", ArenaHeight);
    canArena.setAttribute("width", ArenaWidth);
    conArena = canArena.getContext("2d");

    divArena.appendChild(canArena);

    canScore = document.createElement("canvas");
    canScore.setAttribute("id","canScore");
    canScore.setAttribute("height", ArenaHeight);
    canScore.setAttribute("width", ArenaWidth);
    conScore = canScore.getContext("2d");
    conScore.fillStyle = "white";
    conScore.font = 'bold 15pt Courier';
    divArena.appendChild(canScore);
 
    player.init();
    enemies.init();

    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);
    frameReq = animFrame(recursiveAnim);
}


function reset() {
    document.getElementById("dead").innerHTML = "";
    cancelAnimationFrame(frameReq);
    conArena.clearRect(0, 0, canArena.width, canArena.height);
    conScore.clearRect(0, 0, canScore.width, canScore.height);
    player.nbOfLives = 2;
    player.score = 0;
    player.x = 280;
    player.y = 600;
    init();
}

function pause() {
    cancelAnimationFrame(frameReq);
}

function play() {
    frameReq = animFrame(recursiveAnim);
}

window.addEventListener("load", init, false);
