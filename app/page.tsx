"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { blog, projects, research, type DetailItem } from "./data/items";

const folders = ["Bio", "Projects", "Research", "Blog", "Notes"];
const LAUNCH_DURATION = 560;
const PAGE_FADE_DURATION = 560;

const sortByYear = (items: DetailItem[]) =>
  [...items].sort((a, b) => b.year - a.year);

export default function Home() {
  const [activePage, setActivePage] = useState<string | null>(null);
  const [launching, setLaunching] = useState<string | null>(null);
  const [pageVisible, setPageVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimer = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  useEffect(() => {
    setSelectedId(null);
  }, [activePage]);

  const handleFolderClick = (label: string) => {
    if (launching || pageVisible) return;
    clearTimer();
    setActivePage(label);
    setPageVisible(true);
    setLaunching(label);
  };

  const handleBack = useCallback(() => {
    if (!pageVisible) return;
    clearTimer();
    setPageVisible(false);
    timersRef.current.push(
      window.setTimeout(() => {
        setActivePage(null);
        setLaunching(null);
      }, PAGE_FADE_DURATION)
    );
  }, [pageVisible]);

  useEffect(() => {
    if (!pageVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBack, pageVisible]);

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
          {activePage === "Projects" ||
          activePage === "Research" ||
          activePage === "Blog" ? (
            <PageDetails
              items={sortByYear(
                activePage === "Projects"
                  ? projects
                  : activePage === "Research"
                    ? research
                    : blog
              )}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <p>{activePage ? `${activePage} content goes here.` : ""}</p>
          )}
        </main>
      </section>
    </div>
  );
}

function PageDetails({
  items,
  selectedId,
  onSelect,
}: {
  items: DetailItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="split-layout">
      <div className="item-list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`item-button ${selectedId === item.id ? "is-active" : ""}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="item-logo">{item.logoText}</span>
            <span className="item-meta">
              <span className="item-title">{item.title}</span>
              <span className="item-year">{item.year}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="item-divider" aria-hidden="true" />
      <div className="item-detail">
        {selectedItem ? (
          <>
            <h2 className="detail-title">{selectedItem.title}</h2>
            <p className="detail-summary">{selectedItem.summary}</p>
            <div className="detail-image">
              <span>{selectedItem.imageLabel}</span>
            </div>
          </>
        ) : (
          <div className="detail-placeholder">[SELECT]</div>
        )}
      </div>
    </div>
  );
}
