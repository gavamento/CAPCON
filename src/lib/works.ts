import { getCollection, type CollectionEntry } from 'astro:content';
import { publicAssetUrl } from './assets';
import {
	compareWorksByTags,
	getYearFromTags,
	type WorkTagId,
	type YearLevel,
} from './tags';

export type WorkEntry = CollectionEntry<'works'>;
export type WorkData = WorkEntry['data'];

export interface DevisedCase {
	title: string;
	challenge: string;
	approach: string;
	result: string;
	metric?: string;
}

const DEFAULT_WORK_THUMBNAIL = '/images/placeholder-year1.svg';

/** 一覧・カード用サムネイル（未設定時は先頭スクリーンショット、なければプレースホルダー） */
export function getWorkThumbnail(data: WorkData): string {
	const src = data.thumbnail ?? data.images?.[0] ?? DEFAULT_WORK_THUMBNAIL;
	return publicAssetUrl(src);
}

/** 作品詳細のギャラリー画像（サムネイル未設定時は先頭スクリーンショットのみ） */
export function getWorkGalleryImages(data: WorkData): string[] {
	const images = data.images?.length ? data.images : data.thumbnail ? [data.thumbnail] : [];
	return images.map(publicAssetUrl);
}

/** 学内コンテストへの出品作品（contest フィールドが設定されているか） */
export function isSchoolContestWork(data: WorkData): boolean {
	return !!data.contest?.trim();
}

/** contest フィールドがあれば contest タグを付与（表示・フィルター用） */
export function getEffectiveWorkTags(data: WorkData): WorkTagId[] {
	const tags = [...data.tags.filter((t) => t !== 'contest')];
	if (isSchoolContestWork(data)) {
		tags.push('contest');
	}
	return tags;
}

export async function getAllWorks(): Promise<WorkEntry[]> {
	const works = await getCollection('works');
	return works.sort((a, b) => compareWorksByTags(a.data, b.data));
}

export function getFeaturedWorks(works: WorkEntry[]): WorkEntry[] {
	return works.filter((w) => w.data.featured);
}

/** トップで大きく出す目玉作品（spotlight フラグが立つ先頭 1 件） */
export function getSpotlightWork(works: WorkEntry[]): WorkEntry | undefined {
	return works.find((w) => w.data.spotlight);
}

export function getWorksByYear(works: WorkEntry[], year: YearLevel): WorkEntry[] {
	return works.filter((w) => getYearFromTags(w.data.tags) === year);
}

export function getContestWorksFromList(works: WorkEntry[]): WorkEntry[] {
	return works.filter((w) => isSchoolContestWork(w.data));
}

/** カード/一覧で1行だけ見せる「代表の工夫」リード（devisedCases優先、無ければhighlights先頭） */
export function getWorkHighlightLead(data: WorkData): string | undefined {
	const lead = data.devisedCases?.[0]?.title ?? data.highlights?.[0];
	return lead?.trim() || undefined;
}

/** id配列から作品を取得（順序維持・見つからないものは除外） */
export function getWorksByIds(works: WorkEntry[], ids: string[]): WorkEntry[] {
	const byId = new Map(works.map((w) => [w.id, w]));
	return ids.map((id) => byId.get(id)).filter((w): w is WorkEntry => Boolean(w));
}

/** id→タイトルの辞書（SkillMatrix のリンク表示などに使用） */
export function getWorkTitleMap(works: WorkEntry[]): Record<string, string> {
	return Object.fromEntries(works.map((w) => [w.id, w.data.title]));
}

export interface CuratedDevisedCase extends DevisedCase {
	workId: string;
	workTitle: string;
}

/** 全作品から「課題→工夫→成果」を集約（/engineering の代表的な工夫用） */
export function getCuratedDevisedCases(
	works: WorkEntry[],
	opts: { max?: number } = {},
): CuratedDevisedCase[] {
	const out: CuratedDevisedCase[] = [];
	for (const w of works) {
		for (const c of w.data.devisedCases ?? []) {
			out.push({ ...c, workId: w.id, workTitle: w.data.title });
		}
	}
	return typeof opts.max === 'number' ? out.slice(0, opts.max) : out;
}

/** GitHub 実績ショーケース用の作品（spotlight を流用） */
export function getGithubShowcaseWork(works: WorkEntry[]): WorkEntry | undefined {
	return getSpotlightWork(works);
}
