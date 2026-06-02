import { z } from 'astro/zod';

/** 年次タグ（1件必須） */
export const YEAR_TAG_IDS = ['year-1', 'year-2', 'year-3'] as const;
export type YearTagId = (typeof YEAR_TAG_IDS)[number];

/** 職種カテゴリタグ（1件以上） */
export const CATEGORY_TAG_IDS = ['programmer', 'planner'] as const;
export type CategoryTagId = (typeof CATEGORY_TAG_IDS)[number];

/** 種別タグ（コンテスト出品など） */
export const TYPE_TAG_IDS = ['contest'] as const;
export type TypeTagId = (typeof TYPE_TAG_IDS)[number];

/** 作品で使えるタグ */
export const WORK_TAG_IDS = [...YEAR_TAG_IDS, ...CATEGORY_TAG_IDS, ...TYPE_TAG_IDS] as const;
export type WorkTagId = (typeof WORK_TAG_IDS)[number];

export const workTagSchema = z.enum(WORK_TAG_IDS);

export type YearLevel = 1 | 2 | 3;

const YEAR_TAG_TO_LEVEL: Record<YearTagId, YearLevel> = {
	'year-1': 1,
	'year-2': 2,
	'year-3': 3,
};

const LEVEL_TO_YEAR_TAG: Record<YearLevel, YearTagId> = {
	1: 'year-1',
	2: 'year-2',
	3: 'year-3',
};

export interface TagMeta {
	id: WorkTagId;
	label: string;
	group: 'year' | 'category' | 'type';
	sortOrder: number;
	/** Tailwind / CSS 用（年次は tag--neutral） */
	colorClass: string;
}

export const TAG_REGISTRY: Record<WorkTagId, TagMeta> = {
	'year-1': { id: 'year-1', label: '1年次', group: 'year', sortOrder: 1, colorClass: 'tag--neutral' },
	'year-2': { id: 'year-2', label: '2年次', group: 'year', sortOrder: 2, colorClass: 'tag--neutral' },
	'year-3': { id: 'year-3', label: '3年次', group: 'year', sortOrder: 3, colorClass: 'tag--neutral' },
	programmer: {
		id: 'programmer',
		label: 'プログラマー',
		group: 'category',
		sortOrder: 10,
		colorClass: 'tag--prog',
	},
	planner: {
		id: 'planner',
		label: 'プランナー',
		group: 'category',
		sortOrder: 11,
		colorClass: 'tag--planner',
	},
	contest: {
		id: 'contest',
		label: 'コンテスト',
		group: 'type',
		sortOrder: 20,
		colorClass: 'tag--contest',
	},
};

/** Keystatic 用の選択肢 */
export const WORK_TAG_OPTIONS = WORK_TAG_IDS.map((id) => ({
	label: TAG_REGISTRY[id].label,
	value: id,
}));

export const YEAR_FILTER_OPTIONS = [
	{ value: 'all', label: 'すべて' },
	...YEAR_TAG_IDS.map((id) => ({ value: id, label: TAG_REGISTRY[id].label })),
];

export const CATEGORY_FILTER_OPTIONS = [
	{ value: 'all', label: 'すべて' },
	...CATEGORY_TAG_IDS.map((id) => ({ value: id, label: TAG_REGISTRY[id].label })),
];

export const TYPE_FILTER_OPTIONS = [
	{ value: 'all', label: 'すべて' },
	{ value: 'contest', label: 'コンテスト' },
	{ value: 'regular', label: '通常' },
] as const;

export type WorkTypeFilter = (typeof TYPE_FILTER_OPTIONS)[number]['value'];

export function tagLabel(id: WorkTagId): string {
	return TAG_REGISTRY[id].label;
}

export function tagColorClass(id: WorkTagId): string {
	return TAG_REGISTRY[id].colorClass;
}

export function isYearTag(id: string): id is YearTagId {
	return (YEAR_TAG_IDS as readonly string[]).includes(id);
}

export function isCategoryTag(id: string): id is CategoryTagId {
	return (CATEGORY_TAG_IDS as readonly string[]).includes(id);
}

export function getYearFromTags(tags: readonly WorkTagId[]): YearLevel | undefined {
	const yearTag = tags.find((t): t is YearTagId => isYearTag(t));
	return yearTag ? YEAR_TAG_TO_LEVEL[yearTag] : undefined;
}

export function getCategoriesFromTags(tags: readonly WorkTagId[]): CategoryTagId[] {
	return tags.filter((t): t is CategoryTagId => isCategoryTag(t));
}

/** カード・詳細に表示するタグ（年次→職種の順） */
export function sortTagsForDisplay(tags: readonly WorkTagId[]): WorkTagId[] {
	return [...tags].sort((a, b) => TAG_REGISTRY[a].sortOrder - TAG_REGISTRY[b].sortOrder);
}

/** URL の year クエリ（`1` または `year-1`）をタグ ID に正規化 */
export function normalizeYearFilterParam(value: string | null): string {
	if (!value || value === 'all') return 'all';
	if (isYearTag(value)) return value;
	const n = Number(value);
	if (n === 1 || n === 2 || n === 3) return LEVEL_TO_YEAR_TAG[n];
	return 'all';
}

/** URL の category クエリをタグ ID に正規化 */
export function normalizeCategoryFilterParam(value: string | null): string {
	if (!value || value === 'all') return 'all';
	if (isCategoryTag(value)) return value;
	return 'all';
}

/** URL の type クエリ（all | contest | regular） */
export function normalizeTypeFilterParam(value: string | null): WorkTypeFilter {
	if (value === 'contest' || value === 'regular') return value;
	return 'all';
}

export function isTypeTag(id: string): id is TypeTagId {
	return (TYPE_TAG_IDS as readonly string[]).includes(id);
}

export function compareWorksByTags(
	a: { tags: WorkTagId[]; date: string },
	b: { tags: WorkTagId[]; date: string },
): number {
	const yearA = getYearFromTags(a.tags) ?? 0;
	const yearB = getYearFromTags(b.tags) ?? 0;
	if (yearA !== yearB) return yearB - yearA;
	return b.date.localeCompare(a.date);
}
