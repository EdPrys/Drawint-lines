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
    };

    reader.readAsDataURL(file);
  }
});

////////////////////////////
var canv = document.getElementById("canvas");
var ctx = canv.getContext("2d");

canv.width = window.innerWidth;
canv.height = window.innerHeight;

var rectSize = 5; // Розмір квадрата
var isDrawing = false; // Оголошення змінної isDrawing
var startX, startY; // Зберігання координат квадрата

canv.addEventListener("click", function (event) {
  var x = event.clientX - canv.offsetLeft;
  var y = event.clientY - canv.offsetTop;

  if (!isDrawing) {
    // Перший клік - створення квадрата
    startX = x;
    startY = y;
    isDrawing = true;
  } else {
    // Другий клік - малювання лінії
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Малюємо квадрати
    ctx.fillStyle = "white"; // Колір квадратів
    ctx.fillRect(
      startX - rectSize / 2,
      startY - rectSize / 2,
      rectSize,
      rectSize
    );
    ctx.fillRect(x - rectSize / 2, y - rectSize / 2, rectSize, rectSize);

    isDrawing = false;
  }
});
