import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Heart, Gift, Calendar, LogOut, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

type UserType = "nirdan" | "hribil" | null;

interface UserData {
  id: number;
  giftIdea: string;
  importantDate: string;
  loveCount: number;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ─── Login Screen ────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (user: UserType) => void }) {
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user as UserType);
      } else {
        setError("Wrong keyword — try again 💔");
      }
    } catch {
      setError("Connection error, please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-neutral-900 rounded-3xl shadow-2xl p-10 text-center border border-neutral-800">
          {/* Heart icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-purple-900 p-5 rounded-full">
              <Heart className="w-10 h-10 text-purple-500 fill-purple-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-400 mb-8">Enter your secret keyword to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Secret keyword…"
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-lg"
              autoFocus
            />
            {error && (
              <p className="text-purple-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Countdown Component ─────────────────────────────────────────────────
function CountdownTimer() {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateCountdown() {
      const targetDate = new Date("2026-06-27T23:59:59").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <p className="text-xs font-semibold text-gray-400 mb-2">COUNTDOWN TO</p>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
          <p className="text-xl font-bold text-purple-400">{countdown.days}</p>
          <p className="text-xs text-gray-500">Days</p>
        </div>
        <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
          <p className="text-xl font-bold text-purple-400">{countdown.hours}</p>
          <p className="text-xs text-gray-500">Hours</p>
        </div>
        <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
          <p className="text-xl font-bold text-purple-400">{countdown.minutes}</p>
          <p className="text-xs text-gray-500">Mins</p>
        </div>
        <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
          <p className="text-xl font-bold text-purple-400">{countdown.seconds}</p>
          <p className="text-xs text-gray-500">Secs</p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }: { user: NonNullable<UserType>; onLogout: () => void }) {
  const [data, setData] = useState<UserData | null>(null);
  const [giftDraft, setGiftDraft] = useState("");
  const [dateDraft, setDateDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [loveBurst, setLoveBurst] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const displayName = user === "nirdan" ? "Nirdan" : "Hribil";

  useEffect(() => {
    fetch(`/api/data/${user}`)
      .then((r) => r.json())
      .then((d: UserData) => {
        setData(d);
        setGiftDraft(d.giftIdea ?? "");
        setDateDraft(d.importantDate ?? "");
      });
  }, [user]);

  async function handleLove() {
    setLoveBurst(true);
    setTimeout(() => setLoveBurst(false), 800);
    const res = await fetch(`/api/love/${user}`, { method: "POST" });
    const d = await res.json();
    setData((prev) => prev ? { ...prev, loveCount: d.loveCount } : prev);
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/data/${user}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftIdea: giftDraft, importantDate: dateDraft }),
      });
      const updated: UserData = await res.json();
      setData(updated);
      setSaveMsg("Saved ✓");
      setTimeout(() => setSaveMsg(""), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hello, {displayName} 💕
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Your little love corner</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* I Love You button */}
        <div className="rounded-3xl shadow-lg p-8 mb-5 text-center border border-purple-900 bg-neutral-900">
          <button
            onClick={handleLove}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white text-xl font-bold shadow-lg transition-all active:scale-95 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            style={{transform: loveBurst ? "scale(1.1)" : "scale(1)"}}
          >
            <Heart
              className="w-7 h-7 transition-transform fill-purple-400 text-purple-500"
              style={{transform: loveBurst ? "scale(1.5)" : "scale(1)"}}
            />
            I love you
          </button>
          {data !== null && (
            <p className="text-gray-400 text-sm mt-4">
              <Sparkles className="inline w-4 h-4 mr-1" />
              Pressed&nbsp;
              <span className="font-semibold text-gray-300">{data.loveCount}</span>
              &nbsp;time{data.loveCount !== 1 ? "s" : ""}
            </p>
          )}
          {/* Image */}
          <img
            src="/ily.jpg"
            alt="I Love You"
            className="w-full h-64 object-cover rounded-2xl mt-6"
          />
        </div>

        {/* Data card */}
        <div className="rounded-3xl shadow-lg p-8 border border-purple-900 bg-neutral-900 space-y-6">
          {/* Gift idea */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Gift className="w-4 h-4 text-purple-500" />
              Next Date Idea
            </label>
            <textarea
              value={giftDraft}
              onChange={(e) => setGiftDraft(e.target.value)}
              placeholder="e.g. A surprise dinner, a cozy blanket…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm placeholder-gray-500"
            />
          </div>

          {/* Link to Spotify */}
          <div>
            <a
              href="https://open.spotify.com/artist/4cneZ8WGIBTj2EDiN5T1jv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
            >
              🎵 Listen on Spotify
            </a>
          </div>

          {/* Important date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Important Date
            </label>
            <input
              type="date"
              value={dateDraft}
              onChange={(e) => setDateDraft(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* Countdown to June 28 */}
          <CountdownTimer />

          {/* Save button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {saveMsg && (
              <span className="text-sm font-medium bg-purple-900 text-purple-300 px-3 py-1.5 rounded-lg">
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App root ───────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState<UserType>(null);

  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <LoginScreen onLogin={setUser} />
  );
}
