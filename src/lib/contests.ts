import { getCollection, type CollectionEntry } from 'astro:content';
import { isSchoolContestWork, type WorkEntry } from './works';

export type ContestEntry = CollectionEntry<'contests'>;

export async function getAllContests(): Promise<ContestEntry[]> {
	const contests = await getCollection('contests');
	return contests.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export function getContestWorks(works: WorkEntry[]): WorkEntry[] {
	return works.filter((w) => isSchoolContestWork(w.data));
}

export function getWorksForContest(works: WorkEntry[], contestId: string): WorkEntry[] {
	return works.filter((w) => w.data.contestIds?.includes(contestId));
}

export type ContestTab = 'contests' | 'works';

export function parseContestTab(value: string | null): ContestTab {
	return value === 'works' ? 'works' : 'contests';
}
