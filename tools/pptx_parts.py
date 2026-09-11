import zipfile, re, os, sys
from xml.etree import ElementTree as ET
p = "/Users/heekwon/Documents/Much-site/docs/참조데이터/01_발표자료_문화유산 디지털_한국전자통신연구원_260409.pptx"
z = zipfile.ZipFile(p); names = z.namelist()
A='http://schemas.openxmlformats.org/drawingml/2006/main'; P='http://schemas.openxmlformats.org/presentationml/2006/main'
others = [n for n in names if not n.startswith(('ppt/slides/','ppt/media/','ppt/slideLayouts','ppt/slideMasters','ppt/notesSlides','ppt/theme','ppt/notesMasters','ppt/tags'))]
print("other parts:", [n for n in others if not n.endswith('.rels')])
# per slide: graphicFrames, diagrams, charts, embeddings
slides = sorted([n for n in names if re.match(r'ppt/slides/slide\d+\.xml$', n)], key=lambda n:int(re.search(r'(\d+)', n).group(1)))
for n in slides:
    idx = int(re.search(r'(\d+)', n).group(1))
    root = ET.fromstring(z.read(n))
    gf = len(list(root.iter('{%s}graphicFrame' % P)))
    grp = len(list(root.iter('{%s}grpSp' % P)))
    sp = len(list(root.iter('{%s}sp' % P)))
    reln = n.replace('ppt/slides/', 'ppt/slides/_rels/') + '.rels'
    rels = [(r.get('Type').split('/')[-1], r.get('Target')) for r in ET.fromstring(z.read(reln))] if reln in names else []
    special = [(t,os.path.basename(g)) for t,g in rels if t in ('diagramData','chart','oleObject','package','slide','hyperlink')]
    dtext = []
    for t,g in rels:
        if t=='diagramData':
            dn = 'ppt/diagrams/' + os.path.basename(g)
            if dn in names:
                dr = ET.fromstring(z.read(dn))
                dtext += [x.text.strip() for x in dr.iter('{%s}t' % A) if (x.text or '').strip()]
    if gf or special or dtext:
        print(f"slide {idx}: graphicFrame={gf} grpSp={grp} sp={sp} special={special}")
        if dtext: print("   diagram text:", ' / '.join(dtext)[:600])
# extract selected images
want = ['image4.png','image5.png','image6.png','image11.png','image12.png','image13.png','image14.png','image47.png','image48.png','image49.png','image50.png','image51.png','image54.png','image55.png','image56.png','image57.png','image58.png','image59.png','image60.png','image61.png','image106.png','image113.png','image115.png','image126.png','image129.png','image130.png','image16.png','image15.png','image17.png']
for w in want:
    full = 'ppt/media/' + w
    if full in names:
        with z.open(full) as src, open('img/'+w,'wb') as dst: dst.write(src.read())
print("extracted:", sorted(os.listdir('img')))
