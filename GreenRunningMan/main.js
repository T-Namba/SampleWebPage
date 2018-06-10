
enchant();
var width=568,height=320;
var core = new Core(width,height);
core.preload(`GRM.png`,`sky.png`);// 画像読み込み
core.preload(`jump.ogg`,`fall.ogg`,`speedup.ogg`,`start.ogg`);// 効果音読み込み
core.preload(`title.ogg`,`game.ogg`);// BGM読み込み
core.fps = 60;
core.onload = function(){
	gameMain();
}
core.start();

function rand(n){
	return Math.floor(Math.random() * (n+1) );
}

function gameMain(){
	
	// const Num
	var maxSpeed = 25;
	
	// veriable
	var speed;
	var holllength;
	var fallSpeed;
	var jumpFlag;
	var time;
	var score;
	var touchflag;

	// Color
	var colors = new Array(`Blue`,`BlueViolet`,`LimeGreen`,`Orange`,`Gold`,`OrangeRed`,`Crimson`,`DeepPink`,`Indigo`,`Red`,`Lime`,`Yellow`);
	
	// Scene
	var title = new Scene();
	var game = new Scene();
	core.pushScene(title);
		
	// sky
	var sky1 = new Sprite(1366,568);
	var sky2 = new Sprite(1366,568);
	var sky = {	load : skyLoad,	initPos : skyInitPos,update : skyUpdate	};
	sky.load();	
	
	// stage
	var stageList = new Array();
	var stage = {init : stageInit,update :  stageUpdate };
	
	// GRM
	var grm = new Sprite(64,80);
	var grmLeft = grm.x + 20;
	var grmRight = grm.x + grm.width-10;
	grmInit();
	
	// Label
	var timeLabel = new Label(`time: `+time);
	timeLabel.on('enterframe',function(){
			this.text = (`time: `+time); 
	});
	var scoreLabel = new Label(`score`+score);
	scoreLabel.on('enterframe',function(){
			this.text = (`score: `+score); 
	});
	scoreLabel.y=50;
	
	/************************************
	 * title
	 * 
	 ***********************************/
	
	function titleInit(){
		initNum();
		title.backgroundColor = 'skyblue';
		
		//sky
		title.addChild(sky1);
		title.addChild(sky2);
		sky.initPos();
		
		//GRM
		title.addChild(grm);
		
		//stage
		stage.init();
		title.addChild(stageList[0]);
	}
	titleInit();
	
	title.addEventListener('enterframe', function () {
		
		//sky
		sky.update();
		
		//stage
		if(stage.update()){title.addChild(stageList[stageList.length-1]);}
		
		//grm
		grm.update();
		title.addChild(grm);
		collisionCheck();
		demoPlay()
	
		//bgm
		core.assets['title.ogg'].play();			
	});
	
	title.addEventListener('touchstart', function() {
    	
		core.assets['title.ogg'].stop();
		core.assets[`start.ogg`].play();
		gameInit();
    });
	
	/***********************************************
	 * game
	 * 
	 ************************************************/
	
	function gameInit(){
		game.backgroundColor = `skyblue`;
		core.pushScene(game);
		initNum();
		
		//sky
		game.addChild(sky1);
		game.addChild(sky2);
		sky.initPos();
		
		//grm
		game.addChild(grm);
		
		// label
		game.addChild(timeLabel);
		game.addChild(scoreLabel);
		
		//stage
		stage.init();
		game.addChild(stageList[0]);	
	}
	
	game.addEventListener('enterframe', function () {
		
		//sky
		sky.update();
		
		//stage
		if(stage.update()){game.addChild(stageList[stageList.length-1]);}
		
		//grm
		grm.update();
		game.addChild(grm);
		collisionCheck();
		
		// label
		time ++;
		score += speed;
		if(time%500==0){
			speed+=1;
			core.assets['speedup.ogg'].play();
		}
		
		//bgm
		core.assets['game.ogg'].play();

		if(grm.y > height){
			core.assets[`fall.ogg`].play();
			core.popScene(game);
			core.assets['game.ogg'].stop();
			titleInit();
		}
		
	});
	
	game.addEventListener('touchstart', function() {
    	jump(true);
		touchflag=true;	
    });
	game.addEventListener('touchend', function() {
		touchflag=false;
    });
	
	//---------------------------------------以下大体完成してるの--------------------------------------------
	
	// 変数初期化
	function initNum(){
		speed = 5;
		holllength=-1;
		fallSpeed = 0;
		jumpFlag=false;
		time = 0;
		score = 0;
		touchflag=false;
		grm.y = 200;
	}	
	
	// 色リストからランダム選んだ色を返す。
	function randomColor(){
		return colors[rand(colors.length-1)];
	}
	
	/*******************************************************
	 * GRM
	 *********************************************************/
	function grmInit(){
		grm.x=0;
		grm.image = core.assets[`GRM.png`];
		grm.addEventListener('enterframe',function(){
			//Animation
			if(speed>19 || (speed>9 && core.frame%2==0) || (speed<10 && core.frame%3==0)){
				this.frame = (this.frame+1)%12;
			}
		});
		grm.update = function(){
			(touchflag)?fallSpeed += 0.8 : fallSpeed +=1.5;
			if(fallSpeed > maxSpeed){fallSpeed = maxSpeed;}
			if(fallSpeed < -maxSpeed){fallSpeed = -maxSpeed;}
			grm.y += fallSpeed;
		}
	}
	 
	function jump(sound){
		if(jumpFlag==false){
			if(sound){core.assets[`jump.ogg`].play();}
			jumpFlag=true;
			fallSpeed -= 20;
		}
	}
	
	function demoPlay() {
		touchflag=true;
		for(var i=0;i<stageList.length;i++){
			if(grmRight < stageList[i].x ){break;}
			else if( stageList[i].x < grmRight && grmRight < stageList[i].x + stageList[i].width  ){return;}
		}
		jump(false);				
	}

	/**************************************************
	 * sky
	 * 
	 *************************************************/
	function skyLoad(){
			sky1.image=core.assets[`sky.png`];
			sky2.image=core.assets[`sky.png`];
			sky2.scale(-1,1);
	}
	function skyInitPos(){
			sky1.x=0;sky1.y=0;
			sky2.x=1366;sky2.y=0;
	}
	function skyUpdate(){
			sky1.x -= speed/2;
			sky2.x -= speed/2;
			if(sky1.x < -1366){sky1.x += 1366*2;}
			if(sky2.x < -1366){sky2.x += 1366*2;}
	}
	
	/*****************************************************
	 * stage 
	 *  **************************************************/
	function stageInit(){
			stageList = new Array();
			var firststep = new Sprite(width,100);
			firststep.x=0;
			firststep.y=300;
			firststep.backgroundColor = randomColor();
			stageList.push(firststep);
		}
	function stageUpdate(){
		// ステージの移動
		for(var i=0 ; i<stageList.length; i++){
			stageList[i].x -= speed;	
		}
		// 左端のが画面外に出たら消す
		var first = stageList[0];
		if(first.x < -first.width){
			stageList.shift();
			//console.log(`pop`);//debug message
		} 
		// 右端に新しく出す
		var last = stageList[stageList.length-1];
		if(last.x + last.width < width){
			if(holllength > 0){
				holllength--;
			}else if(holllength < 0){
				holllength = rand(18) + 2 ;
			}
			else if(holllength == 0){
				//console.log(`push!`);//debug message
				var box = new Sprite(200 + rand(500+speed*10),10+rand(300));
				box.x=width;
				box.y=height-280+rand(200);
				box.backgroundColor = randomColor();
				stageList.push(box);
				holllength = -1;
				return true;
			}
		}
		else return false;
	}
	
	
	/*********************************************
	 * 当たり判定
	 * 当たっていると true を返す。 
	 *********************************************/
	function collisionCheck(){
		if(fallSpeed < 0){return;}
		for(var i=0;i<stageList.length;i++){
			if(grmRight < stageList[i].x ){return;}
			else if(stageList[i].x + stageList[i].width > grmLeft ){
				var grmBottom=grm.y+grm.height + 7;
				if( stageList[i].y < grmBottom && grmBottom < stageList[i].y + maxSpeed*2 ){
					grm.y = stageList[i].y - grm.height + 7;
					fallSpeed = 0;
					jumpFlag = false;
					return;
				}
			}
		}
	}
	
}

/*****************************************
 * memo
 * 
 **********************************************/
/*
	var grmcol= new Sprite(34,73);
	grmcol.x=20; 
	grmcol.backgroundColor = "rgb(100, 150, 200)";


	// Spriteオブジェクトの作成
	var sprite = new Sprite(100, 100);
	sprite.x = 100;
	sprite.y = 100;
	// spriteオブジェクトの背景色の指定
	sprite.backgroundColor = "rgba(200, 255, 200, 0.5)";
	
	// Surfaceオブジェクトの作成
	// Spriteの大きさ以上に指定しても範囲外には描画されない
	var surface = new Surface(100, 100);
	// SurfaceオブジェクトをSpriteオブジェクトのimageプロパティに代入
	sprite.image = surface;
	
	// コンテキストを取得する
	context = surface.context;
	// パスの描画の初期化
	context.beginPath();        
	// 描画開始位置の移動
	context.moveTo(10, 10);
	// 指定座標まで直線を描画
	context.lineTo(40, 40);
	// 線の色を指定 (指定しないと黒)
	context.strokeStyle = "rgba(0, 0, 255, 0.5)";        
	// 描画を行う
	context.stroke();

	core.rootScene.addChild(sprite);
*/

/*
//bear
	var bear = new Sprite(32,32);
	bear.image=core.assets[`chara1.png`];
	bear.x=0;
	bear.y=0;
	bear.addEventListener('enterframe',function(){
		this.frame = this.age%3;
	});
	title.addChild(bear);
	
	//rogo
	var titlerogo = new Label(`Title`);
	titlerogo.x = 100;
	titlerogo.y = 100;
	title.addChild(titlerogo);
	*/
	
	/*
	var sky_test = {
		sprite1 : new Sprite(1366,568),
		sprite2 : new Sprite(1366,568),
		init : function(){
			this.sprite1 = new Sprite(1366,568);
			this.sprite2 = new Sprite(1366,568);
		},
		initPos : function(){
			this.sprite1.x=0;
			this.sprite1.y=0;
			this.sprite2.x=1366;
			this.sprite2.y=0;
			this.sprite2.scale(-1,1);
		},
		update : function(speed){
			if(this.sprite1.x < -1366){this.sprite1.x += 1366*2;}
			if(this.sprite2.x < -1366){this.sprite2.x += 1366*2;}
		},
		add : function(scene){
			scene.addChild(this.sprite1);
			scene.addChild(this.sprite2);
		}
	}
	
	//collision_old
	console.log(sky_test);
	sky_test.init();
	sky_test.initPos();
	testScene.addChild(sky_test.sprite1);
	testScene.addChild(sky_test.sprite2);
	//sky_test.add(testScene);
	testScene.addEventListener('enterframe', function () {
		sky_test.update();
	});
	
	function collisionCheck(){
		if(fallSpeed < 0){
			console.log(`up`);
			return false;
		}
		//var flag = false; 
		var grmLeft = grm.x + 20;
		var grmRight = grm.x + grm.width-10;
		for(var i=0;i<stageList.length;i++){
			console.log(i);
			if(grmRight < stageList[i].x ){
				console.log(`break`);
				return false;
			}
			else if(stageList[i].x + stageList[i].width < grmLeft ){
				console.log(`non`);
			}else //if( stageList[i].x < grmRight &&  stageList[i].x + stageList[i].width > grm.x  )
			{
				var grmBottom=grm.y+grm.height + 7;
				if( stageList[i].y < grmBottom && grmBottom < stageList[i].y + maxSpeed*2 ){
					grm.y = stageList[i].y - grm.height + 7;
					fallSpeed = 0;
					//flag = true;
					console.log(`hit`);
					return true;
				}
				else{
					console.log(`noHit`);
				}
			}
		}
		return false;
	}
	
	//memo
	//375×667 iPhone6
	//320×568 iPhone5
	
	*/
