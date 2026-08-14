import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

const CELL_SIZE = 12;
const LEVELS = [0.2, 0.35, 0.5, 0.65, 0.8];

type TopographicBackgroundProps = {
  color1: string;
  color2: string;
};

const TopographicBackground = ({color1, color2,}: TopographicBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const noise2D = createNoise2D();

    let time = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function getNoise(x: number, y: number) {
      return (
        noise2D(
          x * 0.004 + time,
          y * 0.004 + time
        ) *
          0.5 +
        0.5
      );
    }

    function draw() {
      time += 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = color1; // "rgba(116, 150, 127, 0.25)";
      ctx.lineWidth = 1;

      const cols = Math.ceil(canvas.width / CELL_SIZE);
      const rows = Math.ceil(canvas.height / CELL_SIZE);

      const field: number[][] = [];

      for (let y = 0; y <= rows; y++) {
        field[y] = [];

        for (let x = 0; x <= cols; x++) {
          field[y][x] = getNoise(
            x * CELL_SIZE,
            y * CELL_SIZE
          );
        }
      }

      LEVELS.forEach((level) => {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const tl = field[y][x];
            const tr = field[y][x + 1];
            const br = field[y + 1][x + 1];
            const bl = field[y + 1][x];

            let state = 0;

            if (tl > level) state |= 8;
            if (tr > level) state |= 4;
            if (br > level) state |= 2;
            if (bl > level) state |= 1;

            const px = x * CELL_SIZE;
            const py = y * CELL_SIZE;

            const top = {
              x:
                px +
                CELL_SIZE *
                  ((level - tl) / (tr - tl)),
              y: py,
            };

            const right = {
              x: px + CELL_SIZE,
              y:
                py +
                CELL_SIZE *
                  ((level - tr) / (br - tr)),
            };

            const bottom = {
              x:
                px +
                CELL_SIZE *
                  ((level - bl) / (br - bl)),
              y: py + CELL_SIZE,
            };

            const left = {
              x: px,
              y:
                py +
                CELL_SIZE *
                  ((level - tl) / (bl - tl)),
            };

            ctx.beginPath();

            switch (state) {
              case 1:
              case 14:
                ctx.moveTo(left.x, left.y);
                ctx.lineTo(bottom.x, bottom.y);
                break;

              case 2:
              case 13:
                ctx.moveTo(bottom.x, bottom.y);
                ctx.lineTo(right.x, right.y);
                break;

              case 3:
              case 12:
                ctx.moveTo(left.x, left.y);
                ctx.lineTo(right.x, right.y);
                break;

              case 4:
              case 11:
                ctx.moveTo(top.x, top.y);
                ctx.lineTo(right.x, right.y);
                break;

              case 6:
              case 9:
                ctx.moveTo(top.x, top.y);
                ctx.lineTo(bottom.x, bottom.y);
                break;

              case 7:
              case 8:
                ctx.moveTo(left.x, left.y);
                ctx.lineTo(top.x, top.y);
                break;

              case 5:
                ctx.moveTo(top.x, top.y);
                ctx.lineTo(left.x, left.y);

                ctx.moveTo(right.x, right.y);
                ctx.lineTo(bottom.x, bottom.y);
                break;

              case 10:
                ctx.moveTo(top.x, top.y);
                ctx.lineTo(right.x, right.y);

                ctx.moveTo(left.x, left.y);
                ctx.lineTo(bottom.x, bottom.y);
                break;
            }

            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: color2, //"#f9f9f9",
      }}
    />
  );
}

export default TopographicBackground;