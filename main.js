var AM = new AssetManager();

// Queue downloading background
AM.queueDownload('images/galaxy.png');
AM.queueDownload('images/galaxy.jpg');
AM.queueDownload('images/galaxy2.jpg');

// Queue downloading main character
AM.queueDownload('images/sun.png');

// Queue downloading main character
AM.queueDownload('images/earth.png');


AM.downloadAll(function ()
{
    // Load game world. This is the top layer
    var canvas = document.getElementById('gameWorld');
    var gameCtx = canvas.getContext('2d');

    // Load a special effects layer. This is on bottom.
    var bottomCanvas = document.getElementById('projectionsLayerBottom');
    var bottomProjectionContext = bottomCanvas.getContext('2d');

    // Load a special effects layer. This is in the middle.
    var middleCanvas = document.getElementById('projectionsLayerMiddle');
    var middleProjectionContext = middleCanvas.getContext('2d');

    var gameEngine = new GameEngine();

    gameCtx.canvas.focus();

    // Send canvas' to game engine
    gameEngine.init(bottomProjectionContext, middleProjectionContext, gameCtx, AM);
    gameEngine.start();

    console.log('All Done!');
});