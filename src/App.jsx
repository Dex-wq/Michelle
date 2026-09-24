import { AUDIO_SRC, FRIEND_NAME } from "./content";
import { useAudioPlayer } from "./hooks";
import { splitTrailingEmoji } from "./utils";
import Backdrop from "./components/Backdrop";
import FloatingHearts from "./components/FloatingHearts";
import ScrollProgress from "./components/ScrollProgress";
import SparkleCursor from "./components/SparkleCursor";
import MusicDock from "./components/MusicDock";
import Hero from "./components/Hero";
import Letter from "./components/Letter";
import Stats from "./components/Stats";
import Constellation from "./components/Constellation";
import Lanterns from "./components/Lanterns";
import WishJar from "./components/WishJar";
import Music from "./components/Music";
import Quotes from "./components/Quotes";
import Finale from "./components/Finale";

// Personal text, photo and song live in ./content.js
export default function App() {
  const { audioRef, analyserRef, playing, toggle } = useAudioPlayer();
  const [name] = splitTrailingEmoji(FRIEND_NAME);

  return (
    <>
      {AUDIO_SRC && <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop />}
      <Backdrop />
      <FloatingHearts />
      <ScrollProgress />
      <main className="page">
        <Hero playing={playing} onToggle={toggle} />
        <Letter />
        <Stats />
        <Constellation />
        <Lanterns />
        <WishJar />
        <Music playing={playing} onToggle={toggle} analyserRef={analyserRef} />
        <Quotes />
        <Finale />
      </main>
      <footer className="footer">made with 💜 for {name}</footer>
      <MusicDock playing={playing} onToggle={toggle} />
      <SparkleCursor />
    </>
  );
}
