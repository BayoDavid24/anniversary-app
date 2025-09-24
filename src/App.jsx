// src/App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Music, Pause, Play, Image as ImageIcon, Calendar, Volume2, VolumeX, Lock, User } from "lucide-react";
// Note: the Button/Card/Switch imports below assume you have shadcn/ui or similar.
// If you don't, replace Button/Card components with plain HTML elements.
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

/**
 * Anniversary Webapp (plain JSX)
 */

// placeholders — change these
const NAMES = { you: "Dee", partner: "Bee" };
const anniversaryDate = new Date(2025, 8, 25, 0, 0, 0);
const VALID_USERNAME = "Bubbles";     // her first pet's name
const VALID_PASSWORD = "25092025";  // ddmmyyyy

const placeholderImages = [
  { src: "components/images/ice-ream.jpeg", caption: "Ice Cream Date" },
  { src: "components/images/hands.jpeg", caption: "Indomie Date" },
  { src: "components/images/limo-ride.jpeg", caption: "Limo Ride" },
  { src: "components/images/beach.jpeg", caption: "Beach Outing" },
];

function useCountdown(targetDate) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = targetDate.getTime() - new Date().getTime();
  if (diff <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { done: false, days, hours, minutes, seconds };
}

const FloatingHearts = ({ count = 20 }) => {
  const hearts = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {hearts.map((_, i) => {
        const delay = (i * 0.35) % 6;
        const duration = 6 + (i % 5);
        const left = `${(i * 37) % 100}%`;
        const size = 14 + (i % 12) * 2;
        const rotate = (i % 2 ? -1 : 1) * ((i * 11) % 15);
        return (
          <motion.div
            key={i}
            initial={{ y: "100%", opacity: 0, rotate }}
            animate={{ y: "-10%", opacity: [0, 1, 1, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
            className="absolute"
            style={{ left }}
          >
            <Heart style={{ width: size, height: size }} className="text-pink-500 drop-shadow" />
          </motion.div>
        );
      })}
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <Card className="backdrop-blur bg-white/70 dark:bg-zinc-900/70 border-white/30">
    <CardHeader className="flex flex-row items-center gap-2">
      <CardTitle className="text-xl flex items-center gap-2">
        {icon} <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const LoadingScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-fuchsia-200 text-zinc-900 relative overflow-hidden">
      <FloatingHearts count={20} />
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-3xl sm:text-5xl font-bold">
        Loading our Love…
      </motion.h1>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      onLogin();
    } else {
      setError("Nope, try again ❤️");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-200 to-pink-200 text-zinc-900 relative overflow-hidden px-4">
      <FloatingHearts count={18} />
      <Card className="w-full max-w-md bg-white/80 backdrop-blur border border-white/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">💖 Welcome 💖</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <input type="text" placeholder="First pet's name" value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <input type="password" placeholder="Anniversary date (ddmmyyyy)" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">Enter 💌</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const AnniversaryAppContent = () => {
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const countdown = useCountdown(anniversaryDate);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-100 text-zinc-800">
      <FloatingHearts count={24} />
      <audio ref={audioRef} src="components/music.mp3" loop preload="auto" />

      <header className="max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
        <motion.h1 className="text-4xl sm:text-6xl font-extrabold">Happy Anniversary</motion.h1>
        <motion.p className="mt-3 text-lg sm:text-xl">{NAMES.you} & {NAMES.partner}</motion.p>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-24 space-y-6">
        <Section title="A Little Love Note" icon={<Heart className="w-5 h-5" />}>
          <p>Hey love, <span className="font-semibold">In this one year together, every nickname I’ve given you has carried a piece of my heart. When I called you Bubbles, it was because you filled my world with joy, lightness, and laughter. When I called you Bee, it was because your sweetness and quiet strength are always buzzing in my heart. Calling you Baby was my way of saying you are the one I want to hold, protect, and never let go. When I called you Smallie, it was because you are my delicate treasure, the little part of my world I cherish most. Ria flowed from my lips because, like a river, you bring calm and grace to my life. Tory reminded me of a bird—free, adventurous, and always lifting me higher. And when I called you Vikky, it was because you are my victory, my greatest blessing, my proof that love always wins.

Every name has always meant just one thing: I love you. And I hope this past year has shown you that my love is real, deep, and forever yours.

Happy 1-year anniversary, my love 💕</span>. 💕</p>
        </Section>

        <Section title="Our Gallery" icon={<ImageIcon className="w-5 h-5" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {placeholderImages.map((img, idx) => (
              <motion.figure key={idx} className="relative rounded-2xl overflow-hidden shadow-sm border border-white/30" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.06 }}>
                <img src={img.src} alt={img.caption} className="w-full h-32 sm:h-40 object-cover" />
                <figcaption className="absolute bottom-0 left-0 right-0 text-xs px-2 py-1 bg-gradient-to-t from-black/60 to-transparent text-white">{img.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </Section>

        <Section title="Music Controls" icon={muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}>
          <div className="flex items-center gap-3">
            <Button onClick={togglePlay} className="gap-2">{playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}{playing ? "Pause Music" : "Play Music"}</Button>
            <div className="flex items-center gap-2">
              <Switch id="muted" checked={!muted} onCheckedChange={(v) => setMuted(!v)} />
              <label htmlFor="muted" className="text-sm">{muted ? "Muted" : "Sound On"}</label>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
};

export default function AnniversaryApp() {
  const [stage, setStage] = useState("loading");
  if (stage === "loading") return <LoadingScreen onFinish={() => setStage("login")} />;
  if (stage === "login") return <LoginScreen onLogin={() => setStage("app")} />;
  return <AnniversaryAppContent />;
}
