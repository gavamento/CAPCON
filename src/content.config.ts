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
		/** 課題→工夫→成果（個別の工夫エピソード。任意・後方互換のため optional） */
		devisedCases: z
			.array(
				z.object({
					title: z.string(),
					challenge: z.string(),
					approach: z.string(),
					result: z.string(),
					/** 成果の数値（任意。stats の項目と対応づけるラベル等） */
					metric: z.string().optional(),
				}),
			)
			.optional(),
		/** チーム開発での個人の貢献（任意） */
		contribution: z
			.object({
				summary: z.string().optional(),
				items: z.array(z.string()).optional(),
			})
			.optional(),
		featured: z.boolean().default(false),
		/** 出品した学内コンテスト名（設定があると「学内コンテスト」タグが自動付与される） */
		contest: z.string().optional(),
		/** コンテストでの結果・受賞 */
		award: z.string().optional(),
		/** GitHub リポジトリ URL */
		repoUrl: z.string().url().optional(),
		/** 公開デモ / リリース URL */
		liveUrl: z.string().url().optional(),
		/** 開発統計（コミット数・追加行・期間・人数など自由記述） */
		stats: z
			.array(
				z.object({
					label: z.string(),
					value: z.string(),
				}),
			)
			.optional(),
		/** GitHub 貢献グラフ画像（gameplay サムネとは別管理） */
		statsImage: z.string().optional(),
		/** トップで大きく出す目玉作品フラグ */
		spotlight: z.boolean().default(false),
	}),
});

export const collections = { works };
