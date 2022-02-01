
gameScene = {
	key: 'game',
	active: false,  //This makes scenes be unactive until we activate them
	visible: false,
	movingCamera:false,
	playerTeam:null,
	iaTeam:null,
	gameState: 'SELECTFIGHTER',
	background:null,
	playerColor:null,
	inputKeys:[],
	selectFighter_txt:'',
	currentFighter:null,
	iaFighter:null,
	fightingQueen:false,
	gameStarted: false,
	playerWins:false, 
	fixCamPoint:800,
	countdown:null,
	playerAttack_collider:null,
	iaAttack_collider:null,
	preload: preload,
	create: create,
	update: update
};


var floor,
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GAME SCENE XXXXXXXXXXXXXXXXXX
/*		 ██████   █████  ███    ███ ███████     ███████  ██████ ███████ ███    ██ ███████.......................
		██       ██   ██ ████  ████ ██          ██      ██      ██      ████   ██ ██............................
		██   ███ ███████ ██ ████ ██ █████       ███████ ██      █████   ██ ██  ██ █████.........................
		██    ██ ██   ██ ██  ██  ██ ██               ██ ██      ██      ██  ██ ██ ██............................
		 ██████  ██   ██ ██      ██ ███████     ███████  ██████ ███████ ██   ████ ███████
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

buttons = [];

function preload() {
	this.gameState ='SELECTFIGHTER';
	gameScene.background = this.add.image( 0,  this.cameras.main.height/2, 'bg').setOrigin(0,0.5);
	gameScene.background.flipX=gameScene.playerColor;
	this.input.keyboard.on('keydown-SPACE', function() { gameScene.movingCamera = true;},this);
	this.input.keyboard.on('keyup-SPACE', function() { gameScene.movingCamera = false;},this);
	
	
}

function create() {
//--------------------------------------------------------------Create Screen text
	mainPhysics = this.physics;
	// const countdown = this.add.sprite('countdown')
	this.selectFighter_txt = [this.make.text({
		x: this.cameras.main.width / 4,
		y: 50,
		text: 'Select a Fighter!',
		style: {
			font: '42px monospace',
			fill: '#000000'
	}
	}),
	this.make.text({
		x: this.cameras.main.width / 2,
		y: 50,
		text: '      Choose well ...\n \n '+
		'      If a fighter survives \n'+
		'       the first enemy, he\'ll \n'+
		'       have a chance to defeat\n'+
		'       the enemy Queen.\n\n'+
		'       God Save the Queen!!! \n\n'+
		'             CURSORS: Move\n'+
		'             Z: Quick Attack \n'+
		'             X: Heavy Attack \n'+
		'             C: Defense\n'+
		'             P: Pause',
		style: {
			font: '28px monospace',
			fill: '#ffffff'
	}
	})];
	this.selectFighter_txt[0].setOrigin(0.5, 0.5);
	this.selectFighter_txt[1].setOrigin(0, 0);
//----------------------------------------------------------------REGISTER CONTROLS KEYS
	gameScene.inputKeys = {
		cursors: this.input.keyboard.createCursorKeys(),
		keyPause : this.input.keyboard.addKey('P'),
		attack1_key : this.input.keyboard.addKey('Z'),
		attack2_key : this.input.keyboard.addKey('X'),
		defense_key : this.input.keyboard.addKey('C')
	}

	
//---------------------------------------------------------------create the floor object
	floor= this.physics.add.image(1200,640,'logicFloor');
	floor.setImmovable(true)
	floor.body.allowGravity=false
	floor.setVisible(false)
	floor.body.friction.x=0
	floor.body.setDragX(200)

//----------------------------------------------------------------CREATE TEAMS
	
	this.playerTeam = new FighterTeam(gameScene.playerColor,this,this.physics,true);
	this.iaTeam = new FighterTeam(!gameScene.playerColor,this,this.physics,false)

}

//-----------------------------------------------------UPDATE FUNCTION!
function update() {
	switch (gameStateManager.getCurrentState()){
		case 'SELECTFIGHTER':
			if(gameScene.currentFighter!=null){
				gameScene.currentFighter.sprite.destroy();
				gameScene.currentFighter= null;
				goTo_selection();
			}
			break;
		case 'FIGHTQUEEN':
			if(gameScene.fightingQueen===false){
				gameScene.fightingQueen=true;
				goTo_queen();
			}
		case 'FIGHT':
			if(gameScene.gameStarted){
				//if(!gameScene.playerAttack_collider!=='null'){
					console.log('afsafdsafsdafds')
					//this.physics.add.collider(gameScene.currentFighter.sprite,gameScene.iaFighter.sprite);

									
					// this.physics.add.existing(gameScene.currentFighter.attackBox);

					// gameScene.iaAttack_collider= this.physics.add.collider(
					// 	gameScene.iaFighter.attackBox,
					// 	gameScene.currentFighter,
					// 	function(_attack,fighter){
					// 		if(fighter.fighterState!='INMUNE'||fighter.fighterState!='DEFENDING'){
					// 			hit(fighter);
					// 		}
					// 	}
					// );
				//}
				updateFight();
			}else{ 
				if(gameScene.movingCamera){
					moveMainCamera_to(this.cameras.main,gameScene.fixCamPoint,4);
				}else{
					if((typeof countdown !== 'undefined')){
					
					}
					else{
						var countdown = this.add.sprite(1200 , 20, 'selectButton');
						countdown.anims.create({
							key: 'countdown',
							frames: this.anims.generateFrameNumbers('_countdown', {frames:[0,1,2,3]}),
							frameRate: 2,
							repeat: 0
						})
						countdown.play('countdown',false);
						countdown.on('animationcomplete', function () {
							gameScene.gameStarted = true;
							// blockFightZone();
							this.visible = false;
						});
					}
				}
				// if(gameScene.iaFighter.sprite.body.position.x<=1590){
				// 	gameScene.iaFighter.sprite.body.setVelocityX(0);
				// 	gameScene.iaFighter.sprite.anims.play('idle',true);
				// }else{
				// 	gameScene.iaFighter.sprite.body.setVelocityX(-200);
				// 	gameScene.iaFighter.sprite.anims.play('walk',true);
				// }
				if(gameScene.currentFighter.sprite.body.position.x>=800){
					gameScene.currentFighter.sprite.anims.play('idle',true);
					gameScene.currentFighter.sprite.body.setVelocityX(0)
				}else{
					gameScene.currentFighter.sprite.body.setVelocityX(200);
					gameScene.currentFighter.sprite.anims.play('walk',true);
				}
			}
			break;
		case 'GAMEOVER':
			gameOver(gameScene.playerWins);
			break;
		default: break;
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------FIGHT SYSTEM
function updateFight(){
	if(gameScene.currentFighter.fighterState!=='INMUNE'){
		processInput();
			// checkPlayerHit();

	}

	if(gameScene.currentFighter.health<=0){
		// matchOver(false,gameScene.fightingQueen);
	}//else if(gameScene.iaFighter.health<=0){
		// matchOver(true,gameScene.fightingQueen);
	//}

}
function check_enemyHit() {
	// if((enemyFighter.attackBox.collides(playerFighter))&&( playerFighter.fighterState!= DEFENDING)){
	// 	playerFighter.health -= enemyFighter.damage*modifier; 
	// 	playerFighter.fighterState= INMUNE;
	// 	playerFighter.setAnimation('hit');
	// 	playerFighter.on.animationEnd.fighterState = idle;
	// 	return true;
	// }
	return false;
}

function attack(){ 
}

//------------------------------------------------------------------INPUT MANAGEMENT

function processInput(){ 
	// if(this.currentFighter!=null){
		let fighter = gameScene.currentFighter;
		if (gameScene.inputKeys.cursors.left.isDown) {
			if(fighter.sprite.body.velocity.x>(-180-(fighter.speed*10))){fighter.sprite.body.velocity.x-=20}
			else{fighter.sprite.body.velocity.x=-200-(fighter.speed*10)}
			fighter.sprite.anims.play('walk',true)
			fighter.sprite.flipX=true;
		}
		else if (gameScene.inputKeys.cursors.right.isDown) {
			fighter.sprite.anims.play('walk',true);
			if(fighter.sprite.body.velocity.x<180+(fighter.speed*10)){fighter.sprite.body.velocity.x+=20}
			else{fighter.sprite.body.velocity.x=200+(fighter.speed*10)}
			fighter.sprite.flipX=false;
		}
		else {
			if(fighter.sprite.body.velocity.x>0){fighter.sprite.body.velocity.x-=20;}
			else if(fighter.sprite.body.velocity.x<0){fighter.sprite.body.velocity.x+=20;}
			else{}
			
		}

		if (gameScene.inputKeys.cursors.up.isDown&& fighter.sprite.body.touching.down) {
			fighter.sprite.setVelocityY(-450);
		}
		if (gameScene.inputKeys.keyPause.isDown) {
			this.scene.sleep();
			this.scene.run('menu');

		}
		if(gameScene.inputKeys.attack1_key.isDown){
			fighter.fighterState='FIGHTING';
			fighter.sprite.anims.play('attack1',true)
				// if(fighter.fighterState=='FIGHTING'){
				// 	attackBox= mainPhysics.add.sprite(gameScene.currentFighter.sprite.x+150,gameScene.currentFighter.sprite.y,'select_btn').setOrigin(0.5,0.5)
				// 	attackBox.body.setAllowGravity(false);
				// 	gameScene.playerAttack_collider=mainPhysics.add.collider(
				// 		attackBox,
				// 		gameScene.iaFighter.sprite,
				// 		function(_attack,fighter){
				// 			if(gameScene.iaFighter.fighterState!='INMUNE'||gameScene.iaFighter.fighterState!='DEFENDING'){
				// 				// gameScene.iaFighter.hit();
				// 				fighter.anims.play('hit',true);
				// 			}
				// 			_attack.destroy();
				// 		}
				// 	);
					// attackBox.destroy();
				// }
			
			// fighter.attackBox.destroy();
		}else if(gameScene.inputKeys.attack2_key.isDown){
			
			fighter.sprite.anims.play('attack2',true);
		}
		else if(gameScene.inputKeys.defense_key.isDown){
			
			fighter.sprite.anims.play('defense',true);
		}
	// }
}


//------------------------------------------------------------------CREATE ANIMATIONS
function createAnimations(keyName,color) {
	let colorName=(color ? 'white':'black');
	game.anims.create({
		key: 'idle',
		frames: game.anims.generateFrameNumbers(keyName +'_'+colorName+ '_idle', {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12]}),
		frameRate: 12,
		repeat: -1,
	});
	game.anims.create({
		key: 'walk',
		frames: game.anims.generateFrameNumbers(keyName +'_'+colorName+ '_walk', {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}),
		frameRate: 30,
		repeat: 0,
	});
	game.anims.create({
		key: 'attack1',
		frames: game.anims.generateFrameNumbers(keyName +'_'+colorName+ '_attack1', {frames:[0,1,2,3,4,5,6,7,8,9]}),
		frameRate: 12,
		repeat: 0,
	});
	game.anims.create({
		key: 'attack2',
		frames: game.anims.generateFrameNumbers(keyName +'_'+colorName+ '_attack2', {frames:[0,1,2,3,4,5,6,7,8,9]}),
		frameRate: 12,
		repeat: 0,
	});
	game.anims.create({
		key: 'defense',
		frames: game.anims.generateFrameNumbers(keyName +'_'+colorName+ '_defense', {frames:[0,1,2,3,4,5,6,7,8]}),
		frameRate: 12,
		repeat: 0,
	});
	game.anims.create({
		key: 'hit',
		frames: game.anims.generateFrameNumbers(keyName +'_'+colorName+ '_hit', {frames:[0,1,2,3,4,5,6,7,8,9]}),
		frameRate: 12,
		repeat: 0,
	});
}

//------------------------------------------------------------------UTILS
function moveMainCamera_to(camera,xPoint,speed){ 	
	if (camera.midPoint.x<xPoint){
		camera.scrollX+=speed;
		if (camera.midPoint.x<xPoint){movingCamera=false;}
	}else{
		gameScene.movingCamera=false;
	}
}
function goTo_selection(){
	buttons.forEach(function (button) {
		if (button != null) {
			button.disableInteractive();
		}
	});
	gameScene.fixCamPoint=600;
}
function goTo_queen(){gameScene.fixCamPoint=1600;}