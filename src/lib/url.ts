/**
 * GitHub Pages 프로젝트 사이트 경로 처리 (CHIC의 src/lib/url.ts를 계승).
 *
 * 이 사이트는 `https://etri-ulsoo.github.io/much-site/` 아래에서 서비스된다.
 * Astro는 번들 자산(import한 CSS·JS)에는 base를 자동으로 붙이지만,
 * **하드코딩한 절대경로(`/ko/`, `/images/...`)에는 붙이지 않는다.** 그래서 직접 합친다.
 *
 * 커스텀 도메인을 연결해 사이트가 도메인 루트에서 서비스되면 `astro.config.mjs`의
 * `base`를 `'/'`로 되돌리면 된다 — 아래 함수들은 그대로 무해해진다.
 */

/** `import.meta.env.BASE_URL`은 항상 `/`로 끝난다. 끝 슬래시를 떼고 정규화한다. */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** 사이트 내부 절대경로에 base를 붙인다. 외부 URL·mailto·앵커는 그대로 둔다. */
export function withBase(path: string): string {
  if (/^([a-z]+:|\/\/|#)/i.test(path)) return path;
  return BASE + (path.startsWith('/') ? path : `/${path}`);
}

/** URL 경로에서 base를 걷어낸 순수 사이트 경로를 돌려준다.
 *  `Astro.url.pathname`은 base를 포함하므로, 언어 판별처럼 경로를 해석하는 곳은 이걸 써야 한다. */
export function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    const rest = pathname.slice(BASE.length);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname;
}
