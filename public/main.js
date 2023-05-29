var canvasContainer;
var widthInput;
var heightInput;

var canvas;
var canvasExist = false;
var gl;

var vertexData = [];
var textureData = [];
var normalData = [];

const mat4 = glMatrix.mat4;

const matrix = mat4.create();
const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
const fProjMat = mat4.create();
const cameraHAngle = mat4.create();
const cameraVAngle = mat4.create();

mat4.translate(viewMatrix, viewMatrix, [0, 10, 15]);
mat4.invert(viewMatrix, viewMatrix);

console.log(viewMatrix);

const mvMatrix = mat4.create(); 
const normalMatrix = mat4.create();

var SPD = 1;
var XRSPD = 0.005;
var YRSPD = 0.003;

var iElems = ["s", "a", "w", "d", "Shift", " "];
var iDown = [false, false, false, false, false, false];
var mDown = false;

var iDir = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],    [0,1,0],[0,-1,0]];
updateXIDir([1,0,0])

function updateXIDir(dir){
    iDir[0] = [dir[0], 0, dir[2]];
    for(let i = 1; i < 4; i++) iDir[i] = [-1 * iDir[i-1][2], 0, iDir[i-1][0]]
}

var lastPos = 0;
var pos = getMousePosition;
var deltaX = 0;
var deltaY = 0;

const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;


// addEventListener("DOMContentLoaded", () => {
    
canvasContainer = document.getElementById("canvas-container");
widthInput = document.getElementById("width-input");
heightInput = document.getElementById("height-input");

// console.log(widthInput);

function createCanvas(){
    canvas = document.createElement("canvas");

    canvasContainer.addEventListener("keydown", inputDown)
    canvasContainer.addEventListener("keyup", inputUp)

    canvasContainer.addEventListener("mousedown", mouseDown)
    canvasContainer.addEventListener("mouseup", mouseUp)

    canvasContainer.appendChild(canvas);
}

function deleteCanvas(){
    canvas.remove();
}

function autoCanvasSize(){
    widthInput.value = window.innerWidth - 100;
    heightInput.value = parseInt( widthInput.value * 9 / 16 );
}

function importToData(imp){
    vertexData = imp[0];
    textureData = imp[1];
    normalData = imp[2];

    // console.log(p_data);
}

function inputDown(e){
    console.log(e.key);


    for(let i = 0; i < iElems.length; i++){
        if(e.key == iElems[i]){
            iDown[i] = true;
            return;
        }
    }

    // console.lo   g(iDown);
}

function inputUp(e){

    for(let i = 0; i < iElems.length; i++){
        if(e.key == iElems[i]){
            iDown[i] = false;
            return;
        }
    }
}

function mouseDown(){
    mDown = true;
}

function mouseUp(){
    mDown = false;
}

var mousePos;

document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    mousePos = {
        x: event.pageX,
        y: event.pageY
    };
}

function getMousePosition() {
    var pos = mousePos;
    if (!pos) {
        // We haven't seen any movement yet
    }
    else {
        // Use pos.x and pos.y

        return pos;

        console.log(pos);
    }
}

function nxv3(n, v3){
    return [n*v3[0], n*v3[1], n*v3[2]];
}

function update(){
    if(mDown){ //Camera move update
        mat4.rotateY(cameraHAngle, cameraHAngle, parseFloat(XRSPD * deltaX));
        mat4.rotateX(cameraVAngle, cameraVAngle, parseFloat(YRSPD * deltaY));
    }

    for(let i = 0; i < iDown.length; i++){ //Player move update
        if(iDown[i]){
            mat4.translate(viewMatrix, viewMatrix, nxv3(SPD, iDir[i]));
        }
    }

}

async function resizeCanvas(){
    if(widthInput.value == 0 && heightInput.value == 0) return;

    canvasExist = false;

    

    if(canvas != undefined && canvas != null) deleteCanvas();
    createCanvas();

    canvas.setAttribute("width", widthInput.value);
    canvas.setAttribute("height", heightInput.value);


    imp = await importData("gy.obj");
    importToData(imp);

    

    canvasExist = true;

    runGL();
}

function matrixMultiply(){
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    mat4.multiply(fProjMat, cameraHAngle, cameraVAngle);
    mat4.multiply(fProjMat, projectionMatrix, fProjMat);
    mat4.multiply(matrix, fProjMat, mvMatrix);

    mat4.invert(normalMatrix, mvMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
}

function a(){
    console.log(projectionMatrix);
}

// function addFloor(){
//     vertexData.push(100);
//     vertexData.push(0);
//     vertexData.push(100);
//     vertexData.push(-100);
//     vertexData.push(0);
//     vertexData.push(100);
//     vertexData.push(-100);
//     vertexData.push(0);
//     vertexData.push(-100);

//     vertexData.push(100);
//     vertexData.push(0);
//     vertexData.push(100);
//     vertexData.push(100);
//     vertexData.push(0);
//     vertexData.push(-100);
//     vertexData.push(-100);
//     vertexData.push(0);
//     vertexData.push(-100);

//     for(let i = 0; i < 12; i++){
//         textureData.push(0);
//     }
//     for(let i = 0; i < 6; i++){
//         normalData.push(0);
//         normalData.push(1);
//         normalData.push(0);
//     }
// }

function addFloor(){
    for(let i = -100; i < 100; i++) for(let j = -100; j < 100; j++){
        vertexData.push(i)
        vertexData.push(0)
        vertexData.push(j)

        vertexData.push(i+1)
        vertexData.push(0)
        vertexData.push(j)

        vertexData.push(i+1)
        vertexData.push(0)
        vertexData.push(j+1)



        vertexData.push(i)
        vertexData.push(0)
        vertexData.push(j)

        vertexData.push(i)
        vertexData.push(0)
        vertexData.push(j+1)

        vertexData.push(i+1)
        vertexData.push(0)
        vertexData.push(j+1)

        for(let i = 0; i < 12; i++){
            textureData.push(0);
        }
        for(let i = 0; i < 6; i++){
            normalData.push(0);
            normalData.push(1);
            normalData.push(0);
        }
    }
}

async function runGL (){
    
    gl = canvas.getContext("webgl");

    addFloor();
    
    mat4.perspective(projectionMatrix,
        80 * Math.PI/180,
        canvas.width/canvas.height,
        1e-4,
        100 
    );

    const vertexBuffer = createBuffer(gl, vertexData);
    const textureBuffer = createBuffer(gl, vertexData);
    const normalBuffer = createBuffer(gl, vertexData);

    const vertexShader = setVertexShader(gl);
    const fragmentShader = setFragmentShader(gl);

    console.log("Vertex Shader: " + gl.getShaderInfoLog(vertexShader));
    console.log("Fragment Shader: " + gl.getShaderInfoLog(fragmentShader));

    const program = createProgram(gl, vertexShader, fragmentShader);

    setAttribLocation(gl, vertexBuffer, program, `position`, 3);
    setAttribLocation(gl, textureBuffer, program, `texture`, 3);
    setAttribLocation(gl, normalBuffer, program, `normal`, 3);

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    const uniformLocations = {
        matrix: gl.getUniformLocation(program, `matrix`),
        normalMatrix: gl.getUniformLocation(program, `normalMatrix`)
    };

    function animate(timestamp){
        requestAnimationFrame(animate);

        deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
        lastTimestamp = timestamp;

        lastPos = pos;
        pos = getMousePosition();
        deltaX = pos.x-lastPos.x;
        deltaY = pos.y-lastPos.y;

        updateXIDir([fProjMat[8], fProjMat[9], fProjMat[10]])

        // console.log((pos.x - lastPos.x) / deltaTime);

        
        matrixMultiply();

        update();


        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);

        // console.log(vertexData.length);

        gl.drawArrays(gl.TRIANGLES, 0, vertexData.length/3);

        // console.log("a");

        if(!canvasExist){
            cancelAnimationFrame(animate);
            return;
        }
    }

    requestAnimationFrame(animate);
}




function setVertexShader(gl){
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        precision highp float;

        const vec3 lightDirection = normalize(vec3(0,1.0,1.0));
        const float ambient = 0.3;

        attribute vec3 position;
        attribute vec2 texture;
        attribute vec3 normal;

        uniform mat4 matrix;
        uniform mat4 normalMatrix;

        varying vec3 vColor;
        varying float vBrightness;
        varying vec2 vTexture;

        void main(){
            vec3 worldNormal = (normalMatrix * vec4(normal, 1)).xyz;
            float diffuse = max(0.0, dot(worldNormal, lightDirection));

            vBrightness = ambient + (diffuse * 0.2);

            vTexture = texture;

            gl_Position = matrix * vec4(position, 1);
            vColor = vec3(1, texture);
        }
    `);
    gl.compileShader(vertexShader);
    return vertexShader;
}

function setFragmentShader(gl){
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,`
        precision mediump float;

        varying vec3 vColor;
        varying float vBrightness;
        varying vec2 vTexture;

        uniform sampler2D textureID;

        void main(){
            vec4 texel = texture2D(textureID, vTexture);
            vec4 color = vec4(0.7,0.3,0.3, 1);
            color.xyz *= vBrightness;
            gl_FragColor = color;
        }
    `);
    gl.compileShader(fragmentShader);
    return fragmentShader;
}

function createBuffer(gl, arr){
    const buffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
    return buffer;
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    const image = new Image();

    image.onload = e => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
    };

    image.src = url;
    return texture;
}

function createProgram(gl, vertexShader, fragmentShader){
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    return program;
}

function setAttribLocation(gl, buffer, program, name, n){
    const positionLocation = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(positionLocation, n, gl.FLOAT, false, 0, 0);
}