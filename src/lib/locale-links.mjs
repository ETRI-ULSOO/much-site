// 원고 안의 사이트 절대 경로 링크에 base와 언어 접두사를 붙인다.
//   원고:  [연구 내용](/much/research/)
//   결과:  <a href="/much-site/ko/much/research/">  (src/content/ko/ 아래 원고일 때)
// 원고를 쓰는 사람은 언어와 배포 경로를 몰라도 되고, 한·영 원고가 같은 링크 문장을 공유한다.
// 언어는 원고 파일의 경로(src/content/<언어>/)에서 읽는다. 바깥 링크(https:, //, #)는 건드리지 않는다.
//
// Astro 7의 기본 마크다운 처리기 Sätteri의 hast 플러그인이다. 요소 방문자는 `filter`에 적은
// 태그만 넘겨받으므로 <a>만 보면 되고, 파일 경로는 방문자 문맥(ctx.fileURL)에서 읽는다.
// MDX도 @astrojs/mdx가 같은 processor를 이어받으므로 이 플러그인 하나로 두 형식을 다 처리한다.

const LOCALE_RE = /\/src\/content\/(ko|en)\//;
const SITE_ABSOLUTE = /^\/(?!\/)/;

export default function localeLinks({ base = '' } = {}) {
  return {
    name: 'locale-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const match = LOCALE_RE.exec(ctx.fileURL?.pathname ?? '');
        if (!match) return;
        const href = node.properties?.href;
        if (typeof href === 'string' && SITE_ABSOLUTE.test(href)) {
          ctx.setProperty(node, 'href', `${base}/${match[1]}${href}`);
        }
      },
    },
  };
}
