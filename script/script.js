const dropZone = document.getElementById("drop-zone");
const imagePreview = document.getElementById("image-preview");
const imageContainer = document.getElementById("image-container");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");

  const file = e.dataTransfer.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = (e) => {
      imageContainer.style.display = "flex";
      imagePreview.src = e.target.result;

      // Отримуємо розміри картинки і змінюємо розміри полотна
      const img = new Image();
      img.onload = () => {
        canvasEle.width = img.width;
        canvasEle.height = img.height;
        context.clearRect(0, 0, canvasEle.width, canvasEle.height);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
});

////////////////////////////
const canvasEle = document.getElementById("drawContainer");
const context = canvasEle.getContext("2d");

let isDrawStart = false;
let lines = [];

let selectedSquare = null;
let selectedLine = null;

const getClientOffset = (event) => {
  const { pageX, pageY } = event.touches ? event.touches[0] : event;
  const rect = canvasEle.getBoundingClientRect();
  const x = pageX - rect.left;
  const y = pageY - rect.top;

  return {
    x,
    y,
  };
};

const drawLine = (start, end) => {
  context.strokeStyle = "#ffffff";
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
};

const drawSquare = (position) => {
  context.fillStyle = "#ffffff";
  context.fillRect(position.x - 2.5, position.y - 2.5, 5, 5);
};

const mouseDownListener = (event) => {
  const position = getClientOffset(event);

  // Перевіряємо, чи клацнули на квадратик
  for (const line of lines) {
    for (const square of [line.start, line.end]) {
      const dx = square.x - position.x;
      const dy = square.y - position.y;
      if (Math.sqrt(dx * dx + dy * dy) < 2.5) {
        selectedSquare = square;
        selectedLine = line;
        return;
      }
    }
  }

  // Якщо не клацнули на квадратик, створюємо нову лінію
  isDrawStart = true;
  const newLine = { start: position, end: position };
  lines.push(newLine);
  selectedLine = newLine;
  drawSquare(position);
};

const mouseMoveListener = (event) => {
  if (isDrawStart && selectedLine) {
    const position = getClientOffset(event);
    selectedLine.end = position;
  } else if (selectedSquare) {
    const position = getClientOffset(event);
    selectedSquare.x = position.x;
    selectedSquare.y = position.y;
  }

  clearCanvas();
  for (const line of lines) {
    drawLine(line.start, line.end);
    drawSquare(line.start);
    drawSquare(line.end);

    const midPoint = {
      x: (line.start.x + line.end.x) / 2,
      y: (line.start.y + line.end.y) / 2,
    };
    drawSquare(midPoint);
  }
};

const mouseupListener = () => {
  isDrawStart = false;
  selectedSquare = null;
  selectedLine = null;
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvasEle.width, canvasEle.height);
};

canvasEle.addEventListener("mousedown", mouseDownListener);
canvasEle.addEventListener("mousemove", mouseMoveListener);
canvasEle.addEventListener("mouseup", mouseupListener);

canvasEle.addEventListener("touchstart", mouseDownListener);
canvasEle.addEventListener("touchmove", mouseMoveListener);
canvasEle.addEventListener("touchend", mouseupListener);
