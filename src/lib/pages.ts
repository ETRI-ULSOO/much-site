/** 사이트의 쪽 순서. 꼬리말 목록과 쪽 끝의 이전·다음 링크가 같은 배열을 쓴다. 경로는 언어 접두사 없이 적는다. */
import type { UIKey } from '../i18n/ui';

export const pages: readonly (readonly [string, UIKey])[] = [
  ['/much/', 'nav.much'], ['/much/research/', 'nav.research'], ['/much/showcase/', 'nav.showcase'],
  ['/much/outcomes/', 'nav.outcomes'], ['/much/standards/', 'nav.standards'], ['/much/demos/', 'nav.demos'],
  ['/much/awards/', 'nav.awards'], ['/much/media/', 'nav.media'], ['/much/events/', 'nav.events'],
  ['/much/consortium/', 'nav.consortium'], ['/projects/chic/', 'nav.chic'], ['/projects/next/', 'nav.next'],
  ['/contact/', 'nav.contact'],
];
