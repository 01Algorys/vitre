"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, UnderlineIcon, List, ListOrdered, Link2, Quote, Minus } from "lucide-react";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write something…" }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] w-full bg-[#0a0a0a]/80 border border-white/10 rounded-b-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]/50 transition-colors duration-200 prose prose-invert prose-sm max-w-none leading-relaxed",
      },
    },
  });

  // Sync external value changes (e.g. switching section)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);

  if (!editor) return null;

  const btn = (active: boolean, onClick: () => void, icon: React.ReactNode, title?: string) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors duration-150 ${active ? "bg-[#d4af37] text-black" : "text-[#666] hover:text-white hover:bg-white/10"}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="rounded-lg border border-white/10 focus-within:border-[#d4af37]/40 transition-colors duration-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-[#111] border-b border-white/8">
        {btn(editor.isActive("bold"),      () => editor.chain().focus().toggleBold().run(),           <Bold size={13} />,           "Bold")}
        {btn(editor.isActive("italic"),    () => editor.chain().focus().toggleItalic().run(),         <Italic size={13} />,         "Italic")}
        {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(),      <UnderlineIcon size={13} />,  "Underline")}
        <div className="w-px h-4 bg-white/10 mx-1" />
        {btn(editor.isActive("bulletList"),  () => editor.chain().focus().toggleBulletList().run(),  <List size={13} />,           "Bullet list")}
        {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={13} />,    "Ordered list")}
        {btn(editor.isActive("blockquote"),  () => editor.chain().focus().toggleBlockquote().run(),  <Quote size={13} />,          "Blockquote")}
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          type="button"
          title="Insert link"
          onClick={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`p-1.5 rounded transition-colors duration-150 ${editor.isActive("link") ? "bg-[#d4af37] text-black" : "text-[#666] hover:text-white hover:bg-white/10"}`}
        >
          <Link2 size={13} />
        </button>
        {btn(false, () => editor.chain().focus().setHorizontalRule().run(), <Minus size={13} />, "Horizontal rule")}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
