#!/usr/bin/env python3
"""한·영 어긋남(드리프트) 검사. CI와 `npm run check:i18n`에서 실행한다.

검사 세 가지:
  1. src/content/ko 와 src/content/en 의 파일 집합이 같은가 (파일 이름이 언어 간 연결 열쇠다)
  2. src/data/*.yaml 안에서 `ko` 키가 있는 매핑마다 `en` 키가 짝으로 있는가 (그 반대도)
  3. src/i18n/ui.ts 의 ko / en 키 집합이 같은가

어긋난 항목을 전부 출력하고 종료 코드 1. 통과하면 요약을 출력하고 0.
"""
import pathlib
import re
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
errors: list[str] = []


def check_content() -> int:
    ko = {p.relative_to(ROOT / 'src/content/ko') for p in (ROOT / 'src/content/ko').rglob('*.mdx')}
    en = {p.relative_to(ROOT / 'src/content/en') for p in (ROOT / 'src/content/en').rglob('*.mdx')}
    for rel in sorted(ko - en):
        errors.append(f'content: en에 없음  src/content/en/{rel}')
    for rel in sorted(en - ko):
        errors.append(f'content: ko에 없음  src/content/ko/{rel}')
    stubs = sum(1 for p in (ROOT / 'src/content/en').rglob('*.mdx')
                if re.search(r'^stub:\s*true', p.read_text(encoding='utf-8'), re.M))
    print(f'content: ko {len(ko)}개 / en {len(en)}개 (en 스텁 {stubs}개)')
    return len(ko)


def walk(node, path: str, file: str) -> None:
    if isinstance(node, dict):
        has_ko, has_en = 'ko' in node, 'en' in node
        if has_ko != has_en:
            missing = 'en' if has_ko else 'ko'
            errors.append(f'data: {file} {path or "(루트)"} 에 {missing} 키가 없음')
        for k, v in node.items():
            walk(v, f'{path}.{k}' if path else str(k), file)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            label = v.get('id', i) if isinstance(v, dict) else i
            walk(v, f'{path}[{label}]', file)


def check_data() -> int:
    files = sorted((ROOT / 'src/data').glob('*.yaml'))
    for f in files:
        walk(yaml.safe_load(f.read_text(encoding='utf-8')), '', f.name)
    print(f'data: yaml {len(files)}개 검사')
    return len(files)


def check_ui() -> int:
    src = (ROOT / 'src/i18n/ui.ts').read_text(encoding='utf-8')
    blocks = {}
    for lang in ('ko', 'en'):
        m = re.search(rf'^\s*{lang}:\s*\{{(.*?)^\s*\}},?\s*$', src, re.M | re.S)
        if not m:
            errors.append(f'ui: ui.ts에서 {lang} 블록을 찾지 못함')
            return 0
        blocks[lang] = set(re.findall(r"^\s*'([\w.]+)':", m.group(1), re.M))
    for key in sorted(blocks['ko'] - blocks['en']):
        errors.append(f'ui: en에 없음  {key}')
    for key in sorted(blocks['en'] - blocks['ko']):
        errors.append(f'ui: ko에 없음  {key}')
    print(f'ui: ko {len(blocks["ko"])}키 / en {len(blocks["en"])}키')
    return len(blocks['ko'])


def main() -> int:
    check_content()
    check_data()
    check_ui()
    if errors:
        print()
        print('\n'.join(errors))
        print(f'\n어긋난 항목 {len(errors)}건', file=sys.stderr)
        return 1
    print('check_i18n: 통과')
    return 0


if __name__ == '__main__':
    sys.exit(main())
