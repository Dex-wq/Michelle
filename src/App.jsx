import { useState } from "react";
import { AUDIO_SRC } from "./content";
import { useAudioPlayer } from "./hooks";
import Backdrop from "./components/Backdrop";
import ScrollProgress from "./components/ScrollProgress";
import TapSparkles from "./components/TapSparkles";
import Intro from "./components/Intro";
import MusicDock from "./components/MusicDock";
import Hero from "./components/Hero";
import Letter from "./components/Letter";
import Stats from "./components/Stats";
import Constellation from "./components/Constellation";
import Lanterns from "./components/Lanterns";
import WishJar from "./components/WishJar";
import Music from "./components/Music";
import Notes from "./components/Notes";
import Finale from "./components/Finale";
import Reply from "./components/Reply";

// Personal text, photo and song live in ./content.js
export default function App() {
  const { audioRef, analyserRef, playing, play, toggle } = useAudioPlayer();
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      {AUDIO_SRC && <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop />}
      <Backdrop />
      <ScrollProgress />
      <Intro onOpen={play} onReveal={() => setRevealed(true)} />
      <main className={`page${revealed ? "" : " is-waiting"}`}>
        <Hero playing={playing} onToggle={toggle} />
        <Letter />
        <Stats />
        <Constellation />
        <Lanterns />
        <WishJar />
        <Music playing={playing} onToggle={toggle} analyserRef={analyserRef} />
        <Notes />
        <Finale />
        <Reply />
      </main>
      <footer className="footer">
        made with love, just for you <span className="footer-heart">♡</span>
      </footer>
      <MusicDock playing={playing} onToggle={toggle} />
      <TapSparkles />
    </>
  );
}
