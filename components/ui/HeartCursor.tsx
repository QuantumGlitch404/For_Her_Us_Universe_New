import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
}

export const HeartCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const lastMouse = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      const dx = mouse.current.x - lastMouse.current.x;
      const dy = mouse.current.y - lastMouse.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 2) {
        addParticle(mouse.current.x, mouse.current.y);
        lastMouse.current = { ...mouse.current };
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const colors = ['#ff758c', '#ff7eb3', '#fda085', '#fff', '#ffd700'];

    const addParticle = (x: number, y: number) => {
      const count = Math.floor(Math.random() * 2) + 1; 
      for(let i=0; i<count; i++) {
        particles.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          size: Math.random() * 8 + 4,
          speedX: (Math.random() - 0.5) * 1,
          speedY: Math.random() * 1 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1.0
        });
      }
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number = 1) => {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.translate(x, y);
      
      ctx.beginPath();
      // Accurate heart path
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2 + size/2, 0, size);
      ctx.bezierCurveTo(0, (size + topCurveHeight) / 2 + size/2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      
      ctx.fill();
      ctx.restore();
    };
    
    const drawCursor = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        // Shadow/Outline
        drawHeart(ctx, x, y, 16, 'rgba(255, 255, 255, 0.5)', 0.5);
        // Main Cursor
        drawHeart(ctx, x, y, 12, '#ec4899', 1.0); // Pink-500
    };

    let animationFrameId: number;

    const animate = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trails
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.life -= 0.02;
        p.x += p.speedX;
        p.y += p.speedY;
        p.size *= 0.95;

        if (p.life > 0) {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.life);
        } else {
          particles.current.splice(i, 1);
          i--;
        }
      }
      
      // Draw main cursor only if mouse has moved onto screen
      if (mouse.current.x >= 0) {
          drawCursor(ctx, mouse.current.x, mouse.current.y);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};