/*$$$$$$$$$$$$$$$$$$$ COPYRIGHT 2016 Andrew V. Butt Sr. $$$$$$$$$$$$$$$$$$$$$$$*/
/*$$$$$$$$$$$$$$$$$$$     Teriable Version Alpha 1      $$$$$$$$$$$$$$$$$$$$$$$*/
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

// INIT OBJECTS
var TERIABLE = TERIABLE || {}; TERIABLE.Action = {}; TERIABLE.Region = [];


window.addEventListener('DOMContentLoaded', function(){
		
		/*!!!!!!!!!!!!!! TERIABLE GENERATOR FUNCTIONS !!!!!!!!!!!!!!!*/
		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
		
		TERIABLE.CreateBlock = function (sizeX, sizeY, detail, scene, posX, posZ, id){
			this._ground = BABYLON.Mesh.CreateGround("block"+id , sizeX, sizeY, detail, scene, true);
			
			this._ground.position.x = posX;
			this._ground.position.z = posZ;
			this._ground.material = new BABYLON.StandardMaterial("rMat", scene);
			this._ground.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
			TERIABLE.Region.push(this._ground);
			console.log("Made_Block"+id);
			console.log("TERIABLE.Regions.length: "+TERIABLE.Regions.length);
			
		}
		
		
		TERIABLE.Action.CreateNewRegion = function(scene){
			TERIABLE.Action.fadeGui();
			var bsX = $('#block-size-x').val();
			var bsY = $('#block-size-y').val();
			var rsX = $('#region-size-x').val();
			var rsY = $('#region-size-y').val();
			var detail = $('#block-detail').val();
			
			var regionWidth = (bsX*rsX);
			var regionHeight = (bsY*rsY);
			
			setTimeout(function(){TERIABLE.Action.RegionGenerate(scene, 0, 0, bsX, bsY, rsX, rsY, detail, regionWidth, regionHeight);},0);	
			
		}
		
		TERIABLE.Action.RegionGenerate = function(scene, x, y, bsX, bsY, rsX, rsY, detail, regionWidth, regionHeight){
			if(y<rsY){
				var offSetY = ((regionHeight/2)*-1)+ (y * bsY);
				var offSetX = ((regionWidth/2)*-1)+ (x * bsX);
				if(x<rsX){
					TERIABLE.CreateBlock(parseInt(bsX), parseInt(bsY), parseInt(detail), scene, offSetX, offSetY, String(x)+","+String(y));
					x++;
					return setTimeout(function(){TERIABLE.Action.RegionGenerate(scene, x, y, bsX, bsY, rsX, rsY, detail, regionWidth, regionHeight);
					TERIABLE.Action.UpdateProgressBar(rsY*rsX, (y*rsX)+(x+1));
					},0);
				}else{
					y++;
					x = 0;
					return setTimeout(function(){TERIABLE.Action.RegionGenerate(scene, x, y, bsX, bsY, rsX, rsY, detail, regionWidth, regionHeight);
					TERIABLE.Action.UpdateProgressBar(rsY*rsX, (y*rsX)+(x+1));
					},0);
				}
			
			}
			return	setTimeout(function(){TERIABLE.Action.UpdateProgressBar(0, 0); TERIABLE.Action.fadeGui('main');},10);
			
		}
		
		
		
		/*!!!!!!!! UI STUFF !!!!!!!!*/
		/*!!!!!!!!!!!!!!!!!!!!!!!!!!*/
		var pgBar = $('<progressBar><span></span></progressBar>')
		TERIABLE.Action.UpdateProgressBar = function(target, count){
			if(count<target){
			if(!$('progressBar').length){
				bar = $('body').prepend(pgBar);
			}
			
			
				var progress  = ($('progressBar').width()-6)*(count/target);
				
				$('progressBar span').css('width',progress);
			}else{
				$('progressBar').remove();
			}
		}
		
		
		TERIABLE.Action.fadeGui = function(target){
			if(target){
				$('gui pane.active').removeClass('active');
				$('gui pane#'+target).addClass('active');
			}
			
			if($('gui pane.active').is(":visible")){
			$('gui pane.active').fadeOut(320);	
			}else{
			$('gui pane.active').fadeIn(320);	
			}
		}
		/*!!!!!!!! END UI STUFF !!!!!!!!*/
		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
		
		
		/*^^^^^^^^^^^^^ END TERIABLE GENERATOR FUNCTIONS ^^^^^^^^^^^^*/
		/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/


   	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
	
	var createScene = function () {
    var scene = new BABYLON.Scene(engine);

  	var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 5, -30), scene);
	camera.position = new BABYLON.Vector3(0,5,-30);
	camera.attachControl(canvas, false);

	

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
	
	TERIABLE.Action.fadeGui();
	
	$( "action" ).click(function(e) {
  		switch ($(e.target).attr('act')){
			case "create-new-region": 
				TERIABLE.Action.CreateNewRegion(scene);
				break	
		}
	});
	
	
		
    return scene;
    }

	var scene = createScene();

	engine.runRenderLoop(function() { scene.render(); });

//ALWAYS LISTEN FOR RESIZE!
window.addEventListener('resize', function() { engine.resize(); });

});

    