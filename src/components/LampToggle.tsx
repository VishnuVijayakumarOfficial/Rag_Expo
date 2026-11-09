import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LampToggleProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LampToggle: React.FC<LampToggleProps> = ({ theme, onToggleTheme }) => {
  const isLight = theme === 'light';

  // State for drag and spring physics
  // Lamp head offset relative to anchor
  const [lampPos, setLampPos] = useState({ x: 0, y: 0, tilt: 0 });
  // Knob extra pull offset
  const [cordPullY, setCordPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'lamp' | 'knob' | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // References for drag tracking and animation
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Synthesize realistic mechanical pull switch click using Web Audio API
  const playClickSound = useCallback((turningOn: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Primary mechanical contact click
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(turningOn ? 850 : 550, now);
      osc1.frequency.exponentialRampToValueAtTime(turningOn ? 320 : 220, now + 0.035);

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Secondary spring snap click
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const t2 = now + 0.026;
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(turningOn ? 1050 : 450, t2);
      osc2.frequency.exponentialRampToValueAtTime(160, t2 + 0.028);

      gain2.gain.setValueAtTime(0.14, t2);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.032);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.036);
    } catch {
      // Audio autoplay policy fallback (silent)
    }
  }, []);

  // Spring physics solver on release
  const startSpringReturn = useCallback(
    (
      startLampPos: { x: number; y: number; tilt: number },
      startCordPullY: number,
      initialVelLampY = 0,
      initialVelCordY = 0
    ) => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const phys = {
        lampX: startLampPos.x,
        lampY: startLampPos.y,
        tilt: startLampPos.tilt,
        cordPullY: startCordPullY,
        velLampX: 0,
        velLampY: initialVelLampY,
        velTilt: 0,
        velCordPullY: initialVelCordY,
      };

      let lastTime = performance.now();

      const loop = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.032);
        lastTime = now;

        // Spring constants
        const kLamp = 240;
        const dLamp = 15;
        const kCord = 320;
        const dCord = 18;
        const kTilt = 220;
        const dTilt = 14;

        // Lamp X & Y spring acceleration
        const accLampX = -kLamp * phys.lampX - dLamp * phys.velLampX;
        const accLampY = -kLamp * phys.lampY - dLamp * phys.velLampY;
        const accTilt = -kTilt * phys.tilt - dTilt * phys.velTilt;
        const accCord = -kCord * phys.cordPullY - dCord * phys.velCordPullY;

        phys.velLampX += accLampX * dt;
        phys.velLampY += accLampY * dt;
        phys.velTilt += accTilt * dt;
        phys.velCordPullY += accCord * dt;

        phys.lampX += phys.velLampX * dt;
        phys.lampY += phys.velLampY * dt;
        phys.tilt += phys.velTilt * dt;
        phys.cordPullY += phys.velCordPullY * dt;

        setLampPos({ x: phys.lampX, y: phys.lampY, tilt: phys.tilt });
        setCordPullY(phys.cordPullY);

        // Check if settled
        const isSettled =
          Math.abs(phys.lampX) < 0.15 &&
          Math.abs(phys.lampY) < 0.15 &&
          Math.abs(phys.tilt) < 0.15 &&
          Math.abs(phys.cordPullY) < 0.15 &&
          Math.abs(phys.velLampX) < 0.5 &&
          Math.abs(phys.velLampY) < 0.5 &&
          Math.abs(phys.velCordPullY) < 0.5;

        if (!isSettled) {
          animFrameRef.current = requestAnimationFrame(loop);
        } else {
          setLampPos({ x: 0, y: 0, tilt: 0 });
          setCordPullY(0);
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(loop);
    },
    []
  );

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Pointer Down - start drag or prepare click on container
  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);

    // Determine target based on clicked element or relative vertical coordinate
    const targetEl = e.target as HTMLElement | SVGElement | null;
    const isKnob = targetEl?.closest('.lamp-pull-cord');
    if (isKnob) {
      setDragTarget('knob');
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      setDragTarget(relativeY > rect.height * 0.7 ? 'knob' : 'lamp');
    }
  };

  // Pointer Move - real-time movement during drag
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rawDx = e.clientX - pointerStartRef.current.x;
    const rawDy = e.clientY - pointerStartRef.current.y;

    if (dragTarget === 'knob') {
      // Pulling the cord knob downwards
      // Limit stretch with soft resistance curve
      const clampedCordY = rawDy > 0 ? Math.min(rawDy * 0.9, 115) : Math.max(rawDy * 0.3, -20);
      const clampedCordX = Math.max(-40, Math.min(40, rawDx * 0.5));

      setCordPullY(clampedCordY);
      // Slight tension pulls the lamp down and tilts slightly
      setLampPos({
        x: clampedCordX * 0.22,
        y: clampedCordY * 0.18,
        tilt: clampedCordX * 0.25,
      });
    } else {
      // Dragging the lamp shade / fixture itself
      const clampedX = Math.max(-85, Math.min(85, rawDx * 0.75));
      const clampedY = rawDy > 0 ? Math.min(rawDy * 0.7, 95) : Math.max(rawDy * 0.4, -30);
      const tiltAngle = Math.max(-28, Math.min(28, clampedX * 0.32));

      setLampPos({
        x: clampedX,
        y: clampedY,
        tilt: tiltAngle,
      });
      // Cord swings with inertia
      setCordPullY(Math.max(-8, Math.min(35, clampedY * 0.28)));
    }
  };

  // Pointer Up - release drag or click
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already released
    }

    const rawDx = e.clientX - pointerStartRef.current.x;
    const rawDy = e.clientY - pointerStartRef.current.y;
    const totalDist = Math.hypot(rawDx, rawDy);

    // Determine if it was a click or a meaningful pull drag
    const isClick = totalDist < 6;
    const isPullTrigger = rawDy > 16 || cordPullY > 16 || totalDist > 25;

    if (isClick || isPullTrigger) {
      // Toggle theme!
      onToggleTheme();
      playClickSound(!isLight);
    }

    setIsDragging(false);
    setDragTarget(null);

    // Snap back with realistic spring vibration
    const releaseVelY = isClick ? 85 : 0;
    const releaseCordVelY = isClick ? 110 : 0;
    startSpringReturn(lampPos, cordPullY, releaseVelY, releaseCordVelY);
  };

  // Quick keyboard toggle (Enter / Space)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleTheme();
      playClickSound(!isLight);
      // Play a quick physical bounce
      setCordPullY(22);
      setLampPos({ x: 0, y: 8, tilt: 0 });
      startSpringReturn({ x: 0, y: 8, tilt: 0 }, 22, 90, 120);
    }
  };

  // Geometry calculations (scaled for 50% screen height pendant lamp)
  // Fixed ceiling anchor point
  const anchorX = 55;
  const anchorY = 0;

  // Dynamic lamp head coordinates - drops ~60% down the 50vh container
  const lampX = anchorX + lampPos.x;
  const lampY = 280 + lampPos.y;

  // Shade dimensions - bold, elegant Scandinavian dome
  const shadeTopW = 22;
  const shadeBottomW = 68;
  const shadeHeight = 42;

  // Socket at top of shade
  const socketY = lampY - 6;

  // Bulb center (underneath shade)
  const bulbX = lampX;
  const bulbY = lampY + shadeHeight + 3;

  // Pull chain attachment point (from center under lamp)
  const chainStartX = lampX;
  const chainStartY = lampY + shadeHeight + 10;

  // Pull cord length at rest - generous drop
  const cordRestLength = 62;
  const knobX = lampX + (dragTarget === 'knob' ? lampPos.x * 0.45 : 0);
  const knobY = chainStartY + cordRestLength + cordPullY;

  return (
    <div
      ref={containerRef}
      className={`lamp-toggle-container ${isDragging ? 'is-dragging' : ''} ${isLight ? 'lamp-on' : 'lamp-off'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handleContainerPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Current mode: ${theme}. Click or drag lamp to switch theme.`}
      title={`Click or drag lamp to switch to ${isLight ? 'Dark' : 'Light'} mode`}
    >
      <svg
        className="lamp-svg"
        viewBox="0 0 110 490"
        style={{ overflow: 'visible' }}
      >
        {/* Invisible hit testing background */}
        <rect width="110" height="490" fill="transparent" />
        <defs>
          {/* Ceiling canopy gradient */}
          <linearGradient id="canopyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#9088b2' : '#5a4d80'} />
            <stop offset="100%" stopColor={isLight ? '#5f24ec' : '#231846'} />
          </linearGradient>

          {/* Brass / Gold accents */}
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe680" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="80%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Lamp shade gradient - Light mode (clean elegant ceramic violet/white) */}
          <linearGradient id="shadeGradLight" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f4effe" />
            <stop offset="85%" stopColor="#ded1fa" />
            <stop offset="100%" stopColor="#c5b2f2" />
          </linearGradient>

          {/* Lamp shade gradient - Dark mode (cosmic dark obsidian with neon violet edge) */}
          <linearGradient id="shadeGradDark" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#32255c" />
            <stop offset="45%" stopColor="#201740" />
            <stop offset="85%" stopColor="#140e2b" />
            <stop offset="100%" stopColor="#0c081d" />
          </linearGradient>

          {/* Bulb Gradient - ON (Warm glowing sun amber) */}
          <radialGradient id="bulbGradOn" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fff7bd" />
            <stop offset="65%" stopColor="#ffb703" />
            <stop offset="100%" stopColor="#fb8500" />
          </radialGradient>

          {/* Bulb Gradient - OFF (Smoky translucent violet glass) */}
          <radialGradient id="bulbGradOff" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#7a6e9f" />
            <stop offset="50%" stopColor="#45396b" />
            <stop offset="100%" stopColor="#251c4a" />
          </radialGradient>

          {/* Bulb glow filter */}
          <filter id="bulbGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft light cone beam gradient */}
          <linearGradient id="lightBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 230, 90, 0.38)" />
            <stop offset="35%" stopColor="rgba(255, 215, 60, 0.18)" />
            <stop offset="70%" stopColor="rgba(255, 200, 40, 0.05)" />
            <stop offset="100%" stopColor="rgba(255, 190, 20, 0)" />
          </linearGradient>
        </defs>

        {/* 1. Ceiling Canopy Mount */}
        <g className="lamp-canopy" style={{ pointerEvents: 'auto', cursor: 'grab' }}>
          <rect
            x={anchorX - 19}
            y={anchorY}
            width={38}
            height={7}
            rx={3.5}
            fill="url(#canopyGrad)"
            stroke={isLight ? '#cfc1f3' : '#41326d'}
            strokeWidth="0.8"
          />
          <circle cx={anchorX} cy={anchorY + 7} r={2.8} fill="url(#brassGrad)" />
        </g>

        {/* 2. Main Suspension Cable */}
        <line
          x1={anchorX}
          y1={anchorY + 7}
          x2={lampX}
          y2={socketY}
          stroke={isLight ? '#594a86' : '#8c78bf'}
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Invisible Cable Hit Area for easy grabbing */}
        <line
          x1={anchorX}
          y1={anchorY + 7}
          x2={lampX}
          y2={socketY}
          stroke="transparent"
          strokeWidth="22"
          style={{
            pointerEvents: 'auto',
            cursor: isDragging && dragTarget === 'lamp' ? 'grabbing' : 'grab',
          }}
        />

        {/* 3. Radiant Light Cone (Visible in Light Mode, hidden in Dark Mode) */}
        <polygon
          className={`lamp-light-beam ${isLight ? 'beam-active' : ''}`}
          points={`
            ${lampX - shadeBottomW / 2 + 4},${lampY + shadeHeight}
            ${lampX + shadeBottomW / 2 - 4},${lampY + shadeHeight}
            ${lampX + 85},${lampY + 280}
            ${lampX - 85},${lampY + 280}
          `}
          fill="url(#lightBeamGrad)"
          style={{
            opacity: isLight ? 1 : 0,
            transformOrigin: `${lampX}px ${lampY}px`,
            transition: isDragging ? 'none' : 'opacity 0.35s ease',
            pointerEvents: 'none',
          }}
        />

        {/* 4. Lamp Head Group (Shade, Socket, Bulb) */}
        <g
          className="lamp-head"
          style={{
            pointerEvents: 'auto',
            cursor: isDragging && dragTarget === 'lamp' ? 'grabbing' : 'grab',
            transform: `rotate(${lampPos.tilt}deg)`,
            transformOrigin: `${lampX}px ${lampY}px`,
          }}
        >
          {/* Metallic Socket */}
          <rect
            x={lampX - 7}
            y={socketY}
            width={14}
            height={7}
            rx={2}
            fill="url(#brassGrad)"
            stroke="#92400e"
            strokeWidth="0.5"
          />

          {/* Glowing Bulb (Behind shade rim) */}
          <ellipse
            cx={bulbX}
            cy={bulbY}
            rx={11.5}
            ry={10.5}
            fill={isLight ? 'url(#bulbGradOn)' : 'url(#bulbGradOff)'}
            filter={isLight ? 'url(#bulbGlow)' : undefined}
            stroke={isLight ? '#fb8500' : '#45386d'}
            strokeWidth={isLight ? '1' : '0.8'}
          />

          {/* Filament inside bulb */}
          <path
            d={`M ${bulbX - 4.5} ${bulbY + 4} Q ${bulbX - 2.2} ${bulbY - 3.5} ${bulbX} ${bulbY + 1} Q ${bulbX + 2.2} ${bulbY - 3.5} ${bulbX + 4.5} ${bulbY + 4}`}
            fill="none"
            stroke={isLight ? '#ffffff' : isHovered ? '#ffc043' : '#64548e'}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Lamp Shade Dome */}
          <path
            d={`
              M ${lampX - shadeTopW / 2} ${lampY}
              C ${lampX - shadeTopW / 2 - 3} ${lampY + 12}, ${lampX - shadeBottomW / 2} ${lampY + shadeHeight - 3}, ${lampX - shadeBottomW / 2} ${lampY + shadeHeight}
              L ${lampX + shadeBottomW / 2} ${lampY + shadeHeight}
              C ${lampX + shadeBottomW / 2} ${lampY + shadeHeight - 3}, ${lampX + shadeTopW / 2 + 3} ${lampY + 12}, ${lampX + shadeTopW / 2} ${lampY}
              Z
            `}
            fill={isLight ? 'url(#shadeGradLight)' : 'url(#shadeGradDark)'}
            stroke={isLight ? '#d2c2f7' : '#57428f'}
            strokeWidth="1.4"
          />

          {/* Metallic Trim Band at bottom of shade */}
          <path
            d={`
              M ${lampX - shadeBottomW / 2} ${lampY + shadeHeight}
              L ${lampX + shadeBottomW / 2} ${lampY + shadeHeight}
            `}
            stroke="url(#brassGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Delicate Highlight on Shade */}
          <path
            d={`
              M ${lampX - shadeTopW / 2 + 4} ${lampY + 4}
              C ${lampX - shadeTopW / 2 + 2} ${lampY + 10}, ${lampX - shadeBottomW / 2 + 7} ${lampY + shadeHeight - 5}, ${lampX - shadeBottomW / 2 + 8} ${lampY + shadeHeight - 3}
            `}
            fill="none"
            stroke={isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(167, 126, 255, 0.35)'}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>

        {/* 5. Pull Chain & Knob */}
        <g
          className="lamp-pull-cord"
          style={{
            pointerEvents: 'auto',
            cursor: isDragging && dragTarget === 'knob' ? 'grabbing' : 'grab',
          }}
        >
          {/* Beaded Chain line */}
          <line
            x1={chainStartX}
            y1={chainStartY}
            x2={knobX}
            y2={knobY - 8}
            stroke="url(#brassGrad)"
            strokeWidth="2.6"
            strokeDasharray="2 4"
            strokeLinecap="round"
          />

          {/* Pull Knob / Droplet Bead */}
          <g transform={`translate(${knobX}, ${knobY})`}>
            {/* Halo when hovered or dragged */}
            {(isHovered || isDragging) && (
              <circle
                cx={0}
                cy={0}
                r={13}
                fill={isLight ? 'rgba(245, 158, 11, 0.28)' : 'rgba(167, 126, 255, 0.32)'}
                filter="blur(2.5px)"
              />
            )}

            {/* Brass Knob Teardrop */}
            <ellipse
              cx={0}
              cy={0}
              rx={6.2}
              ry={8.5}
              fill="url(#brassGrad)"
              stroke="#92400e"
              strokeWidth="0.9"
            />

            {/* Specular highlight on knob */}
            <ellipse cx={-1.8} cy={-2.4} rx={1.8} ry={2.8} fill="#ffffff" opacity={0.75} />
          </g>
        </g>
      </svg>

      {/* Subtle floating hint tag */}
      <span className="lamp-hint-pill" aria-hidden="true">
        {isLight ? 'Pull for Dark' : 'Pull for Light'}
      </span>
    </div>
  );
};
