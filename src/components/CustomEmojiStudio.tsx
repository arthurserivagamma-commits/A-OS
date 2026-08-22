import React, { useState, useEffect } from "react";
import { Copy, Check, Sparkles, Plus, Apple, Search, MessageCircle, Send, Globe, Zap, Wand2 } from "lucide-react";

export type EmojiPackType = "iOS / Apple" | "Meta / WhatsApp" | "Telegram" | "Google Noto" | "3D Cyber";

export interface CustomEmoji {
  id: string;
  name: string;
  char: string;
  glow?: string;
  gradient?: string;
  badge?: string;
  category: string;
}

export const EMOJI_PACK_LIST: { char: string; name: string; category: string }[] = [
  // Smileys & Emotion
  { char: "😀", name: "Grinning Face", category: "Smileys" },
  { char: "😃", name: "Grinning Face Big Eyes", category: "Smileys" },
  { char: "😄", name: "Smile Laugh", category: "Smileys" },
  { char: "😁", name: "Beaming Face", category: "Smileys" },
  { char: "😆", name: "Squinting Face", category: "Smileys" },
  { char: "😅", name: "Sweat Smile", category: "Smileys" },
  { char: "🤣", name: "ROFL Laughing", category: "Smileys" },
  { char: "😂", name: "Joy Tears", category: "Smileys" },
  { char: "🙂", name: "Slight Smile", category: "Smileys" },
  { char: "🙃", name: "Upside Down", category: "Smileys" },
  { char: "😉", name: "Wink", category: "Smileys" },
  { char: "😊", name: "Blush Smile", category: "Smileys" },
  { char: "😇", name: "Halo Angel", category: "Smileys" },
  { char: "🥰", name: "Hearts Smile", category: "Smileys" },
  { char: "😍", name: "Heart Eyes", category: "Smileys" },
  { char: "🤩", name: "Star Struck", category: "Smileys" },
  { char: "😘", name: "Blow Kiss", category: "Smileys" },
  { char: "😋", name: "Yummy Tongue", category: "Smileys" },
  { char: "😛", name: "Tongue Out", category: "Smileys" },
  { char: "😜", name: "Wink Tongue", category: "Smileys" },
  { char: "🤪", name: "Zany Face", category: "Smileys" },
  { char: "😝", name: "Squint Tongue", category: "Smileys" },
  { char: "🤑", name: "Money Face", category: "Smileys" },
  { char: "🤗", name: "Hug Face", category: "Smileys" },
  { char: "🤫", name: "Shush Face", category: "Smileys" },
  { char: "🤔", name: "Thinker Face", category: "Smileys" },
  { char: "🫡", name: "Salute", category: "Smileys" },
  { char: "🤐", name: "Zipper Mouth", category: "Smileys" },
  { char: "🤨", name: "Raised Eyebrow", category: "Smileys" },
  { char: "😐", name: "Neutral Face", category: "Smileys" },
  { char: "😑", name: "Expressionless", category: "Smileys" },
  { char: "😏", name: "Smirk", category: "Smileys" },
  { char: "😒", name: "Unamused", category: "Smileys" },
  { char: "🙄", name: "Roll Eyes", category: "Smileys" },
  { char: "😬", name: "Grimace", category: "Smileys" },
  { char: "😮‍💨", name: "Exhale Face", category: "Smileys" },
  { char: "🤥", name: "Liar Nose", category: "Smileys" },
  { char: "😌", name: "Relieved", category: "Smileys" },
  { char: "😔", name: "Pensive", category: "Smileys" },
  { char: "😪", name: "Sleepy Tear", category: "Smileys" },
  { char: "🤤", name: "Drool Face", category: "Smileys" },
  { char: "😴", name: "Sleeping Zzz", category: "Smileys" },
  { char: "😷", name: "Mask Face", category: "Smileys" },
  { char: "🤒", name: "Thermometer", category: "Smileys" },
  { char: "🤕", name: "Bandage Head", category: "Smileys" },
  { char: "🤢", name: "Nauseated", category: "Smileys" },
  { char: "🤮", name: "Vomit", category: "Smileys" },
  { char: "🤧", name: "Sneeze", category: "Smileys" },
  { char: "🥵", name: "Hot Sweat", category: "Smileys" },
  { char: "🥶", name: "Cold Freeze", category: "Smileys" },
  { char: "🥴", name: "Woozy", category: "Smileys" },
  { char: "😵", name: "Dizzy Crossed", category: "Smileys" },
  { char: "🤯", name: "Mind Blown", category: "Smileys" },
  { char: "🤠", name: "Cowboy", category: "Smileys" },
  { char: "🥳", name: "Party Horn", category: "Smileys" },
  { char: "😎", name: "Cool Sunglasses", category: "Smileys" },
  { char: "🤓", name: "Nerd Glasses", category: "Smileys" },
  { char: "🧐", name: "Monocle", category: "Smileys" },
  { char: "😕", name: "Confused", category: "Smileys" },
  { char: "😟", name: "Worried", category: "Smileys" },
  { char: "🙁", name: "Frown", category: "Smileys" },
  { char: "😮", name: "Open Mouth", category: "Smileys" },
  { char: "😲", name: "Astonished", category: "Smileys" },
  { char: "😳", name: "Flushed", category: "Smileys" },
  { char: "🥺", name: "Pleading Eyes", category: "Smileys" },
  { char: "🥹", name: "Hold Tears", category: "Smileys" },
  { char: "😦", name: "Frowning Open", category: "Smileys" },
  { char: "😧", name: "Anguished", category: "Smileys" },
  { char: "😨", name: "Fearful", category: "Smileys" },
  { char: "😰", name: "Anxious", category: "Smileys" },
  { char: "😥", name: "Sad Relieved", category: "Smileys" },
  { char: "😢", name: "Cry Tear", category: "Smileys" },
  { char: "😭", name: "Loud Cry", category: "Smileys" },
  { char: "😱", name: "Scream Fear", category: "Smileys" },
  { char: "😖", name: "Confounded", category: "Smileys" },
  { char: "😣", name: "Persevere", category: "Smileys" },
  { char: "😞", name: "Disappointed", category: "Smileys" },
  { char: "😓", name: "Downcast Sweat", category: "Smileys" },
  { char: "😩", name: "Weary", category: "Smileys" },
  { char: "😫", name: "Tired", category: "Smileys" },
  { char: "🥱", name: "Yawn", category: "Smileys" },
  { char: "😤", name: "Triumph Steam", category: "Smileys" },
  { char: "😡", name: "Rage Pout", category: "Smileys" },
  { char: "😠", name: "Angry", category: "Smileys" },
  { char: "🤬", name: "Curse Symbols", category: "Smileys" },
  { char: "😈", name: "Devil Horns", category: "Smileys" },
  { char: "👿", name: "Angry Devil", category: "Smileys" },
  { char: "💀", name: "Skull", category: "Smileys" },
  { char: "☠️", name: "Crossbones", category: "Smileys" },
  { char: "💩", name: "Poop", category: "Smileys" },
  { char: "🤡", name: "Clown", category: "Smileys" },
  { char: "👻", name: "Ghost", category: "Smileys" },
  { char: "👽", name: "Alien", category: "Smileys" },
  { char: "👾", name: "Invader", category: "Smileys" },
  { char: "🤖", name: "Robot Bot", category: "Smileys" },

  // Gestures
  { char: "👋", name: "Wave Hand", category: "Gestures" },
  { char: "🤚", name: "Back Hand", category: "Gestures" },
  { char: "🖐️", name: "Splayed Hand", category: "Gestures" },
  { char: "✋", name: "High Five Hand", category: "Gestures" },
  { char: "🖖", name: "Vulcan", category: "Gestures" },
  { char: "👌", name: "OK Sign", category: "Gestures" },
  { char: "🤌", name: "Pinched Fingers", category: "Gestures" },
  { char: "🤏", name: "Pinch Hand", category: "Gestures" },
  { char: "✌️", name: "Peace Victory", category: "Gestures" },
  { char: "🤞", name: "Crossed Fingers", category: "Gestures" },
  { char: "🫰", name: "Heart Finger", category: "Gestures" },
  { char: "🤟", name: "Love You", category: "Gestures" },
  { char: "🤘", name: "Rock On", category: "Gestures" },
  { char: "🤙", name: "Call Me", category: "Gestures" },
  { char: "👈", name: "Point Left", category: "Gestures" },
  { char: "👉", name: "Point Right", category: "Gestures" },
  { char: "👆", name: "Point Up", category: "Gestures" },
  { char: "👇", name: "Point Down", category: "Gestures" },
  { char: "👍", name: "Thumbs Up", category: "Gestures" },
  { char: "👎", name: "Thumbs Down", category: "Gestures" },
  { char: "👊", name: "Punch Fist", category: "Gestures" },
  { char: "👏", name: "Applause Claps", category: "Gestures" },
  { char: "🙌", name: "Celebrate Hands", category: "Gestures" },
  { char: "🫶", name: "Heart Hands", category: "Gestures" },
  { char: "🤝", name: "Handshake", category: "Gestures" },
  { char: "🙏", name: "Pray Folded", category: "Gestures" },
  { char: "💪", name: "Flex Muscle", category: "Gestures" },

  // Hearts & Symbols
  { char: "❤️", name: "Red Heart", category: "Hearts" },
  { char: "🧡", name: "Orange Heart", category: "Hearts" },
  { char: "💛", name: "Yellow Heart", category: "Hearts" },
  { char: "💚", name: "Green Heart", category: "Hearts" },
  { char: "💙", name: "Blue Heart", category: "Hearts" },
  { char: "💜", name: "Purple Heart", category: "Hearts" },
  { char: "🖤", name: "Black Heart", category: "Hearts" },
  { char: "🤍", name: "White Heart", category: "Hearts" },
  { char: "💔", name: "Broken Heart", category: "Hearts" },
  { char: "❤️‍🔥", name: "Fire Heart", category: "Hearts" },
  { char: "💖", name: "Sparkle Heart", category: "Hearts" },
  { char: "✨", name: "Magic Sparkles", category: "Symbols" },
  { char: "⭐️", name: "Gold Star", category: "Symbols" },
  { char: "🌟", name: "Glow Star", category: "Symbols" },
  { char: "⚡️", name: "Lightning Zap", category: "Symbols" },
  { char: "🔥", name: "Fire Flame", category: "Symbols" },
  { char: "💥", name: "Boom Collision", category: "Symbols" },
  { char: "🌈", name: "Rainbow", category: "Symbols" },
];

export function CustomEmojiStudio({
  onSelectEmoji,
  onClose,
}: {
  onSelectEmoji?: (emojiStr: string) => void;
  onClose: () => void;
}) {
  const [selectedPack, setSelectedPack] = useState<EmojiPackType>(() => {
    return (localStorage.getItem("aos-active-emoji-pack") as any) || "iOS / Apple";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedChar, setCopiedChar] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("aos-active-emoji-pack", selectedPack);
    window.dispatchEvent(new Event("storage"));
  }, [selectedPack]);

  const handleCopy = (char: string) => {
    navigator.clipboard.writeText(char).catch(() => {});
    setCopiedChar(char);
    if (onSelectEmoji) onSelectEmoji(char);
    setTimeout(() => setCopiedChar(null), 1800);
  };

  const filteredEmojis = EMOJI_PACK_LIST.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const packs: { id: EmojiPackType; label: string; icon: any }[] = [
    { id: "iOS / Apple", label: "iOS / Apple", icon: Apple },
    { id: "Meta / WhatsApp", label: "Meta / WhatsApp", icon: MessageCircle },
    { id: "Telegram", label: "Telegram", icon: Send },
    { id: "Google Noto", label: "Google Noto", icon: Globe },
    { id: "3D Cyber", label: "3D Cyber & Neon", icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-white/50 dark:border-slate-700/70 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/70 dark:border-slate-800/80 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-pink-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                A-OS Multi-Emoji Pack Studio
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Apple iOS, Meta WhatsApp, Telegram, Google, and 3D Cyber styles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition"
          >
            ✕
          </button>
        </div>

        {/* Emoji Pack Switcher */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-100/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {packs.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPack(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedPack === p.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="px-6 py-2.5 bg-slate-50/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${selectedPack} emojis...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-none placeholder-slate-400"
          />
        </div>

        {/* Emoji Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {filteredEmojis.map((item, idx) => (
              <button
                key={`${item.char}-${idx}`}
                onClick={() => handleCopy(item.char)}
                className={`group relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-150 hover:scale-110 active:scale-95 ${
                  selectedPack === "3D Cyber"
                    ? "bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-500/10 hover:border-cyan-400"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800"
                }`}
                title={item.name}
              >
                <span
                  className={`text-3xl leading-none transition-transform group-hover:scale-125 ${
                    selectedPack === "3D Cyber" ? "filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : ""
                  }`}
                  style={{
                    fontFamily:
                      selectedPack === "iOS / Apple"
                        ? '"Apple Color Emoji", -apple-system, sans-serif'
                        : selectedPack === "Meta / WhatsApp"
                        ? '"WhatsApp Emoji", "Apple Color Emoji", sans-serif'
                        : selectedPack === "Google Noto"
                        ? '"Noto Color Emoji", "Apple Color Emoji", sans-serif'
                        : undefined,
                  }}
                >
                  {item.char}
                </span>
                <span className="mt-1 text-[9px] text-slate-500 dark:text-slate-400 truncate w-full text-center">
                  {copiedChar === item.char ? (
                    <span className="text-emerald-500 font-bold">Copied!</span>
                  ) : (
                    item.name.split(" ")[0]
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Active Pack: <b className="text-blue-600 dark:text-cyan-400">{selectedPack}</b></span>
          <span className="text-slate-400">Click any emoji to copy & paste</span>
        </div>
      </div>
    </div>
  );
}
