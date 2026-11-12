"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { PROJECT_SOURCE_REPOS } from "@/lib/data/project-source-code";
import {
  GITHUB_REPO_TREES,
  type RepoTreeEntry,
} from "@/lib/data/github-repo-trees";
import { formatBytes } from "@/lib/format";
import { deriveAutoSummary } from "@/lib/summary";

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "ico",
]);

const BINARY_EXTENSIONS = new Set([
  "mp3",
  "wav",
  "ogg",
  "mp4",
  "webm",
  "ttf",
  "otf",
  "woff",
  "woff2",
  "eot",
  "jar",
  "keystore",
  "jks",
  "so",
  "dll",
  "exe",
  "pdf",
  "zip",
  "tar",
  "gz",
]);

function getExtension(filePath: string): string {
  const base = filePath.toLowerCase().split("/").pop() ?? "";
  return base.includes(".") ? base.split(".").pop() ?? "" : "";
}



export function SourceCodeExplorer({
  projectSlug,
  lang,
  compact = false,
}: {
  projectSlug: string;
  lang: "en" | "id";
  compact?: boolean;
}) {
  const curatedRepo = PROJECT_SOURCE_REPOS[projectSlug];
  const treeSnapshot = GITHUB_REPO_TREES[projectSlug];
  const isId = lang === "id";

  // In-memory cache of fetched raw file contents across clicks
  const fileCacheRef = useRef<Map<string, string>>(new Map());

  const defaultFilePath =
    curatedRepo?.files[0]?.path ??
    treeSnapshot?.items.find((i) => i.t === "f")?.p ??
    "README.md";

  const [currentDir, setCurrentDir] = useState<string>("");
  const [activeFilePath, setActiveFilePath] = useState<string>(defaultFilePath);
  const [activeCode, setActiveCode] = useState<string>("");
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Seed cache with curated files for 0ms initial load
  useEffect(() => {
    if (!curatedRepo) return;
    curatedRepo.files.forEach((f) => {
      fileCacheRef.current.set(`${curatedRepo.repoName}:${f.path}`, f.code);
    });
  }, [curatedRepo]);

  // Reset state when switching projects
  useEffect(() => {
    const firstPath =
      curatedRepo?.files[0]?.path ??
      treeSnapshot?.items.find((i) => i.t === "f")?.p ??
      "README.md";
    setCurrentDir("");
    setSearchQuery("");
    setActiveFilePath(firstPath);
  }, [projectSlug, curatedRepo, treeSnapshot]);

  // Load active file content (from cache or raw.githubusercontent.com CDN)
  useEffect(() => {
    if (!treeSnapshot || !activeFilePath) return;

    const ext = getExtension(activeFilePath);
    if (IMAGE_EXTENSIONS.has(ext) || BINARY_EXTENSIONS.has(ext)) {
      setLoadingFile(false);
      setActiveCode("");
      return;
    }

    const cacheKey = `${treeSnapshot.repoName}:${activeFilePath}`;
    const cached = fileCacheRef.current.get(cacheKey);
    if (cached !== undefined) {
      setActiveCode(cached);
      setLoadingFile(false);
      return;
    }

    let cancelled = false;
    setLoadingFile(true);

    const rawUrl = `https://raw.githubusercontent.com/AryaWgna/${treeSnapshot.repoName}/${treeSnapshot.branch}/${encodeURI(
      activeFilePath
    )}`;

    fetch(rawUrl)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return await res.text();
      })
      .then((text) => {
        if (cancelled) return;
        fileCacheRef.current.set(cacheKey, text);
        setActiveCode(text);
        setLoadingFile(false);
      })
      .catch(() => {
        if (cancelled) return;
        setActiveCode(
          isId
            ? `// Tidak dapat memuat ${activeFilePath}. Pastikan koneksi internet aktif.`
            : `// Could not load ${activeFilePath}. Please check your connection.`
        );
        setLoadingFile(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeFilePath, isId, treeSnapshot]);

  const allEntries = useMemo(
    () => treeSnapshot?.items ?? [],
    [treeSnapshot]
  );

  const stats = useMemo(() => {
    let folders = 0;
    let files = 0;
    for (const item of allEntries) {
      if (item.t === "d") folders++;
      else files++;
    }
    return { folders, files };
  }, [allEntries]);

  // Direct children of `currentDir` (just like GitHub's directory view)
  const directoryEntries = useMemo(() => {
    const prefix = currentDir ? `${currentDir}/` : "";
    const children: RepoTreeEntry[] = [];

    for (const item of allEntries) {
      if (!item.p.startsWith(prefix)) continue;
      const rest = item.p.slice(prefix.length);
      if (!rest || rest.includes("/")) continue;
      children.push(item);
    }

    // Sort folders first (A-Z), then files (A-Z)
    children.sort((a, b) => {
      if (a.t !== b.t) return a.t === "d" ? -1 : 1;
      return a.p.localeCompare(b.p);
    });

    return children;
  }, [allEntries, currentDir]);

  // Count direct items inside each folder for helpful metadata
  const folderChildCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of allEntries) {
      const lastSlash = item.p.lastIndexOf("/");
      if (lastSlash > 0) {
        const parent = item.p.slice(0, lastSlash);
        counts.set(parent, (counts.get(parent) ?? 0) + 1);
      }
    }
    return counts;
  }, [allEntries]);

  // Global file search across all files in the repository
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allEntries
      .filter((item) => item.t === "f" && item.p.toLowerCase().includes(q))
      .slice(0, 40);
  }, [allEntries, searchQuery]);

  if (!treeSnapshot) return null;

  const activeEntry = allEntries.find((i) => i.p === activeFilePath);
  const activeCurated = curatedRepo?.files.find(
    (f) => f.path === activeFilePath
  );
  const activeExt = getExtension(activeFilePath);
  const isImageFile = IMAGE_EXTENSIONS.has(activeExt);
  const isBinaryFile = BINARY_EXTENSIONS.has(activeExt);
  const rawAssetUrl = `https://raw.githubusercontent.com/AryaWgna/${treeSnapshot.repoName}/${treeSnapshot.branch}/${encodeURI(
    activeFilePath
  )}`;
  const codeLines = activeCode.split("\n");
  const activeSummary =
    activeCurated?.summary[lang] ??
    deriveAutoSummary(
      activeFilePath,
      activeExt,
      activeCode,
      isImageFile,
      isBinaryFile,
      isId
    );

  const breadcrumbParts = currentDir ? currentDir.split("/") : [];

  const handleSelectFile = (filePath: string) => {
    setActiveFilePath(filePath);
    const lastSlash = filePath.lastIndexOf("/");
    setCurrentDir(lastSlash > 0 ? filePath.slice(0, lastSlash) : "");
    setSearchQuery("");
  };

  const handleGoUpDir = () => {
    if (!currentDir) return;
    const lastSlash = currentDir.lastIndexOf("/");
    setCurrentDir(lastSlash > 0 ? currentDir.slice(0, lastSlash) : "");
  };

  const handleCopyCode = () => {
    try {
      navigator.clipboard?.writeText(activeCode);
    } catch {
      // ignore
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      id={`source-explorer-${projectSlug}`}
      className="rec-card"
      style={{
        gap: "10px",
        padding: compact ? "12px" : "15px",
        border: "1px solid rgba(242, 242, 242, 0.16)",
        background: "rgba(10, 10, 12, 0.9)",
      }}
    >
      {/* 1. GitHub-Style Repository Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(242, 242, 242, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ color: "rgba(242, 242, 242, 0.85)", flexShrink: 0 }}
            aria-hidden="true"
          >
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            AryaWgna / {treeSnapshot.repoName}
          </span>
          <span
            style={{
              fontSize: "10.5px",
              padding: "2px 7px",
              borderRadius: "999px",
              border: "1px solid rgba(242, 242, 242, 0.2)",
              color: "rgba(242, 242, 242, 0.8)",
            }}
          >
            Public
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "6px",
              background: "rgba(242, 242, 242, 0.07)",
              color: "#ffffff",
            }}
          >
            ⎇ {treeSnapshot.branch}
          </span>
        </div>

        <div
          style={{
            fontSize: "11.5px",
            color: "var(--mute)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {stats.folders} {isId ? "folder" : "folders"} · {stats.files}{" "}
          {isId ? "file" : "files"}
        </div>
      </div>

      {/* 2. Instant File Search ("Go to file...") + Highlighted Core Files */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 11px",
            borderRadius: "9px",
            background: "rgba(242, 242, 242, 0.04)",
            border: "1px solid rgba(242, 242, 242, 0.12)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--mute)" }}>⌕</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isId
                ? `Cari dari ${stats.files} file di repo ${treeSnapshot.repoName}...`
                : `Go to file (${stats.files} files in ${treeSnapshot.repoName})...`
            }
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
            }}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                fontSize: "11px",
                color: "var(--mute)",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          ) : null}
        </div>

        {/* Pinned Key Files Bar */}
        {curatedRepo && curatedRepo.files.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "var(--mute)",
                marginRight: "3px",
              }}
            >
              {isId ? "File Inti:" : "Key Files:"}
            </span>
            {curatedRepo.files.map((f) => {
              const isCurrent = activeFilePath === f.path;
              const shortName = f.path.split("/").pop() ?? f.path;
              return (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => handleSelectFile(f.path)}
                  className={`box-tab${isCurrent ? " active" : ""}`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    padding: "4px 9px",
                  }}
                  title={f.path}
                >
                  {shortName}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* 3. GitHub-Style Directory Tree Table (or Search Results) */}
      <div
        style={{
          borderRadius: "10px",
          border: "1px solid rgba(242, 242, 242, 0.12)",
          background: "rgba(16, 16, 20, 0.75)",
          overflow: "hidden",
        }}
      >
        {/* Directory Breadcrumb Bar */}
        <div
          style={{
            padding: "8px 12px",
            background: "rgba(242, 242, 242, 0.04)",
            borderBottom: "1px solid rgba(242, 242, 242, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "6px",
            fontFamily: "var(--font-mono)",
            fontSize: "11.5px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setCurrentDir("")}
              style={{
                color: currentDir ? "#ffffff" : "var(--mute)",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: currentDir ? "underline" : "none",
                textUnderlineOffset: "3px",
              }}
            >
              {treeSnapshot.repoName}
            </button>
            {breadcrumbParts.map((part, idx) => {
              const targetDir = breadcrumbParts.slice(0, idx + 1).join("/");
              const isLast = idx === breadcrumbParts.length - 1;
              return (
                <React.Fragment key={targetDir}>
                  <span style={{ color: "var(--mute)" }}>/</span>
                  <button
                    type="button"
                    onClick={() => setCurrentDir(targetDir)}
                    style={{
                      color: isLast ? "var(--mute)" : "#ffffff",
                      fontWeight: isLast ? 500 : 600,
                      cursor: "pointer",
                      textDecoration: isLast ? "none" : "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {part}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <span style={{ fontSize: "11px", color: "var(--mute)" }}>
            {searchQuery
              ? `${searchResults.length} ${isId ? "hasil" : "matches"}`
              : `${directoryEntries.length} ${isId ? "item di folder ini" : "items in folder"}`}
          </span>
        </div>

        {/* Folder & File Rows */}
        <div
          style={{
            maxHeight: compact ? "185px" : "220px",
            overflowY: "auto",
          }}
        >
          {searchQuery ? (
            searchResults.length === 0 ? (
              <div
                style={{
                  padding: "12px",
                  fontSize: "12px",
                  color: "var(--mute)",
                }}
              >
                {isId
                  ? "Tidak ada file yang cocok dengan pencarian."
                  : "No matching files found in repository."}
              </div>
            ) : (
              searchResults.map((item) => {
                const isSelected = item.p === activeFilePath;
                return (
                  <button
                    key={item.p}
                    type="button"
                    onClick={() => handleSelectFile(item.p)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      padding: "6px 12px",
                      borderBottom: "1px solid rgba(242, 242, 242, 0.05)",
                      background: isSelected
                        ? "rgba(242, 242, 242, 0.12)"
                        : "transparent",
                      color: "#ffffff",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11.5px",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      📄 {item.p}
                    </span>
                    <span
                      style={{
                        fontSize: "10.5px",
                        color: "var(--mute)",
                        flexShrink: 0,
                      }}
                    >
                      {formatBytes(item.s)}
                    </span>
                  </button>
                );
              })
            )
          ) : (
            <>
              {/* Parent directory ".." row when inside a subfolder */}
              {currentDir ? (
                <button
                  type="button"
                  onClick={handleGoUpDir}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    borderBottom: "1px solid rgba(242, 242, 242, 0.05)",
                    background: "rgba(242, 242, 242, 0.02)",
                    color: "#ffffff",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span>📁 ..</span>
                  <span style={{ fontSize: "11px", color: "var(--mute)" }}>
                    ({isId ? "Kembali ke folder atas" : "Up one folder"})
                  </span>
                </button>
              ) : null}

              {directoryEntries.map((entry) => {
                const name = entry.p.split("/").pop() ?? entry.p;
                const isDir = entry.t === "d";
                const isSelected = !isDir && entry.p === activeFilePath;
                const childCount = isDir
                  ? folderChildCounts.get(entry.p) ?? 0
                  : 0;

                return (
                  <button
                    key={entry.p}
                    type="button"
                    onClick={() => {
                      if (isDir) {
                        setCurrentDir(entry.p);
                      } else {
                        setActiveFilePath(entry.p);
                      }
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      padding: "6.5px 12px",
                      borderBottom: "1px solid rgba(242, 242, 242, 0.05)",
                      background: isSelected
                        ? "rgba(242, 242, 242, 0.12)"
                        : "transparent",
                      color: isDir ? "#ffffff" : "rgba(242, 242, 242, 0.88)",
                      fontWeight: isDir || isSelected ? 600 : 400,
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span aria-hidden="true">{isDir ? "📁" : "📄"}</span>
                      <span>{name}</span>
                    </span>

                    <span
                      style={{
                        fontSize: "10.5px",
                        color: isSelected ? "#ffffff" : "var(--mute)",
                        flexShrink: 0,
                      }}
                    >
                      {isDir
                        ? `${childCount} ${isId ? "item" : "items"}`
                        : isSelected
                          ? `${formatBytes(entry.s)} · ${isId ? "Dibuka" : "Viewing"}`
                          : formatBytes(entry.s)}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* 4. Active File Header & Code/Asset Viewer */}
      <div
        style={{
          padding: "8px 12px",
          borderRadius: "9px",
          background: "rgba(242, 242, 242, 0.03)",
          border: "1px solid rgba(242, 242, 242, 0.09)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <code
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "#ffffff",
              fontWeight: 600,
              wordBreak: "break-all",
            }}
          >
            {activeFilePath}
          </code>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--mute)",
              }}
            >
              {!isImageFile && !isBinaryFile
                ? `${codeLines.length} ${isId ? "baris" : "lines"} · `
                : ""}
              {formatBytes(activeEntry?.s ?? activeCode.length)}
            </span>

            {!isImageFile && !isBinaryFile ? (
              <button
                type="button"
                className={`back-link copy-link${copied ? " done" : ""}`}
                onClick={handleCopyCode}
                style={{ fontSize: "11px", padding: "3px 9px" }}
              >
                <span>
                  {copied
                    ? isId
                      ? "Tersalin ✓"
                      : "Copied ✓"
                    : isId
                      ? "Salin Kode"
                      : "Copy Code"}
                </span>
              </button>
            ) : null}
          </div>
        </div>

        {activeSummary ? (
          <div
            style={{
              fontSize: "12px",
              color: "rgba(242, 242, 242, 0.78)",
              lineHeight: 1.45,
            }}
          >
            {activeSummary}
          </div>
        ) : null}
      </div>

      {/* 5. File Content Viewport (Code Table / Image Preview / Binary Info) */}
      <div
        style={{
          maxHeight: compact ? "320px" : "420px",
          overflow: "auto",
          borderRadius: "10px",
          background: "#070709",
          border: "1px solid rgba(242, 242, 242, 0.12)",
          padding: isImageFile || isBinaryFile ? "16px" : "10px 0",
          fontFamily: "var(--font-mono)",
          fontSize: "11.5px",
          lineHeight: 1.58,
          color: "#e8e8ec",
        }}
      >
        {loadingFile ? (
          <div style={{ padding: "12px 16px", color: "var(--mute)" }}>
            {isId
              ? `Memuat ${activeFilePath}...`
              : `Loading ${activeFilePath}...`}
          </div>
        ) : isImageFile ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rawAssetUrl}
              alt={activeFilePath}
              style={{
                maxWidth: "100%",
                maxHeight: "280px",
                objectFit: "contain",
                borderRadius: "8px",
                border: "1px solid rgba(242, 242, 242, 0.12)",
              }}
            />
            <span style={{ fontSize: "11px", color: "var(--mute)" }}>
              {activeFilePath} ({formatBytes(activeEntry?.s ?? 0)})
            </span>
          </div>
        ) : isBinaryFile ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              color: "var(--mute)",
            }}
          >
            <div>
              {isId
                ? `File biner (${activeExt.toUpperCase()}) — ${formatBytes(
                    activeEntry?.s ?? 0
                  )}`
                : `Binary file (${activeExt.toUpperCase()}) — ${formatBytes(
                    activeEntry?.s ?? 0
                  )}`}
            </div>
            <a
              href={rawAssetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="back-link"
              style={{ width: "fit-content", fontSize: "11.5px" }}
            >
              <span>{isId ? "Unduh File Mentah ↗" : "Download Raw File ↗"}</span>
            </a>
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <tbody>
              {codeLines.map((line, i) => (
                <tr key={i}>
                  <td
                    style={{
                      width: "44px",
                      padding: "0 10px 0 12px",
                      textAlign: "right",
                      userSelect: "none",
                      color: "rgba(242, 242, 242, 0.28)",
                      fontSize: "10.5px",
                      verticalAlign: "top",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td
                    style={{
                      padding: "0 14px 0 6px",
                      whiteSpace: "pre",
                      overflowX: "visible",
                    }}
                  >
                    {line || " "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
