import { useEffect, useRef } from "react";

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
 
    let animFrame: number;
 
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
 
    // Icon types: 'bubble-sm', 'bubble-md', 'bubble-lg', 'dot', 'ring', 'plus', 'line'
    type IconType = "bubble-sm" | "bubble-md" | "bubble-lg" | "dot" | "ring" | "plus" | "dash";
 
    const icons: {
      x: number; y: number; type: IconType; size: number;
      opacity: number; speed: number; drift: number; phase: number;
    }[] = [];
 
    const types: IconType[] = ["bubble-sm", "bubble-md", "bubble-lg", "dot", "ring", "plus", "dash"];
    for (let i = 0; i < 160; i++) {
      icons.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        type: types[Math.floor(Math.random() * types.length)],
        size: 8 + Math.random() * 18,
        opacity: 0.04 + Math.random() * 0.1,
        speed: 0.1 + Math.random() * 0.25,
        drift: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }
 
    const drawBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, dots: number) => {
      const r = s;
      ctx.beginPath();
      ctx.moveTo(x - r, y);
      ctx.quadraticCurveTo(x - r, y - r, x, y - r);
      ctx.quadraticCurveTo(x + r, y - r, x + r, y);
      ctx.quadraticCurveTo(x + r, y + r * 0.65, x, y + r * 0.65);
      ctx.quadraticCurveTo(x - r * 0.3, y + r * 0.65, x - r * 0.55, y + r);
      ctx.quadraticCurveTo(x - r * 0.75, y + r * 0.65, x - r, y + r * 0.5);
      ctx.quadraticCurveTo(x - r, y + r * 0.25, x - r, y);
      ctx.stroke();
      if (dots > 0) {
        const dr = s * 0.12;
        const spacing = s * 0.3;
        for (let d = 0; d < dots; d++) {
          ctx.beginPath();
          ctx.arc(x + (d - (dots - 1) / 2) * spacing, y - s * 0.05, dr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
 
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;
 
      for (const icon of icons) {
        const bob = Math.sin(t * icon.speed * 6 + icon.phase) * 2;
        const ix = icon.x + Math.sin(t * icon.speed + icon.phase) * 8;
        const iy = icon.y + bob;
 
        ctx.save();
        ctx.globalAlpha = icon.opacity;
        ctx.strokeStyle = "#64748b";
        ctx.fillStyle = "#64748b";
        ctx.lineWidth = 1;
 
        switch (icon.type) {
          case "bubble-sm": drawBubble(ctx, ix, iy, icon.size * 0.7, 0); break;
          case "bubble-md": drawBubble(ctx, ix, iy, icon.size * 0.9, 3); break;
          case "bubble-lg": drawBubble(ctx, ix, iy, icon.size, 3); break;
          case "dot":
            ctx.beginPath();
            ctx.arc(ix, iy, icon.size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "ring":
            ctx.beginPath();
            ctx.arc(ix, iy, icon.size * 0.4, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case "plus": {
            const h = icon.size * 0.45;
            ctx.beginPath();
            ctx.moveTo(ix - h, iy); ctx.lineTo(ix + h, iy);
            ctx.moveTo(ix, iy - h); ctx.lineTo(ix, iy + h);
            ctx.stroke();
            break;
          }
          case "dash": {
            const w = icon.size * 0.55;
            ctx.beginPath();
            ctx.moveTo(ix - w, iy); ctx.lineTo(ix + w, iy);
            ctx.stroke();
            break;
          }
        }
        ctx.restore();
      }
 
      animFrame = requestAnimationFrame(draw);
    };
    draw();
 
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);
 
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: "#f5f6f8" }}
    />
  );
}