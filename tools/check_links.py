#!/usr/bin/env python3
"""빌드 결과(dist/)의 내부 링크를 전수 검사한다 — 4단계 검증 기준 "깨진 링크 0건".

검사 대상: 모든 index.html의 href·src 가운데 사이트 안 경로(/much-site/…)와 상대 경로.
바깥 링크(http·https·mailto)와 조각(#)만 있는 링크는 건너뛴다.
쪽마다 <meta name="description">와 og:image가 있는지도 함께 본다 (같은 4단계 기준).
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
BASE = '/much-site'

def target_exists(path: str) -> bool:
    path = unquote(path.split('#', 1)[0].split('?', 1)[0])
    if not path.startswith(BASE + '/') and path != BASE:
        return False
    rel = path[len(BASE):].lstrip('/')
    p = DIST / rel
    return p.is_file() or (p / 'index.html').is_file()

def main() -> int:
    pages = sorted(DIST.rglob('index.html'))
    if not pages:
        print('check_links: dist/ 가 비어 있습니다. 먼저 npx astro build 를 실행하십시오.')
        return 1
    broken, meta_missing, checked = [], [], 0
    for page in pages:
        html = page.read_text(encoding='utf-8')
        rel = '/' + page.relative_to(DIST).parent.as_posix()
        for attr, url in re.findall(r'\b(href|src)="([^"]+)"', html):
            if url.startswith(('http:', 'https:', 'mailto:', '#', 'data:')):
                continue
            checked += 1
            if not target_exists(url):
                broken.append((rel, attr, url))
        if 'http-equiv="refresh"' in html:
            continue  # 구 주소를 넘기는 자리표시 쪽. 본문이 없으므로 메타는 보지 않는다.
        if 'name="description"' not in html:
            meta_missing.append((rel, 'description'))
        if 'property="og:image"' not in html:
            meta_missing.append((rel, 'og:image'))
    for rel, attr, url in broken:
        print(f'  깨진 링크  {rel}  {attr}={url}')
    for rel, what in meta_missing:
        print(f'  메타 누락  {rel}  {what}')
    print(f'check_links: 쪽 {len(pages)}개 / 내부 링크 {checked}건 검사 / 깨진 링크 {len(broken)}건 / 메타 누락 {len(meta_missing)}건')
    return 1 if broken or meta_missing else 0

if __name__ == '__main__':
    sys.exit(main())
