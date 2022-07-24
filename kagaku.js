// #region VARS
const can = document.getElementById('can');
const ctx = can.getContext("2d");
const ratio = 20;
const fps = 50;
const maxWidth = Math.floor(window.innerWidth / ratio);
const maxHeight = Math.floor(window.innerHeight / ratio);
let frameCount = 0;
let g = { // GRAVITY VALUE
    x: 0,   //1 > RIGHT -1 > LEFT
    y: 1    //1 > DOWN -1 > UP
}
// #endregion

// #region FUNCS

// #region -- MISC
let fullsize = () => {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
}; fullsize();

let randomRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

let make2DArray = (rows, cols) => {
	let x = [];
	for (let i = 0; i < rows; i++) {
		x[i] = [];
		for (let j = 0; j < cols; j++) {
			x[i][j] = 0;
		}
	}
	return x;
};
// #endregion

// #region -- CANVAS
let clear = () => {
	ctx.clearRect(0, 0, can.width, can.height);
};

let drawRect = (x, y, w, h, colorInt = "rgba(0, 0, 0, 0)", colorExt="#000") => {
    ctx.beginPath();
    ctx.fillStyle = colorInt;
    ctx.strokeStyle = colorExt;
    ctx.rect(x, y, w, h);
    ctx.fill();
    // ctx.stroke();
};

let drawSandbox = (arr) => {

    // vars to center sandbox on screen
    let xcent = (window.innerWidth - arr.length*ratio)/2;
    let ycent = (window.innerHeight - arr[0].length*ratio)/2;

    let colInt = "#000";

    for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[0].length; j++) {

            switch (arr[i][j]) {
                // AIR
                case 0:
                    colInt = "rgba(0, 0, 0, 0.8)";
                    break;
                    
                // WATER
                case 1:
                    colInt = "rgba(0, 100, 255, 0.5)";
                    break;
                
                // LAVA
                case 2:
                    colInt = "rgba(255, 80, 0, 0.9)";
                    break;
                
                // LAVA
                case 3:
                    colInt = "rgba(255, 80, 0, 0.9)";
                    break;

            }
			drawRect(xcent+i*ratio, ycent+j*ratio, ratio, ratio, colInt, "#000");

		}
	}

};
// #endregion

// #region -- AUTOMATA
let automata = (arr) => {

    let nextArr = arr;

    for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[0].length; j++) {

            switch (arr[i][j]) {
                // WATER
                case 1:
                    if(i>0 && i<arr.length-1 && arr[i+g.x][j+g.y] == 0) {
                        nextArr[i+g.x][j+g.y] = 1;
                        nextArr[i][j] = 0;
                    }
                    break;
                
                // LAVA
                // case 2:
                //     if(i>0 && i<arr.length-1 && arr[i][j-1] == 0) {
                //         nextArr[i][j-1] = 2;
                //         nextArr[i][j] = 0;
                //     }
                //     break;
            }

		}
	}

    return nextArr;

};
// #endregion

// #region -- PHYSICS
let gravityAxis = (x, y) => {
    g.x = x;
    g.y = y;
}
//#endregion

// #endregion

// INTERCEPT
let sandboxArray = make2DArray(maxWidth, maxHeight);
sandboxArray[Math.floor(sandboxArray.length/2)][Math.floor(sandboxArray[0].length/2)] = 1;
sandboxArray[Math.floor(sandboxArray.length/4)][Math.floor(sandboxArray[0].length/2)] = 1;
sandboxArray[Math.floor(sandboxArray.length/4)][Math.floor(sandboxArray[0].length/4)] = 2;

document.getElementById("gravU").onclick = function(event) { gravityAxis(0, -1); }
document.getElementById("gravD").onclick = function(event) { gravityAxis(0, 1); }
document.getElementById("gravL").onclick = function(event) { gravityAxis(-1, 0); }
document.getElementById("gravR").onclick = function(event) { gravityAxis(1, 0); }
document.getElementById("gravS").onclick = function(event) { gravityAxis(0, 0); }

// MAIN LOOP
let loop = () => {
    clear();

    sandboxArray = automata(sandboxArray);
    // sandboxArray[Math.floor(sandboxArray.length/2)][Math.floor(sandboxArray[0].length/2)] = 1;
    
    frameCount++;
    drawSandbox(sandboxArray);
};
// window.requestAnimationFrame(loop);

setInterval(loop, fps);

