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

// ─── Login Screen ─────────────────────────────────────────────────────────────
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          {/* Heart icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-rose-100 p-5 rounded-full">
              <Heart className="w-10 h-10 text-rose-500 fill-rose-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-400 mb-8">Enter your secret keyword to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Secret keyword…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-center text-lg tracking-widest"
              autoFocus
            />
            {error && (
              <p className="text-rose-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }: { user: NonNullable<UserType>; onLogout: () => void }) {
  const [data, setData] = useState<UserData | null>(null);
  const [giftDraft, setGiftDraft] = useState("");
  const [dateDraft, setDateDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [loveBurst, setLoveBurst] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const displayName = user === "nirdan" ? "Nirdan" : "Hribil";
  const accentColor = user === "nirdan" ? "rose" : "purple";

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

  const accent = {
    rose: {
      bg: "from-rose-50 via-pink-50 to-red-50",
      card: "border-rose-100",
      btn: "bg-rose-500 hover:bg-rose-600",
      badge: "bg-rose-100 text-rose-600",
      ring: "focus:ring-rose-300",
      icon: "text-rose-500",
      heartFill: "fill-rose-400",
      loveBtn:
        "bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 shadow-rose-200",
    },
    purple: {
      bg: "from-purple-50 via-violet-50 to-indigo-50",
      card: "border-purple-100",
      btn: "bg-purple-500 hover:bg-purple-600",
      badge: "bg-purple-100 text-purple-600",
      ring: "focus:ring-purple-300",
      icon: "text-purple-500",
      heartFill: "fill-purple-400",
      loveBtn:
        "bg-gradient-to-r from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600 shadow-purple-200",
    },
  }[accentColor];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${accent.bg} p-4 sm:p-8`}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hello, {displayName} 💕
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Your little love corner</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* I Love You button */}
        <div className="bg-white rounded-3xl shadow-md p-8 mb-5 text-center border ${accent.card}">
          <button
            onClick={handleLove}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white text-xl font-bold shadow-lg transition-all active:scale-95 ${accent.loveBtn} ${loveBurst ? "scale-110" : "scale-100"}`}
          >
            <Heart
              className={`w-7 h-7 transition-transform ${loveBurst ? "scale-150" : ""} ${accent.heartFill}`}
            />
            I love you
          </button>
          {data !== null && (
            <p className="text-gray-400 text-sm mt-4">
              <Sparkles className="inline w-4 h-4 mr-1" />
              Pressed&nbsp;
              <span className="font-semibold text-gray-600">{data.loveCount}</span>
              &nbsp;time{data.loveCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Data card */}
        <div className="bg-white rounded-3xl shadow-md p-8 border ${accent.card} space-y-6">
          {/* Gift idea */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
              <Gift className={`w-4 h-4 ${accent.icon}`} />
              Next Date Idea
            </label>
            <textarea
              value={giftDraft}
              onChange={(e) => setGiftDraft(e.target.value)}
              placeholder="e.g. A surprise dinner, a cozy blanket…"
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 ${accent.ring} resize-none text-sm text-gray-700 placeholder-gray-300`}
            />
          </div>

          {/* Important date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
              <Calendar className={`w-4 h-4 ${accent.icon}`} />
              Important Date
            </label>
            <input
              type="date"
              value={dateDraft}
              onChange={(e) => setDateDraft(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 ${accent.ring} text-sm text-gray-700`}
            />
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex-1 ${accent.btn} disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors`}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {saveMsg && (
              <span className={`text-sm font-medium ${accent.badge} px-3 py-1.5 rounded-lg`}>
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState<UserType>(null);

  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <LoginScreen onLogin={setUser} />
  );
}
