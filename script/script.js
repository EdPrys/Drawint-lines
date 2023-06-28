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

let startPosition = { x: 0, y: 0 };
let lineCoordinates = { x: 0, y: 0 };
let isDrawStart = false;

const getClientOffset = (event) => {
  const { pageX, pageY } = event.touches ? event.touches[0] : event;
  const rect = canvasEle.getBoundingClientRect(); // Отримуємо розміри та положення полотна
  const x = pageX - rect.left;
  const y = pageY - rect.top;

  return {
    x,
    y,
  };
};

const drawLine = () => {
  context.strokeStyle = "#ffffff";
  context.beginPath();
  context.moveTo(startPosition.x, startPosition.y);
  context.lineTo(lineCoordinates.x, lineCoordinates.y);
  context.stroke();
};

const drawSquare = (position) => {
  context.fillStyle = "#ffffff";
  context.fillRect(position.x - 2.5, position.y - 2.5, 5, 5);
};

const mouseDownListener = (event) => {
  startPosition = getClientOffset(event);
  isDrawStart = true;
  drawSquare(startPosition);
};

const mouseMoveListener = (event) => {
  if (!isDrawStart) return;

  lineCoordinates = getClientOffset(event);
  clearCanvas();
  drawLine();
};

const mouseupListener = (event) => {
  isDrawStart = false;
  drawSquare(lineCoordinates);
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
