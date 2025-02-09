import { useEffect, useRef } from "react";
import styled from "styled-components";

interface CanvasProps {
  width: number;
  height: number;
  onDraw: (ctx: CanvasRenderingContext2D) => void;
}

const Canvas: React.FC<CanvasProps> = ({ width, height, onDraw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Execute drawing function
    onDraw(ctx);
  }, [width, height, onDraw]);

  return <CanvasElement ref={canvasRef} width={width} height={height} />;
};

export default Canvas;

const CanvasElement = styled.canvas`
  width: 100%;
  height: 100%;
`;
