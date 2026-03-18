import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Twitter, Instagram } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// ========================
// CONFIGURATION — Adjust these to sync with your MP4
// ========================
const DROP_IMPACT_TIME = 2.5;  // seconds into the video when the drop hits the surface
// ========================

const LandingPage: React.FC = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroTriggeredRef = useRef(false); // Prevents re-triggers

  // Once hero is visible, dim the background shortly after
  useEffect(() => {
    if (!heroVisible) return;
    const dimTimer = setTimeout(() => {
      setVideoEnded(true);
    }, 1500);
    return () => clearTimeout(dimTimer);
  }, [heroVisible]);

  // Handle video time updates — trigger hero at drop impact
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || heroTriggeredRef.current) return;
    if (video.currentTime >= DROP_IMPACT_TIME) {
      heroTriggeredRef.current = true;
      setHeroVisible(true);
    }
  }, []);

  // Freeze on the last frame when video ends
  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (video) video.pause();
  }, []);

  // Video is ready to play — start playback
  const handleCanPlayThrough = useCallback(() => {
    setVideoReady(true);
    const video = videoRef.current;
    if (video) {
      video.play().catch(e => console.warn('Autoplay blocked:', e));
    }
  }, []);

  // Set up event listeners once on mount only
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplaythrough', handleCanPlayThrough);

    // If the video is already loaded (cached), fire manually
    if (video.readyState >= 4) {
      handleCanPlayThrough();
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [handleTimeUpdate, handleEnded, handleCanPlayThrough]);

  return (
    <div className="min-h-screen relative flex flex-col bg-black overflow-hidden selection:bg-[#d32f2f] selection:text-white">
      
      {/* ===== LOADING STATE ===== */}
      {!videoReady && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <motion.div
            className="w-2 h-2 bg-[#d32f2f] rounded-full"
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
      )}

      {/* ===== FIXED VIDEO BACKGROUND ===== */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover transition-[filter] duration-500 will-change-[filter]"
          style={{ filter: videoEnded ? 'blur(6px)' : 'none' }}
        >
          <source src="/1058001805-preview.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay — fades in after dim */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoEnded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* ===== ALWAYS-VISIBLE CONTENT (Nav, Logo, Socials) ===== */}
      <nav className="relative z-20 flex justify-between items-center px-8 lg:px-16 py-6 w-full">
        {/* Top Left — Lottie Logo + Links */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden">
            <DotLottieReact
              src="https://lottie.host/1ae66548-84d6-4422-bb41-b31c5f9eb0bb/HoHG9ekGrU.lottie"
              loop
              autoplay
            />
          </div>
          <div className="hidden sm:flex gap-8 font-medium text-sm uppercase tracking-widest text-white/70">
            <a href="#about" className="transition-colors duration-300 hover:text-[#d32f2f]">About</a>
            <a href="#work" className="transition-colors duration-300 hover:text-[#d32f2f]">Work</a>
          </div>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="font-japanese text-3xl lg:text-4xl tracking-[0.25em] text-white drop-shadow-xl">
            NINJA
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5 text-white/70">
          <a href="#" className="transition-all duration-300 hover:-translate-y-1 hover:text-[#d32f2f]"><Github size={18} /></a>
          <a href="#" className="transition-all duration-300 hover:-translate-y-1 hover:text-[#d32f2f]"><Twitter size={18} /></a>
          <a href="#" className="transition-all duration-300 hover:-translate-y-1 hover:text-[#d32f2f]"><Instagram size={18} /></a>
        </div>
      </nav>

      {/* ===== HERO CONTENT — Revealed only when drop hits ===== */}
      <main className="relative z-10 flex-1 flex items-center justify-center text-center px-8 py-16">
        <motion.div
          className="max-w-3xl flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={heroVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white/5 text-white/80 px-5 py-2 rounded-full text-xs uppercase tracking-[0.2em] backdrop-blur-sm border border-white/10">
            Cinematic Experience
          </div>

          <h1 className="text-5xl lg:text-7xl leading-tight font-japanese text-white m-0 drop-shadow-2xl">
            The Art of <br />
            <span className="text-[#d32f2f] text-6xl lg:text-8xl inline-block mt-2 drop-shadow-[0_0_20px_rgba(211,47,47,0.6)]">
              Mastery
            </span>
          </h1>

          <p className="text-lg leading-relaxed text-white/80 max-w-2xl mb-6 font-light">
            Crafting fluid, cinematic, and high-performance digital experiences driven purely by organic motion and minimal aesthetics.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <button className="group bg-[#d32f2f] text-white px-8 py-4 rounded font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#b71c1c] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(211,47,47,0.4)]">
              Explore Portfolio
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button className="bg-black/40 text-white border border-white/20 px-8 py-4 rounded font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/40 backdrop-blur-md">
              Contact Us
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
