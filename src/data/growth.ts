export type YearLevel = 1 | 2 | 3;

export interface YearGrowth {
	year: YearLevel;
	label: string;
	theme: string;
	skills: string[];
}

export const yearGrowthData: YearGrowth[] = [
	{
		year: 1,
		label: '1年次',
		theme: '基礎固め — ゲーム制作の土台を築く',
		skills: [
			'C++の基本文法とポインタの理解',
			'2D描画・当たり判定の実装',
			'企画書の構成とプレゼン資料作成',
		],
	},
	{
		year: 2,
		label: '2年次',
		theme: '応用 — チーム開発と設計力の向上',
		skills: [
			'オブジェクト指向設計とステートマシン',
			'チーム内での役割分担とコードレビュー',
			'ゲームデザイン文書（GDD）の執筆',
		],
	},
	{
		year: 3,
		label: '3年次',
		theme: '集大成 — 就活に直結する作品づくり',
		skills: [
			'大規模チーム開発でのリード経験',
			'パフォーマンス最適化とデバッグ',
			'企画から実装まで一貫したプロジェクト推進',
		],
	},
];
