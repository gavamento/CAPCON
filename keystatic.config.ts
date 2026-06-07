import { config, fields, collection } from '@keystatic/core';

function generateSafeSlug(name: string) {
	// Keystatic の slug はファイルパスにも使われるため、Windows 禁止文字を除去して安全化する
	const trimmed = name.trim();
	const sanitized = trimmed
		.normalize('NFKC')
		.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '') // Windows 禁止文字 + 制御文字
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^[.-]+|[.-]+$/g, ''); // 先頭末尾の . や - は避ける

	// 日本語などで slugify が空になるケースの保険
	return sanitized.length ? sanitized : `entry-${Date.now()}`;
}

export default config({
	storage: {
		kind: 'local',
	},
	collections: {
		contests: collection({
			label: '学内コンテスト',
			slugField: 'title',
			path: 'src/content/contests/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({
					name: { label: 'タイトル' },
					slug: {
						label: 'ファイル名',
						description: '保存用のID（Windowsで使えない文字は除外されます）',
						generate: generateSafeSlug,
						validation: {
							pattern: {
								regex: /^[^<>:"/\\|?*\u0000-\u001F]+$/,
								message:
									'ファイル名に使えない文字（<>:"/\\\\|?* や制御文字）が含まれています。',
							},
						},
					},
				}),
				date: fields.text({
					label: '開催時期',
					description: 'YYYY-MM 形式（例: 2024-12）',
				}),
				tags: fields.multiselect({
					label: 'タグ（年次）',
					options: [
						{ label: '1年次', value: 'year-1' },
						{ label: '2年次', value: 'year-2' },
						{ label: '3年次', value: 'year-3' },
					],
				}),
				organizer: fields.text({ label: '主催' }),
				award: fields.text({ label: '結果・受賞' }),
				summary: fields.text({
					label: '概要',
					description: '一覧・OGP 用の短い説明',
					multiline: true,
				}),
				youtubeId: fields.text({
					label: 'YouTube 動画 ID',
					description: 'URL の v= 以降（例: dQw4w9WgXcQ）',
				}),
				thumbnail: fields.image({
					label: 'サムネイル',
					directory: 'public/images',
					publicPath: '/images/',
				}),
				link: fields.url({ label: '公式リンク' }),
				driveLink: fields.url({
					label: 'Googleドライブ',
					description:
						'資料フォルダやファイルの共有リンク（リンクを知っている全員に公開しておく）',
				}),
				featured: fields.checkbox({
					label: 'トップに表示',
					defaultValue: false,
				}),
				content: fields.markdoc({
					label: '参加記録・振り返り',
				}),
			},
		}),
		works: collection({
			label: '作品',
			slugField: 'title',
			path: 'src/content/works/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({
					name: { label: 'タイトル' },
					slug: {
						label: 'ファイル名',
						description: '保存用のID（Windowsで使えない文字は除外されます）',
						generate: generateSafeSlug,
						validation: {
							pattern: {
								regex: /^[^<>:"/\\|?*\u0000-\u001F]+$/,
								message:
									'ファイル名に使えない文字（<>:"/\\\\|?* や制御文字）が含まれています。',
							},
						},
					},
				}),
				tags: fields.multiselect({
					label: 'タグ（年次・職種・種別）',
					description:
						'年次は1つ、職種は1つ以上。contestIds がある場合は「コンテスト」タグが自動付与されます',
					options: [
						{ label: '1年次', value: 'year-1' },
						{ label: '2年次', value: 'year-2' },
						{ label: '3年次', value: 'year-3' },
						{ label: 'プログラマー', value: 'programmer' },
						{ label: 'プランナー', value: 'planner' },
						{ label: 'コンテスト', value: 'contest' },
					],
				}),
				role: fields.text({ label: '担当' }),
				team: fields.text({ label: 'チーム' }),
				date: fields.text({
					label: '制作時期',
					description: 'YYYY-MM 形式（例: 2024-06）',
				}),
				summary: fields.text({
					label: '概要',
					description: '一覧・OGP 用の短い説明',
					multiline: true,
				}),
				youtubeId: fields.text({
					label: 'YouTube 動画 ID',
					description: 'URL の v= 以降（例: dQw4w9WgXcQ）',
				}),
				thumbnail: fields.image({
					label: 'サムネイル',
					directory: 'public/images',
					publicPath: '/images/',
				}),
				images: fields.array(
					fields.image({
						label: 'スクリーンショット',
						directory: 'public/images',
						publicPath: '/images/',
					}),
					{
						label: 'スクリーンショット一覧',
						itemLabel: (props) => props.value ?? '画像',
					},
				),
				pdf: fields.file({
					label: '企画書 PDF',
					directory: 'public/pdf',
					publicPath: '/pdf/',
				}),
				driveLink: fields.url({
					label: 'Googleドライブ',
					description:
						'資料フォルダやファイルの共有リンク（リンクを知っている全員に公開しておく）',
				}),
				tech: fields.array(fields.text({ label: '技術・ツール' }), {
					label: '使用技術・ツール',
					itemLabel: (props) => props.value ?? '項目',
				}),
				highlights: fields.array(fields.text({ label: '工夫・学び' }), {
					label: '工夫・学んだこと',
					itemLabel: (props) => props.value ?? '項目',
				}),
				featured: fields.checkbox({
					label: 'トップに表示',
					defaultValue: false,
				}),
				contestIds: fields.array(
					fields.relationship({
						label: '関連コンテスト',
						collection: 'contests',
					}),
					{
						label: '提出・出品したコンテスト',
						itemLabel: (props) => props.value ?? 'コンテスト',
					},
				),
				content: fields.markdoc({
					label: '詳細',
				}),
			},
		}),
	},
});
