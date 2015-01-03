//grab gl context; set viewport
var gl = canvas.getContext("webgl");
gl.viewportWidth = canvas.width;
gl.viewportHeight = canvas.height;

//fragment shader
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,
	"precision mediump float;"
	+ "varying highp vec2 vTextureCoord;"
	+ "uniform sampler2D uSampler;"
	+ "void main(void) {"
		+ "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s * vTextureCoord.s, vTextureCoord.t * vTextureCoord.t));"
	+ "}"
);
gl.compileShader(fragmentShader);

//vertex shader
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, 
	"attribute vec3 aVertexPosition;"
	+ "attribute vec2 aTextureCoord;"
    + "uniform mat4 uMVMatrix;"
	+ "uniform mat4 uPMatrix;"
	+ "varying highp vec2 vTextureCoord;"
	+ "void main(void) {"
		+ "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);"
		+ "vTextureCoord = aTextureCoord;"
	+ "}"
);
gl.compileShader(vertexShader);

//shader program?
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

//grab locations of attributes/uniforms from the shaders
//    so we can set them, and change them later.
//remember: Uniforms are "uniform" throughout all vertices,
//remember: Attributes are applied per vertex, which is why we
//    need to specify that the location will use an array.
//    ...not sure how the arrays actually get to that attribute tho...
var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
gl.enableVertexAttribArray(vertexPositionAttribute);
var pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
var mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

//square
var square = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, square);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	-1,-1, 0,
	 1,-1, 0,
	 1, 1, 0,
	-1, 1, 0
]), gl.STATIC_DRAW);

//textures
var texture = gl.createTexture();
var image = new Image();
image.onload = resume;
image.src = "crate.jpg";
							function resume() {
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
gl.generateMipmap(gl.TEXTURE_2D);
gl.bindTexture(gl.TEXTURE_2D, null);

//texture mapping
var squareTexture = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, squareTexture);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	0,0,
	1,0,
	1,1,
	0,1
]), gl.STATIC_DRAW);

var textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
gl.enableVertexAttribArray(textureCoordAttribute);

gl.bindBuffer(gl.ARRAY_BUFFER, squareTexture);
gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

//clear scene before draw?
gl.clearColor(0,0,0,1);
gl.enable(gl.DEPTH_TEST);

//a few temp variables for holding the "camera" info
var pMatrix = mat4.create();
var mvMatrix = mat4.create();

//draw the scene
gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

mat4.perspective(
	pMatrix, //matrix to be mutated
	45, //vertical field of view
	gl.viewportWidth / gl.viewportHeight, //aspect ratio
	0.1, //near render distance
	100 //far render distance
);

//reset the draw location to the center of the screen
mat4.identity(mvMatrix);

//draw the square
mat4.translate(mvMatrix, mvMatrix, [0,0,-2]);
gl.bindBuffer(gl.ARRAY_BUFFER, square);
//set the vertices to be an array?
gl.vertexAttribPointer(
	vertexPositionAttribute,
	3, //the array is of vec3s (all concatenated into one array)
	gl.FLOAT,
	false,
	0,
	0
);
//set the uniforms
gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);
//and draw!
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4 /* vert count */);

						}
