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

export function getWorksByYear(works: WorkEntry[], year: YearLevel): WorkEntry[] {
	return works.filter((w) => getYearFromTags(w.data.tags) === year);
}

export function getContestWorksFromList(works: WorkEntry[]): WorkEntry[] {
	return works.filter((w) => isSchoolContestWork(w.data));
}
