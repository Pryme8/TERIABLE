// Teriable - Basic Shader;
 BABYLON.Effect.ShadersStore["Basic_Teriable_Shader"]=                "precision highp float;\r\n"+

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

                BABYLON.Effect.ShadersStore["Basic_Teriable_Shader"]=                "precision highp float;\r\n"+

                "// Lights\r\n"+
                "varying vec3 vPositionW;\r\n"+
                "varying vec3 vNormalW;\r\n"+
                "varying vec2 vUV;\r\n"+

                "// Refs\r\n"+
                "uniform sampler2D textureSampler;\r\n"+
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
                "   r[0] = vec2(0.0,0.035);\r\n"+
                "   r[1] = vec2(0.035,0.35);\r\n"+
                "   r[2] = vec2(0.35,1.65);\r\n"+
                "   r[3] = vec2(1.65,2.0);\r\n"+
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
	
				var teriableShader = new BABYLON.ShaderMaterial("Basic_Teriable_Shader", scene, {
                    vertex: "custom",
                    fragment: "custom",
                },
                    {
                        attributes: ["position", "normal", "uv"],
                        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
                    });
					
				teriableShader.setFloat("time", 0);
                teriableShader.setVector3("cameraPosition", BABYLON.Vector3.Zero());
                teriableShader.backFaceCulling = false;
				
				/*engine.runRenderLoop(function () {
                var shaderMaterial = scene.getMaterialByName("shader");
                shaderMaterial.setFloat("time", time);
                time += 0.02;

                shaderMaterial.setVector3("cameraPosition", scene.activeCamera.position);

                scene.render();
            	});*/