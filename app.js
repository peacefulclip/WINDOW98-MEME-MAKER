const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = "490";
const CANVAS_HEIGHT = "485"
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.strokeStyle = "black"
ctx.lineWidth = 5;
ctx.lineCap = "round";

const brushSize = document.querySelector("#brush-size");
const brushSizeRangeBtn = document.querySelector("#brush-size-button");
const brushSizeRange = document.querySelector("#brush-size-range");

const brushFillStrokeBtn = document.querySelector("#brush-fill-stroke-button");
const brushFillStrokeRadio = document.querySelector("#brush-fill-stroke-radio");

const colors = document.getElementById("colors");
const colorOption = Array.from(document.getElementsByClassName("color-option"));



let isPainting = false;
let isFilling = false;

/*그리기*/
function moveBrush(event) {
    if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        if (isFilling) {
            ctx.fillStyle = colors.value;
            ctx.fill();
            return;
        }
        ctx.stroke();
        return
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPaint(event) {
    isPainting = true;
}

function endPaint(event) {
    isPainting = false;
    ctx.beginPath();
}

function controlBrushSize(event) {
    const newBrushSize = event.target.value;
    ctx.lineWidth = newBrushSize;
}

canvas.addEventListener("mousemove", moveBrush);
canvas.addEventListener("mousedown", startPaint);
canvas.addEventListener("mouseup", endPaint);

/*브러시 사이즈*/
brushSizeRangeBtn.addEventListener("click", function showBrushSizeRange(){
    brushSizeRange.classList.toggle("hidden");
});

brushSize.addEventListener("change", controlBrushSize);

/*브러시 stroke or fill*/
brushFillStrokeBtn.addEventListener("click", function showBrushFillStrokeRadio(){
    brushFillStrokeRadio.classList.toggle("hidden");
});

document.getElementById("Fill").addEventListener("change", brushFill);
document.getElementById("Stroke").addEventListener("change", brushStroke);

function brushFill() {
    isFilling = true;
}

function brushStroke() {
    isFilling = false;
}

/*브러시 background or draw*/

const brushPaintDrawBtn = document.getElementById("brush-paint-draw-button");

brushPaintDrawBtn.addEventListener("click", showBrushPaintDrawSwitch);

isBackgroundPainting = false;

const BACKGROUNDPAINT_IMG = "https://64.media.tumblr.com/32c3d9246dbf8237146e4b245ca4e410/4f38a22038f39816-ff/s540x810/3e28460155df564aca1266dda6f3e3dd75df603f.png";
const CANVASDRAW_IMG = "https://64.media.tumblr.com/7eebd65874419d4f2a52c8491e584281/77d5dc836f103511-b9/s540x810/8ad0c6c804941ac750881746087a66a1b3e34616.png";

function showBrushPaintDrawSwitch() {
    if (brushPaintDrawBtn.src === BACKGROUNDPAINT_IMG) {
        isBackgroundPainting = true;
        brushPaintDrawBtn.src = CANVASDRAW_IMG;
    } else if (brushPaintDrawBtn.src === CANVASDRAW_IMG) {
        isBackgroundPainting = false;
        brushPaintDrawBtn.src = BACKGROUNDPAINT_IMG;
        /*moveBrush();*/
    }
}

canvas.addEventListener("click", controlBgPaint);
function controlBgPaint() {
    if (isBackgroundPainting) {
        ctx.fillStyle = colors.value;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}


/*색깔 지정*/
function controlBrushColor(event) {
    const selectedColor = event.target.value;
    ctx.strokeStyle = selectedColor;
}

function controlBrushColorOption(event) {
    const selectedColorOption = event.target.dataset.color;
    ctx.strokeStyle = selectedColorOption;
    colors.value = selectedColorOption;
}

colors.addEventListener("change", controlBrushColor);
colorOption.forEach(color => color.addEventListener("click", controlBrushColorOption));


/*버튼 클릭*/

/*지우기*/
const eraseCanvasBtn = document.querySelector("#erase-canvas-button");
const eraseDrawingBtn = document.querySelector("#erase-drawing-button");

eraseCanvasBtn.addEventListener("click", eraseCanvas);
eraseDrawingBtn.addEventListener("click", eraseDrawing);

function eraseCanvas() {
    brushPaintDrawBtn.src = CANVASDRAW_IMG;
    canvas.addEventListener("mouseup", function eraseCanvasWhite() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        canvas.removeEventListener("mouseup", eraseCanvasWhite);
    });
    canvas.addEventListener("mousedown", function backToDraw() {
        ctx.restore();
    });
}

const ERASEDRAWING_IMG = "https://64.media.tumblr.com/8eb43eea9baa1389494b21600b9a4316/18b60a06d75e2e47-69/s540x810/23f2540950c70040058eb01144a70afa5a20439e.png";
const BACKTODRAWING_IMG = "https://64.media.tumblr.com/b60d2892aa531c1d3164571485316d07/3c3031ca10fb1453-ab/s540x810/59392d21323eb439383c6af5efd0ded1e20455ed.png";

eraseDrawingBtn.addEventListener("click", eraseDrawing);

function eraseDrawing() {
    ctx.strokeStyle = "white";
    isBackgroundPainting = false; /*지우는건 filling이 아니라 stroking이다*/
    brushPaintDrawBtn.src = BACKGROUNDPAINT_IMG;
}

const memeImage = document.querySelector("#meme-image");

memeImage.addEventListener("change", showMemeImage);

function showMemeImage(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = document.createElement("img");
    image.src = url;
    image.onload = function() {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

const memeText = document.querySelector("#meme-text");

canvas.addEventListener("dblclick", showMemeText);

function showMemeText(event) {
    const text = memeText.value;
    if (text !== "") {
        ctx.fillSltyle = colors.value;
        ctx.fillText(text, event.offsetX, event.offsetY);
    }
}


const memeTextSize = document.getElementById("meme-text-size");
const memeTextFont = document.getElementById("meme-text-font");

memeTextSize.addEventListener("input", controlMemeText);
memeTextFont.addEventListener("change", controlMemeText);

function controlMemeText() {
    const selectedFontSize = `${memeTextSize.value}px`;
    const selectedFont = memeTextFont.value;

    // Set the font size
    ctx.font = selectedFontSize;
  
    // Set the font family based on the selected font
    switch (selectedFont) {
        case "Workbench":
        case "Anton":
        case "Miltonian Tattoo":
            ctx.font = `${selectedFontSize} ${selectedFont}, Workbench`;
            break;
        default :
            ctx.font = "30px Workbench";
    }
}


const fileName = document.querySelector("#file-name");
const canvasDownloadBtn = document.querySelector("#canvas-download-button");

canvasDownloadBtn.addEventListener("click", canvasDownload);

function canvasDownload() {
   const url = canvas.toDataURL();
   const a = document.createElement("a");
   a.href = url;
   a.download = `${fileName.value}.jpg`;
   a.click();
}

