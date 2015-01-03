//grab gl context; set viewport
var gl = canvas.getContext("webgl");
gl.viewportWidth = canvas.width;
gl.viewportHeight = canvas.height;

//fragment shader
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,
	"precision mediump float;"
	+ "void main(void) {"
		+ "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);"
	+ "}"
);
gl.compileShader(fragmentShader);

//vertex shader
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, 
	"attribute vec3 aVertexPosition;"
    + "uniform mat4 uMVMatrix;"
	+ "uniform mat4 uPMatrix;"
	+ "void main(void) {"
		+ "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);"
	+ "}"
);
gl.compileShader(vertexShader);

//triangle
var triangle = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	0, 1, 0,
	-1,-1,0,
	1, -1,0
]), gl.STATIC_DRAW);
triangle.itemSize = 3;
triangle.numItems = 3;

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
	1, 1, 0,
	-1,1, 0,
	1, -1,0,
	-1,-1,0
]), gl.STATIC_DRAW);
square.itemSize = 3;
square.numItems = 4;

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

//draw the triangle 1.5 to the left
mat4.translate(mvMatrix, mvMatrix, [-1.5, 0, -7]);
gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
//set the verticies to be an array?
gl.vertexAttribPointer(
	vertexPositionAttribute,
	triangle.itemSize,
	gl.FLOAT,
	false,
	0,
	0
);
//set the uniforms (position)
gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);
//and draw!
gl.drawArrays(gl.TRIANGLES, 0, triangle.numItems);

//draw the square 1.5 to the right
mat4.translate(mvMatrix, mvMatrix, [3,0,0]);
gl.bindBuffer(gl.ARRAY_BUFFER, square);
//set the vertices to be an array?
gl.vertexAttribPointer(
	vertexPositionAttribute,
	square.itemSize,
	gl.FLOAT,
	false,
	0,
	0
);
//set the uniforms
gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);
//and draw!
gl.drawArrays(gl.TRIANGLE_STRIP, 0, square.numItems);





