import React, { useEffect, useState } from "react";

const REPO = "osaurus-ai/osaurus";

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString();
}

interface Stats {
  stars: number;
  downloads: number;
  version: string;
  license: string;
}

const badges: {
  key: keyof Stats;
  label: string;
  href: (repo: string) => string;
}[] = [
  {
    key: "stars",
    label: "stars",
    href: (r) => `https://github.com/${r}`,
  },
  {
    key: "version",
    label: "release",
    href: (r) => `https://github.com/${r}/releases`,
  },
  {
    key: "downloads",
    label: "downloads",
    href: (r) => `https://github.com/${r}/releases`,
  },
  {
    key: "license",
    label: "license",
    href: (r) => `https://github.com/${r}/blob/main/LICENSE`,
  },
];

export default function GitHubStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const [repoRes, releasesRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${REPO}`, {
            headers: { Accept: "application/vnd.github+json" },
          }),
          fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
            headers: { Accept: "application/vnd.github+json" },
          }),
        ]);

        if (!repoRes.ok || !releasesRes.ok) return;

        const repo = await repoRes.json();
        const releases: any[] = await releasesRes.json();

        const downloads = releases.reduce((total: number, release: any) => {
          return (
            total +
            (release.assets ?? []).reduce(
              (sum: number, asset: any) => sum + (asset.download_count ?? 0),
              0
            )
          );
        }, 0);

        const latestRelease = releases.find((r) => !r.prerelease && !r.draft);
        const version = latestRelease?.tag_name ?? "—";
        const license: string = repo.license?.spdx_id ?? repo.license?.name ?? "—";

        if (!cancelled) {
          setStats({ stars: repo.stargazers_count, downloads, version, license });
        }
      } catch {
        // Rate limits or offline: badges keep their placeholder value.
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  function displayValue(key: keyof Stats): string {
    if (!stats) return "—";
    const v = stats[key];
    if (key === "stars" || key === "downloads") return formatNum(v as number);
    return v as string;
  }

  return (
    <ul className="github-stats" aria-busy={!stats} aria-label="GitHub project stats">
      {badges.map(({ key, label, href }) => (
        <li key={key}>
          <a
            href={href(REPO)}
            target="_blank"
            rel="noopener noreferrer"
            className="github-stats__badge"
            aria-label={`${label}: ${stats ? displayValue(key) : "loading"} (opens GitHub in a new tab)`}
          >
            <span className="github-stats__label">{label}</span>
            <span className="github-stats__value" aria-hidden="true">
              {displayValue(key)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
