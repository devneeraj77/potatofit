"use client";

import React, { useState } from "react";
import { Flame } from "lucide-react";

interface Protocol {
  id: string;
  name: string;
  target: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Elite";
  sessionsPerWeek: number;
  activeAthletes: number;
  status: "active" | "archived";
}

const INITIAL_PROTOCOLS: Protocol[] = [
  {
    id: "proto-1",
    name: "Barbell Hypertrophy & Posterior Chain",
    target: "Deadlift & Clean Kinematics",
    duration: "10 Weeks",
    level: "Elite",
    sessionsPerWeek: 4,
    activeAthletes: 4210,
    status: "active",
  },
  {
    id: "proto-2",
    name: "Zone 2 Mitochondrial Density Base",
    target: "Lactate Clearance & Aerobic Base",
    duration: "12 Weeks",
    level: "Intermediate",
    sessionsPerWeek: 3,
    activeAthletes: 6840,
    status: "active",
  },
  {
    id: "proto-3",
    name: "Circadian Breathwork & HRV Reset",
    target: "Parasympathetic Tuning & Deep Sleep",
    duration: "4 Weeks",
    level: "Beginner",
    sessionsPerWeek: 7,
    activeAthletes: 8930,
    status: "active",
  },
  {
    id: "proto-4",
    name: "Home Dumbbell & Kettlebell Hybrid",
    target: "High-Density Glycogen Depletion",
    duration: "6 Weeks",
    level: "Intermediate",
    sessionsPerWeek: 4,
    activeAthletes: 2310,
    status: "active",
  },
];

export default function AdminProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>(INITIAL_PROTOCOLS);

  const toggleStatus = (id: string) => {
    setProtocols((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "archived" : "active" } : p
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Athletic Curriculum
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs text-[#A0A493]">Uchitatvam Coaching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Workout Protocols Management
          </h1>
          <p className="text-xs sm:text-sm text-[#505445] dark:text-[#A0A493] mt-0.5">
            Configure athletic training tracks, progressive overload formulas, and active contender regimens.
          </p>
        </div>
      </div>

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {protocols.map((proto) => (
          <div
            key={proto.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase bg-[#18211C] text-[#f7fe72] border border-[#757761]/30 px-2 py-0.5 rounded font-bold">
                  {proto.level}
                </span>
                <span className="text-xs font-mono text-[#505445] dark:text-[#A0A493]">
                  {proto.duration} · {proto.sessionsPerWeek}x / wk
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#121815] dark:text-white">
                  {proto.name}
                </h3>
                <p className="text-xs text-[#505445] dark:text-[#A0A493] mt-1">
                  Target: {proto.target}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#121815] dark:text-white pt-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>{proto.activeAthletes.toLocaleString()} active athletes enrolled</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#757761]/15 mt-4">
              <span className="text-[11px] font-mono text-[#757761]">ID: {proto.id}</span>
              <button
                type="button"
                onClick={() => toggleStatus(proto.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                  proto.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                }`}
              >
                {proto.status === "active" ? "Protocol Live" : "Archived"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
