import zipfile, re, sys, os, collections
from xml.etree import ElementTree as ET
p, outp = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(p)
names = z.namelist()
ns = {'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
# core props
for cp in ('docProps/core.xml','docProps/app.xml'):
    if cp in names:
        r = ET.fromstring(z.read(cp))
        for el in r.iter():
            tag = el.tag.split('}')[-1]
            if tag in ('creator','lastModifiedBy','created','modified','title','Slides','Notes','Application','PresentationFormat','Words','TotalTime') and (el.text or '').strip():
                print(f"prop {tag}: {el.text.strip()}")
media = [(n, z.getinfo(n).file_size) for n in names if n.startswith('ppt/media/')]
byext = collections.defaultdict(lambda:[0,0])
for n,s in media:
    e = os.path.splitext(n)[1].lower(); byext[e][0]+=1; byext[e][1]+=s
print("entries:", len(names), "| media files:", len(media))
for k,v in sorted(byext.items(), key=lambda kv:-kv[1][1]):
    print(f"  {k}: {v[0]} files, {v[1]/1e6:,.1f} MB")
print("largest media:")
for n,s in sorted(media, key=lambda x:-x[1])[:12]:
    print(f"  {os.path.basename(n)} {s/1e6:,.1f} MB")
slides = sorted([n for n in names if re.match(r'ppt/slides/slide\d+\.xml$', n)],
                key=lambda n:int(re.search(r'(\d+)', n).group(1)))
out = []
for n in slides:
    idx = int(re.search(r'(\d+)', n).group(1))
    root = ET.fromstring(z.read(n))
    shapes = []
    for sp in root.iter('{%s}sp' % ns['p']):
        ph = sp.find('.//p:nvSpPr/p:nvPr/p:ph', ns)
        phtype = ph.get('type') if ph is not None else None
        paras = []
        for para in sp.iter('{%s}p' % ns['a']):
            t = ''.join(x.text or '' for x in para.iter('{%s}t' % ns['a']))
            if t.strip(): paras.append(t.strip())
        if paras: shapes.append((phtype, paras))
    # table text
    tables = []
    for tbl in root.iter('{%s}tbl' % ns['a']):
        rows = []
        for tr in tbl.iter('{%s}tr' % ns['a']):
            cells = [' '.join((x.text or '') for x in tc.iter('{%s}t' % ns['a'])).strip() for tc in tr.iter('{%s}tc' % ns['a'])]
            rows.append(' | '.join(cells))
        tables.append(rows)
    pics = len(list(root.iter('{%s}pic' % ns['p'])))
    reln = n.replace('ppt/slides/', 'ppt/slides/_rels/') + '.rels'
    refs = []
    if reln in names:
        for rel in ET.fromstring(z.read(reln)):
            refs.append((rel.get('Type').split('/')[-1], rel.get('Target')))
    notes = ''
    for typ,tgt in refs:
        if typ=='notesSlide':
            nn = 'ppt/notesSlides/' + os.path.basename(tgt)
            if nn in names:
                nr = ET.fromstring(z.read(nn))
                notes = ' '.join((x.text or '') for x in nr.iter('{%s}t' % ns['a'])).strip()
    media_refs = [(t, os.path.basename(g)) for t,g in refs if t in ('image','video','media','audio','chart','oleObject')]
    mediasz = 0
    for t,g in media_refs:
        full = 'ppt/media/' + g
        if full in names: mediasz += z.getinfo(full).file_size
    links = [g for t,g in refs if t=='hyperlink']
    out.append((idx, shapes, tables, pics, media_refs, links, notes, mediasz))
with open(outp,'w') as f:
    f.write(f"# 슬라이드 텍스트 덤프: {os.path.basename(p)}\n")
    for idx, shapes, tables, pics, media_refs, links, notes, mediasz in out:
        title = next((ps[0] for ph,ps in shapes if ph in ('title','ctrTitle')), None)
        f.write(f"\n## Slide {idx}: {title or '(제목 없음)'}\n")
        f.write(f"- pictures={pics} media={media_refs} media_size={mediasz/1e6:.1f}MB links={links}\n")
        for ph, ps in shapes:
            f.write(f"- [{ph or 'text'}] " + ' / '.join(ps) + "\n")
        for rows in tables:
            f.write("- [table]\n"); [f.write(f"    {r}\n") for r in rows]
        if notes: f.write(f"- notes: {notes}\n")
print("slides:", len(slides))
print("idx | title | chars | pics | video | media MB | links")
for idx, shapes, tables, pics, media_refs, links, notes, mediasz in out:
    title = next((ps[0] for ph,ps in shapes if ph in ('title','ctrTitle')), None)
    ntext = sum(len(' '.join(ps)) for _,ps in shapes) + sum(len(r) for rows in tables for r in rows)
    nvid = len([1 for t,_ in media_refs if t in ('video','media')])
    print(f"{idx:3d} | {(title or '-')[:45]} | {ntext} | {pics} | {nvid} | {mediasz/1e6:.0f} | {len(links)}")
