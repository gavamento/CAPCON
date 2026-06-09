import fs from 'node:fs';
import path from 'node:path';

/** public/ 配下の静的画像 URL に更新時刻を付与（同名ファイルの差し替え対策） */
export function publicAssetUrl(src: string): string {
	if (!src.startsWith('/')) return src;

	const filePath = path.join(process.cwd(), 'public', src.slice(1));
	try {
		const version = Math.floor(fs.statSync(filePath).mtimeMs);
		return `${src}?v=${version}`;
	} catch {
		return src;
	}
}
