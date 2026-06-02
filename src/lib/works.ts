import { getCollection, type CollectionEntry } from 'astro:content';
import {
	compareWorksByTags,
	getYearFromTags,
	type WorkTagId,
	type YearLevel,
} from './tags';

export type WorkEntry = CollectionEntry<'works'>;
export type WorkData = WorkEntry['data'];

/** contestIds があれば contest タグを付与（表示・フィルター用） */
export function getEffectiveWorkTags(data: WorkData): WorkTagId[] {
	const tags = [...data.tags];
	if ((data.contestIds?.length ?? 0) > 0 && !tags.includes('contest')) {
		tags.push('contest');
	}
	return tags;
}

export function isContestWork(data: WorkData): boolean {
	return getEffectiveWorkTags(data).includes('contest');
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
	return works.filter((w) => isContestWork(w.data));
}
