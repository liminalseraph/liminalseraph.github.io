"use client";

import { useEffect, useRef, useState } from "react";

const folders = ["Bio", "Projects", "Research", "Blog", "Notes"];
const LAUNCH_DURATION = 560;
const PAGE_FADE_DURATION = 560;

export default function Home() {
  const [activePage, setActivePage] = useState<string | null>(null);
  const [launching, setLaunching] = useState<string | null>(null);
  const [pageVisible, setPageVisible] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearTimer = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleFolderClick = (label: string) => {
    if (launching || pageVisible) return;
    clearTimer();
    setActivePage(label);
    setPageVisible(true);
    setLaunching(label);
  };

  const handleBack = () => {
    if (!pageVisible) return;
    clearTimer();
    setPageVisible(false);
    timersRef.current.push(
      window.setTimeout(() => {
        setActivePage(null);
        setLaunching(null);
      }, PAGE_FADE_DURATION)
    );
  };

  return (
    <div className="app">
      <section
        className="home-view"
        aria-hidden={pageVisible}
        style={{ pointerEvents: pageVisible ? "none" : "auto" }}
      >
        <div className="stack" aria-hidden={pageVisible}>
          {folders.map((label, index) => {
            const isLaunching = launching === label;
            const isDimmed = launching && !isLaunching;
            return (
              <button
                key={label}
                className={`folder ${isLaunching ? "is-launching" : ""} ${isDimmed ? "is-dimmed" : ""}`}
                style={
                  {
                    "--offset-x": `${index * 28}px`,
                    "--offset-y": `${index * 36}px`,
                    "--stack-index": `${index + 1}`,
                  } as React.CSSProperties
                }
                onClick={() => handleFolderClick(label)}
                type="button"
              >
                <span className="folder__body">
                  <span className="folder__label">{label}</span>
                  <svg
                    className="folder__svg"
                    viewBox="0 0 260 180"
                    role="img"
                    aria-label={`${label} folder`}
                  >
                    <path d="M248 56H128L110 40H12V168H248Z" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className={`page-view ${pageVisible ? "is-visible" : ""}`}
        aria-hidden={!pageVisible}
      >
        <header className="page-header">
          <div className="page-label">{activePage ?? ""}</div>
          <button className="back-button" type="button" onClick={handleBack}>
            <span aria-hidden="true">⌃</span>
            <span className="sr-only">Back</span>
          </button>
        </header>
        <main className="page-content">
          <p>{activePage ? `${activePage} content goes here.` : ""}</p>
        </main>
      </section>
    </div>
  );
}
