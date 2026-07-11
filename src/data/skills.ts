// スキル/できることの単一情報源（About と /engineering が参照）。
// ※ src/data/growth.ts は「年次ごとの成長ナラティブ」専用。スキルの定義はこちらに集約する。
// レベルや根拠はオーナーが実態に合わせて調整可能（workIds は実在の作品 id）。

export const SKILL_LEVELS = {
	1: { label: '基礎' },
	2: { label: '応用' },
	3: { label: '実践' },
} as const;

export type SkillLevel = keyof typeof SKILL_LEVELS;

export interface SkillItem {
	name: string;
	level: SkillLevel;
	/** 根拠（1行） */
	evidence?: string;
	/** 証拠となる作品 id（/works/<id> へリンク） */
	workIds?: string[];
}

export interface SkillCategory {
	key: string;
	/** 表示名（例: PROGRAMMING） */
	label: string;
	/** ドット等の色（CSS 変数式） */
	colorVar: string;
	items: SkillItem[];
}

export interface Capability {
	/** できること（成果ベースで言い切る） */
	title: string;
	description: string;
	workIds?: string[];
}

export const skillCategories: SkillCategory[] = [
	{
		key: 'programming',
		label: 'PROGRAMMING',
		colorVar: 'var(--color-prog)',
		items: [
			{
				name: 'C++',
				level: 3,
				evidence: '3年間の主言語。ゲームロジック・自作エンジン・チーム開発で使用',
				workIds: ['gavamento', 'aurea-hew', 'gm31-renderer'],
			},
			{
				name: 'DirectX 11 / 12',
				level: 2,
				evidence: '2年次の3Dゲーム開発でスプライト描画・ゲーム実装',
				workIds: ['dx21-sprite', 'dx21-oti-falling-blocks'],
			},
			{
				name: 'OpenGL / 自作レンダラ',
				level: 2,
				evidence: '描画パイプラインを理解し自作レンダラを実装',
				workIds: ['gm31-renderer'],
			},
			{
				name: '設計パターン・クラス設計',
				level: 2,
				evidence: 'Strategy 等を用い、拡張しやすい設計を実践',
				workIds: ['cpp-designpattern-strategy', 'capcon-team'],
			},
			{
				name: 'Git / GitHub',
				level: 3,
				evidence: 'develop ブランチ運用での並行開発・コードレビュー（155コミット・進行中）',
				workIds: ['gavamento'],
			},
			{
				name: 'Python',
				level: 2,
				evidence: 'ツール作成・演習で使用',
				workIds: ['xg31-python'],
			},
			{
				name: 'Unity / C#',
				level: 1,
				evidence: '授業課題で基礎を習得',
				workIds: ['ge11-unity-class'],
			},
			{
				name: 'HTML / CSS（Web）',
				level: 2,
				evidence: 'このポートフォリオを Astro + Tailwind CSS で自作',
			},
		],
	},
	{
		key: 'planning',
		label: 'PLANNING',
		colorVar: 'var(--color-planner)',
		items: [
			{
				name: '企画・仕様書作成',
				level: 2,
				evidence: '企画書・仕様書を作成し実装まで落とし込み',
				workIds: ['aurea-plan', 'hew-onesheet-plan', 'gamecom2026-plan'],
			},
			{
				name: 'レベル・バランス設計',
				level: 2,
				evidence: '世界観・難易度バランスを設計',
				workIds: ['worldview-brushup'],
			},
			{
				name: 'チームリード・PM',
				level: 2,
				evidence: 'チームのテクニカルリード／リーダーとして進行管理',
				workIds: ['capcon-team', 'gavamento'],
			},
			{
				name: 'プレゼン・企画書プレゼン',
				level: 2,
				evidence: '企画演習・コンテストでの発表',
			},
		],
	},
];

export const capabilities: Capability[] = [
	{
		title: 'C++ でゲームのコアロジックを実装できる',
		description: '当たり判定・ステートマシン・ゲームループなどを設計から実装まで担当できます。',
		workIds: ['gavamento', 'aurea-hew'],
	},
	{
		title: 'DirectX / OpenGL で2D・3D描画を扱える',
		description: 'スプライト描画から自作レンダラまで、グラフィックスパイプラインを理解しています。',
		workIds: ['dx21-sprite', 'gm31-renderer'],
	},
	{
		title: 'Git / GitHub でチーム開発を回せる',
		description: 'develop ブランチ運用・コードレビュー・並行開発。これまでに155コミットを重ねながら開発を継続しています。',
		workIds: ['gavamento', 'capcon-team'],
	},
	{
		title: '設計パターンで拡張しやすいコードを書ける',
		description: 'メンバーが機能を追加しやすいクラス設計で、チームの開発効率を高めます。',
		workIds: ['cpp-designpattern-strategy', 'capcon-team'],
	},
	{
		title: '企画から実装まで一貫して進められる',
		description: '仕様書作成からプロトタイプ実装まで、技術と企画を橋渡しできます。',
		workIds: ['aurea-plan', 'aurea-hew'],
	},
];

/** 習熟度の高い順に上位 n 件のスキルを返す（トップのチップ表示など） */
export function getTopSkills(n: number): SkillItem[] {
	return skillCategories
		.flatMap((c) => c.items)
		.slice()
		.sort((a, b) => b.level - a.level)
		.slice(0, n);
}
