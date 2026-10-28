"use client";

import React, { useState } from "react";
import {
  Trophy,
  Plus,
  Flame,
  Zap,
  Clock,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Award,
} from "lucide-react";

interface Quest {
  id: string;
  title: string;
  category: "nutrition" | "biometrics" | "recovery" | "workout";
  xp: number;
  potatoes: number; // In-app currency / reward token
  difficulty: "Easy" | "Medium" | "Heroic";
  targetMetric: string;
  frequency: "daily" | "weekly" | "special";
  status: "active" | "inactive";
  participants: number;
}

const INITIAL_QUESTS: Quest[] = [
  {
    id: "quest-1",
    title: "100% Local Farmer Protein Harvest",
    category: "nutrition",
    xp: 250,
    potatoes: 40,
    difficulty: "Medium",
    targetMetric: "Log 140g protein from certified local vendors",
    frequency: "daily",
    status: "active",
    participants: 1240,
  },
  {
    id: "quest-2",
    title: "Hydration Electrolyte Lock",
    category: "biometrics",
    xp: 150,
    potatoes: 25,
    difficulty: "Easy",
    targetMetric: "Log 3.5 Liters of structured water intake",
    frequency: "daily",
    status: "active",
    participants: 3890,
  },
  {
    id: "quest-3",
    title: "Sub-100ms Wearable Sync Streak",
    category: "biometrics",
    xp: 300,
    potatoes: 50,
    difficulty: "Heroic",
    targetMetric: "Maintain uninterrupted 7-day wearable biometrics sync",
    frequency: "weekly",
    status: "active",
    participants: 840,
  },
  {
    id: "quest-4",
    title: "Vigorous Sprint Protocol",
    category: "workout",
    xp: 200,
    potatoes: 35,
    difficulty: "Medium",
    targetMetric: "Complete 6x 100m sprint intervals with heart-rate recovery",
    frequency: "daily",
    status: "active",
    participants: 1650,
  },
  {
    id: "quest-5",
    title: "Deep Sleep & HRV Recovery Master",
    category: "recovery",
    xp: 400,
    potatoes: 60,
    difficulty: "Heroic",
    targetMetric: "Score >85 Sleep Quality and >60ms HRV baseline",
    frequency: "weekly",
    status: "inactive",
    participants: 420,
  },
];

export default function QuestsManagementPage() {
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New quest form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"nutrition" | "biometrics" | "recovery" | "workout">("nutrition");
  const [newXp, setNewXp] = useState(200);
  const [newPotatoes, setNewPotatoes] = useState(30);
  const [newDifficulty, setNewDifficulty] = useState<"Easy" | "Medium" | "Heroic">("Medium");
  const [newMetric, setNewMetric] = useState("");
  const [newFrequency, setNewFrequency] = useState<"daily" | "weekly" | "special">("daily");

  const handleToggleStatus = (id: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: q.status === "active" ? "inactive" : "active" } : q
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quest?")) {
      setQuests((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMetric) return;

    const quest: Quest = {
      id: "quest-" + Date.now().toString(36),
      title: newTitle.trim(),
      category: newCategory,
      xp: Number(newXp),
      potatoes: Number(newPotatoes),
      difficulty: newDifficulty,
      targetMetric: newMetric.trim(),
      frequency: newFrequency,
      status: "active",
      participants: 0,
    };

    setQuests([quest, ...quests]);
    setShowAddModal(false);
    setNewTitle("");
    setNewMetric("");
  };

  const filteredQuests = quests.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.targetMetric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || q.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalActive = quests.filter((q) => q.status === "active").length;
  const totalParticipants = quests.reduce((acc, q) => acc + q.participants, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Gamification &amp; Engagement
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs font-mono text-[#34d399]">Live Campaign Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Daily Quests &amp; Challenges
          </h1>
          <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
            Configure athletic daily missions, XP multiplier thresholds, potato token rewards, and habit loops.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Quest</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
          <div className="flex items-center justify-between text-[#757761] mb-2">
            <span className="text-[11px] font-mono uppercase">Total Quests</span>
            <Trophy className="w-4 h-4 text-[#f7fe72]" />
          </div>
          <div className="text-2xl font-black text-[#121815] dark:text-white">{quests.length}</div>
          <div className="text-[10px] text-[#34d399] font-mono mt-1">{totalActive} actively running</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
          <div className="flex items-center justify-between text-[#757761] mb-2">
            <span className="text-[11px] font-mono uppercase">Active Athletes</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-[#121815] dark:text-white">{totalParticipants.toLocaleString()}</div>
          <div className="text-[10px] text-[#A0A493] font-mono mt-1">Competing today</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
          <div className="flex items-center justify-between text-[#757761] mb-2">
            <span className="text-[11px] font-mono uppercase">Max XP Pool</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-[#121815] dark:text-white">
            {quests.reduce((acc, q) => acc + q.xp, 0).toLocaleString()} XP
          </div>
          <div className="text-[10px] text-[#34d399] font-mono mt-1">Daily harvest cap</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
          <div className="flex items-center justify-between text-[#757761] mb-2">
            <span className="text-[11px] font-mono uppercase">Reward Yield</span>
            <Award className="w-4 h-4 text-[#f7fe72]" />
          </div>
          <div className="text-2xl font-black text-[#121815] dark:text-white">
            {quests.reduce((acc, q) => acc + q.potatoes, 0)} 🥔
          </div>
          <div className="text-[10px] text-[#A0A493] font-mono mt-1">Total token payload</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quest by title or metric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#757761]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
          >
            <option value="all">All Categories</option>
            <option value="nutrition">Nutrition &amp; Fuel</option>
            <option value="biometrics">Wearable Biometrics</option>
            <option value="workout">Workout Protocol</option>
            <option value="recovery">Sleep &amp; Recovery</option>
          </select>
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuests.map((quest) => (
          <div
            key={quest.id}
            className={`p-5 rounded-2xl bg-white dark:bg-[#0E1310] border transition-all flex flex-col justify-between ${
              quest.status === "active"
                ? "border-[#757761]/30 hover:border-[#f7fe72]/50 shadow-xs"
                : "border-[#757761]/15 opacity-60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#141A16] text-[#34d399] border border-[#34d399]/30 font-bold">
                  {quest.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      quest.difficulty === "Heroic"
                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                        : quest.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {quest.difficulty}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(quest.id)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border cursor-pointer ${
                      quest.status === "active"
                        ? "bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30"
                        : "bg-[#757761]/20 text-[#757761] border-[#757761]/30"
                    }`}
                  >
                    {quest.status === "active" ? "Active" : "Paused"}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#121815] dark:text-white leading-snug">
                  {quest.title}
                </h3>
                <p className="text-xs text-[#505445] dark:text-[#A0A493] mt-1.5 leading-relaxed">
                  {quest.targetMetric}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[#757761]/20 text-xs font-mono">
                <div className="flex items-center gap-1 text-[#f7fe72]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+{quest.xp} XP</span>
                </div>
                <div className="flex items-center gap-1 text-[#34d399]">
                  <Award className="w-3.5 h-3.5" />
                  <span>+{quest.potatoes} 🥔</span>
                </div>
                <div className="flex items-center gap-1 text-[#757761] ml-auto text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span className="capitalize">{quest.frequency}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#757761]/15 text-[11px] font-mono">
              <span className="text-[#505445] dark:text-[#A0A493]">
                {quest.participants.toLocaleString()} Athletes Completed
              </span>
              <button
                type="button"
                onClick={() => handleDelete(quest.id)}
                className="text-[#757761] hover:text-red-400 p-1 transition-colors"
                title="Delete Quest"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Quest */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1310] border border-[#757761]/35 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#757761]/25">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f7fe72]" />
                <h3 className="text-base font-bold text-white">Create Daily Quest</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#757761] hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Quest Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100g Fresh Spinach Iron & Nitrate Surge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Quest["category"])}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none focus:border-[#f7fe72]"
                  >
                    <option value="nutrition">Nutrition &amp; Fuel</option>
                    <option value="biometrics">Wearable Biometrics</option>
                    <option value="workout">Workout Protocol</option>
                    <option value="recovery">Recovery &amp; HRV</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as Quest["difficulty"])}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none focus:border-[#f7fe72]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Heroic">Heroic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Target Completion Metric</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Purchase certified local leafy greens and log intake"
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">XP Reward</label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={newXp}
                    onChange={(e) => setNewXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">Tokens (🥔)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newPotatoes}
                    onChange={(e) => setNewPotatoes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as Quest["frequency"])}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none focus:border-[#f7fe72]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="special">Special Event</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#757761]/25">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-xs text-[#A0A493] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer"
                >
                  Publish Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
