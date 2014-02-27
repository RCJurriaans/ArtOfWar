goog.provide('ArtOfWar.card');
goog.require('lime.Sprite');

/**
 * Card elements
 * @param {} tile
 */
 
 ArtOfWar.card = function(tile, card){
	goog.base(this);
    this.setAnchorPoint(0, 0);
    this.setSize(tile.width, tile.height);
    this.setFill(card.image);
	this.setFill(26, 188, 156);
	this.setStroke(1, 52, 73, 94);

}

goog.inherits(ArtOfWar.card, lime.Sprite); 