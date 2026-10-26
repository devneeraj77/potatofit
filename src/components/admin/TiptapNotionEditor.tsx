"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Sparkles,
  Command,
  FileCode,
} from "lucide-react";

interface TiptapNotionEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export default function TiptapNotionEditor({
  content = "",
  onChange,
  placeholder = "Type '/' for Notion-style commands, or start typing your protocol...",
}: TiptapNotionEditorProps) {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[320px] px-4 py-3 text-sm sm:text-base leading-relaxed text-[#121815] dark:text-[#E2E7DE]",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
      if (onChange) {
        onChange(html);
      }
    },
  });

  // Keep editor content in sync when loaded from props
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="w-full min-h-[340px] rounded-xl border border-[#757761]/25 bg-[#F4F6F5] dark:bg-[#121815] animate-pulse flex items-center justify-center text-xs text-[#757761]">
        Loading Notion-style editor...
      </div>
    );
  }

  const slashCommands = [
    {
      title: "Text",
      desc: "Plain body paragraph",
      icon: <Command className="w-4 h-4 text-[#A0A493]" />,
      action: () => editor.chain().focus().setParagraph().run(),
    },
    {
      title: "Heading 1",
      desc: "Big protocol section header",
      icon: <Heading1 className="w-4 h-4 text-[#f7fe72]" />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: "Heading 2",
      desc: "Medium subsection header",
      icon: <Heading2 className="w-4 h-4 text-[#f7fe72]" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: "Heading 3",
      desc: "Small block header",
      icon: <Heading3 className="w-4 h-4 text-[#f7fe72]" />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: "Bullet List",
      desc: "Unordered checklist or steps",
      icon: <List className="w-4 h-4 text-[#60a5fa]" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      title: "Numbered List",
      desc: "Sequential routine protocol",
      icon: <ListOrdered className="w-4 h-4 text-[#60a5fa]" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      title: "Callout / Quote",
      desc: "Emphasized biometric law or quote",
      icon: <Quote className="w-4 h-4 text-[#34d399]" />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      title: "Code Block",
      desc: "JSON telemetry or technical formula",
      icon: <FileCode className="w-4 h-4 text-[#f87171]" />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: "Divider",
      desc: "Visual horizontal hairline separator",
      icon: <Minus className="w-4 h-4 text-[#A0A493]" />,
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <div className="rounded-2xl border border-[#757761]/30 bg-white dark:bg-[#0E1310] overflow-hidden shadow-xs">
      {/* Top Floating / Notion Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 sm:p-2.5 border-b border-[#757761]/20 bg-[#F4F6F5] dark:bg-[#141A16]">
        {/* Formatting Actions */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Notion Quick Slash Command Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSlashMenuOpen(!slashMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1D2520] text-[#f7fe72] border border-[#757761]/35 hover:bg-[#253028] transition-colors"
              title="Notion Slash Commands"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Notion Commands</span>
            </button>

            {/* Notion Command Menu Dropdown */}
            {slashMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl bg-[#0B0E0C] border border-[#757761]/40 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#757761]">
                  Basic Notion Blocks
                </div>
                <div className="space-y-0.5">
                  {slashCommands.map((cmd) => (
                    <button
                      key={cmd.title}
                      type="button"
                      onClick={() => {
                        cmd.action();
                        setSlashMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left text-xs text-[#CBD2C7] hover:bg-[#18211C] hover:text-white transition-colors"
                    >
                      <div className="p-1 rounded bg-[#141A16] border border-[#757761]/30">
                        {cmd.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{cmd.title}</div>
                        <div className="text-[10px] text-[#757761]">{cmd.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-[#757761]/25 mx-1" />

          {/* Heading 1 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>

          {/* Heading 2 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          {/* Heading 3 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#757761]/25 mx-1" />

          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("bold")
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("italic")
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("strike")
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          {/* Code */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("code")
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#757761]/25 mx-1" />

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("bulletList")
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("orderedList")
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Blockquote / Callout */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive("blockquote")
                ? "bg-[#f7fe72] text-[#0B0E0C] font-bold"
                : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15"
            }`}
            title="Blockquote / Callout"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Divider */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg text-xs text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15 transition-colors"
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Right side undo/redo & stats */}
        <div className="flex items-center gap-2 text-xs text-[#757761]">
          <span className="hidden sm:inline font-mono text-[11px] text-[#A0A493]">
            {wordCount} words · {Math.max(1, Math.ceil(wordCount / 200))} min read
          </span>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-[#A0A493] hover:text-white disabled:opacity-30 disabled:hover:text-[#A0A493] transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-[#A0A493] hover:text-white disabled:opacity-30 disabled:hover:text-[#A0A493] transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="min-h-[380px] p-2 sm:p-4 bg-white dark:bg-[#0B0E0C] text-[#121815] dark:text-[#E2E7DE]">
        <EditorContent editor={editor} />
      </div>

      {/* Footer helper */}
      <div className="px-4 py-2 border-t border-[#757761]/20 bg-[#F4F6F5] dark:bg-[#121815] flex items-center justify-between text-[11px] text-[#757761]">
        <span>Tip: Use Notion Commands or standard Markdown shortcuts for fast styling</span>
        <span className="font-mono text-[#A0A493]">Tiptap Notion Engine v3.3</span>
      </div>
    </div>
  );
}
