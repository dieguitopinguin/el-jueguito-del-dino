var PLAY = 1
var END = 0
var gamestate = PLAY
var trex, trex_running, trex_death, edges;
var groundImage;
var cross;
var piso;
var nube,nubeimage;
var obstacule,obstaculeimage1,obstaculeimage2,obstaculeimage3,obstaculeimage4,obstaculeimage5,obstaculeimage6;
var score;
var group_obstacule
var group_nube
var restart, restartpng;
var gameover, gameOver;
var sonidomorir, morir
var sonidopaso_de_nivel, paso_de_nivel
var sonidosaltar, saltar



function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_death = loadAnimation("trex_collided.png")
  groundImage = loadImage("ground2.png");
  nubeimage = loadImage("cloud.png")
  obstaculeimage1 = loadImage("obstacle1.png")
  obstaculeimage2 = loadImage("obstacle2.png")
  obstaculeimage3 = loadImage("obstacle3.png")
  obstaculeimage4 = loadImage("obstacle4.png")
  obstaculeimage5 = loadImage("obstacle5.png")
  obstaculeimage6 = loadImage("obstacle6.png")
  restartpng = loadImage("restart.png")
  gameOver = loadImage("gameOver.png")
  morir = loadSound("morir.mp3")
  paso_de_nivel = loadSound("paso_de_nivel.mp3")
  saltar = loadSound("saltar.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  cross = createSprite (width/2,height-11,400,20);
  cross.addImage("cross",groundImage);
  cross.x = cross.width/2;

  //mensaje de que ya perdiste
  gameover = createSprite (300,100);
  gameover.addImage (gameOver)
  gameover.scale = 1.5

  restart = createSprite (300,140);
  restart.addImage (restartpng)
  restart.scale = 0.5

  //crea el piso invisible
  piso = createSprite (width/2,height-10,width,0);
  piso.visible = false;

  //crear sprite de Trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("trex_death", trex_death)
  edges = createEdgeSprites();
  
  //agregar tamaño y posición al Trex
  trex.scale = 0.5;
  trex.x = 50;

  //funcion de math (matematicas) para generar numero aleatorio
  //var ran = Math.round(random(10,60));
  //console.log(ran);
  score = 0;

  group_obstacule = new Group();
  group_nube = new Group();

  trex.debug = false

}
function draw(){
  //establecer color de fondo.
  background("white");
  text("score: "+score,500,50);
  
  //cargar la posición Y del Trex
  // console.log(trex.y);
  
  //evitar que el Trex caiga
  trex.collide(piso)
   
 if (mousePressedOver(restart)){
  empesar()
 }
  
  if (gamestate == PLAY) {
    score = score + Math.round(getFrameRate()/60)

    //hacer que el Trex salte al presionar la barra espaciadora
  if((touches.length > 0 || keyDown("UP_ARROW"))&& trex.y >= 550){
    trex.velocityY = -20;
    saltar.play();
  }

  //dar gravedad al trex
  trex.velocityY = trex.velocityY + 2;

  //velocidad al suelo
  cross.velocityX = -10

  gameover.visible = false

  restart.visible = false
  
  //restableser suelo
  if (cross.x < 0) {
  cross.x = cross.width/2
  }

 if (score > 0 && score % 100 == 0) {
  paso_de_nivel.play()
 }
   
  //spawnea nubes 
  spawncloud();
   
  //spawnea los cactus
  spawnobstacules();
  
  if (group_obstacule.isTouching(trex)) {
   gamestate = END
   morir.play()
  }
  }else if (gamestate == END) {
    cross.velocityX = 0;

    group_obstacule.setVelocityXEach(0);
    group_nube.setVelocityXEach(0);

    trex.changeAnimation("trex_death",trex_death)
    trex.velocityY = 0;

    group_nube.setLifetimeEach(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000)
    group_obstacule.setLifetimeEach(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000)

    gameover.visible = true

    restart.visible = true
  }
  
  drawSprites();
}



//spawnea nubes
function spawncloud() {
  if (frameCount % 60 === 0) {
    nube = createSprite(600,100,40,10)

    nube.addImage(nubeimage)

    nube.scale = 0.5

    nube.velocityX = -2

    nube.y = Math.round(random(100,height-70))

    console.log(frameCount)

    //profundidad a la nube
    nube.depth = trex.depth
    trex.depth = trex.depth + 1

    nube.lifetime = 300

    group_nube.add(nube)
  }
}

//spawnea los cactus
function spawnobstacules () {
  if (frameCount % 60 === 0){
    var obstacule = createSprite (600,height-25,10,40)

    obstacule.velocityX = -10
    var ran = Math.round(random(1,6))

    switch(ran){

      case 1: obstacule.addImage(obstaculeimage1);
      break;

      case 2: obstacule.addImage(obstaculeimage2);
      break;

      case 3: obstacule.addImage(obstaculeimage3);
      break;

      case 4: obstacule.addImage(obstaculeimage4);
      break;

      case 5: obstacule.addImage(obstaculeimage5);
      break;

      case 6: obstacule.addImage(obstaculeimage6);
      break;

      default:break
    }

    obstacule.scale = 0.5;
    obstacule.lifetime = 100;

    group_obstacule.add(obstacule)
  }
}



function empesar (){
 gamestate = PLAY
 gameover.visible = false
 restart.visible = false
 group_obstacule.destroyEach();
 group_nube.destroyEach();
 trex.changeAnimation("running",trex_running)
 score = 0
}
