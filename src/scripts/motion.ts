// スクロール表示（reveal）＋数値カウントアップ。
// View Transitions 対応のため何度呼ばれても安全（前回の Observer を切断してから張り直す）。
// 進歩的強化：JS が無効／reduced-motion の場合はコンテンツを最初から可視・最終値で表示する。

const prefersReducedMotion = (): boolean =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let revealObserver: IntersectionObserver | null = null;
let countObserver: IntersectionObserver | null = null;

/** [data-reveal] 要素をビューポート進入時にフェード＋上方向スライドで表示する。 */
export function initReveal(): void {
	// reduced-motion：reveal-ready を外し（CSS で可視化）、全要素を即表示扱いに。
	if (prefersReducedMotion()) {
		document.documentElement.classList.remove('reveal-ready');
		document
			.querySelectorAll<HTMLElement>('[data-reveal]')
			.forEach((el) => el.classList.add('is-revealed'));
		return;
	}

	// グリッド等：子要素へ data-reveal とスタガー遅延（--reveal-delay）を付与。
	document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
		const step = Number(group.dataset.revealStagger ?? '0');
		Array.from(group.children).forEach((child, i) => {
			const c = child as HTMLElement;
			c.setAttribute('data-reveal', '');
			if (step > 0) c.style.setProperty('--reveal-delay', `${i * step}ms`);
		});
	});

	if (revealObserver) revealObserver.disconnect();
	revealObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-revealed');
				observer.unobserve(entry.target);
			});
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
	);

	document
		.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)')
		.forEach((el) => revealObserver!.observe(el));
}

function easeOutCubic(t: number): number {
	return 1 - Math.pow(1 - t, 3);
}

function runCount(el: HTMLElement): void {
	const to = Number(el.dataset.countTo ?? '0');
	const decimals = Number(el.dataset.countDecimals ?? '0');
	const prefix = el.dataset.countPrefix ?? '';
	const suffix = el.dataset.countSuffix ?? '';
	const useSep = el.dataset.countSep !== 'false';

	const format = (n: number): string => {
		const out = useSep
			? n.toLocaleString('en-US', {
					minimumFractionDigits: decimals,
					maximumFractionDigits: decimals,
				})
			: n.toFixed(decimals);
		return `${prefix}${out}${suffix}`;
	};

	const duration = 1100;
	let startTs: number | null = null;
	const tick = (ts: number): void => {
		if (startTs === null) startTs = ts;
		const progress = Math.min((ts - startTs) / duration, 1);
		el.textContent = format(to * easeOutCubic(progress));
		if (progress < 1) requestAnimationFrame(tick);
		else el.textContent = format(to);
	};
	requestAnimationFrame(tick);
}

/**
 * .count-up[data-count-to] 要素をビューポート進入時に 0→最終値でカウントアップ。
 * markup の textContent には最終整形値を入れておくこと（no-JS / reduced-motion フォールバック）。
 */
export function initCountUp(): void {
	const els = document.querySelectorAll<HTMLElement>('.count-up[data-count-to]');

	// reduced-motion：サーバ描画済みの最終値をそのまま使う。
	if (prefersReducedMotion()) {
		els.forEach((el) => {
			el.dataset.counted = 'true';
		});
		return;
	}

	if (countObserver) countObserver.disconnect();
	countObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target as HTMLElement;
				observer.unobserve(el);
				if (el.dataset.counted === 'true') return;
				el.dataset.counted = 'true';
				runCount(el);
			});
		},
		{ threshold: 0.4 },
	);

	els.forEach((el) => {
		if (el.dataset.counted === 'true') return;
		countObserver!.observe(el);
	});
}
