/*$$$$$$$$$$$$$$$$$$$ COPYRIGHT 2016 Andrew V. Butt Sr. $$$$$$$$$$$$$$$$$$$$$$$*/
/*$$$$$$$$$$$$$$$$$$$    Teriable Version 0.1.3         $$$$$$$$$$$$$$$$$$$$$$$*/
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
			
		
		
			this._ground.material = teriableBasic;
					
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
			
			TERIABLE.regionWidth = regionWidth;
			TERIABLE.regionHeight = regionHeight;
			TERIABLE.scene = scene;
			
			
			setTimeout(function(){TERIABLE.Action.RegionGenerate(scene, 0, 0, bsX, bsY, rsX, rsY, detail, regionWidth, regionHeight);},0);	
			TERIABLE.ResetCam();
			
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
			
			//WHORLEY 2D
			
			//PERLIN 2D
			if(state =="WorleyNoise2D"){
				console.log(state+" applyed");
				
				var points = $(activeItem).children("#Worley-2d-points").val();
				var seed = $(activeItem).children("#Worley-2d-seed").val();
				var height = $(activeItem).children("#Worley-2d-height").val();
				var nth = $(activeItem).children("#Worley-2d-nth").val();
				var style = $(activeItem).children("#Worley-2d-style").val();
				var mode = $(activeItem).children("#Worley-2d-mode").val();
				
				
				
				var maskTrigger = 0;
				var maskArray = [];
				if($(activeItem).attr('maskArray')){
					maskTrigger = 1;
					maskArray = $(activeItem).attr('maskArray').split(',');
				}
				
					
				var worly = new WorleyNoise2D(points, seed, TERIABLE.regionWidth, TERIABLE.regionHeight, nth, style);
				var vertexData = block.getVerticesData(BABYLON.VertexBuffer.PositionKind);
				
				var maskIndex = 0;
				for (var i = 0; i < vertexData.length; i += 3) {
						var x = vertexData[i]+block.position.x, y = vertexData[i+1]+block.position.y ,z = vertexData[i+2]+block.position.z;
					var worlyReturn = worly._getPointValue(x,z);
					
				if(mode!="Mask"){
							var maskAmount = 1;
							if(maskTrigger){
								var worlyMask =  new WorleyNoise2D(maskArray[0], maskArray[1], TERIABLE.regionWidth, TERIABLE.regionHeight, maskArray[2], maskArray[3])
								maskAmount = worlyMask._getPointValue(x,z);
							}
					
						
				switch (mode){
							case "Absolute":
								vertexData[i+1] = (worlyReturn*height)*maskAmount;
								break;
							case "Additive":
								vertexData[i+1] += (worlyReturn*height)*maskAmount;
								break;
							case "Subtractive":
								vertexData[i+1] -= (worlyReturn*height)*maskAmount;
								break;		
						}
				
				
				}
			}
							
			if(mode!="Mask"){
					block.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vertexData, 0, 0);
					return;
					}else{
					
						if($(activeItem).next('item').length){
							$(activeItem).next('item').attr('maskArray',points+','+seed+','+nth+','+style);
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
			'<action act="item-move-up">move-up</action><action act="item-move-down">move-down</action><action act="item-delete">delete</action><BR />'+
			'<hiddenTag itype ="Perlin2D" />';
			
			TERIABLE.NoiseStack.Items.WorleyNoise2D = 
			'<label for="Worley-2d-seed">Worley-2d-seed</label>'+
			'<input id="Worley-2d-seed" value="3412"><BR />'+
			'<label for="Worley-2d-points">Worley-2d-points</label>'+
			'<input id="Worley-2d-points" value="40"><BR />'+
			'<label for="Worley-2d-nth">Worley-2d-nth</label>'+
			'<input id="Worley-2d-nth" value="2"><BR />'+
			'<label for="Worley-2d-style">Worley-2d-style</label>'+
			'<select id="Worley-2d-style" value="euclidean"><option>euclidean</option><option>euclidean2</option><option>manhattan</option><option>manhattan2</option><option>chebyshevish</option><option>chebyshevish2</option><option>chebyshevish3</option><option>chebyshevish4</option><option>valentine</option><option>valentine2</option><option>valentine3</option><option>valentine4</option></select><BR />'+
			'<label for="Worley-2d-height">Worley-2d-height</label>'+
			'<input id="Worley-2d-height" value="20"><BR />'+
			'<label for="Worley-2d-mode">Worley-2d-mode</label>'+
			'<select id="Worley-2d-mode" value="Absolute"><option>Absolute</option><option>Additive</option><option>Subtractive</option><option>Mask</option></select><BR />'+
			'<action act="item-move-up">move-up</action><action act="item-move-down">move-down</action><action act="item-delete">delete</action><BR />'+
			'<hiddenTag itype ="WorleyNoise2D" />';
			
					
			TERIABLE.NoiseStack.Items.Clamp = 
			'<label for="clamp-upper">clamp-upper</label>'+
			'<input id="clamp-upper" value="100"><BR />'+
			'<label for="clamp-lower">clamp-lower</label>'+
			'<input id="clamp-lower" value="-100"><BR />'+
			'<action act="item-move-up">move-up</action><action act="item-move-down">move-down</action><action act="item-delete">delete</action><BR />'+
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
			setTimeout(function(){TERIABLE.Action.UpdateProgressBar($('#NoiseStack item').length,iCount);},0);
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
			setTimeout(function(){TERIABLE.Action.UpdateProgressBar(0,0);},0);
			TERIABLE.Action.fadeGui();
			
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
				$('gui').css("pointer-events","none");
			$('gui pane.active').fadeOut(320);	
			}else{
				$('gui').css("pointer-events","initial");
			$('gui pane.active').fadeIn(320);	
			}
		}
		
		
		TERIABLE.ResetCam = function(){
			var scene = TERIABLE.scene;
			cam =  scene.activeCamera;
			cam.position = new BABYLON.Vector3(0, TERIABLE.regionHeight, ((TERIABLE.regionWidth+TERIABLE.regionHeight)/1.5)*-1);
			cam.setTarget(BABYLON.Vector3.Zero());
			
		}
		/*!!!!!!!! END UI STUFF !!!!!!!!*/
		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
		
		
		/*^^^^^^^^^^^^^ END TERIABLE GENERATOR FUNCTIONS ^^^^^^^^^^^^*/
		/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/


   	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
	
	var createScene = function () {
    var scene = new BABYLON.Scene(engine);
	
	
	
	//SHADERS?
		BABYLON.Effect.ShadersStore["teriableBasicVertexShader"]= "precision highp float;\r\n"+

                "// Attributes\r\n"+
                "attribute vec3 position;\r\n"+
                "attribute vec3 normal;\r\n"+
                "attribute vec2 uv;\r\n"+

                "// Uniforms\r\n"+
                "uniform mat4 world;\r\n"+
                "uniform mat4 worldViewProjection;\r\n"+

                "// Varying\r\n"+
                "varying vec3 vPositionW;\r\n"+
                "varying vec3 vNormalW;\r\n"+
                "varying vec2 vUV;\r\n"+

                "void main(void) {\r\n"+
                "    vec4 outPosition = worldViewProjection * vec4(position, 1.0);\r\n"+
                "    gl_Position = outPosition;\r\n"+
                "    \r\n"+
                "    vPositionW = vec3(world * vec4(position, 1.0));\r\n"+
                "    vNormalW = normalize(vec3(world * vec4(normal, 0.0)));\r\n"+
                "    \r\n"+
                "    vUV = uv;\r\n"+
                "}\r\n";
				
				BABYLON.Effect.ShadersStore["teriableBasicFragmentShader"]=                         "precision highp float;\r\n"+

                "// Lights\r\n"+
                "varying vec3 vPositionW;\r\n"+
                "varying vec3 vNormalW;\r\n"+
                "varying vec2 vUV;\r\n"+

                "// Refs\r\n"+
                "uniform sampler2D textureBank;\r\n"+
                "const vec3 up = vec3(0.0,1.0,0.0);\r\n"+

                "float rangeV(float v, float x, float y){\r\n"+
                "    return 1.0-max(0.0 , min(1.0 , (v - y)/(y - x)));\r\n"+
                "}\r\n"+
                "//http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl\r\n"+
                "float snoise(vec2 co)\r\n"+
                "{\r\n"+
                "    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\r\n"+
                "}\r\n"+

                "void main(void) {\r\n"+
                "   vec2 r[4];//RANGES\r\n"+
                "   r[0] = vec2(-50.0,-30.0);\r\n"+
                "   r[1] = vec2(-30.0,10.0);\r\n"+
                "   r[2] = vec2(10.0,45.0);\r\n"+
                "   r[3] = vec2(45.0,50.0);\r\n"+
                "   vec2 aR[4];\r\n"+
                "   aR[0] = vec2(0.0,0.35);\r\n"+
                "   aR[1] = vec2(0.35,0.5);\r\n"+
                "   aR[2] = vec2(0.5,0.98);\r\n"+
                "   aR[3] = vec2(0.98,1.0);\r\n"+
                "   \r\n"+
                "   float angle = max(0., dot(vNormalW, up));//ANGLE 0:1\r\n"+
                "   float el = vPositionW.y; //ELEVATION\r\n"+
                "   /*vec3 color;\r\n"+
                "   if(angle >= 0.0 && angle <= 0.35 ){\r\n"+
                "     color = vec3(angle,1.,1.); //BASE COLOR\r\n"+
                "   }else if(angle > 0.35 && angle <= 0.5 ){\r\n"+
                "      color = vec3(1.0,angle,1.); //BASE COLOR\r\n"+
                "   }else if(angle == 1.0){\r\n"+
                "      color = vec3(0.0,0.0,0.0); //BASE COLOR\r\n"+
                "   }else{\r\n"+
                "      color = vec3(1.0,1.0,angle); //BASE COLOR\r\n"+
                "   }*/\r\n"+
                "   vec3 color = vec3(1.0,1.0,1.0); //BASE COLOR\r\n"+
                "   vec3 rc[4];  //RANGE COLORS\r\n"+
                "   rc[0] = vec3(0.4,0.4,0.2);\r\n"+
                "   rc[1] = vec3(0.8,0.8,0.3);\r\n"+
                "   rc[2] = vec3(0.4,0.8,0.4);\r\n"+
                "   rc[3] = vec3(0.8,0.8,0.9);\r\n"+
                "   vec3 ac[16];  //ANGLE COLORS\r\n"+
                "   //ZONE 1:\r\n"+
                "   ac[0] = vec3(0.2,0.2,0.0);\r\n"+
                "   ac[1] = vec3(0.4,0.4,0.2);\r\n"+
                "   ac[2] = vec3(0.5,0.5,0.2);\r\n"+
                "   ac[3] = vec3(-0.8,-0.8,-0.6);\r\n"+
                "   //ZONE 2:\r\n"+
                "   ac[4] = vec3(0.0,0.4,0.4);\r\n"+
                "   ac[5] = vec3(0.6,0.6,0.6);\r\n"+
                "   ac[6] = vec3(-0.3,0.0,0.3);\r\n"+
                "   ac[7] = vec3(-0.2,-0.2,0.0);\r\n"+
                "   //ZONE 3:\r\n"+
                "   ac[8] = vec3(0.0,0.4,0.0);\r\n"+
                "   ac[9] = vec3(-0.2,-0.2,0.0);\r\n"+
                "   ac[10] = vec3(0.0,0.6,0.6);\r\n"+
                "   ac[11] = vec3(0.0,-0.8,0.0);\r\n"+
                "   //ZONE 4:\r\n"+
                "   ac[12] = vec3(-0.5,-0.5,-0.5);\r\n"+
                "   ac[13] = vec3(-1.0,0.6,0.0);\r\n"+
                "   ac[14] = vec3(-1.0,0.0,0.0);\r\n"+
                "   ac[15] = vec3(0.2,-0.6,-0.6);\r\n"+
                "   \r\n"+
                "   float ap[4]; //Angle Blend PERCENTAGE\r\n"+
                "    ap[0] = rangeV(angle, aR[0].x, aR[0].y);\r\n"+
                "    ap[1] = rangeV(angle, aR[1].x, aR[1].y);\r\n"+
                "    ap[2] = rangeV(angle, aR[2].x, aR[2].y);\r\n"+
                "    ap[3] = rangeV(angle, aR[3].x, aR[3].y);\r\n"+
                "    \r\n"+
                "    //Mix into BaseColor for Zones;\r\n"+
                "    //Zone 1:\r\n"+
                "    rc[0] = normalize(rc[0]-(ac[0]*(ap[0]*0.5)));\r\n"+
                "    rc[0] = normalize(rc[0]-(ac[1]*(ap[1]*0.5)));\r\n"+
                "    rc[0] = normalize(rc[0]-(ac[2]*(ap[2]*0.5)));\r\n"+
                "    rc[0] = normalize( rc[0]-(ac[3]*(ap[3]*0.5)));\r\n"+
                "    //Zone 2:\r\n"+
                "    rc[1] = normalize(rc[1]-(ac[4]*(ap[0]*0.5)));\r\n"+
                "    rc[1] = normalize(rc[1]-(ac[5]*(ap[1]*0.5)));\r\n"+
                "    rc[1] = normalize(rc[1]-(ac[6]*(ap[2]*0.5)));\r\n"+
                "    rc[1] = normalize( rc[1]-(ac[7]*(ap[3]*0.5)));\r\n"+
                "    //Zone 3:\r\n"+
                "    rc[2] = normalize(rc[2]-(ac[8]*(ap[0]*0.5)));\r\n"+
                "    rc[2] = normalize(rc[2]-(ac[9]*(ap[1]*0.5)));\r\n"+
                "    rc[2] = normalize(rc[2]-(ac[10]*(ap[2]*0.5)));\r\n"+
                "    rc[2] = normalize( rc[2]-(ac[11]*(ap[3]*0.5)));\r\n"+
                "    //Zone 4:\r\n"+
                "    rc[3] = normalize(rc[3]-(ac[12]*(ap[0]*0.5)));\r\n"+
                "    rc[3] = normalize(rc[3]-(ac[13]*(ap[1]*0.5)));\r\n"+
                "    rc[3] = normalize(rc[3]-(ac[14]*(ap[2]*0.5)));\r\n"+
                "    rc[3] = normalize( rc[3]-(ac[15]*(ap[3]*0.5)));\r\n"+
                "   \r\n"+
                "    float rp[4]; //RANGE BLEND PERCENTAGE\r\n"+
                "    rp[0] = rangeV(el, r[0].x, r[0].y);\r\n"+
                "    rp[1] = rangeV(el, r[1].x, r[1].y);\r\n"+
                "    rp[2] = rangeV(el, r[2].x, r[2].y);\r\n"+
                "    rp[3] = rangeV(el, r[3].x, r[3].y);\r\n"+
                "   \r\n"+
                "   //Slight Blending nouse... this could be better...\r\n"+
                "   if(rp[0]<=0.25){\r\n"+
                "        rp[0]*=snoise(vPositionW.xz);\r\n"+
                "    }\r\n"+
                "    if(rp[1]<=0.25){\r\n"+
                "        rp[1]*=snoise(vPositionW.xz);\r\n"+
                "    }\r\n"+
                "    if(rp[2]<=0.25){\r\n"+
                "        rp[2]*=snoise(vPositionW.xz);\r\n"+
                "    }\r\n"+
                "    if(rp[3]<=0.25){\r\n"+
                "        rp[3]*=snoise(vPositionW.xz);\r\n"+
                "    }\r\n"+
                "    \r\n"+
                "    \r\n"+
                "    //RANGE COLOR MIX\r\n"+
                "    color = mix(color, rc[3], rp[3]);\r\n"+
                "    color = mix(color, rc[2], rp[2]);\r\n"+
                "    color = mix(color, rc[1], rp[1]);\r\n"+
                "    color = mix(color, rc[0], rp[0]);\r\n"+
                "    \r\n"+
                "    vec3 vLightPosition = vec3(-2,100,5);\r\n"+
                "    // Light\r\n"+
                "    vec3 lightVectorW = normalize(vLightPosition - vPositionW);\r\n"+
                "    // diffuse\r\n"+
                "    float ndl = max(0., dot(vNormalW, lightVectorW));\r\n"+
                "    color*=ndl;\r\n"+
                "    \r\n"+
                "    gl_FragColor = vec4(color, 1.);\r\n"+
                "}\r\n";
				
				var textureBank = new Array();
				var textureLocations = [
				//ZONE 1:
					"./textures/Beach_Rocks.jpg",//BASE
					"./textures/Sand_2.jpg",//Angle Zone 1
					"./textures/Sand_2.jpg",//Angle Zone 2
					"./textures/Sand_1.jpg",//Angle Zone 3
					"./textures/Rocks_2.jpg",//Angle Zone 4
				];
				
				$.each(textureLocations, function(i,e){
					textureBank.push(new BABYLON.Texture(e, scene));
					textureBank[i].wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
					textureBank[i].wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
					});
					
					
				teriableBasic = new BABYLON.ShaderMaterial("teriableBasic", scene, {
                    vertex: "teriableBasic",
                    fragment: "teriableBasic",
                	},
                    {
                        attributes: ["position", "normal", "uv"],
                        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
                    });
				
				teriableBasic.setTexture("textureBank", textureBank);

                
  	var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 5, -30), scene);
	camera.position = new BABYLON.Vector3(0,5,-30);
	camera.attachControl(canvas, false);
	scene.activeCamera = camera;

	

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
	
	TERIABLE.Action.fadeGui();
	
	$( "gui" ).click(function(e) {
  		var element = $(e.target);
		
	if(element.attr('act')){
		var action = element.attr('act');
		if(action == "create-new-region"){
			TERIABLE.Action.CreateNewRegion(scene);		
		}
		if(action == "add-item"){
			TERIABLE.AddItem();		
		}
		if(action == "apply-noise"){
			TERIABLE.Action.fadeGui();
			TERIABLE.ApplyItem(0,0);		
		}
		if(action == "item-move-up"){
			var parentItem = element.parent();
			if(parentItem.prev('item').length){
				parentItem.prev('item').before(parentItem);
			}	
		}
		if(action == "item-move-down"){
			var parentItem = parentItem.parent();
			if(parentItem.next('item').length){
				parentItem.next('item').after(parentItem);
			}	
		}
		if(action == "item-delete"){
			var parentItem = element.parent();
			parentItem.remove();
		}
	}
	});
	
	
		
    return scene;
    }

	var scene = createScene();

	engine.runRenderLoop(function() { scene.render(); });

//ALWAYS LISTEN FOR RESIZE!
window.addEventListener('resize', function() { engine.resize(); });

});

    