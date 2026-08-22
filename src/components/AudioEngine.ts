import { originalTones } from "../constants";
import { VFile } from "../types";

export const playOriginalTone = (selection: string, volume = 65, loop = false) => {
  if (typeof window === "undefined") return () => {};
  try {
    const definition = originalTones.find((tone) => tone.name === selection) || originalTones[0];
    const AudioEngine = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioEngine) return () => {};
    const context: AudioContext = new AudioEngine();
    let stopped = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const play = () => {
      if (stopped) return;
      const start = context.currentTime + 0.02;
      definition.notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const at = start + index * definition.gap;
        oscillator.type = definition.wave;
        oscillator.frequency.setValueAtTime(frequency, at);
        if (definition.name === "Orbit") {
          oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, at + 0.22);
        }
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.015, volume / 520), at + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.52);
      });
    };

    play();
    if (loop) interval = setInterval(play, 2200);

    return () => {
      stopped = true;
      if (interval) clearInterval(interval);
      void context.close().catch(() => {});
    };
  } catch {
    return () => {};
  }
};

export const playToneSelection = (selection: string, files: VFile[] = [], volume = 65, loop = false) => {
  if (selection.startsWith("file:")) {
    const media = files.find((file) => file.id === selection.slice(5));
    if (media?.content) {
      const audio = new Audio(media.content);
      audio.volume = volume / 100;
      audio.loop = loop;
      void audio.play().catch(() => {});
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }
  return playOriginalTone(selection, volume, loop);
};

export const conciseWikipediaAnswer = async (question: string, maxWords = 70) => {
  const searchTerm =
    question
      .replace(/^(what|who|where|when)\s+(is|are|was|were)\s+/i, "")
      .replace(/-/g, " ")
      .trim() || question;
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: searchTerm,
    gsrlimit: "1",
    prop: "extracts|info",
    exintro: "1",
    explaintext: "1",
    inprop: "url",
    redirects: "1",
  });
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error("Wikipedia did not respond");
  const result = await response.json();
  const page = Object.values(result?.query?.pages || {})[0] as any;
  if (!page?.extract) throw new Error("No matching Wikipedia article was found");
  const allWords = page.extract.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const words = allWords.slice(0, maxWords);
  return {
    title: page.title as string,
    answer: words.join(" ") + (allWords.length > maxWords ? "…" : ""),
    sourceUrl:
      page.fullurl ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(String(page.title).replace(/ /g, "_"))}`,
  };
};
