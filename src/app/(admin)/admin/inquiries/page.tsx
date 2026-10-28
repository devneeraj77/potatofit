"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Send,
} from "lucide-react";

interface Inquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  category: "Vendor Partnership" | "Wearable Sync Issue" | "Nutrition Plan" | "General";
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  receivedAt: string;
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    senderName: "Rohan Verma",
    senderEmail: "rohan.v@outlook.com",
    category: "Vendor Partnership",
    subject: "Listing our organic dairy farm in Bhopal",
    message: "Namaste team Uchitatvam. We operate a certified A2 Gir cow dairy farm in Bhopal outskirts with daily deliveries. How can we get mapped for athletes in Bhopal?",
    status: "new",
    receivedAt: "2026-10-28 10:14",
  },
  {
    id: "inq-2",
    senderName: "Priya Sharma",
    senderEmail: "priya.fitrunner@gmail.com",
    category: "Wearable Sync Issue",
    subject: "Whoop 4.0 HRV latency exceeding threshold",
    message: "My Whoop strap synced with 120ms latency this morning. The sync pipe card flagged amber. Is there a cache reset I should perform?",
    status: "in_progress",
    receivedAt: "2026-10-27 18:32",
  },
  {
    id: "inq-3",
    senderName: "Vikram Sengupta",
    senderEmail: "vikram.s@apextech.co",
    category: "Nutrition Plan",
    subject: "High protein vegetarian plan for marathon prep",
    message: "Loved the vegetable mandi mapping! Can we customize the iron intake target specifically for high-altitude endurance runs in Uttarakhand?",
    status: "resolved",
    receivedAt: "2026-10-25 14:05",
  },
  {
    id: "inq-4",
    senderName: "Ananya Dixit",
    senderEmail: "ananya.dixit@indorefit.org",
    category: "General",
    subject: "Community athletic leaderboard quest event",
    message: "We want to sponsor a city-wide 10k sprint challenge quest in Indore next month with potato token prizes.",
    status: "new",
    receivedAt: "2026-10-28 08:45",
  },
];

export default function InquiriesManagementPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const handleUpdateStatus = (id: string, nextStatus: "new" | "in_progress" | "resolved") => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: nextStatus } : i))
    );
    if (activeInquiry?.id === id) {
      setActiveInquiry((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this inquiry?")) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (activeInquiry?.id === id) setActiveInquiry(null);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeInquiry) return;

    setSendingReply(true);
    setTimeout(() => {
      handleUpdateStatus(activeInquiry.id, "resolved");
      setSendingReply(false);
      setReplyText("");
      alert(`Reply dispatched to ${activeInquiry.senderEmail}`);
    }, 800);
  };

  const filtered = inquiries.filter((i) => {
    const matchesSearch =
      i.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Athlete &amp; Partner Inbox
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs font-mono text-[#34d399]">{unreadCount} Unread Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Inquiries &amp; Support Inbox
          </h1>
          <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
            Review vendor partnership proposals, telemetry sync support requests, and user feedback messages.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#757761]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
          >
            <option value="all">All Inquiries</option>
            <option value="new">New (Unread)</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Two-Pane Layout: Inquiry List + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List Pane */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#757761] rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
              No inquiries found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveInquiry(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeInquiry?.id === item.id
                    ? "bg-[#18211C] border-[#f7fe72] shadow-sm"
                    : "bg-white dark:bg-[#0E1310] border-[#757761]/25 hover:border-[#757761]/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#141A16] text-[#34d399] border border-[#34d399]/30">
                    {item.category}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                      item.status === "new"
                        ? "bg-[#f7fe72]/15 text-[#7A5A00] dark:text-[#f7fe72] border-[#f7fe72]/30 font-bold"
                        : item.status === "in_progress"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#121815] dark:text-white line-clamp-1">
                  {item.subject}
                </h3>
                <p className="text-[11px] text-[#505445] dark:text-[#A0A493] line-clamp-2 mt-1">
                  {item.message}
                </p>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#757761]/15 text-[10px] font-mono text-[#757761]">
                  <span>{item.senderName}</span>
                  <span>{item.receivedAt}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail & Reply Pane */}
        <div className="lg:col-span-7">
          {activeInquiry ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#757761]/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#18211C] text-[#f7fe72] border border-[#757761]/35">
                      {activeInquiry.category}
                    </span>
                    <span className="text-xs font-mono text-[#757761]">{activeInquiry.receivedAt}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#121815] dark:text-white">
                    {activeInquiry.subject}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeInquiry.id, "in_progress")}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeInquiry.id, "resolved")}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    Mark Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(activeInquiry.id)}
                    className="p-1.5 rounded-lg text-[#757761] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/20 text-xs">
                <div className="w-9 h-9 rounded-full bg-[#1A231D] border border-[#757761]/35 flex items-center justify-center font-bold text-xs text-[#f7fe72] shrink-0">
                  {activeInquiry.senderName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#121815] dark:text-white">
                    {activeInquiry.senderName}
                  </div>
                  <div className="text-[11px] font-mono text-[#757761]">
                    {activeInquiry.senderEmail}
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#141A16]/50 border border-[#757761]/20 text-xs leading-relaxed text-[#121815] dark:text-[#E2E7DE]">
                {activeInquiry.message}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-[#757761]/20">
                <label className="block text-xs font-mono text-[#505445] dark:text-[#A0A493]">
                  Direct Reply to {activeInquiry.senderEmail}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type official response from Uchitatvam operations..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#757761]">
                    Dispatches from support@uchitatvam.com
                  </span>
                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingReply ? "Sending..." : "Dispatch Reply"}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 text-[#757761] space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-[#757761]/50" />
              <div className="text-xs font-mono">Select an inquiry from the inbox to read and respond.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
