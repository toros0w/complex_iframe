import bus from "@/eventBus";
import { onUpdated, ref, watch } from "vue";

/*type ImageSize = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type Figure = {
  readonly id: string;
  points: Point[];
  background: string;
};

export type TContextMenuOptions = {
  isVisible: boolean;
  x: number;
  y: number;
};*/

export default function useCanvas() {
  const canvas = ref(null);
  const ctx = ref(null);
  const sourceImage = ref(null);
  const imageSize = ref(null);
  const figures = ref([]);
  const currentFigure = ref(null);
  const currentHoveredFigure = ref(null);
  const idFigureOnContextMenu = ref('');
  const contextMenuOptions = ref({
    isVisible: false,
    figure: null,
    x: 0,
    y: 0,
  });


  function clickHandler(e) {
    canvas.value = e.target;
    ctx.value = canvas.value.getContext("2d");
    if (!sourceImage.value || !ctx.value || !canvas.value) return;

    if (contextMenuOptions.value.isVisible) {
      contextMenuOptions.value.isVisible = false;
      return;
    }
    
    const x = e.clientX - canvas.value.getBoundingClientRect().left;
    const y = e.clientY - canvas.value.getBoundingClientRect().top;
    
    if (currentFigure.value === null) {
      currentFigure.value = [];
    }

    if (currentFigure.value !== null) {
      currentFigure.value.push({ x, y });

      if (isClosedFigure(currentFigure.value)) {
        bus.$emit('canvas:figure-added', {
          points: currentFigure.value,
          background: '173, 169, 219',
        })
        currentFigure.value = null;
      }
    }

    redraw();
  }

  function contextmenuHandler(e) {
    canvas.value = e.target
    ctx.value = canvas.value.getContext("2d");
    e.preventDefault();
    if (!sourceImage.value || !ctx.value || !canvas.value) return;

    if (currentFigure.value && currentFigure.value.length > 0) {
      currentFigure.value.pop();
      redraw();
    } else {
      const x = e.clientX - canvas.value.getBoundingClientRect().left;
      const y = e.clientY - canvas.value.getBoundingClientRect().top;
      for (const figure of figures.value) {
        const path = createFigurePath(figure.points);
        if (ctx.value.isPointInPath(path, x, y)) {
          idFigureOnContextMenu.value = figure.id;
          contextMenuOptions.value.isVisible = true
          contextMenuOptions.value.figure = figure
          contextMenuOptions.value.x = x
          contextMenuOptions.value.y = y
        }
      }

      return contextMenuOptions.value
    }

    return null
  }

  function mousemoveHandler(e) {
    canvas.value = e.target
    ctx.value = canvas.value.getContext("2d");
    if (!sourceImage.value || !ctx.value || !canvas.value) return;

    const x = e.clientX - canvas.value.getBoundingClientRect().left;
    const y = e.clientY - canvas.value.getBoundingClientRect().top;

    for (const figure of figures.value) {
      const path = createFigurePath(figure.points);
      if (ctx.value.isPointInPath(path, x, y)) {
        currentHoveredFigure.value = figure.id;
        redraw(true, figure.id);
        return;
      }
    }

    currentHoveredFigure.value = null;
    redraw();
  }

  function isClosedFigure(points) {
    if (points.length >= 3) {
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      const distanceX = Math.abs(firstPoint.x - lastPoint.x);
      const distanceY = Math.abs(firstPoint.y - lastPoint.y);
      return distanceX < 10 && distanceY < 10; // Check if the last point is close to the first point
    }
    return false;
  }

  function createFigurePath(points) {
    if (!points) return;

    const path = new Path2D();
    path.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y);
    }
    path.closePath();
    return path;
  }

  function calculateCenter(points) {
    if (points.length === 0) {
      return { x: 0, y: 0 };
    }

    let centerX = 0;
    let centerY = 0;
    for (const point of points) {
      centerX += point.x;
      centerY += point.y;
    }
    centerX /= points.length;
    centerY /= points.length;

    return { x: centerX, y: centerY };
  }

  function deleteFigure(id) {
    const index = figures.value.findIndex(
      (el) => el.id === id
    );
    if (index >= 0) figures.value.splice(index, 1);

    localStorage.setItem("figures", JSON.stringify(figures.value));

    redraw();
  }

  watch(sourceImage, () => redraw())

  const uploadImage = (file, canvasEl) => {
    canvas.value = canvasEl;
    ctx.value = canvas.value.getContext("2d");
    imageSize.value = localStorage.getItem("imageSize")
      ? JSON.parse(localStorage.getItem("imageSize"))
      : null;
    figures.value = localStorage.getItem("figures")
      ? JSON.parse(localStorage.getItem("figures"))
      : [];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const image = new Image();
          image.onload = () => {
            sourceImage.value = image;
            if (imageSize.value) {
              if (
                image.naturalWidth !== imageSize.value.width ||
                image.naturalHeight !== imageSize.value.height
              ) {
                localStorage.removeItem("figures");
                figures.value = [];
              }
            }
            localStorage.setItem(
              "imageSize",
              JSON.stringify({
                width: image.naturalWidth,
                height: image.naturalHeight,
              })
            );
            redraw();
          };
          image.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // onMounted(() => {
  //   window.addEventListener('resize', (e) => {
  //     if (canvas.value) {
  //       canvas.value.width = window.innerWidth
  //       redraw()
  //     }
  //   })
  // })
  function redraw(isHover, figureId) {

    console.log('redrawing');
    
    if (!ctx.value || !sourceImage.value || !canvas.value) return;
    canvas.value.width = sourceImage.value.naturalWidth;
    canvas.value.height = sourceImage.value.naturalHeight;
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    // Draw the image
    ctx.value.drawImage(
      sourceImage.value,
      0,
      0,
      sourceImage.value.naturalWidth,
      sourceImage.value.naturalHeight
    );
    for (const figure of figures.value) {
      ctx.value.fillStyle = `rgba(${figure.background}, ${isHover && figureId == figure.id ? '0.8' : '0.5'})`;
      ctx.value.fill(createFigurePath(figure.points));
    }
    if (currentFigure.value !== null) {
      ctx.value.fillStyle = "red";
      ctx.value.strokeStyle = "blue";
      for (let i = 0; i < currentFigure.value.length; i++) {
        const point = currentFigure.value[i];
        ctx.value.beginPath();
        ctx.value.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.value.fill();
        if (i > 0) {
          const prevPoint = currentFigure.value[i - 1];
          ctx.value.moveTo(prevPoint.x, prevPoint.y);
          ctx.value.lineTo(point.x, point.y);
          ctx.value.stroke();
        }
      }
    }
  }

  function getRandomColor() {
    const usedColors = new Set(figures.value.map((figure) => figure.background));
    const availableColors = [
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#33FFFF",
      "#FFFF33",
      "#FF33FF",
    ];
    const unusedColors = availableColors.filter(
      (color) => !usedColors.has(hexToRgb(color))
    );
    if (unusedColors.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedColors.length);
      return unusedColors[randomIndex].startsWith("#")
        ? hexToRgb(unusedColors[randomIndex])
        : unusedColors[randomIndex];
    } else {
      // Если все цвета использованы, генерируем случайный цвет
      const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`;
      return randomColor.startsWith("#")
        ? hexToRgb(randomColor)
        : hexToRgb(randomColor);
    }
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const objColor = result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;

    return objColor ? `${objColor.r},${objColor.g},${objColor.b}` : null;
  }

  function randomId(length = 6) {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }

  return {
    figures,
    sourceImage,
    idFigureOnContextMenu,
    contextMenuOptions,
    clickHandler,
    contextmenuHandler,
    mousemoveHandler,
    uploadImage,
    deleteFigure,
    canvas,
    imageSize,
    ctx
  };
}
