//TERIABLE-INFINITY : V 0.0.1;
//8/13/2016 Andrew V Butt Sr.
//Pryme8@gmail.com | http://pryme8.github.io

window.onkeydown = function(e) { 
    return !(e.keyCode == 32 || e.keyCode == 17 || e.keyCode == 91);
};

v3 = function(x,y,z){
	return new BABYLON.Vector3(x,y,z);
}

Teriable = {} || Teriable;

Teriable.Core = function(){
	this._state = 'init';
	this._stack = [];
	this._data = {
		engine: null,
		canvas: null,
		scene: null,
		point_of_origin: v3(0.0,0.0,0.0),		
	};
	this.materialBank = [];
	Teriable.Do.buildCanvas({},this);
};

Teriable.Do = {
	create_block : function(args, parent){
		var scene = parent._data.scene;
		var newBlock = BABYLON.Mesh.CreateGround("g-block", 2000, 2000, 500, scene, true /*successCallback*/);
		newBlock.material = parent.materialBank[0];
		newBlock.body = newBlock.setPhysicsState(BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0.0, friction: 0.0001, restitution: 0.0});
	},
	
	buildCanvas : function(args, parent){
		console.log('building-canvas');
		this._args = {} || args;
		var newDomCanvas = $("<canvas id='teriable-canvas'></canvas>");
		if(!this._args.target){
			newDomCanvas.appendTo('body');
		}else{
			newDomCanvas.appendTo(this._args.target);
		}
		newDomCanvas.css({'width':'100%',
        'height'  : '100%',
        'touch-action': 'none'});
		
		var canvas = document.getElementById('teriable-canvas');
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
				parent.materialBank.push(teriableBasic);
            
	  	var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 5, -30), scene);
		camera.position = new BABYLON.Vector3(0,5,-30);
		camera.attachControl(canvas, false);
		scene.activeCamera = camera;
	

   		worldlight1 = new BABYLON.HemisphericLight("wl1", new BABYLON.Vector3(0, 1, 0), scene);
		worldlight1.diffuse = new BABYLON.Color3(0.8, 0.8, 0.9);
		worldlight1.specular = new BABYLON.Color3(0.9, 0.9, 1.0);
		worldlight1.groundColor = new BABYLON.Color3(0.2, 0.1, 0.1);                  
		
		
		var gravity = new BABYLON.Vector3(0, 0, 0);
		var p = new BABYLON.CannonJSPlugin();
		
		scene.enablePhysics(gravity, p);
		scene.collisionsEnabled = true;
		scene.workerCollisions = true;
		
		scene.getPhysicsEngine().setTimeStep(1 / 120);
		var temp = BABYLON.MeshBuilder.CreateTube("p-temp", {path: [v3(0.0,0.0,0.0), v3(0.0,2.0,0.0)], radius:0.5, tessellation:8}, scene);
		temp.position.y = 0.0;
		temp.position.z = 4.0;
		
		
		
		var player_box = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 4}, scene);
		var refPoint = BABYLON.Mesh.CreateSphere("pref", 1, 0.01, scene);
		refPoint.position.y = 0.0;
		refPoint.position.z = 1.0;
		
		refPoint.parent = camera;
		player_box.position.y = 8.0;
		player_box.isVisible = false;
		refPoint.isVisible = true;
		//camera.parent = player_box;

		player = {
			mesh:player_box,
			speed: {
				f:0,
				s:0,
				u:0,
			}
		};
		
		//PHYSICS START
		
		player_box.body = player_box.setPhysicsState(BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1.0, friction: 0.0001, restitution: 0.0});

		player_box.body.grounded = false;
				
				player_box.body.collisionResponse = 0;
				player_box.body.addEventListener("collide", function(e){ player_box.body.grounded = true;
				player_box.body.collisionResponse = 1;
		});
		//CONTROLS
		keys = {};
		keys.up = false, keys.down = false, keys.left = false, keys.right = false, keys.space = false, keys.w = false, keys.s = false, keys.a = false, keys.d = false, keys.ctrl = false;
		function onKeyDown(evt) {
		console.log(evt.keyCode);
   		 switch (evt.keyCode){
		case 37: // left
		keys.left = true;
		break;
		case 39: //right
		keys.right = true;
		break;
		case 38: //up
		keys.up = true;
		break;
		case 40: //down
		keys.down = true;
		break;
		case 32: //space
		keys.space = true;
		break;
		case 87: //w
		keys.w = true;
		break;
		case 83: //s
		keys.s = true;
		break;
		case 65: //a
		keys.a = true;
		break;
		case 68: //d
		keys.d = true;
		break;
		case 17: //ctrl
		keys.ctrl = true;
		break;
	}
	}
		function onKeyUp(evt) {
    switch (evt.keyCode){
		case 37: // left
		keys.left = false;
		break;
		case 39: //right
		keys.right = false;
		break;
		case 38: //up
		keys.up = false;
		break;
		case 40: //down
		keys.down = false;
		break;	
		case 32: //space
		keys.space = false;
		break;	
		case 87: //w
		keys.w = false;
		break;
		case 83: //s
		keys.s = false;
		break;
		case 65: //a
		keys.a = false;
		break;
		case 68: //d
		keys.d = false;
		break;
		case 17: //ctrl
		keys.ctrl = false;
		break;
	}
	}
	
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
		
		//console.log(player_box.body);
		//console.log(camera);
		settings = {
			accel : 1,
			speeds :{
				normal :{
					f: 50.0,
					b: -20.0,
					s: 30.0,
				},
				run :{
					f: 1.0,
					b: 0.45,
					s: 0.65,
				},
				walk :{
					f: 0.3,
					b: 0.1,
					s: 0.2,
				},
			},
		};
		//CONTROL RESPONSE
		scene.registerBeforeRender(function(){
			//console.log(player_box.position);
			
			if(player_box.body.collisionResponse){
			player_box.body.grounded = true;
			player_box.body.velocity.y = 0;
			}else{
			player_box.body.grounded = false;	
			}
							
							
			if(player_box.body.grounded || gravity.y == 0){
			
			if(keys.w){
				if(player.speed.f < settings.speeds.normal.f){
					player.speed.f += settings.accel;
				}else{
				player.speed.f = settings.speeds.normal.f;
				}
								
			}else if(keys.s){
				if(player.speed.f > settings.speeds.normal.b){
					player.speed.f -= settings.accel;
				}else{
				player.speed.f = settings.speeds.normal.b;
				}	
			}
			
			if(keys.a){
				if(player.speed.s > settings.speeds.normal.s*-1){
					player.speed.s -= settings.accel;
				}else{
				player.speed.s = settings.speeds.normal.s*-1;
				}
			}
			
			if(keys.d ){
				if(player.speed.s < settings.speeds.normal.s){
					player.speed.s += settings.accel;
				}else{
				player.speed.s = settings.speeds.normal.s;
				}
			}
			
			if(keys.space){
				if(gravity.y != 0 && player_box.body.grounded){
					player_box.body.collisionResponse = 0;
					var jumpVector = v3(0,6.5,0);
					player_box.applyImpulse(jumpVector, player_box.position);	
				}else{
				if(player.speed.u < -2){
					player.speed.u -= settings.accel;
					}else{
					player.speed.u = -2;
					}
				}
			}
				
			
			if(keys.ctrl){
				if(gravity.y != 0 && player_box.body.grounded){
					player.speed.f*=0.5;
					player.speed.s*=0.5;
				}else{
				  if(player.speed.u > 2){
					player.speed.u += settings.accel;
					}else{
					player.speed.u = 2;
					}
				}
			}
			
			
			 	player.speed.f*=0.82;
				player.speed.s*=0.82;
				player.speed.u*=0.82;
				if(player.speed.f<0.05 && player.speed.f > -0.05){
					player.speed.f = 0;
				}
				if(player.speed.s<0.05 && player.speed.s > -0.05){
					player.speed.s = 0;
				}
				
				var forward = scene.activeCamera.getTarget().subtract(scene.activeCamera.position).normalize();
				forward.y = 0;
				var right = BABYLON.Vector3.Cross(forward, scene.activeCamera.upVector).normalize();
				right.y = 0;	
				
			
				var f_speed = 0, s_speed = 0, u_speed = 0;
				if(player.speed.f != 0){
					f_speed = player.speed.f;
				}
				if(player.speed.s != 0){
					s_speed = player.speed.s;
				}
				if(player.speed.u != 0){
					u_speed = player.speed.u;
				}
				
				move = (forward.scale(f_speed)).subtract((right.scale(s_speed))).subtract(scene.activeCamera.upVector.scale(u_speed));
				
								
			player_box.body.velocity.x = move.x;
			player_box.body.velocity.z = move.z;
			player_box.body.velocity.y = move.y;
			}
			if(keys.ctrl){
			camera.position = v3(player_box.position.x,player_box.position.y+1,player_box.position.z);
			}else{
			camera.position = v3(player_box.position.x,player_box.position.y+2,player_box.position.z);
			}
			 
			
			
			//console.log(player.speed);

		});
		
		
		
    return scene;
    }

	var scene = createScene();
	engine.runRenderLoop(function() {
			
		 scene.render(); });

	//ALWAYS LISTEN FOR RESIZE!
	window.addEventListener('resize', function() { engine.resize(); });
	parent._data.engine = engine;
	parent._data.scene = scene;
	parent._data.canvas = canvas;
	
	//Build First Blocks
	Teriable.Do.create_block({},parent);
	
	},
};

Teriable.sItem = {
	domE : "<item><div class='head-block'><span class='input-block'></span><span class='output-block'></span></div><div class='settings-block'></div></item>",
	
};