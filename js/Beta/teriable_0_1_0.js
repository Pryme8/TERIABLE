/*$$$$$$$$$$$$$$$$$$$ COPYRIGHT 2016 Andrew V. Butt Sr. $$$$$$$$$$$$$$$$$$$$$$$*/
/*$$$$$$$$$$$$$$$$$$$    Teriable Version 0.1.0         $$$$$$$$$$$$$$$$$$$$$$$*/
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
			//console.log("Made_Block"+id);
			//console.log("TERIABLE.Regions.length: "+TERIABLE.Region.length);
			
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
		
		TERIABLE.UpdatePositions = function (block, state, activeItem, count) {
			//console.log(block.name);
			//PERLIN 2D
			if(state =="Perlin2D"){
				console.log(state+" applyed");
				
				var xDiv = $(activeItem).children("#perlin-2d-x-divider").val();
				var yDiv = $(activeItem).children("#perlin-2d-y-divider").val();
				var height = $(activeItem).children("#perlin-2d-height").val();
				var seed = $(activeItem).children("#perlin-2d-seed").val();
				var mode = $(activeItem).children("#perlin-2d-mode").val();
				
				
				
				var maskTrigger = 0;
				var maskArray = [];
				if($(activeItem).attr('maskArray')){
					maskTrigger = 1;
					maskArray = $(activeItem).attr('maskArray').split(',');
				}
					
							
				var vertexData = block.getVerticesData(BABYLON.VertexBuffer.PositionKind);
				
				var maskIndex = 0;	
					for (var i = 0; i < vertexData.length; i += 3) {
						var x = vertexData[i]+block.position.x, y = vertexData[i+1]+block.position.y ,z = vertexData[i+2]+block.position.z;
						if(mode!="Mask"){
							var maskAmount = 1;
							if(maskTrigger){
									noise.seed(maskArray[3]);
									maskAmount = noise.perlin2(x/maskArray[0], z/maskArray[1])		;				
							}
						noise.seed(seed);
											
						switch (mode){
							case "Absolute":
								vertexData[i+1] = ((noise.perlin2(x/xDiv, z/yDiv))*height)*maskAmount;
								break;
							case "Additive":
								vertexData[i+1] += ((noise.perlin2(x/xDiv, z/yDiv))*height)*maskAmount;
								break;
							case "Subtractive":
								vertexData[i+1] -= ((noise.perlin2(x/xDiv, z/yDiv))*height)*maskAmount;
								break;		
						}
						
						}
					}
					
					if(mode!="Mask"){
					block.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vertexData, 0, 0);
					return;
					}else{
					
						if($(activeItem).next('item').length){
							$(activeItem).next('item').attr('maskArray',xDiv+','+yDiv+','+seed);
							return;
						}else{
						return;	
						}
					}
			}
			
			if(state == "Clamp"){
				
				var clampUp = $(activeItem).children("#clamp-upper").val();
				var clampLow = $(activeItem).children("#clamp-lower").val();

				var vertexData = block.getVerticesData(BABYLON.VertexBuffer.PositionKind);
				
				for (var i = 0; i < vertexData.length; i += 3) {
						var y = vertexData[i+1]+block.position.y;
						vertexData[i+1] = Math.min(Math.max(y, clampLow), clampUp);
					}
				block.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vertexData, 0, 0);
				return;
			}
	
		};
			
		TERIABLE.UpdateNormal = function(position){
		return
		}
		
		
	
		
		TERIABLE.NoiseStack = {}; TERIABLE.NoiseStack.Items = {};
		TERIABLE.NoiseStackItem = '<item><select></select><action act="accept-item">Accept</action></item>';
			TERIABLE.NoiseStack.Items.Perlin2D = 
			'<label for="perlin-2d-x-divider">perlin-2d-x-divider</label>'+
			'<input id="perlin-2d-x-divider" value="100"><BR />'+
			'<label for="perlin-2d-y-divider">perlin-2d-y-divider</label>'+
			'<input id="perlin-2d-y-divider" value="100"><BR />'+
			'<label for="perlin-2d-height">perlin-2d-height</label>'+
			'<input id="perlin-2d-height" value="100"><BR />'+
			'<label for="perlin-2d-seed">perlin-2d-seed</label>'+
			'<input id="perlin-2d-seed" value="420420"><BR />'+
			'<label for="perlin-2d-mode">perlin-2d-mode</label>'+
			'<select id="perlin-2d-mode" value="Absolute"><option>Absolute</option><option>Additive</option><option>Subtractive</option><option>Mask</option></select><BR />'+
			'<hiddenTag itype ="Perlin2D" />';
			
					
			TERIABLE.NoiseStack.Items.Clamp = 
			'<label for="clamp-upper">clamp-upper</label>'+
			'<input id="clamp-upper" value="100"><BR />'+
			'<label for="clamp-lower">clamp-lower</label>'+
			'<input id="clamp-lower" value="-100"><BR />'+
			'<hiddenTag itype ="Clamp" />';
				 
		
		TERIABLE.AddItem = function(){
			//console.log("NOISE ADDED");
				var newItem = $(TERIABLE.NoiseStackItem);
				$(newItem).appendTo('#NoiseStack');
				newItem.find('select').html(TERIABLE.getItemTypes());
				newItem.find('action').click(function(){
					TERIABLE.AcceptItem($(this));
				});
								
		}
		
		TERIABLE.AcceptItem = function(target){
				var parent = target.parent();
				var selectVal = parent.find('select').val();
				Object.getOwnPropertyNames(TERIABLE.NoiseStack.Items).forEach(function(type) {
					if(type == selectVal){
							parent.html(TERIABLE.NoiseStack.Items[type]);
					}
				
				});
				
				
		}
		
		
		TERIABLE.getItemTypes = function(){
				var selectString = "";
				Object.getOwnPropertyNames(TERIABLE.NoiseStack.Items).forEach(function(type) {
  				selectString += "<option value='"+type+"'>"+type+"</option>";
				});
				return selectString;
		}
		
		
		var stride,strideDivider,frequency,heightScale;
		
		
		TERIABLE.ApplyItem = function(iCount, count){
			
			if(iCount<$('#NoiseStack item').length){
				if(count<TERIABLE.Region.length){
					var currentItem = $('#NoiseStack item')[iCount];
					var state = $(currentItem).find('hiddenTag').attr('itype');
						TERIABLE.UpdatePositions(TERIABLE.Region[count], state, currentItem, count);
						TERIABLE.Region[count].updateMeshPositions(function(){}, true);
						
						setTimeout(function(){TERIABLE.ApplyItem(iCount, count+1);},0);
				}else{
						var currentItem = $('#NoiseStack item')[iCount];
						$(currentItem).removeAttr('maskArray');
						setTimeout(function(){TERIABLE.ApplyItem(iCount+1, 0);},0);
				}
			}else{
			return	
			}
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
				break;
			case "add-item": 
				TERIABLE.AddItem();
				break
			case "apply-noise": 
				TERIABLE.ApplyItem(0,0);
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

    