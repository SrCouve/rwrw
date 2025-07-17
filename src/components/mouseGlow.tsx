import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function MouseGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastParticleTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Throttle particle creation
      const now = Date.now();
      if (now - lastParticleTime.current > 30) {
        lastParticleTime.current = now;
        
        // Add new particles
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.8,
            vy: Math.random() * 0.8 + 0.3,
            life: 1,
            maxLife: Math.random() * 1.2 + 1.5
          });
        }
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.01; // Pequena gravidade
        particle.life -= 0.008;
        
        if (particle.life <= 0) return false;

        const alpha = particle.life / particle.maxLife;
        const size = (1 - alpha) * 4 + 2;

        try {
          // Desenhar núcleo brilhante
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(147, 51, 234, ${alpha * 0.6})`;
          
          // Criar gradiente mais definido
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size
          );
          
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
          gradient.addColorStop(0.2, `rgba(196, 125, 255, ${alpha * 0.8})`);
          gradient.addColorStop(0.6, `rgba(147, 51, 234, ${alpha * 0.5})`);
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Resetar shadow
          ctx.shadowBlur = 0;
          
          // Adicionar pequeno ponto brilhante no centro
          if (alpha > 0.3) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        } catch (error) {
          console.warn('Error drawing particle:', error);
        }

        return true;
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'lighten' }}
    />
  );
} 