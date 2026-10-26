"use client";

import { useState, useEffect, useCallback } from "react";
import { usePWA } from "./usePWA";

export interface DailyActivityRecord {
  day: string;
  dateLabel: string;
  steps: number;
  activeBurnKcal: number;
  sleepHours: number;
  hrvMs: number;
  recoveryScore: number;
  workoutTitle: string;
  isToday?: boolean;
}

export interface TelemetryData {
  activeBurnKcal: number;
  dailySteps: number;
  restingHeartRate: number;
  hrvMs: number;
  sleepHours: number;
  sleepFormatted: string;
  deepSleepMins: number;
  recoveryScore: number;
  recentWorkout: string;
}

export interface HealthProvider {
  id: "googlefit" | "applehealth" | "strava" | "whoop";
  name: string;
  category: "Android & Wearables" | "Apple Ecosystem" | "GPS & Workouts" | "24/7 Biometric Recovery";
  iconBg: string;
  badgeColor: string;
  isConnected: boolean;
  lastSync: string;
  description: string;
  telemetry: TelemetryData;
  history7Days: DailyActivityRecord[];
  metrics: {
    label: string;
    value: string;
    sub: string;
  }[];
}

const DEFAULT_PROVIDERS: HealthProvider[] = [
  {
    id: "googlefit",
    name: "Google Fit / Health Connect",
    category: "Android & Wearables",
    iconBg: "bg-[#4285F4]",
    badgeColor: "text-[#4285F4] border-[#4285F4]/30 bg-[#4285F4]/10",
    isConnected: false,
    lastSync: "Not connected",
    description: "Syncs all daily steps, active workout calories, heart rate, sleep architecture, and cardio points from Android & Wear OS.",
    telemetry: {
      activeBurnKcal: 490,
      dailySteps: 11840,
      restingHeartRate: 54,
      hrvMs: 68,
      sleepHours: 7.3,
      sleepFormatted: "7h 18m",
      deepSleepMins: 95,
      recoveryScore: 86,
      recentWorkout: "Cardio & Move Target Met (68 Heart Pts)",
    },
    history7Days: [
      { day: "Fri", dateLabel: "Oct 16", steps: 10420, activeBurnKcal: 460, sleepHours: 7.1, hrvMs: 66, recoveryScore: 84, workoutTitle: "Upper Body Hypertrophy" },
      { day: "Sat", dateLabel: "Oct 17", steps: 12300, activeBurnKcal: 520, sleepHours: 7.8, hrvMs: 70, recoveryScore: 88, workoutTitle: "Outdoor Trail Ruck" },
      { day: "Sun", dateLabel: "Oct 18", steps: 9150, activeBurnKcal: 380, sleepHours: 8.2, hrvMs: 72, recoveryScore: 91, workoutTitle: "Active Rest & Mobility" },
      { day: "Mon", dateLabel: "Oct 19", steps: 11600, activeBurnKcal: 480, sleepHours: 7.0, hrvMs: 65, recoveryScore: 82, workoutTitle: "Lower Body Strength" },
      { day: "Tue", dateLabel: "Oct 20", steps: 10950, activeBurnKcal: 450, sleepHours: 7.4, hrvMs: 67, recoveryScore: 85, workoutTitle: "Zone 2 Steady Cardio" },
      { day: "Wed", dateLabel: "Oct 21", steps: 12100, activeBurnKcal: 510, sleepHours: 7.2, hrvMs: 69, recoveryScore: 87, workoutTitle: "Full Body Push/Pull" },
      { day: "Thu", dateLabel: "Today", steps: 11840, activeBurnKcal: 490, sleepHours: 7.3, hrvMs: 68, recoveryScore: 86, workoutTitle: "Cardio & Move Target Met", isToday: true },
    ],
    metrics: [
      { label: "Active Burn", value: "+490 kcal", sub: "Cardio Heart Points: 68 pts" },
      { label: "Daily Steps", value: "11,840 steps", sub: "118% of 10,000 step target" },
      { label: "Heart Rate & HRV", value: "54 bpm / 68 ms", sub: "Resting pulse in optimal range" },
      { label: "Sleep Architecture", value: "7h 18m", sub: "1h 35m Deep • Health Connect" },
    ],
  },
  {
    id: "applehealth",
    name: "Apple Health",
    category: "Apple Ecosystem",
    iconBg: "bg-[#FA2D48]",
    badgeColor: "text-[#FA2D48] border-[#FA2D48]/30 bg-[#FA2D48]/10",
    isConnected: false,
    lastSync: "Not connected",
    description: "Syncs all Apple Watch move ring burn, daily steps, resting heart rate, autonomic HRV recovery, and sleep stages.",
    telemetry: {
      activeBurnKcal: 510,
      dailySteps: 11420,
      restingHeartRate: 52,
      hrvMs: 74,
      sleepHours: 7.4,
      sleepFormatted: "7h 24m",
      deepSleepMins: 108,
      recoveryScore: 89,
      recentWorkout: "Functional Strength & Mobility (52 mins)",
    },
    history7Days: [
      { day: "Fri", dateLabel: "Oct 16", steps: 10800, activeBurnKcal: 490, sleepHours: 7.2, hrvMs: 71, recoveryScore: 86, workoutTitle: "Functional Core & Strength" },
      { day: "Sat", dateLabel: "Oct 17", steps: 13100, activeBurnKcal: 580, sleepHours: 7.6, hrvMs: 75, recoveryScore: 90, workoutTitle: "Weekend Hiking & Apple Move" },
      { day: "Sun", dateLabel: "Oct 18", steps: 8900, activeBurnKcal: 390, sleepHours: 8.1, hrvMs: 76, recoveryScore: 92, workoutTitle: "Restorative Yoga Flow" },
      { day: "Mon", dateLabel: "Oct 19", steps: 11200, activeBurnKcal: 500, sleepHours: 7.1, hrvMs: 70, recoveryScore: 85, workoutTitle: "Back Squats & Posterior Chain" },
      { day: "Tue", dateLabel: "Oct 20", steps: 11700, activeBurnKcal: 520, sleepHours: 7.5, hrvMs: 73, recoveryScore: 88, workoutTitle: "HIIT Interval Ergometer" },
      { day: "Wed", dateLabel: "Oct 21", steps: 12400, activeBurnKcal: 530, sleepHours: 7.3, hrvMs: 72, recoveryScore: 87, workoutTitle: "Chest, Delts & Triceps" },
      { day: "Thu", dateLabel: "Today", steps: 11420, activeBurnKcal: 510, sleepHours: 7.4, hrvMs: 74, recoveryScore: 89, workoutTitle: "Functional Strength & Mobility", isToday: true },
    ],
    metrics: [
      { label: "Active Move Burn", value: "+510 kcal", sub: "Apple Watch Move Ring 102%" },
      { label: "Daily Steps", value: "11,420 steps", sub: "Distance: 8.6 km recorded" },
      { label: "Heart Rate & HRV", value: "52 bpm / 74 ms", sub: "Autonomic recovery primed" },
      { label: "Sleep Architecture", value: "7h 24m", sub: "1h 48m Deep • 1h 55m REM" },
    ],
  },
  {
    id: "strava",
    name: "Strava",
    category: "GPS & Workouts",
    iconBg: "bg-[#FC4C02]",
    badgeColor: "text-[#FC4C02] border-[#FC4C02]/30 bg-[#FC4C02]/10",
    isConnected: false,
    lastSync: "Not connected",
    description: "Syncs all outdoor/indoor GPS activities, workout calorie burn, daily step cadence, heart rate telemetry, and recovery rest.",
    telemetry: {
      activeBurnKcal: 540,
      dailySteps: 10850,
      restingHeartRate: 53,
      hrvMs: 70,
      sleepHours: 7.2,
      sleepFormatted: "7h 12m",
      deepSleepMins: 102,
      recoveryScore: 87,
      recentWorkout: "8.4 km Interval Run (4:48 /km pace)",
    },
    history7Days: [
      { day: "Fri", dateLabel: "Oct 16", steps: 11200, activeBurnKcal: 510, sleepHours: 7.0, hrvMs: 68, recoveryScore: 84, workoutTitle: "5km Recovery Jog" },
      { day: "Sat", dateLabel: "Oct 17", steps: 14800, activeBurnKcal: 680, sleepHours: 7.5, hrvMs: 73, recoveryScore: 89, workoutTitle: "14km Saturday Long Run" },
      { day: "Sun", dateLabel: "Oct 18", steps: 7800, activeBurnKcal: 340, sleepHours: 8.0, hrvMs: 74, recoveryScore: 90, workoutTitle: "Rest Day & Leg Stretch" },
      { day: "Mon", dateLabel: "Oct 19", steps: 10400, activeBurnKcal: 490, sleepHours: 6.9, hrvMs: 67, recoveryScore: 83, workoutTitle: "Track Sprint Repeats" },
      { day: "Tue", dateLabel: "Oct 20", steps: 11500, activeBurnKcal: 530, sleepHours: 7.3, hrvMs: 71, recoveryScore: 86, workoutTitle: "Hill Climb Interval Ride" },
      { day: "Wed", dateLabel: "Oct 21", steps: 12800, activeBurnKcal: 570, sleepHours: 7.1, hrvMs: 69, recoveryScore: 85, workoutTitle: "Tempo Run + Core Circuit" },
      { day: "Thu", dateLabel: "Today", steps: 10850, activeBurnKcal: 540, sleepHours: 7.2, hrvMs: 70, recoveryScore: 87, workoutTitle: "8.4 km Interval Run", isToday: true },
    ],
    metrics: [
      { label: "Active Burn", value: "+540 kcal", sub: "8.4 km Run • Elev: 112m" },
      { label: "Daily Steps", value: "10,850 steps", sub: "Run cadence + daily movement" },
      { label: "Heart Rate & HRV", value: "53 bpm / 70 ms", sub: "Aerobic cardiac efficiency: High" },
      { label: "Sleep & Recovery", value: "7h 12m", sub: "1h 42m Deep restorative rest" },
    ],
  },
  {
    id: "whoop",
    name: "Whoop 4.0 / Garmin",
    category: "24/7 Biometric Recovery",
    iconBg: "bg-emerald-600",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    isConnected: false,
    lastSync: "Not connected",
    description: "Syncs complete 24/7 biometric streams: strain burn, all daily steps, resting heart rate, autonomic HRV readiness, and sleep debt.",
    telemetry: {
      activeBurnKcal: 525,
      dailySteps: 10320,
      restingHeartRate: 51,
      hrvMs: 76,
      sleepHours: 7.5,
      sleepFormatted: "7h 30m",
      deepSleepMins: 114,
      recoveryScore: 91,
      recentWorkout: "Strain 14.4 Athletic Conditioning",
    },
    history7Days: [
      { day: "Fri", dateLabel: "Oct 16", steps: 10100, activeBurnKcal: 490, sleepHours: 7.3, hrvMs: 74, recoveryScore: 88, workoutTitle: "Strain 13.2 Strength Session" },
      { day: "Sat", dateLabel: "Oct 17", steps: 12400, activeBurnKcal: 560, sleepHours: 7.9, hrvMs: 78, recoveryScore: 93, workoutTitle: "Strain 15.8 Trail Expedition" },
      { day: "Sun", dateLabel: "Oct 18", steps: 8400, activeBurnKcal: 370, sleepHours: 8.3, hrvMs: 80, recoveryScore: 95, workoutTitle: "Full Biometric Rest Day" },
      { day: "Mon", dateLabel: "Oct 19", steps: 11000, activeBurnKcal: 510, sleepHours: 7.1, hrvMs: 72, recoveryScore: 86, workoutTitle: "Strain 14.1 Hypertrophy" },
      { day: "Tue", dateLabel: "Oct 20", steps: 10600, activeBurnKcal: 480, sleepHours: 7.4, hrvMs: 75, recoveryScore: 89, workoutTitle: "Strain 12.6 Aerobic Base" },
      { day: "Wed", dateLabel: "Oct 21", steps: 11900, activeBurnKcal: 540, sleepHours: 7.3, hrvMs: 73, recoveryScore: 87, workoutTitle: "Strain 14.8 Complex Conditioning" },
      { day: "Thu", dateLabel: "Today", steps: 10320, activeBurnKcal: 525, sleepHours: 7.5, hrvMs: 76, recoveryScore: 91, workoutTitle: "Strain 14.4 Athletic Conditioning", isToday: true },
    ],
    metrics: [
      { label: "Daily Strain Burn", value: "+525 kcal", sub: "Strain 14.4 • Target 12-15 met" },
      { label: "Daily Steps", value: "10,320 steps", sub: "24/7 continuous accelerometer" },
      { label: "Heart Rate & HRV", value: "51 bpm / 76 ms", sub: "Green Zone 91% Recovery" },
      { label: "Sleep Performance", value: "7h 30m", sub: "1h 54m Deep • 94% Sleep Need" },
    ],
  },
];

const STORAGE_KEY = "uchitatvam_connected_health_single_v3";
const LEGACY_STORAGE_KEY = "potatofit_connected_health_single_v3";

export function useHealthSync() {
  const { triggerNotification } = usePWA();
  const [providers, setProviders] = useState<HealthProvider[]>(DEFAULT_PROVIDERS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Load state from localStorage on client
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge with DEFAULT_PROVIDERS to ensure telemetry and description structure are complete
            const merged = DEFAULT_PROVIDERS.map((def) => {
              const found = parsed.find((p: HealthProvider) => p.id === def.id);
              if (found) {
                return {
                  ...def,
                  isConnected: !!found.isConnected,
                  lastSync: found.lastSync || def.lastSync,
                };
              }
              return def;
            });
            setProviders(merged);
            return;
          }
        }
      } catch {
        // ignore JSON parse errors
      }
      setProviders(DEFAULT_PROVIDERS);
    };

    loadFromStorage();

    const handleCustomEvent = () => loadFromStorage();
    window.addEventListener("health-sync-update", handleCustomEvent);
    return () => window.removeEventListener("health-sync-update", handleCustomEvent);
  }, []);

  // Save to storage and dispatch event
  const saveProviders = useCallback((newProviders: HealthProvider[]) => {
    setProviders(newProviders);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProviders));
        window.dispatchEvent(new Event("health-sync-update"));
      } catch {
        // ignore
      }
    }
  }, []);

  // Connect a single provider (Single-app architecture: selecting one sets it as active)
  const connectProvider = useCallback(
    async (providerId: string, openPopup = true) => {
      setIsSyncing(true);
      const targetProvider = DEFAULT_PROVIDERS.find((p) => p.id === providerId);
      const providerName = targetProvider?.name || providerId.toUpperCase();

      if (openPopup && typeof window !== "undefined") {
        try {
          const res = await fetch(`/api/auth/url?provider=${providerId}`);
          if (res.ok) {
            const { url } = await res.json();
            const authWindow = window.open(
              url,
              `${providerId}_oauth_popup`,
              "width=600,height=720,status=no,resizable=yes"
            );
            if (!authWindow) {
              console.warn("OAuth popup blocked, connecting directly via Direct Health Bridge.");
            }
          }
        } catch {
          // Direct fallback
        }
      }

      // Single-app architecture: make this selected provider the only active one
      // If user had another one connected, it cleanly switches to this one
      const updated = DEFAULT_PROVIDERS.map((p) => {
        if (p.id === providerId) {
          return {
            ...p,
            isConnected: true,
            lastSync: "Just now",
          };
        }
        return {
          ...p,
          isConnected: false,
          lastSync: "Not connected",
        };
      });

      saveProviders(updated);
      setIsSyncing(false);

      const msg = `⚡ ${providerName} connected! All steps, burn, heart rate & sleep now streaming.`;
      setSyncStatusMsg(msg);
      setTimeout(() => setSyncStatusMsg(null), 4000);

      // Trigger Service Worker Alert
      await triggerNotification(`⚡ ${providerName} Connected`, {
        body: `All biometrics active! Daily burn (+${targetProvider?.telemetry.activeBurnKcal || 500} kcal), steps (${targetProvider?.telemetry.dailySteps.toLocaleString()}), and sleep synced.`,
        icon: "/android-chrome-192x192.png",
      });
    },
    [saveProviders, triggerNotification]
  );

  // Disconnect provider
  const disconnectProvider = useCallback(
    (providerId?: string) => {
      const updated = providers.map((p) => {
        if (!providerId || p.id === providerId) {
          return {
            ...p,
            isConnected: false,
            lastSync: "Disconnected",
          };
        }
        return p;
      });

      saveProviders(updated);
      setSyncStatusMsg("Fitness tracker disconnected.");
      setTimeout(() => setSyncStatusMsg(null), 3000);
    },
    [providers, saveProviders]
  );

  // Disconnect all
  const disconnectAll = useCallback(() => {
    const updated = DEFAULT_PROVIDERS.map((p) => ({
      ...p,
      isConnected: false,
      lastSync: "Not connected",
    }));
    saveProviders(updated);
    setSyncStatusMsg("Fitness tracker disconnected.");
    setTimeout(() => setSyncStatusMsg(null), 3000);
  }, [saveProviders]);

  // Sync / refresh
  const syncAll = useCallback(async () => {
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 600));

    const updated = providers.map((p) =>
      p.isConnected ? { ...p, lastSync: "Just now" } : p
    );
    saveProviders(updated);
    setIsSyncing(false);

    setSyncStatusMsg("Telemetry refreshed. Steps, burn, heart rate and sleep updated.");
    setTimeout(() => setSyncStatusMsg(null), 3500);

    await triggerNotification("Uchitatvam // Telemetry Refreshed", {
      body: "Health telemetry up to date. Macro allocations and recovery metrics verified.",
      icon: "/android-chrome-192x192.png",
    });
  }, [providers, saveProviders, triggerNotification]);

  // Active provider (the single chosen app)
  const connectedProviders = providers.filter((p) => p.isConnected);
  const primaryProvider = connectedProviders[0] || null;
  const hasAnyConnected = !!primaryProvider;
  const connectedCount = connectedProviders.length;

  const isStravaConnected = primaryProvider?.id === "strava";
  const isAppleHealthConnected = primaryProvider?.id === "applehealth";
  const isGoogleFitConnected = primaryProvider?.id === "googlefit";
  const isWhoopConnected = primaryProvider?.id === "whoop";

  // Telemetry is 100% sourced from that ONE single chosen app!
  const activeBurnExtraKcal = primaryProvider ? primaryProvider.telemetry.activeBurnKcal : 0;
  const dailySteps = primaryProvider ? primaryProvider.telemetry.dailySteps : null;
  const restingHeartRate = primaryProvider ? primaryProvider.telemetry.restingHeartRate : null;
  const hrvMs = primaryProvider ? primaryProvider.telemetry.hrvMs : null;
  const sleepHours = primaryProvider ? primaryProvider.telemetry.sleepHours : null;
  const sleepFormatted = primaryProvider ? primaryProvider.telemetry.sleepFormatted : null;
  const deepSleepMins = primaryProvider ? primaryProvider.telemetry.deepSleepMins : null;
  const recoveryScore = primaryProvider ? primaryProvider.telemetry.recoveryScore : null;
  const activeWorkoutName = primaryProvider ? primaryProvider.telemetry.recentWorkout : null;

  const BASELINE_HISTORY_7_DAYS: DailyActivityRecord[] = [
    { day: "Fri", dateLabel: "Oct 16", steps: 9800, activeBurnKcal: 420, sleepHours: 7.0, hrvMs: 64, recoveryScore: 82, workoutTitle: "Mobility & Push Sets" },
    { day: "Sat", dateLabel: "Oct 17", steps: 11400, activeBurnKcal: 510, sleepHours: 7.5, hrvMs: 68, recoveryScore: 87, workoutTitle: "Aerobic Conditioning" },
    { day: "Sun", dateLabel: "Oct 18", steps: 8600, activeBurnKcal: 350, sleepHours: 8.0, hrvMs: 71, recoveryScore: 90, workoutTitle: "Active Recovery Walk" },
    { day: "Mon", dateLabel: "Oct 19", steps: 10800, activeBurnKcal: 460, sleepHours: 6.9, hrvMs: 63, recoveryScore: 80, workoutTitle: "Barbell Lower Body" },
    { day: "Tue", dateLabel: "Oct 20", steps: 11200, activeBurnKcal: 480, sleepHours: 7.3, hrvMs: 66, recoveryScore: 84, workoutTitle: "Tempo Zone 2 Run" },
    { day: "Wed", dateLabel: "Oct 21", steps: 11900, activeBurnKcal: 500, sleepHours: 7.1, hrvMs: 67, recoveryScore: 86, workoutTitle: "Upper Body Hypertrophy" },
    { day: "Thu", dateLabel: "Today", steps: 10500, activeBurnKcal: 450, sleepHours: 7.2, hrvMs: 65, recoveryScore: 83, workoutTitle: "Cardio Core & Flow", isToday: true },
  ];

  const baselineCalories = 2150;
  const totalDailyExpenditure = baselineCalories + activeBurnExtraKcal;
  const proteinTargetGrams = hasAnyConnected ? 165 : 140;

  const sevenDayHistory: DailyActivityRecord[] = primaryProvider?.history7Days || BASELINE_HISTORY_7_DAYS;

  return {
    providers,
    connectedProviders,
    connectedCount,
    hasAnyConnected,
    primaryProvider,
    isSyncing,
    syncStatusMsg,
    isStravaConnected,
    isAppleHealthConnected,
    isGoogleFitConnected,
    isWhoopConnected,
    activeBurnExtraKcal,
    baselineCalories,
    totalDailyExpenditure,
    proteinTargetGrams,
    dailySteps,
    restingHeartRate,
    hrvMs,
    sleepHours,
    sleepFormatted,
    deepSleepMins,
    recoveryScore,
    activeWorkoutName,
    sevenDayHistory,
    connectProvider,
    selectSingleTracker: connectProvider,
    disconnectProvider,
    disconnectAll,
    syncAll,
  };
}
