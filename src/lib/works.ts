import { getCollection, type CollectionEntry } from 'astro:content';
import {
	compareWorksByTags,
	getYearFromTags,
	type WorkTagId,
	type YearLevel,
} from './tags';

export type WorkEntry = CollectionEntry<'works'>;
export type WorkData = WorkEntry['data'];

const DEFAULT_WORK_THUMBNAIL = '/images/placeholder-year1.svg';

/** 一覧・カード用サムネイル（未設定時は先頭スクリーンショット、なければプレースホルダー） */
export function getWorkThumbnail(data: WorkData): string {
	if (data.thumbnail) return data.thumbnail;
	const firstImage = data.images?.[0];
	if (firstImage) return firstImage;
	return DEFAULT_WORK_THUMBNAIL;
}

/** 学内コンテスト（contests コレクション）への出品作品 */
export function isSchoolContestWork(data: WorkData): boolean {
	return (data.contestIds?.length ?? 0) > 0;
}

/** contestIds があれば contest タグを付与（表示・フィルター用） */
export function getEffectiveWorkTags(data: WorkData): WorkTagId[] {
	const tags = [...data.tags.filter((t) => t !== 'contest')];
	if (isSchoolContestWork(data)) {
		tags.push('contest');
	}
	return tags;
}

/** @deprecated 互換用。学内コンテスト出品作かどうか */
export function isContestWork(data: WorkData): boolean {
	return isSchoolContestWork(data);
}

export async function getAllWorks(): Promise<WorkEntry[]> {
	const works = await getCollection('works');
	return works.sort((a, b) => compareWorksByTags(a.data, b.data));
}

export function getFeaturedWorks(works: WorkEntry[]): WorkEntry[] {
	return works.filter((w) => w.data.featured);
}

export function getWorksByYear(works: WorkEntry[], year: YearLevel): WorkEntry[] {
	return works.filter((w) => getYearFromTags(w.data.tags) === year);
}

export function getContestWorksFromList(works: WorkEntry[]): WorkEntry[] {
	return works.filter((w) => isSchoolContestWork(w.data));
}
