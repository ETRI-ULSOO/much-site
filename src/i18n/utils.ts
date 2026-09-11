import { defaultLocale, locales, ui, type Locale, type UIKey } from './ui';
import { stripBase, withBase } from '../lib/url';

/** URL 경로의 첫 세그먼트에서 언어를 읽는다. 없으면 기본 언어.
 *  Astro.url.pathname은 base를 포함하므로 반드시 걷어내고 판별한다. */
export function getLocale(url: URL): Locale {
  const seg = stripBase(url.pathname).split('/')[1];
  return (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale;
}

/** 화면 문자열 조회. 누락 키는 기본 언어로 폴백한다. */
export function useTranslations(locale: Locale) {
  return (key: UIKey): string => ui[locale][key] ?? ui[defaultLocale][key];
}

/** 같은 쪽의 반대 언어 경로. 한·영은 파일 이름이 같으므로(check_i18n.py가 보장) 항상 대응 쪽이 있다. */
export function alternatePath(url: URL, to: Locale): string {
  const segments = stripBase(url.pathname).split('/').filter(Boolean);
  segments[0] = to;
  // 끝 슬래시를 항상 붙인다 — 붙이지 않으면 hreflang이 상대 쪽의 canonical과
  // 다른 URL이 되어 언어 쌍이 성립하지 않는다.
  return withBase('/' + segments.join('/') + '/');
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'ko' ? 'en' : 'ko';
}

/** 언어 접두사가 붙은 사이트 내부 경로. 페이지·컴포넌트의 내부 링크는 전부 이걸 쓴다. */
export function localePath(locale: Locale, path = '/'): string {
  const rest = path.replace(/^\/+/, '');
  return withBase(`/${locale}/${rest}`);
}
