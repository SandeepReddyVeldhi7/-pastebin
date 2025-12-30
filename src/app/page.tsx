"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "last_paste_url";


function saveUrl(url: string) {
  localStorage.setItem(STORAGE_KEY, btoa(url));
}

function getSavedUrl(): string | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? atob(raw) : null;
}

function clearSavedUrl() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState(() => {
  if (typeof window === "undefined") return "";
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? atob(raw) : "";
});

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);



  async function submit() {
    if (!content.trim()) return;

    setLoading(true);

    clearSavedUrl();
    setUrl("");

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    setUrl(data.url);
    saveUrl(data.url); 
    setContent("");
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setShowToast(true);

    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 1500);
  }

  function deletePasteLink() {
    clearSavedUrl();
    setUrl("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-slate-100 via-white to-indigo-100">

      <div className="w-full max-w-3xl rounded-3xl
        bg-white/80 backdrop-blur-xl
        border border-slate-200
        shadow-xl">

        <div className="px-8 py-6 text-center border-b border-slate-200">
          <h1 className="text-4xl font-extrabold text-transparent
            bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Pastebin Lite
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Paste • Share • Done
          </p>
        </div>

        <div className="px-8 pb-8 space-y-5">
         
          <textarea
            className="w-full min-h-[240px] rounded-2xl
              bg-slate-50 text-slate-900 placeholder-slate-400
              border border-slate-300 p-5 font-mono text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Drop your code or text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{content.length} chars</span>
            {content.length > 0 && (
              <span className="text-indigo-600">Ready to paste</span>
            )}
          </div>

          {/* Create button */}
          <button
            onClick={submit}
            disabled={!content.trim() || loading}
            className="w-full py-4 rounded-2xl font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-violet-600
              hover:brightness-110
              active:scale-[0.98] transition
              disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Paste"}
          </button>

          {/* Result */}
          {url && (
            <div className="rounded-2xl p-5
              bg-indigo-50 border border-indigo-200 text-slate-700">

              <p className="text-xs mb-2 text-indigo-700 font-medium">
                Shareable link
              </p>

              <div className="flex items-center gap-3">
                <a
                  href={url}
                  className="flex-1 break-all underline text-indigo-700"
                >
                  {url}
                </a>

                <button
                  onClick={copy}
                  className="px-4 py-2 rounded-xl text-xs font-medium
                    bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={deletePasteLink}
                  className="px-4 py-2 rounded-xl text-xs font-medium
                    bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

         
          {showToast && (
            <div className="fixed bottom-6 right-6 z-50
              rounded-xl bg-indigo-600 text-white
              px-4 py-3 shadow-lg">
              ✅ Link copied to clipboard
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
