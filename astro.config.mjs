import { defineConfig } from 'astro/config';

// GitHub Pages 프로젝트 사이트는 `https://<계정>.github.io/<저장소>/` 아래에서 서비스된다.
// 저장소 이름이 곧 하위 경로이므로 base를 여기서 한 번만 정한다.
// 커스텀 도메인을 연결하면 base를 '/'로 되돌리고 site를 그 도메인으로 바꾼다 —
// 내부 링크는 전부 src/lib/url.ts의 withBase()를 거치므로 그 밖의 수정은 필요 없다.
const BASE = '/much-site';

export default defineConfig({
  site: 'https://etri-ulsoo.github.io',
  base: BASE,

  // 한국어와 영어가 같은 구조를 갖도록 두 언어 모두 접두사를 붙인다 (/ko/…, /en/…).
  // 페이지 파일은 src/pages/[locale]/ 한 벌이고 언어는 라우트 파라미터다.
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: { prefixDefaultLocale: true },
  },

  // 구 Google Sites(sites.google.com/view/much0)의 경로를 새 경로로 넘긴다.
  // 도메인이 다르므로 구 사이트에서 자동으로 넘어오지는 않는다 — 구 사이트에는 사용자가
  // 새 주소 안내를 게시한다. 여기 두는 이유는 사람들이 손으로 옮겨 적은 경로가 깨지지
  // 않게 하기 위해서다. 영어판(much0-en)은 별도 사이트였고 경로가 같아서 구분할 수 없으므로
  // 한국어로만 넘긴다.
  // redirects는 출발 경로에만 base가 붙고 대상에는 붙지 않으므로 대상은 여기서 직접 합친다.
  redirects: {
    '/': `${BASE}/ko/`,
    '/home': `${BASE}/ko/`,
    '/project/about': `${BASE}/ko/much/`,
    '/project/concept-and-approach': `${BASE}/ko/much/`,
    '/project/ambition-and-objectives': `${BASE}/ko/much/`,
    '/project/consortium': `${BASE}/ko/much/consortium/`,
    '/results': `${BASE}/ko/much/research/`,
    '/news/media': `${BASE}/ko/much/media/`,
    '/news/award': `${BASE}/ko/much/awards/`,
    '/news/event': `${BASE}/ko/much/events/`,
    '/contact-us': `${BASE}/ko/contact/`,
  },
});
