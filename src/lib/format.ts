// stats の値文字列を数値カウントアップ用に分解する（ビルド時に StatStrip が使用）。
//   "+299,841" → { prefix: "+", number: 299841, suffix: "",   decimals: 0 }
//   "98"       → { prefix: "",  number: 98,     suffix: "",   decimals: 0 }
//   "4人"      → { prefix: "",  number: 4,      suffix: "人", decimals: 0 }
//   "約3ヶ月"  → { prefix: "約", number: 3,      suffix: "ヶ月", decimals: 0 }
// 先頭が数値として解釈できない値（"C++" 等）は null（＝カウントアップ非対象・静的表示）。

export interface ParsedCount {
	prefix: string;
	number: number;
	suffix: string;
	decimals: number;
}

export function parseCountValue(raw: string): ParsedCount | null {
	if (typeof raw !== 'string') return null;
	const trimmed = raw.trim();
	const match = trimmed.match(/^([^\d-]*-?)?\s*([\d,]+(?:\.\d+)?)(.*)$/);
	if (!match) return null;

	const numRaw = match[2];
	const number = Number(numRaw.replace(/,/g, ''));
	if (!Number.isFinite(number)) return null;

	const dot = numRaw.indexOf('.');
	const decimals = dot === -1 ? 0 : numRaw.length - dot - 1;

	return {
		prefix: (match[1] ?? '').trim(),
		number,
		suffix: (match[3] ?? '').trim(),
		decimals,
	};
}
