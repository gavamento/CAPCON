import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { workTagSchema, YEAR_TAG_IDS } from './lib/tags';

const works = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx,mdoc}', base: './src/content/works' }),
	schema: z.object({
		title: z.string(),
		/** 年次・職種・種別はタグで管理（例: year-1?3, programmer, planner, contest） */
		tags: z.array(workTagSchema).min(1),
		role: z.string(),
		team: z.string(),
		date: z.string(),
		summary: z.string(),
		youtubeId: z.string().optional(),
		thumbnail: z.string().optional(),
		images: z.array(z.string()).optional(),
		pdf: z.string().optional(),
		driveLink: z.string().url().optional(),
		tech: z.array(z.string()),
		highlights: z.array(z.string()),
		featured: z.boolean().default(false),
		/** 提出・出品した学内コンテストの ID（contests コレクションのファイル名と一致） */
		contestIds: z.array(z.string()).optional(),
	}),
});

const contests = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx,mdoc}', base: './src/content/contests' }),
	schema: z.object({
		title: z.string(),
		date: z.string(),
		/** 年次タグ（任意） */
		tags: z.array(z.enum(YEAR_TAG_IDS)).optional(),
		organizer: z.string().optional(),
		award: z.string().optional(),
		summary: z.string(),
		youtubeId: z.string().optional(),
		thumbnail: z.string().optional(),
		link: z.string().url().optional(),
		driveLink: z.string().url().optional(),
		featured: z.boolean().default(false),
	}),
});

export const collections = { works, contests };
