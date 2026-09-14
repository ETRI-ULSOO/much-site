import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import localeLinks from './src/lib/locale-links.mjs';

// GitHub Pages 프로젝트 사이트는 `https://<계정>.github.io/<저장소>/` 아래에서 서비스된다.
// 저장소 이름이 곧 하위 경로이므로 base를 여기서 한 번만 정한다.
// 커스텀 도메인을 연결하면 base를 '/'로 되돌리고 site를 그 도메인으로 바꾼다 —
// 내부 링크는 전부 src/lib/url.ts의 withBase()를 거치므로 그 밖의 수정은 필요 없다.
const BASE = '/much-site';

export default defineConfig({
  site: 'https://etri-ulsoo.github.io',
  base: BASE,

  // 원고는 MDX다. 본문 안에 <Video id="…"/> 같은 구성 요소를 놓기 위해서이고, 구성 요소는
  // 쪽 파일이 <Content components={…}/>로 주입하므로 원고에는 import가 없다.
  // 마크다운 처리기는 Astro 7 기본값인 Sätteri를 명시해 hast 플러그인을 끼운다 — 원고의
  // 사이트 절대 경로 링크에 base와 언어를 붙이는 일이다 (src/lib/locale-links.mjs).
  // 옛 markdown.rehypePlugins는 @astrojs/markdown-remark를 따로 설치해야 동작하므로 쓰지 않는다.
  // 사이트맵은 /ko/·/en/ 아래의 실제 쪽만 싣는다. 구 경로를 넘기는 redirects 쪽(meta refresh)은
  // 검색 대상이 아니므로 뺀다. i18n을 주면 쪽마다 다른 언어판을 hreflang으로 함께 적는다.
  // robots.txt는 두지 않는다 — GitHub Pages 프로젝트 사이트는 도메인 루트가 아니어서
  // /much-site/robots.txt를 검색 엔진이 읽지 않는다. 기관 도메인을 붙일 때 public/에 추가한다.
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => /\/(ko|en)\//.test(page),
      i18n: { defaultLocale: 'ko', locales: { ko: 'ko-KR', en: 'en-GB' } },
    }),
  ],
  markdown: { processor: satteri({ hastPlugins: [localeLinks({ base: BASE })] }) },

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
