"""별첨 5·6·7 zip에서 논문·특허·프로그램 등록의 서지 텍스트를 뽑는다.

zip을 풀지 않고 항목별로 pypdf에 넘기며, 결과는 <출력 폴더>에 JSON 세 개로 남긴다.
  papers.json    논문 PDF의 첫 두 쪽 텍스트(앞부분)와 DOI 후보
  patents.json   특허의 출원번호통지서·명세서 첫 쪽에서 뽑은 항목만 (출원서는 읽지 않는다 —
                 발명자의 주민등록번호·주소가 있어 어디에도 남기지 않는다)
  software.json  저작권 등록증 텍스트 전체(1쪽)

사용: python3 tools/extract_outcomes.py docs/참조데이터 <출력 폴더>
"""
import io, json, os, re, sys, unicodedata, zipfile, logging
from pypdf import PdfReader

logging.getLogger('pypdf').setLevel(logging.ERROR)   # /UniKS-UTF16-H 경고 숨김

def nfc(s):
    return unicodedata.normalize('NFC', s)

def zip_path(root, key):
    for f in os.listdir(root):
        if nfc(f).endswith('.zip') and key in nfc(f):
            return os.path.join(root, f)
    raise FileNotFoundError(key)

def entry_name(info):
    n = info.filename
    if not (info.flag_bits & 0x800):
        try:
            n = n.encode('cp437').decode('cp949')
        except UnicodeError:
            pass
    return nfc(n)

def pdf_pages(z, info, max_pages):
    reader = PdfReader(io.BytesIO(z.read(info)))
    texts = []
    for page in reader.pages[:max_pages]:
        try:
            texts.append(page.extract_text() or '')
        except Exception as e:      # 깨진 글꼴 항목은 건너뛴다
            texts.append(f'<<추출 실패: {e}>>')
    return len(reader.pages), texts

DOI = re.compile(r'10\.\d{4,9}/[^\s"<>]+')

def papers(root):
    out = []
    with zipfile.ZipFile(zip_path(root, '별첨 5')) as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            n, texts = pdf_pages(z, info, 2)
            joined = '\n'.join(texts)
            out.append({
                'file': entry_name(info), 'pages': n,
                'doi': sorted(set(m.rstrip('.,;)') for m in DOI.findall(joined))),
                'head': texts[0][:1800],
                'page2': texts[1][:400] if len(texts) > 1 else '',
            })
    return out

def patents(root):
    """통지서에서 번호·일자·명칭·출원인·발명자, 명세서 첫 쪽에서 영문 명칭만 남긴다."""
    out = {}
    with zipfile.ZipFile(zip_path(root, '별첨 6')) as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            name = entry_name(info)
            key, kind = name.rsplit('_', 1)
            kind = kind.replace('.pdf', '')
            rec = out.setdefault(key, {})
            if kind == '출원번호통지서':
                _, texts = pdf_pages(z, info, 1)
                rec['notice'] = texts[0]
            elif kind == '명세서':
                _, texts = pdf_pages(z, info, 1)
                m = re.search(r'【발명의 명칭】\s*(.+?)\s*\{(.+?)\}', texts[0], re.S)
                if m:
                    rec['title_ko'] = ' '.join(m.group(1).split())
                    rec['title_en'] = ' '.join(m.group(2).split())
                else:
                    rec['spec_head'] = texts[0][:600]
    return out

def software(root):
    out = []
    with zipfile.ZipFile(zip_path(root, '별첨 7')) as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            _, texts = pdf_pages(z, info, 1)
            out.append({'file': entry_name(info), 'text': texts[0]})
    return out

if __name__ == '__main__':
    root, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    for name, fn in (('papers', papers), ('patents', patents), ('software', software)):
        data = fn(root)
        with open(os.path.join(outdir, name + '.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print(name, len(data))
