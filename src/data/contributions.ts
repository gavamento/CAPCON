// GitHub 風の貢献ヒートマップ用データ。作品 id をキーに持つ。
// level は 0–4（0 = 活動なし、4 = 最も活発）。
// ▼ 現状は暫定シード。Phase 5 でオーナーが GitHub の実データに差し替える。
//   実データ化する場合は weeks を「各週 = 日〜土の level 7 要素」の配列で並べるだけ。

export interface ContributionGraph {
	/** 各週（列）。先頭が最も古い週。各週は日〜土の 7 要素（level 0–4）。 */
	weeks: number[][];
	/** 合計コントリビューション数（カウントアップ表示用）。 */
	total: number;
	/** 期間ラベル（例: "2026.3.7 – 6.7"）。 */
	periodLabel?: string;
}

const clamp = (n: number): number => Math.max(0, Math.min(4, n));

// Date/random を使わず、週・曜日インデックスから決定的に生成（再現可能なプレースホルダ）。
function seedWeeks(count: number, fn: (week: number, day: number) => number): number[][] {
	return Array.from({ length: count }, (_, w) =>
		Array.from({ length: 7 }, (_, d) => clamp(Math.round(fn(w, d)))),
	);
}

// 中盤が最も活発・週末はやや控えめ、という自然な見た目のシード。
const gavamentoWeeks = seedWeeks(14, (w, d) => {
	const weekend = d === 0 || d === 6;
	const ramp = w < 2 ? 0 : w < 4 ? 1 : w < 11 ? 2 : 1;
	const base = [2, 3, 4, 3, 2, 4, 3][(w * 3 + d) % 7];
	return (base + ramp) / 2 - (weekend ? 2 : 0);
});

export const contributionGraphs: Record<string, ContributionGraph> = {
	gavamento: {
		weeks: gavamentoWeeks,
		total: 155,
		periodLabel: '2026.3.7 〜 現在（進行中・9月マスター提出予定）',
	},
};

export function getContributionGraph(id: string): ContributionGraph | undefined {
	return contributionGraphs[id];
}
