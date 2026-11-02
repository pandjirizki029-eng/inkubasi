import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { uid } from "../../../../data/cases";
import { Button } from "../../../ui/form";

/** Daftar tindakan (Corrective / Preventive) dengan checklist besar. */
export default function ActionList({ id, title, desc, items, onChange, placeholder, accent = "bg-ink" }) {
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    onChange([...items, { id: uid("act"), text: text.trim(), done: false }]);
    setText("");
  };
  const toggle = (itemId) => onChange(items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)));
  const remove = (itemId) => onChange(items.filter((i) => i.id !== itemId));
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h4 className="flex items-center gap-2 text-[16px] font-bold text-ink">
            <span className={`h-3 w-3 rounded-sm ${accent}`} /> {title}
          </h4>
          <p className="text-[13.5px] text-ink-2">{desc}</p>
        </div>
        <span className="shrink-0 font-mono text-[14px] font-bold text-ink-2">
          {doneCount}/{items.length} selesai
        </span>
      </div>

      {items.length === 0 && (
        <p className="rounded-xl border-2 border-dashed border-line p-3 text-center text-[14px] text-ink-3">Belum ada tindakan.</p>
      )}

      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id} className={`flex items-center gap-2 rounded-xl border-2 p-2 ${i.done ? "border-done/40 bg-done/5" : "border-line bg-card"}`}>
            <button
              type="button"
              onClick={() => toggle(i.id)}
              aria-pressed={i.done}
              className={`tap flex h-11 shrink-0 items-center gap-1.5 rounded-lg border-2 px-2.5 text-[13px] font-bold ${
                i.done ? "border-done bg-done text-white" : "border-ink-3 bg-card text-ink"
              }`}
            >
              <Check size={16} strokeWidth={3} /> {i.done ? "Selesai" : "Tandai"}
            </button>
            <span className={`min-w-0 flex-1 text-[15px] leading-snug ${i.done ? "text-ink-2 line-through" : "text-ink"}`}>{i.text}</span>
            <button
              type="button"
              onClick={() => remove(i.id)}
              className="tap flex h-11 shrink-0 items-center gap-1 rounded-lg px-2 text-[13px] font-bold text-critical-ink"
            >
              <Trash2 size={16} /> Hapus
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          id={id}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          aria-label={`Tambah ${title}`}
          className="h-12 min-w-0 flex-1 rounded-xl border-2 border-line bg-card px-3.5 text-[16px] outline-none placeholder:text-ink-3 focus:border-ink"
        />
        <Button size="md" icon={Plus} onClick={add} disabled={!text.trim()}>
          Tambah
        </Button>
      </div>
    </div>
  );
}
