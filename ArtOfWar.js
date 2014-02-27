//set main namespace 
goog.provide('ArtOfWar');   
//get requirements 
goog.require('lime.Director'); 
goog.require('lime.Scene'); 
goog.require('lime.Layer');   
goog.require('lime.Sprite');
goog.require('lime.GlossyButton'); 
goog.require('ArtOfWar.card'); 

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
	
}

//entrypoint 
ArtOfWar.start = function(){   
	
	var player = {
		crtCard: -1,
		hp: 20,
		gold: 1,
		opp: 30
	}
	
	var cards = [
		{
			name: 'tank',
			cost: 4,
			attack: 3,
			range: 4,
			speed: 2,
			hp: 3,
			image: 'graphics/tank.svg'		
		},
		{
			name: 'knight',
			cost: 2,
			attack: 2,
			range: 1,
			speed: 1,
			hp: 2,
			image: 'graphics/battle-axe.svg'
		},
		{
			name: 'axeman',
			cost: 1,
			attack: 1,
			range: 1,
			speed: 3,
			hp: 1,
			image: 'graphics/battered-axe.svg'
		},
		{
			name: 'gunman',
			cost: 2,
			attack: 1,
			range: 3,
			speed: 2,
			hp: 1,
			image: 'graphics/cannon-shot.svg'
		}
	];
	
	// Tile
	var tile = {
		width: 64,
		height: 64
	}
	
	var map = {
		width: 25,
		height: 10,
		field: [],	
		tiles: []
	}
	map.field = createArray(map.width, map.height);
	map.tiles = createArray(map.width, map.height);
	
	
    var director = new lime.Director(document.body,tile.width*map.width,tile.height*map.height+160+40);     
    director.makeMobileWebAppCapable();     
    director.setDisplayFPS(false);          
    
	var mapScene = new lime.Scene();
	var mapLayer = new lime.Layer().setAnchorPoint(0, 0);
	
	var YouWonScene = new lime.Scene();
	YouWonScene.appendChild(mapLayer);
	
	var WonLayer = new lime.Layer().setAnchorPoint(0,0);
	YouWonScene.appendChild(WonLayer);
				
	var WonArea = new lime.Sprite().setAnchorPoint(0,0).setSize(tile.width*map.width,tile.height*map.height+160+40).setFill('#2c3e50');
	WonLayer.appendChild(WonArea);
	
	WonArea.appendChild(new lime.Label().setText('You WON, the enemy has been slaughtered').setFontColor('#E8FC08')
	.setPosition((map.width*tile.width)/2, (map.height*tile.height)/2).setSize(tile.width*4,tile.height*2).setFontWeight('bold'));
	
	mapScene.appendChild(mapLayer);
	for(var i = 0; i < map.width; i++){
		for(var j = 0; j< map.height; j++){
			var fieldTile = new lime.Sprite().setSize(tile.width, tile.height).setStroke(1, 52, 73, 94).
			setPosition(i*tile.width+(tile.width/2), 40+j*tile.height+(tile.height/2));
			
			map.tiles[i][j] = fieldTile;
			
			if(i<3)
				fieldTile.setFill('#2ecc71');
			else
				fieldTile.setFill('#1abc9c');
			
			mapLayer.appendChild(fieldTile);
				
			(function(fieldTile, i,j) {
				goog.events.listen(fieldTile,['mousedown', 'touchstart'], function(e) {
				if(i<3 && player.crtCard>=0){
				if(map.field[i][j]==undefined && player.gold>=cards[player.crtCard].cost){
						map.field[i][j] = cards[player.crtCard];
						console.log(i + ' ' + j + ' is now ' + cards[player.crtCard].name);
						console.log(map.field[i][j]);
						fieldTile.setFill(map.field[i][j].image);
						player.gold -= cards[player.crtCard].cost;
						goldLabel.setText('Gold: ' + player.gold);
						
					}
				}
        });
    })(fieldTile, i,j);
			
		}
	}
	
	var statusLayer = new lime.Layer().setAnchorPoint(0,0);
	mapScene.appendChild(statusLayer);
	
	var statusArea = new lime.Sprite().setAnchorPoint(0,0)
	.setPosition(0,0).setSize(tile.width*map.width, 40).setFill('#2c3e50');
	statusLayer.appendChild(statusArea);
	
	var hpLabel = new lime.Label().setAlign('left').setText('HP: ' + player.hp).setFontColor('#E8FC08').setPosition(20, 0).setAnchorPoint(0,0).setSize(100,20).setFontWeight('bold');
	var goldLabel = new lime.Label().setAlign('left').setText('Gold: ' + player.gold).setFontColor('#E8FC08').setPosition(20, 20).setAnchorPoint(0,0).setSize(100,20).setFontWeight('bold');
	var oppLabel = new lime.Label().setAlign('right').setText('HP: ' + player.opp).setFontColor('#E8FC08').setPosition(tile.width*map.width-120, 0).setAnchorPoint(0,0).setSize(100,20).setFontWeight('bold');
	statusArea.appendChild(hpLabel);
	statusArea.appendChild(goldLabel);
	statusArea.appendChild(oppLabel);
	
	
	var cardsLayer = new lime.Layer().setAnchorPoint(0,0);
	mapScene.appendChild(cardsLayer);
	var controlArea = new lime.Sprite().setAnchorPoint(0,0)
    .setPosition(0, 40+map.height*tile.height)
    .setSize(map.width*tile.width, 160)
    .setFill('#2c3e50');
	
	var items = []
	for(var i = 0; i<cards.length; i++){
		items[i] = new lime.Sprite().setSize(tile.width, tile.height).setFill(cards[i].image)
		.setAnchorPoint(0,0).setPosition((20*(i+1))+i*tile.width,20).setStroke(1);	
		controlArea.appendChild(items[i]);
		
		controlArea.appendChild(new lime.Label().setText(cards[i].name).setFontColor('#E8FC08').setAnchorPoint(0,0)
			.setPosition((20*(i+1))+i*tile.width, 20+tile.height));
		controlArea.appendChild(new lime.Label().setText(cards[i].cost + ' gold').setFontColor('#E8FC08').setAnchorPoint(0,0)
			.setPosition((20*(i+1))+i*tile.width, 35+tile.height));
		
		var item = items[i];
		
		
		
	(function(item, i) {
        goog.events.listen(item,['mousedown', 'touchstart'], function(e) {
		if(player.crtCard==i){
			player.crtCard = -1;
			item.setStroke(1,0,0,0);
			console.log(cards[i].name + ' deselected');
		}else{
			if(player.crtCard>=0){
				items[player.crtCard].setStroke(1);
				console.log(cards[player.crtCard].name + ' deselected');
			}
            player.crtCard = i;
			item.setStroke(4, 255, 0, 0);
            console.log(cards[i].name + ' selected');
			}
        });
    })(item, i);
		
	}	
	
	// turn button
	var turnButton = new lime.GlossyButton().setColor('#2980b9').setText('End Turn').setAnchorPoint(0,0)
    .setPosition(20*(cards.length+1)+tile.width*(cards.length+1),20+(tile.height/4))
    .setSize(tile.width*2, tile.height/2);
	controlArea.appendChild(turnButton);
	cardsLayer.appendChild(controlArea);
	
// Move unit
function moveUnit(i,j){
	if(map.field[i][j]!=undefined){
		console.log(map.field[i][j].name + ' at ' + i + ' ' + j);
		// Check to attack opponent
		if(i+map.field[i][j].speed >=map.width){
			console.log('Hit opponent for ' + map.field[i][j].attack);
			player.opp -= map.field[i][j].attack;
			
			if(player.opp<=0){
				player.opp=0;
				oppLabel.setText('');
				YouWonScene.appendChild(new lime.Sprite().setFill(map.field[i][j].image)
				.setSize(2*tile.width, 2*tile.height)
				.setPosition((map.width*tile.width)/4, (map.height*tile.height)/2));
				YouWonScene.appendChild(new lime.Sprite().setFill(map.field[i][j].image)
				.setSize(2*tile.width, 2*tile.height)
				.setPosition(3*(map.width*tile.width)/4, (map.height*tile.height)/2).setScale(-1, 1) );
				director.replaceScene(YouWonScene,lime.transitions.Dissolve,2);			
			}
			
			oppLabel.setText('HP: ' + player.opp)
			map.tiles[i][j].setFill('#1abc9c');
		}
		else{
			// Check to Move
			if(map.field[i+map.field[i][j].speed][j]!=undefined){
				moveUnit(i+map.field[i][j].speed, j);					
			}
			if(tmpMap[i+map.field[i][j].speed][j]==undefined){
				map.tiles[i+map.field[i][j].speed][j].setFill(map.field[i][j].image);
				tmpMap[i+map.field[i][j].speed][j] = map.field[i][j];
				map.field[i][j] = undefined;
			if(i<3)
				map.tiles[i][j].setFill('#2ecc71');
			else
				map.tiles[i][j].setFill('#1abc9c');
			}
			else{
				tmpMap[i][j] = map.field[i][j];
			}
		}
	}	
}
	
	
	//launch turn event
goog.events.listen(turnButton, ['mousedown', 'touchstart'], function(e) {
		player.gold+=1;
		goldLabel.setText('Gold: ' + player.gold);
		tmpMap = createArray(map.width, map.height);
		
    	for(var i = 0; i < map.width; i++){
			for(var j = 0; j< map.height; j++){
				moveUnit(i,j);
			}
		}
		map.field = tmpMap;
});

    director.replaceScene(mapScene); 
}



