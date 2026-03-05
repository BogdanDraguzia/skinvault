'use client';

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Video layer */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-50"
        style={{ filter: 'blur(2px)' }}
      >
        <source src="/csgo-gameplay.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,14,26,0.4) 0%, rgba(10,14,26,0.3) 50%, rgba(10,14,26,0.5) 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(10,14,26,0.6) 100%)',
        }}
      />
    </div>
  );
}
