import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { workTagSchema } from './lib/tags';

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
		/** 出品した学内コンテスト名（設定があると「学内コンテスト」タグが自動付与される） */
		contest: z.string().optional(),
		/** コンテストでの結果・受賞 */
		award: z.string().optional(),
	}),
});

export const collections = { works };
