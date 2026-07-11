import { config, fields, collection } from '@keystatic/core';

function imageArrayItemLabel(props: { value: unknown }): string {
	const value = props.value;
	if (!value) return '画像';
	if (typeof value === 'string') return value;
	if (typeof value === 'object' && value !== null && 'filename' in value) {
		return String((value as { filename: string }).filename);
	}
	return '画像';
}

function generateSafeSlug(name: string) {
	// Keystatic の slug はファイルパスにも使われるため、Windows 禁止文字を除去して安全化する
	const trimmed = name.trim();
	const sanitized = trimmed
		.normalize('NFKC')
		.replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Windows 禁止文字 + 制御文字
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
								regex: /^[^<>:"/\\|?*\x00-\x1F]+$/,
								message:
									'ファイル名に使えない文字（<>:"/\\\\|?* や制御文字）が含まれています。',
							},
						},
					},
				}),
				tags: fields.multiselect({
					label: 'タグ（年次・職種）',
					description:
						'年次は1つ、職種は1つ以上。コンテスト名を入力すると「学内コンテスト」タグが自動付与されます',
					options: [
						{ label: '1年次', value: 'year-1' },
						{ label: '2年次', value: 'year-2' },
						{ label: '3年次', value: 'year-3' },
						{ label: 'プログラマー', value: 'programmer' },
						{ label: 'プランナー', value: 'planner' },
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
						itemLabel: imageArrayItemLabel,
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
				devisedCases: fields.array(
					fields.object({
						title: fields.text({ label: '見出し（工夫のタイトル）' }),
						challenge: fields.text({ label: '課題', multiline: true }),
						approach: fields.text({ label: '工夫（やったこと）', multiline: true }),
						result: fields.text({ label: '成果', multiline: true }),
						metric: fields.text({
							label: '成果の数値（任意）',
							description: '例: 98コミット / 描画60fps など。stats の項目と対応させると効果的',
						}),
					}),
					{
						label: '課題→工夫→成果',
						description: '「何が課題で、どう工夫し、どうなったか」を1件ずつ。採用担当が最も見る箇所です',
						itemLabel: (props) => props.fields.title.value || '工夫',
					},
				),
				contribution: fields.object(
					{
						summary: fields.text({
							label: '個人の貢献（要約）',
							description: 'チームの中で自分が担当・主導したことを1〜2文で',
							multiline: true,
						}),
						items: fields.array(fields.text({ label: '担当・貢献' }), {
							label: '担当・貢献（箇条書き）',
							itemLabel: (props) => props.value ?? '項目',
						}),
					},
					{ label: '個人の貢献（チーム開発）' },
				),
				featured: fields.checkbox({
					label: 'トップに表示',
					defaultValue: false,
				}),
				contest: fields.text({
					label: '出品コンテスト',
					description:
						'出品した学内コンテスト名（入力すると「学内コンテスト」タグが自動付与されます）',
				}),
				award: fields.text({
					label: '結果・受賞',
					description: 'コンテストでの結果や受賞（例: グラフィック賞受賞）',
				}),
				repoUrl: fields.url({
					label: 'GitHub リポジトリ',
					description: 'リポジトリの URL（例: https://github.com/owner/repo）',
				}),
				liveUrl: fields.url({
					label: '公開デモ URL',
					description: 'プレイ可能なデモ・リリースページなど',
				}),
				stats: fields.array(
					fields.object({
						label: fields.text({
							label: '項目',
							description: '例: コミット数 / 追加行 / 削除行 / 期間 / 人数',
						}),
						value: fields.text({
							label: '値',
							description: '例: 98 / 299,841 / 84,609 / 約3ヶ月 / 4人',
						}),
					}),
					{
						label: '開発統計（GitHub）',
						itemLabel: (props) => {
							const label = props.fields.label.value;
							const value = props.fields.value.value;
							return label || value ? `${label}: ${value}` : '統計';
						},
					},
				),
				statsImage: fields.image({
					label: '貢献グラフ画像',
					description: 'GitHub のコントリビューショングラフ等のスクリーンショット',
					directory: 'public/images/gavamento',
					publicPath: '/images/gavamento/',
				}),
				spotlight: fields.checkbox({
					label: 'トップで大きく表示（スポットライト）',
					defaultValue: false,
				}),
				content: fields.markdoc({
					label: '詳細',
				}),
			},
		}),
	},
});
