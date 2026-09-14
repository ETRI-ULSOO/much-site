# WORKLOG — MUCH 사이트 리뉴얼

## 2026-09-10

**목표**: 리뉴얼 착수 전 현행 Google Sites(`sites.google.com/view/much0`) 분석.

**결정사항**: 없음 (분석 단계). 리뉴얼의 정체성(P0-1)과 호스팅·스택(P0-2)은 인터뷰 대기.

**산출물**: [[SITE-ANALYSIS]] — 요약 6항 / IA / 페이지별 인벤토리 / 디자인·UX 관찰 / 기술 실측 /
오류 목록 11건 / 플랫폼 제약 / 사각지대 질문표 / 다음 단계.

**실행한 방법과 결과**: `curl`은 샌드박스에서 거부됨 → 앱 내 브라우저 DOM 추출(구조·iframe·링크·
반응형) + WebFetch(본문). WebFetch 요약이 "iframe 없음"으로 보고한 페이지에 실제로는 YouTube 11개가
있었으므로 부재(absence) 주장은 DOM으로 재확인했다. 네트워크 로그는 비어 있어 전송량 미측정.

**현재 진행도**: 분석 완료. 코드·디자인 미착수. 작업 폴더에는 `docs/` 두 파일만 있음.

**남은 미해결**:
- 페이지 전송량·Lighthouse·마지막 갱신 일자 미측정
- 과제 종료 여부는 기간 표기 기반 추정 (연장·후속 과제 미확인)
- ETRI 외부 호스팅·도메인 정책 미확인
- 원본 자산(이미지·영상·다이어그램)과 산출물 목록(논문·특허·SW·표준·데이터셋) 미확보

**다음 단계**: G2 인터뷰 — P0-1(사이트 정체성) → P0-2(호스팅·스택) 순. 그 뒤 G3 시안 3~4방향.

---

## 2026-09-11

**목표**: 0단계 — 결정을 문서로 고정하고 저장소를 준비한다. 아울러 종료평가 발표자료
(7.1 GB, 52장)에서 사이트에 실을 내용을 뽑아 참조 문서로 만든다.

**결정사항** (전문은 [[DECISIONS]]):

| 번호 | 결정 | 비고 |
|---|---|---|
| P0-3 | 정적 사이트 생성기를 **Astro**로 한다 | 승인된 계획서의 Hugo 채택을 뒤집었다. 경위는 [[STACK-SURVEY]] |
| P0-4 | 저장소는 **별도로** `ETRI-ULSOO/much-site`를 만든다 | CHIC 저장소는 건드리지 않는다 |
| P1-1 | 1차 독자는 박물관 실무자와 일반 대중을 함께 본다 | 2026-09-10 인터뷰 결정을 문서로 옮겼다 |
| P1-2 | **디자인은 사용자가 직접 만들어 넘긴다** | Claude는 넘겨받은 결과물을 토큰으로 옮겨 구현만 한다. 시안 4방향 제작은 하지 않는다 |

P0-3을 뒤집은 이유는 하나다. 0단계에 착수하고 나서야 자매 과제 CHIC의 홈페이지가 이미
Astro 7.1.6으로 완성되어 같은 GitHub 조직에 배포 중임을 확인했다. 계획서가 Hugo를 고른
근거는 "선례가 없다"였으므로 전제 자체가 틀렸다. 프로토콜 G5(구현 중 이탈 규칙)가 P0급
결정이 뒤집힐 때는 멈추고 묻도록 정하고 있어 임의로 진행하지 않고 사용자에게 확인받았다.

**산출물**:

| 파일 | 내용 |
|---|---|
| `.gitignore` | 7.1 GB 발표자료·영상·사무 문서를 추적 대상에서 제외한다 |
| [[DECISIONS]] | P0-1·P0-2·P0-3·P0-4·P1-1·P1-2와 미결 항목 Q-1~Q-6 |
| [[STACK-SURVEY]] | 후보 5종 비교(실행 가능성 열 포함), Hugo 판정과 그 전제, 재조사 실측, 남길 교훈 |
| [[REF-종료평가발표자료]] | 슬라이드 52장 인벤토리, 그림 판독 29장, 영상 19편 프로브표, 정량 성과표 |
| [[REF-발표자료-슬라이드덤프]] | 슬라이드별 원문 텍스트 덤프 |
| [[PLAN]] | 승인된 계획서를 Astro 기준으로 개정해 프로젝트 안으로 옮겼다 |
| `tools/pptx_dump.py`, `tools/pptx_parts.py` | 7.1 GB pptx를 풀지 않고 부분 파싱한다 |
| `tools/check_size.sh` | 커밋 전 50 MB 초과 파일을 막는다 |
| `tools/README.md` | 세 스크립트의 사용법 |

**실행한 방법과 결과**:

- `git init -b main` 후 로컬 `user.email`을 업무 계정으로 지정했다(저장소 단위 설정이며
  전역 설정은 건드리지 않았다). `git status --short --untracked-files=all` 결과 추적 후보는
  세 파일뿐이었고 7.1 GB 발표자료는 들어오지 않았다 (2026-09-11 실측).
- `tools/check_size.sh`를 실행해 "대용량 파일 없음 (기준 50 MB)"을 확인했다.
- 발표자료는 zip 묶음이므로 파이썬 `zipfile`이 중앙 디렉터리만 읽는다. 7 GB를 메모리에
  올리지 않고 `ppt/slides/slide*.xml`만 파싱했고, 영상은 한 편씩 꺼내 `ffprobe`로 재고
  즉시 지웠다.
- 영상 19편이 각각 몇 번 슬라이드에 실렸는지 슬라이드 XML의 관계 파일로 대조해 전부 채웠다.
  그 결과 media16은 TV 뉴스 보도, media17은 ETRI 공식 유튜브 숏츠, media18은 국립중앙박물관
  '역사의 길' 디지털 광개토대왕릉비, media19는 콜로키움임이 슬라이드 문구로 확인되었다.

**현재 진행도**: 0단계 문서 작업 완료. 첫 커밋과 원격 저장소 생성이 남았다. 코드는 미착수다.

**남은 미해결** (전문은 [[DECISIONS]] 미결 항목):

| 번호 | 항목 |
|---|---|
| Q-1 | ETRI의 외부 사이트 운영 정책 |
| Q-2 | 논문 27편·특허 8건의 서지 정보 |
| Q-3 | 시연 영상을 어느 계정에 올릴 것인가 (CHIC은 개인 계정에 있어 위험 항목으로 남아 있다) |
| Q-4 | 언론 보도 20여 건의 기사 주소와 일자 |
| Q-5 | 후속 과제의 이름과 기간 |
| Q-6 | 사용자가 넘겨줄 디자인 결과물의 형태와 시점 |

영상 넉 편(media2·5·8·15)은 대표 화면이 검은색이라 주제를 판독하지 못했다.

**다음 단계**: 첫 커밋 → `gh auth status`로 활성 계정 확인 → 사용자 승인을 받아
`gh repo create ETRI-ULSOO/much-site --private` → 1단계(한국어 원고와 데이터 정리) 착수.
1단계는 디자인을 기다리지 않고 진행한다.

**추가 (같은 날, 사용자 승인 후 실행)**: 원격 저장소 `ETRI-ULSOO/much-site`를 비공개로
만들고 첫 커밋을 올렸다. 확인 결과 공개 여부 PRIVATE, 기본 브랜치 main, 원격 파일 12개로
로컬과 일치했고 합계는 약 98 KB였다 (2026-09-11 실측). `tools/check_size.sh`를
`.git/hooks/pre-commit`에 연결해 50 MB 초과 파일의 커밋을 막았다.

**0단계 완료.** 남은 것은 배포 전 공개 전환이며, 그 전에 Q-1(기관의 외부 사이트 운영 정책)을
확인해야 한다.

---

## 2026-09-11 — 1단계: 한국어 원고와 데이터 정리

**목표**: 사이트에 실을 한국어 원고와 데이터를 코드 없이 먼저 확정한다. 근거는
[[REF-종료평가발표자료]]와 [[SITE-ANALYSIS]] 두 문서이며, 현행 사이트가 가진 오류 열한 건을
원고 단계에서 전부 고친다.

**사용자 지시 두 가지**
1. "1단계 시작해줘. 자료는 현재 외부라서 복귀후에 제공하겠습니다." — 논문·특허 서지(Q-2)와
   언론 기사 주소·일자(Q-4)는 뼈대와 합계 숫자만 남긴다.
2. "발표자료에 있는 동영상도 최대한 활용 부탁합니다." — 발표자료에 실린 영상 열아홉 편을
   하나도 빠뜨리지 않고 사이트에 배치한다.

**결정 사항**

- **영상 게시 경로를 세 갈래로 나누었다.** 저장소에 담을 수 있는 파일 크기 상한(GitHub 기준
  파일당 100 MB)이 영상 배치를 지배하는 제약이기 때문이다. `youtube`는 ETRI 공식 계정에 올려
  지연 로드로 싣고, `self-clip`은 소리 없는 짧은 발췌를 5 MB 이하로 만들어 저장소에 직접 담으며,
  `oversize`는 원본이 너무 커서 저장소에 절대 넣지 않는다. 분류 결과는 유튜브 15편, 자체 발췌
  2편, 반입 금지 2편이다 (media2는 2,732 MB, media15는 1,051 MB).
- **제목이 확인되지 않은 영상 열다섯 편은 `confirmed: false`로 두어 게시를 보류한다.** 슬라이드
  문구로 주제가 확인된 것은 media16·17·18·19 네 편뿐이다.
- **국제 특허는 홈 숫자 띠에서 실적으로 세지 않는다.** 목표 2건에 대해 출원 2건이 심사 중이고
  등록된 건이 없기 때문이다. 성과 쪽에는 진행 상태를 그대로 적었다.
- **컨소시엄 표기 불일치(오류 8번)는 확인 전까지 양쪽 모두에 적지 않는다.** 현행 사이트의
  수상 쪽에만 등장하고 컨소시엄 쪽에는 없는 기관이 있어, 어느 쪽이 맞는지 확인이 필요하다.
  `src/data/awards.yaml`의 `partners_pending` 값이 이 보류 상태를 나타낸다.
- **이메일 주소를 평문으로 싣지 않는다.** 현행 사이트는 담당자 세 명의 주소를 그대로 노출하고
  있어 수집 프로그램의 표적이 되기 쉽다. 가공 방식은 사용자가 고르기로 했다.

**산출물**

| 구분 | 내용 |
|---|---|
| `src/data/` YAML 12개 | stats, papers, patents, software, datasets, standards, awards, press, events, videos, timeline, consortium |
| `src/content/ko/` 원고 14개 | `index.md`, `contact.md`, `much/` 10개, `projects/` 2개 |
| [[CONTENT-CHECK]] | 오류 11건 정정 체크표, 정량 수치 대조표, 영상 19편 배치표, 미결 11건 |

원고에는 그림과 영상마다 대체 텍스트를 함께 적었다. 현행 사이트의 대체 텍스트는 0퍼센트였다.

**검증 결과 (2026-09-11 실측)**

- `src/data/*.yaml` 12개를 `python3 -c 'import yaml; yaml.safe_load(...)'`로 파싱 — 전부 통과.
- 원고 14개의 프런트매터를 YAML로 파싱하고 `title`·`description` 존재를 확인 — 전부 통과.
- 오류 열한 건 가운데 일곱 건은 원고에서 완결했고, 두 건(7번 메뉴 문자열·11번 대체 텍스트 강제)은
  원고 단계까지 마치고 3단계에서 구조로 강제한다. 나머지 두 건은 자료와 확인을 기다린다.

**현재 진행도**: 1단계의 데이터 층과 원고 층을 모두 마쳤다. 남은 것은 사용자 검수 한 차례다.

**남은 미해결**: [[CONTENT-CHECK]] 4절에 열한 건으로 정리했다. Q-2·Q-3·Q-4·Q-5는 사용자가
자료를 제공하면 값만 채우면 되도록 구조를 미리 잡아 두었다. 새로 생긴 확인 항목은 학술대회
발표 16건의 표기 방식, 영상 media16의 이용 허락, media10·11·12의 장소 대응, media15와 iF
수상작의 동일 여부, media1과 유튜브 영상 `nJ_bwRA2z98`의 동일 여부, 이메일 표기 방식이다.

**다음 단계**: 사용자 검수를 받은 뒤 2단계(디자인 토큰화, Q-6 대기)와 3단계(Astro 뼈대)로
넘어간다. 3단계는 디자인을 기다리지 않고 라우팅과 i18n 구조부터 착수할 수 있다.

---

## 2026-09-11 (오후) — 최종보고서 반영과 2단계 착수

**목표**

사용자가 `docs/참조데이터/`에 넣은 최종보고서를 판독해서 1단계 원고와 데이터에 반영하고,
`design/` 폴더에 전달된 디자인 시안 두 벌을 2단계의 입력으로 삼아 색과 서체를 토큰으로 고정한다.

**결정 사항**

- **정량 수치의 원천을 [[REF-종료평가발표자료]]에서 [[REF-최종보고서]]로 옮긴다.** 두 자료가
  어긋난 항목은 학술대회 발표(16건 → 18건)와 소프트웨어 등록(6건 → 7건) 두 가지인데,
  최종보고서가 2026년 5월 11일에 확정된 최종본이므로 그쪽을 따른다. 어긋난 사실 자체는
  `src/data/stats.yaml` 머리말과 [[REF-최종보고서]] 3절에 남겨서 근거가 사라지지 않게 했다.
- **학술대회 발표의 표기 방식을 확정한다.** 최종보고서 5쪽이 논문을 29편(9 + 2 + 18)으로
  세므로 보고서의 셈법은 학술대회 발표를 논문에 합산한다. 다만 사이트에서는 학술지 논문 11편과
  학술대회 발표 18건을 나누어 보여 주고, 합계가 필요한 자리에만 29편을 쓴다. 이로써
  [[CONTENT-CHECK]] 4절의 미결 1번이 해소되었다.
- **사이트 꼬리말에 지원 기관 표기를 의무로 넣는다.** 최종보고서 79쪽 주의 사항 2번이 요구하는
  사항이므로 빠뜨리면 안 된다. 문구는 `src/data/site.yaml`의 `footer.funding`에 고정했고,
  이 파일은 편집 대상이 아니다.
- **국제 특허의 내부 관리번호와 특허명은 싣지 않는다.** 아직 출원 전 단계이기 때문이다.
  최종보고서 79쪽 주의 사항 3번(국가과학기술 기밀 유지)과도 맞물린다.
- **대비비를 만족하지 못하는 색은 본문에 쓰지 않는다.** 시안 가의 라벨색은 2.43으로 기준
  4.5에 크게 미달하므로 대안으로 `#6f6a58`(4.67 실측)을 제시했고, 시안 나의 적·청 강조색은
  3.56과 3.71이라서 큰 글자와 도형에만 쓰기로 했다.

**산출물**

| 구분 | 내용 |
|---|---|
| [[REF-최종보고서]] | 자료 개요·쪽 구성표·정량표 대조·새로 확보한 사실 13행·비공개 항목·출처 표기 의무·미결 3건 |
| `DESIGN.md` 6절 | 대비비 실측표 15행과 그로부터 나온 규칙 세 가지 |
| `src/data/site.yaml` | 꼬리말 지원 기관 표기(한국어·영어), 연구 기간, 수행 기관 |
| `src/data/awards.yaml`·`events.yaml` | AVICOM 수상 시점과 대상 기술 보강, 행사 항목 6개에서 9개로 확대 |
| 원고 7개 갱신 | `index.md`, `much/outcomes.md`·`standards.md`·`showcase.md`·`awards.md`·`events.md`·`media.md` |

새로 원고에 들어간 내용은 시범 서비스 여섯 가지(실증 2024-09-04~2024-11-18), 학습·검증용
데이터셋 77,976건, 성능 지표 다섯 가지, 표준 번호 TTAK.KO-10.1621과 제정 경로, 관계정의서
3.0판, 국립중앙도서관 협약과 기술 이전이다.

**검증 결과 (2026-09-11 실측)**

- `src/data/*.yaml` 13개를 파싱 — 전부 통과. `events.yaml`의 항목 수는 9개다.
- 색 대비비 15쌍을 상대 휘도 공식으로 계산 — 본문용 색은 전부 4.5 이상이고, 미달한 두 색은
  용도를 제한했다. `[[PLAN]]` 2단계의 검증 조건 하나를 이것으로 충족했다.
- `tools/check_size.sh` — 50 MB 초과 파일 없음. `design/` 폴더는 전체가 124 KB다.

**현재 진행도**: 1단계의 내용을 최종보고서 기준으로 갱신했고, 2단계는 색과 대비비를 고정한
단계까지 왔다. 남은 것은 두 시안 가운데 어느 쪽을 채택할지 사용자가 고르는 일이다.

**남은 미해결**: [[CONTENT-CHECK]] 4절이 열세 건으로 늘었다. 새로 생긴 두 건은 2025년
콜로키움과 박람회 협력 전시가 같은 행사인지, 과제번호 RS-2023-00219579를 사이트에 표기할지다.
Q-2(개별 서지 목록)는 최종보고서 78쪽의 별첨 5~7에 해당하지만 제공받은 PDF에 별첨이 들어
있지 않아 여전히 미결이다.

**다음 단계**: 사용자가 시안을 고르면 `DESIGN.md`에 토큰을 확정하고 3단계(Astro 뼈대)로
넘어간다. 3단계의 라우팅과 i18n 구조는 시안 선택과 무관하므로 먼저 착수할 수 있다.

### 2026-09-11 (저녁) — 시안 채택과 2단계 완료

**목표**: 사용자가 고른 시안을 확정 토큰으로 굳히고 2단계를 닫는다.

**결정 사항**

- **시안 나(단청)를 채택한다.** 사용자가 2026년 9월 11일에 골랐고, [[DECISIONS]] P1-3으로
  기록했다. 근거는 영상 열아홉 편과의 이음새, 그리고 라벨색까지 대비 기준을 통과해서 색을
  고칠 곳이 없다는 점이다.
- **누를 수 있는 요소의 테두리 색을 새로 둔다.** 시안의 구분선 두 가지가 비텍스트 대비
  3 대 1에 못 미쳐서(1.44와 2.74 실측), 같은 청록 색조를 밝힌 `#647f7c`를 `--line-ui`로
  추가했다. 색조를 유지했으므로 시안의 인상은 달라지지 않는다.
- **면과 바탕은 반드시 선으로 나눈다.** 두 색의 대비가 1.07이라 사실상 같은 밝기이므로,
  배경색 차이에만 기대면 카드의 경계가 보이지 않는다.

**검증 결과 (2026-09-11 실측)**

채택안에서 실제로 쓰이게 된 조합 열네 쌍을 추가로 쟀다. 면 `#14211f` 위의 글자색은 전부
본문 기준을 통과했고, 적과 청은 면 위에서 3.32와 3.46까지 내려가므로 도형에만 쓰기로 했다.
`[[PLAN]]` 2단계의 검증 조건 두 가지(사용자 선택 1개, 본문 대비비 4.5 대 1 이상)를 모두 채웠다.

**산출물**: `DESIGN.md` 개정(0절 채택 결과, 3절 확정 토큰, 6절 추가 실측표 14행과 규칙 네 가지),
[[DECISIONS]] P1-3 신설, 미결 Q-6 해소.

**현재 진행도**: 2단계를 마쳤다. 1단계의 사용자 검수 한 차례만 남아 있다.

**다음 단계**: 3단계(Astro 뼈대)로 넘어간다. 확정 토큰을 `src/styles/tokens.css`로 옮기고,
한국어와 영어가 같은 구조를 갖도록 라우팅과 i18n을 잡는다. 시안에 없는 구성 요소 세 가지
(숫자 띠, 언어 전환, 연표)는 이 단계에서 만든다.

### 2026-09-11 (밤) — 3단계: Astro 뼈대 구축

**목표**: 확정 토큰과 1단계 원고 위에 Astro 사이트의 뼈대를 세우고, 한·영이 같은 구조를
갖도록 라우팅·i18n·검사 도구·배포 흐름까지 한 번에 관통시킨다.

**결정 사항**

- **서체는 저장소에 담아 자체 호스팅한다** (`@fontsource` 세 묶음, [[DESIGN]] 9절 미결 해소).
  외부 요청이 0건이므로 기관 정책(Q-1) 결과와 무관하게 유지할 수 있고, CHIC과 같은 방식이다.
  구글 폰트 외부 로드는 정책 확인이 끝나기 전에는 쓰지 않는다는 보수적 선택이다
  (G5 이탈 규칙에 따른 기록).
- **영어판은 스텁 열네 개로 채운다.** 4단계 전이지만 언어 전환과 `check_i18n.py`를 검증하려면
  한국어와 같은 이름의 파일이 있어야 한다. 프런트매터 `stub: true`인 쪽은 레이아웃이 안내 띠와
  한국어판 링크를 띄운다.
- **홈을 뺀 열세 쪽은 `[...slug].astro` 하나로 만든다.** 계획서에는 `much/index`, `much/[slug]`,
  `projects/[slug]`, `contact` 네 파일로 적었으나, 뼈대가 전부 같고 다른 것이 원고뿐이라
  원고 파일의 자리에서 경로를 그대로 뽑는 쪽이 단순하다 (G5 이탈: 파일 수 4 → 1).
- **컬렉션은 다섯 개만 잡는다** (`pages`·`stats`·`timeline`·`consortium`·`site`). 나머지 YAML
  여덟 개(`videos`·`papers` 등)는 4단계에서 쓰는 쪽을 만들 때 스키마와 함께 추가한다.
- **`base: '/much-site'`**: 내부 링크는 전부 `localePath()`/`withBase()`를 거친다. 구 사이트
  주소 아홉 개는 `redirects`로 한국어판에 넘긴다 (영어판은 별도 사이트였으므로 구분 불가).

**산출물** (전부 새 파일, 2026-09-11 실측)

- 설정: `package.json`(Astro 7.3.2 설치 실측, `^7.1.6` 지정), `.nvmrc`(22), `astro.config.mjs`,
  `.claude/launch.json`, `public/.nojekyll`, `.github/workflows/deploy.yml`(CHIC 계승 +
  `check_i18n.py`를 빌드 앞에 둠).
- 배관: `src/lib/url.ts`, `src/i18n/ui.ts`(38키 × 2언어), `src/i18n/utils.ts`,
  `src/content.config.ts`.
- 외형: `src/styles/fonts.css`, `src/styles/tokens.css`([[DESIGN]] 3절 토큰 전부),
  `src/layouts/BaseLayout.astro`(제목·설명·canonical·hreflang 3종·OG·JSON-LD `ResearchProject`·
  건너뛰기 링크·스텁 띠).
- 구성 요소 일곱: `Header`(고정 상단, 항목 7 + 언어 전환), `LangSwitch`, `Footer`(의무 표기
  문구 + 전체 쪽 목록 13), `StatBand`(숫자 띠, highlight 5항목), `Timeline`(연표 3칸),
  `VideoEmbed`(클릭 전 iframe 미생성, youtube-nocookie, 세로 영상 `max-height`).
- 쪽: `src/pages/[locale]/index.astro`, `src/pages/[locale]/[...slug].astro`, `src/pages/404.astro`.
- 원고: `src/content/en/` 스텁 14개.
- 도구: `tools/check_i18n.py`(원고 파일 집합·YAML ko/en 키 짝·ui.ts 키 집합), `tools/README.md` 한 줄.

**검증 결과 (2026-09-11 실측)**

- `npx astro build` 성공: 29쪽(ko 14 + en 14 + 루트 넘김 1) + 구 주소 넘김 9 + `404.html`.
  경고·오류 0건.
- `python3 tools/check_i18n.py` 종료 코드 0. 영어 파일 하나를 빼고 ui.ts 키 하나를 바꾼 뒤
  돌리자 3건을 잡고 종료 코드 1을 냈다 (음성 검사).
- `tools/check_size.sh` 통과. `dist/` 25 MB, 그중 서체 24 MB (woff2 10.8 MB + 구형 woff
  13.5 MB). 브라우저는 유니코드 구간별로 필요한 조각만 내려받는다.
- 개발 서버에서 `/much-site/ko/` ↔ `/much-site/en/` 전환 확인. 영어 홈에서 `lang="en"`,
  스텁 띠, 한국어판 링크가 나왔고 외부 호스트 요청은 0건이었다(서체 자체 호스팅 확인).
  서체 세 가족이 모두 적재됐고 제목은 Song Myung으로 그려졌다.
- 생성 HTML: 내부 링크 전부 `/much-site/` 접두, canonical과 hreflang(ko·en·x-default) 정상,
  꼬리말 의무 표기 문구 노출, 초기 `<iframe>` 0개.

**현재 진행도**: 3단계 산출물과 로컬 검증을 마쳤고 커밋 `f45dc77`로 push했다. GitHub Actions
첫 실행(2026-09-11 실측, run 34563553209)에서 `npm ci`·`check_i18n.py`·`npm run build`는
ubuntu에서도 통과했으나, `configure-pages` 단계가 "Pages site not found"로 실패했다. 저장소가
개인 계정(User)의 비공개 저장소라 Pages를 켤 수 없는 상태다 — 비공개 저장소의 Pages는 유료
플랜에서만 되므로, 첫 배포는 Q-1(기관 정책) 확인 뒤 저장소를 공개로 전환하고 Pages 원천을
GitHub Actions로 지정한 다음에 이루어진다. 그때까지 push마다 Actions는 같은 자리에서 실패한다.

**남은 미해결**

- 1단계 원고 앞머리의 HTML 주석(작성 노트)이 렌더 HTML에 그대로 남는다. 4단계에서 원고를
  정리할 때 걷어내거나 프런트매터로 옮긴다.
- 홈 원고가 아직 "히어로 / 카드" 같은 절 제목을 본문으로 갖고 있어 `.prose`로 통째로
  나온다. 4단계에서 절별 구성 요소로 나눈다.
- 서체 구형 woff 13.5 MB는 배포 무게만 늘린다. 5단계 자산 정리에서 woff2만 남기는
  `@font-face`로 바꿀지 정한다.
- `timeline.yaml`의 후속 과제 영어 값이 비어 있어 영어 연표 셋째 칸이 "In preparation"만
  보인다 (Q-5 대기).
- 세로형 영상 배치는 `VideoEmbed`의 `orientation="portrait"`로 자리만 잡았다. 실제 갤러리
  배치는 4단계 showcase 쪽에서 본다.
- 나머지 YAML 컬렉션 여덟 개의 스키마.

**다음 단계**: 4단계(페이지 옮기기와 영어판). 홈 원고를 절별 구성 요소로 나누고, 각 쪽에
`videos.yaml`·`awards.yaml` 등을 붙이며, 영어 스텁을 실제 원고로 바꾼다.

### 2026-09-11 (심야) — 4단계: 페이지 옮기기와 영어판

**목표**: 1단계 원고를 구성 요소가 붙은 실제 쪽으로 바꾸고, 영어 스텁 14개를 번역 초안으로
채우며, 이전·다음 링크와 내부 링크 검사까지 한 번에 관통시킨다.

**결정 사항**

- **원고 형식을 `.md`에서 `.mdx`로 바꾼다** (28개 파일 `git mv`). 원고 안에서 `<Video>`·
  `<StatTable>` 같은 구성 요소 태그를 쓰기 위해서다. 쪽 파일이 `<Content components={{ … }} />`로
  태그를 넘기므로 원고에는 import가 없고, 원고 작성자는 태그 이름만 알면 된다.
- **마크다운 처리기를 Astro 7 기본값인 Sätteri로 명시하고 hast 플러그인을 끼운다**
  (`astro.config.mjs`의 `processor: satteri({ hastPlugins: [localeLinks(…)] })`). 원고의
  `[연구 내용](/much/research/)` 같은 언어 없는 경로를 빌드 때 `/much-site/ko/much/research/`로
  바꾸는 플러그인 `src/lib/locale-links.mjs`가 그것이다. 옛 `markdown.rehypePlugins`는
  `@astrojs/markdown-remark`를 따로 설치해야 동작하므로 쓰지 않았다 (2026-09-11 빌드 실패로 확인).
- **프런트매터 `layout`을 `kind`로 개명**한다. MDX에서 `layout`은 Astro가 레이아웃 파일 경로로
  해석해 "Rolldown failed to resolve import 'home'" 오류를 낸다 (2026-09-11 실측).
- **원고 앞머리의 작성 노트는 지우지 않고 MDX 주석 `{/* */}`으로 바꾼다.** 렌더 HTML에는 나오지
  않고 저장소에는 근거가 남는다 (3단계 미해결 "HTML 주석 잔존" 해소).
- **영어 번역은 sonnet 서브에이전트 세 개에 나눠 맡겼다** (토큰 위생 원칙 5항). A는 원고 7편
  (홈·개요·연구·시범 콘텐츠·성과·표준·데모), B는 원고 7편(수상·언론·행사·컨소시엄·CHIC·
  후속·문의), C는 YAML 8파일의 `en` 값. 공통 지침은 번역 규칙 12개와 용어집(스크래치패드
  `en-brief.md`, 저장소 밖)이며, 각 에이전트가 태그·헤딩·링크 동일성 검사와 금지어 검사, 빌드를
  스스로 돌린 뒤 보고했다. 실측 소모: A 10.6만 토큰·27분, B 14.1만·6분, C 12.9만·28분.
- **표의 단위는 언어별 값을 그대로 쓴다** (`StatTable.astro`). 영어 단위는 비워 두는 것이 정상이며
  한국어 단위("편")로 대신하지 않는다.
- **IDEA 2024 등급 표기는 `awards.yaml`의 `grade: finalist`를 따라 영어에서 "Finalist"로 통일**했다.
  에이전트 A가 "본상"을 "the main prize"로 옮긴 것을 되돌렸다. 다만 `finalist` 값 자체의 근거가
  기록에 없어 아래 검수 항목에 올린다.
- **1단계 원고의 사실 오류 정정**: 언론 보도 쪽의 "매체 아홉 개"는 `press.yaml` 실측(9건 = 8개
  매체)에 따라 "여덟 개 매체의 보도 아홉 건"으로 고쳤다 (2026-09-11).

**산출물** (2026-09-11 실측: 67개 파일 변경, +1,652 / −771줄, 이름 바꾼 파일 28개 별도)

- 원고: `src/content/ko/**` 14편(구성 요소 태그 적용), `src/content/en/**` 14편(번역 초안,
  전부 `draft: true`, 스텁 0개).
- 데이터: `src/data/*.yaml` 11개 갱신 — `awards`·`papers`·`patents`·`software`는 최상위 배열로
  재구성(콘텐츠 컬렉션 file 로더가 배열 항목의 id를 열쇠로 쓰기 때문), 8개 파일의 `en` 값 채움.
  `stats.unit.en`·`timeline.next`·`events.venue`(한국어도 빈 7건)는 의도적으로 비워 둠.
- 구성 요소 12개 신규: `Section`·`Cards`·`Card`·`Video`·`Videos`·`Awards`·`Press`·`Events`·
  `StandardTable`·`StatTable`·`Publications`·`PrevNext`. `Footer`·`VideoEmbed`·`BaseLayout`
  (초안 띠, `og:image`) 갱신. `public/og.png` 추가.
- 배관: `src/content.config.ts`(컬렉션 14개, `standards`에 언어별 `organization` 선택 항목),
  `src/lib/pages.ts`(이전·다음 순서), `src/lib/locale-links.mjs`, `src/i18n/ui.ts`(60키 × 2언어).
- 도구: `tools/check_links.py` 신규 — `dist/`의 모든 `index.html`에서 내부 `href`·`src`가 실제
  파일을 가리키는지, 쪽마다 `description`과 `og:image`가 있는지 검사한다. `tools/check_i18n.py`는
  `*.mdx` 기준으로 고침.

**검증 결과 (2026-09-11 실측)**

- `npx astro build` 성공: 29쪽. 경고는 `papers`·`patents`·`software` 컬렉션이 비어 있다는 것뿐
  (Q-2 서지 대기, 의도된 상태).
- `python3 tools/check_i18n.py` 통과: 원고 ko 14 / en 14(스텁 0), YAML 13개, ui 60/60키.
- `python3 tools/check_links.py` 통과: 쪽 39개, 내부 링크 809건, 깨진 링크 0건, 메타 누락 0건.
- `tools/check_size.sh` 통과, `git ls-files`에 참조데이터·mp4 0건.
- 생성된 영어 쪽 14개를 스크립트로 훑은 결과: "world's first"·175ZB·TRIC·과제번호·이메일 0건
  (`@`는 "F@IMP" 두 곳뿐), 본문에 남은 한국어는 언어 전환 단추의 "한국어"뿐. 처음 검사에서
  표준 쪽에 포럼 이름이 한국어로 남아 `standards.yaml`의 `en.organization`을 추가해 해소했다.
- 영어 홈: `<h1>` 번역 노출, 초안 안내 띠("draft translation pending review")와 한국어판 링크
  노출. 성과 쪽 `StatTable`의 영어 단위 열은 빈 값.
- YAML 주석 줄 수: 에이전트 C가 다룬 8파일 중 6파일은 HEAD와 같고, `awards`(+2)·`datasets`(+3)는
  이번 세션의 배열 재구성 때 내가 더한 주석이다 (C의 보고와 대조해 확인).

**현재 진행도**: 4단계 산출물과 로컬 검증을 마쳤다. 사용자 검수 두 건(1단계 원고, 영어 초안)은
아직이며, 영어판은 검수 전까지 `draft: true`로 안내 띠를 띄운다.

**영어 초안 검수 항목** (에이전트 보고에서 판단이 갈린 표현 — 사용자 확인 대기)

| 위치 | 한국어 | 영어 초안 | 확인할 것 |
|---|---|---|---|
| `awards.yaml`, showcase | IDEA 2024 본상 | Finalist | IDEA 등급이 Finalist가 맞는지 (`grade: finalist`의 근거 없음) |
| showcase, consortium | 역사의 길 | Road of History | 국립중앙박물관 공식 영문 통로명 |
| media | 3단계에 해당하는 보도 | the project's third stage | "3단계"가 연차인지 협약 단계인지 |
| `events.yaml` | 세계국가유산산업전 | World National Heritage Industry Fair | 공식 영문 행사명 |
| `awards.yaml` | AVICOM 우수상 | Excellence Award | 주최 측 영문 등급명 |
| `stats.yaml` | 체험 실증 | Hands-on Demonstrations | 협약서의 영문 항목명이 있으면 그것으로 |
| `timeline.yaml` | 지정과제 / 일반과제 | 서로 다른 번역 | 공식 영문 구분이 있는지 |

**남은 미해결**

- 1단계 원고 사용자 검수(정량 수치·정정 문구)와 영어 초안 검수(위 표). 검수가 끝나면
  `draft: false`로 바꿔 안내 띠를 없앤다.
- `papers`·`patents`·`software` 컬렉션이 비어 성과 쪽 목록이 나오지 않는다 (Q-2).
- 영상 19편의 `youtube` 값이 전부 비어 자리표시 패널만 보인다 (Q-3, media16 이용 허락).
- 언론 보도 9건 전부 `ready: false`라 화면에 나오지 않는다 (Q-4 주소·일자).
- 이메일 표기 방식·과제번호 표기 여부·TRIC 표기가 정해지지 않아 문의 쪽과 수상 쪽이 불완전하다.
- 서체 구형 woff 13.5 MB(5단계), `.band + .band` 이중 테두리, `.nvmrc`(22)와 실제 Node(26.3.0)
  불일치는 3단계에서 이월.
- ~~원고 앞머리 HTML 주석 잔존~~, ~~홈 절 구성 요소화~~, ~~YAML 컬렉션 여덟 개 스키마~~는 이번에
  해소.

**다음 단계**: 사용자 검수 2건을 받은 뒤 5단계(그림·영상·문서 자산). 발표자료에서 꺼낸 그림을
`src/assets/`에 넣고 `videos.yaml`의 `youtube` 값을 채운다.

## 2026-09-14 — 5.5단계: 참조 데이터 2차분으로 내용 보강 (순서 1~4)

**목표**: 사용자가 `docs/참조데이터/`에 넣은 2차분(별첨 1~9, `01_성과등록/`, 작성자료 원본 모음)으로
현재 쪽의 내용을 최대한 보강한다. 사용자 지시대로 계획을 먼저 [[PLAN]] 5.5단계로 반영한 뒤 실행했다.

**결정사항**

- 쓰는 자료와 쓰지 않는 자료를 [[PLAN#5.5단계 — 참조 데이터 2차분으로 내용 보강 (2026-09-14 추가)|PLAN 5.5단계]]
  표로 갈랐다. 평가용 내부 증빙(별첨 1·2·3·4·9, 연구노트, 전년도 단계보고서, 작성 중 hwp)은 사이트 원천으로
  쓰지 않는다. 목록은 [[REF-참조데이터-2차분]].
- 특허 출원서 PDF에는 발명자 주민등록번호·주소·연락처가 있어 `tools/extract_outcomes.py`는 출원서를 읽지 않고
  명세서·통지서에서 명칭·출원번호·출원일·출원인·발명자 이름만 뽑는다. 2025년 출원 3건은 특허청 공개(출원 후
  18개월) 전일 수 있어 `patents.yaml`에 `public: false`로 두고 화면에 내지 않는다(사용자 확인 항목).
- 가이드라인 2024 PDF는 발행처 판권면에 "무단 전재와 무단 복제, 배포 등을 금합니다"가 있어 `public/files/`에
  복사하지 않는다(계획 이탈, PLAN 순서 2에 기록). TTA 표준 PDF도 복제하지 않고 표준화위원회 상세 쪽으로만
  링크한다(`www.tta.or.kr`은 서비스가 끝나 위원회 사이트에서 실측).
- 방송 뉴스 영상 7편은 방송사 저작물이므로 임베드하지 않고 유튜브 링크로만 안내한다. `press` 스키마에
  `youtube` 필드를 두어 ID만 보관한다.
- 홈의 언론 띠(`<Press compact />`)는 최근 4건만 보이고, 전체 목록은 날짜 내림차순이다(컬렉션이 id 순으로
  와서 명시적으로 정렬).

**산출물**

| 순서 | 파일 | 내용 (2026-09-14 실측) |
|---|---|---|
| 1 서지 | `tools/extract_outcomes.py`, `src/data/papers.yaml`(29편)·`patents.yaml`(6건)·`software.yaml`(7건), `src/components/Publications.astro`, `outcomes.mdx` ko/en, `stats.yaml`, [[CONTENT-CHECK]] | zip을 풀지 않고 스트리밍으로 pypdf 추출. 학회명 미확인 4편(p02·p03·p04·p13)은 상호 인용으로 일부 복원, 나머지는 사용자 확인 |
| 2 문서 | `src/data/standards.yaml`(url 추가), `StandardTable.astro`, `standards.mdx` ko/en, `src/content.config.ts` | 포럼 인증서로 `forum-2024` 확인, TTA 표준 URL 실측. 가이드라인은 서지만 |
| 3 수상 | `src/data/awards.yaml`, `awards.mdx` ko/en, [[REF-종료평가발표자료]] | AVICOM 인증서 실측: 출품작 "H+Low: Visual Exploration of Cultural Heritage with Generative AI", 출품 기관 국립중앙박물관, 부문 Website, Prize Interpretation. 이전의 "H+Low 부문"은 오독이었다 |
| 4 언론 | `src/data/press.yaml`(14건 중 12건 `ready: true`), `Press.astro`, `media.mdx` ko/en, [[DECISIONS]] Q-4 | 방송 7건은 현행 사이트 Media 쪽 유튜브 ID를 이전 세션 기록에서 복원해 oEmbed·watch 쪽에서 제목·게시일·길이를 실측(게시일은 방송일과 다를 수 있음). 기사 5건(쿠키뉴스 2024-05-28, ZDNet ㉑ 2025-07-10, ZDNet 2025-07-18, 헤럴드경제 2025-07-18, ETRI 웹진 2024-08호)은 원문 확인. 충청투데이·디지털타임스는 주소 미확인 |

**검증**: `npx astro build` 29쪽 성공, `check_i18n.py`·`check_links.py`(내부 링크 811건, 깨진 것 0)·
`check_size.sh` 통과, `git ls-files`에 참조데이터·PDF·mp4 없음, 저장소와 스크래치패드에 주민등록번호
형식 문자열 없음(grep). 스크래치패드의 특허 통지서 PDF·PNG, 논문 PDF, 표준 PDF, 인증서 PNG는 삭제했다.

**현재 진행도**: 5.5단계 순서 1~4 완료, 순서 5(그림 합류)·6(5단계 잔여)은 미착수.

**남은 미해결 (사용자 확인 항목, 2026-09-14 기준)**

- ETRI 웹진 연월: 최종보고서 70쪽 캡션은 25.08이나 실측한 기사는 2024년 8월호(Vol.242)다. 2025년 8월호에서는
  찾지 못했다.
- ZDNet 「디지털 K-헤리티지」 2025년 8월 ETRI 편은 검색으로 찾지 못했다(㉑ 국립중앙박물관 편으로 대신).
- 충청투데이·디지털타임스 기사 주소, 방송 영상 임베드 허용 여부, 방송·기사 영어 제목 초안 검수.
- AVICOM 상 이름의 한국어 표기("우수상" vs "Prize: Interpretation")와 인증서의 "Explaration" 오자.
- 2025년 출원 특허 3건의 노출 여부, 한국어 논문·특허·프로그램의 영어 제목 초안, 학회명 미확인 논문 4편,
  SCOPUS 10편 중 보고서 집계 9편에서 빠진 1편, p09 "투어 최적합" 오타 여부, p12 KSC 전체 이름, sw06 제호.
- 가이드라인 2024 PDF 호스팅은 발행처(TRIC) 허락 확인 뒤에 정한다(Q-3에 병기). TRIC 표기 자체도 미정.
- 이전부터 이월: 1단계 원고 검수, 영어 초안 7항목, Q-1·Q-5, media16 허락, 이메일·과제번호 표기.

**다음 단계**: 순서 5 — `tools/pptx_dump.py`로 `그림수정_230127_박찬우.pptx`를 덤프해 수행 체계도·플랫폼
구조도를 확보하고 `평생도.png`·`반가사유상.png`를 검토한 뒤, 5단계 잔여(그림 판독표, Figure 구성 요소,
영상 대표 그림, 홈 배경 영상, 유튜브 길이 대조표)로 잇는다.

## 2026-09-14 (오후) — 5.5단계 순서 5·6·7: 그림 합류, 5단계 잔여(그림·영상), 검증

**목표**: [[PLAN]] 5.5단계의 남은 순서를 마친다. 순서 5는 `그림수정_230127_박찬우.pptx`에서 쓸 수 있는
그림을 가르는 일, 순서 6은 5단계 잔여(Figure 구성 요소, 영상 대표 그림, 홈 배경 영상, 유튜브 길이
대조표), 순서 7은 검증과 커밋이다.

**결정사항**

- 그림수정 pptx의 체계도·구조도는 글상자로 그린 것이라 그림으로 꺼낼 수 없고, 이 Mac에는 pptx를
  그려 줄 도구(soffice·PowerPoint)가 없다. 같은 도식의 완성본이 발표자료(2026-04)에 그림으로 있으므로
  그쪽을 원천으로 삼았다. 판독표는 [[REF-참조데이터-2차분]] 4.1절.
- 그림은 `src/assets/img/`에 두고 `astro:assets`의 `<Image>`로 낸다(빌드 때 webp·폭별 사본 생성,
  `sharp` 0.35.4 실측). 원고(MDX)에서는 `<Figure src="이름" alt="…" />`만 쓰고, 파일 찾기는
  `src/lib/images.ts`의 `findImage`가 맡는다. alt가 없으면 빌드가 실패한다.
- 컨소시엄은 `Consortium` 구성 요소(3단 체계도: 주무 부처 / 주관 / 참여·수요처)로 바꿨다. 기관 로고 5종은
  `src/assets/img/logos/`에 두되 `consortium.yaml`의 `# logo:` 주석을 풀어야 화면에 나온다. 각 기관의
  로고 사용 지침 확인은 사용자 몫이다.
- 영상 대표 그림은 `videos.yaml`의 `poster` 필드로 처리했다. 발표자료 그림과 영상의 짝은 첫 장면
  해상도로 확정했다(`image48`=`media4`, `image57`=`media10`, `image58`=`media11`, `image59`=`media12`,
  `image126`=`media18`, 2026-09-14 실측). 게시 전(`confirmed: false`)에는 자리표시 패널 안에 대표 그림과
  "영상 준비 중" 라벨만 보인다.
- 홈 배경 영상은 `media10`(정조 화성행궁 행렬)의 0~6초를 잘라 `public/video/hero-hwaseong.mp4`
  (1280×528, h264, 무음, 543 kB)와 정지 이미지 `hero-hwaseong.jpg`(174 kB)로 만들었다. **계획 이탈(G5,
  보수적 선택)**: 계획은 8~10초였으나 6초다. `media10`을 3초 간격 격자와 프레임 차이(`tblend` difference
  의 YAVG)로 실측한 결과, 화면 UI 패널 없이 그림만 움직이는 구간이 0~10초뿐이고 5.5~6.5초에 제목 카드가
  사라지며 10.5초에 패널이 열린다. 인물이 제자리에서 걷는 애니메이션이라 0초와 6초의 구도가 거의 같아
  반복 이음새가 덜 띈다. `media12`(광개토대왕릉비)의 0~8초는 팔레트는 맞지만 중앙에 인용문이 크게 겹쳐
  제외했다. 자르기(`crop=3150:1300:260:200`)로 좌상단 로고, 우측 제목 카드, 하단 "들어가기" 단추를 뺐다.
- 배경 영상은 `autoplay` 속성 대신 스크립트가 `play()`를 부른다. `prefers-reduced-motion: reduce`이거나
  `[data-nomotion]`이면 부르지 않으므로 정지 이미지만 남고 `preload="none"`이라 영상 파일도 내려받지
  않는다([[DESIGN]] 5절 규칙 4). 글자 대비는 영상 불투명도 0.3에 왼쪽 40%까지 바탕색 그라데이션을 덮어
  지켰다.
- `.gitignore`의 `*.mp4` 전역 제외에 `!public/video/*.mp4` 예외를 두었다. 이 폴더는 홈 배경 클립
  1개만을 위한 것이며 다른 영상을 넣지 않는다(`git check-ignore -v`로 예외 규칙 매치 확인).
- 유튜브 길이 대조표는 [[REF-종료평가발표자료]] 5.1절에 **채점표로만** 두었다(G4.8). 현행 사이트 12편은
  모두 ETRI 채널이고, 길이가 정확히 같은 짝은 6쌍(`media2`↔홈 소개 영상 `nJ_bwRA2z98`, `media4`, `media7`,
  `media8`, `media9`, `media13`)이다. 1초 차이 2쌍은 내용 단서가 어긋나 짝으로 보지 않았다. `videos.yaml`의
  `youtube`·`confirmed`·제목은 바꾸지 않았다. `media1`을 홈 소개 영상으로 본 이전 추정(`youtube_candidate`)은
  길이(135초 vs 203초)로 기각된다.

**산출물**

| 순서 | 파일 | 내용 (2026-09-14 실측) |
|---|---|---|
| 5 그림 합류 | [[REF-참조데이터-2차분]] 4.1절, `src/assets/img/logos/`(5종) | 삽화 1장·로고 5종만 채택. 인증서·타사 화면·내부 경로 화면은 제외 |
| 6 그림 | `src/assets/img/`(그림 8장: overview-needs·overview-concept·research-roadmap PNG, showcase-platform-ui·hwaseong·bangasayusang·gwanggaeto·outreach-museum-gwanggaeto JPEG), `src/lib/images.ts`, `src/components/Figure.astro`, ko/en `much/index.mdx`·`research.mdx` | 긴 변 2000px, `<Image widths={[640,1024,1600]}>`, alt 필수 |
| 6 컨소시엄 | `src/components/Consortium.astro`, `src/data/consortium.yaml`, `src/i18n/ui.ts`, `src/content.config.ts`, ko/en `consortium.mdx` | 3단 체계도, 로고는 주석 게이트 |
| 6 영상 대표 그림 | `src/data/videos.yaml`(poster 5건·alt), `Video.astro`·`VideoEmbed.astro`, `content.config.ts` | 자리표시 패널에 대표 그림 |
| 6 홈 배경 영상 | `public/video/hero-hwaseong.mp4`·`.jpg`, `src/pages/[locale]/index.astro`, `.gitignore` | 6초 무음 반복, 움직임 줄임 설정 존중 |
| 6 유튜브 대조표 | [[REF-종료평가발표자료]] 5.1절 | 12편 실측, 짝 6쌍 제시, 판정 대기 |
| 7 문서 | [[PLAN]] 5.5단계 6·7항, [[DECISIONS]] Q-3 | |

**검증 (2026-09-14 실측)**: `npx astro build` 29쪽 성공(빌드 산출물 `dist/ko/index.html`의 `<video>`가
`/much-site/video/hero-hwaseong.mp4`를 가리킴), `check_i18n.py` 통과(ko/en 14쪽, yaml 13개, ui 64키),
`check_links.py` 통과(39쪽, 내부 링크 835건, 깨진 것 0, 메타 누락 0), `check_size.sh` 통과, `src/assets`
1.7 MB·`public` 784 kB. dev 서버에서 375px 가로 넘침 없음(`scrollWidth == innerWidth`, JS DOM 실측; 앱 안
브라우저 창이 숨겨져 있어 스크린샷은 못 찍었다). 배경 영상은 숨겨진 탭에서는 `paused: true`였으나 수동
`play()`가 오류 없이 재생됐고(`currentTime` 1.74) 움직임 줄임 판정은 `false`였다. **자동 재생은 보이는
창에서만 확인할 수 있어 미확인**이며, 배포 뒤 사용자 검수 항목으로 남긴다.

**현재 진행도**: 5.5단계 순서 1~7 완료. 5단계(그림·영상)는 이로써 마쳤고 문서(가이드라인 PDF 호스팅)는
발행처 허락 확인 대기. 다음은 6단계(점검과 배포)이며 Q-1(ETRI 기관 정책)이 선행 조건이다.

**남은 미해결 (사용자 확인 항목, 2026-09-14 추가분)**

- 홈 배경 클립 구간: `media10` 0~6초를 채택했고 대안은 `media12` 0~8초(인용문 겹침)다. 실제 브라우저에서
  자동 재생과 반복 이음새를 확인해 달라.
- 유튜브 짝 6쌍의 판정([[REF-종료평가발표자료]] 5.1절). 맞으면 `videos.yaml`의 `youtube`에 옮기고 제목을
  유튜브 제목으로 바꿀지, 발표자료에 없는 유튜브 4편(`Xst3GBBzCQY`·`hx4G-OvY1nQ`·`fQHP54KxzXM`·`zcYEaA_JAZU`)을
  별도로 실을지.
- 기관 로고 5종의 사용 가부(`consortium.yaml` `# logo:` 주석 해제 게이트).
- 그림 출처: 발표자료 `image12` 삽화(그림수정 `image11`과 같은 삽화), `image16`(반가사유상 전시 연출),
  `image126`(전시 공간 사진), `image4`(선 아이콘 9개).
- 영상 제목 단서(`media1`·`3`·`4`·`6`·`7`·`9`·`10`·`11`·`12`·`13`) 확인, `media1`의 방송 뉴스 여부와
  임베드 여부(방송 7편과 같은 규칙).
- 이전부터 이월: 위 2026-09-14 오전 항목 전부(1단계 원고 검수, 영어 초안, Q-1·Q-5, TRIC 표기, media16 허락,
  이메일·과제번호 표기, 2025년 출원 특허 3건, 서지 확인 항목들).

**다음 단계**: 사용자 검수(위 항목) → 6단계 점검과 배포(Q-1 확인 뒤 Pages 설정·공개 전환은 사용자 확인 후).

## 2026-09-14 (저녁) — 6단계 점검: 사이트맵, 375px 패널 넘침 수정, 유효성·Lighthouse 실측

**목표**: [[PLAN]] 6단계의 점검(QA) 부분을 끝내고, 배포(저장소 설정 변경)는 사용자 결정에 넘긴다.

**결정사항**
- `@astrojs/sitemap` 3.7.4를 넣어 `/ko/`·`/en/` 아래 실제 쪽 28개만 싣는다(redirect·404 제외, i18n으로 hreflang
  56개). `BaseLayout.astro` head에 `<link rel="sitemap">`을 더했다.
- `robots.txt`는 두지 않는다. GitHub Pages 프로젝트 사이트(`/much-site/`)는 도메인 루트가 아니어서 검색 엔진이
  `/much-site/robots.txt`를 읽지 않는다. 기관 도메인을 붙일 때 `public/`에 추가한다(`astro.config.mjs` 주석).
- 375px 넘침의 원인은 `VideoEmbed.astro`의 `.pending .panel`이 가진 `min-height: 200px`였다. `aspect-ratio: 16/9`가
  있으면 브라우저가 min-height를 최소 너비(200 × 16/9 = 356px)로 옮기므로(transfer), 부모 295px보다 넓어져
  ko/en의 `much/`·`events`·`media`·`research`·`showcase` 10쪽이 scrollWidth 395로 넘쳤다. `min-height`를 지워
  비율만으로 높이를 정한다(2026-09-14 실측, 수정 뒤 29쪽 넘침 0).
- `html-validate`의 `valid-id` 규칙은 숫자로 시작하는 id(`3d-shape-data` 등)를 오류로 보지만 HTML5에서는 유효하므로
  이 규칙만 끄고 검사했다.
- Lighthouse 성능 점수(62·78·81)의 원인은 서체 CSS다. Noto Serif KR 3굵기 × 124구간 + Song Myung 89 + IBM Plex Mono 10
  = 471개 `@font-face`가 본문 CSS와 한 파일(527 kB, gzip 235 kB)로 묶여 화면 그리기를 막는다. 굵기 900은 명시
  규칙이 없어도 `strong`·헤딩의 bold(700)가 400·600·900 중 900을 고르므로 실제로 쓰이며, 굵기 구성은 시안이 정한
  것이라 바꾸지 않았다. 접근성·검색이 목표(90 이상)이고 둘 다 100이므로 성능은 기록만 한다. favicon은 디자인
  자산이 없어(시안 HTML에도 없음) 넣지 않았고 `favicon.ico` 404 콘솔 오류 1건이 남는다.
- `.claude/launch.json`에 `much-site preview`(`npm run preview`, 4321) 구성을 더해 dist를 그대로 검사했다.

**산출물**: `astro.config.mjs`(sitemap 통합), `src/layouts/BaseLayout.astro`(sitemap link), `src/components/VideoEmbed.astro`
(min-height 제거), `package.json`·`package-lock.json`, `.claude/launch.json`, [[PLAN]] 6단계 점검표.

**검증 (2026-09-14 실측, 로컬 preview·dist 29쪽)**

| 검사 | 결과 |
|---|---|
| 375px iframe 하네스(29쪽) | 넘침 0, 초기 iframe 0, alt 없는 img 0, 깨진 이미지 0, h1 1개(404만 한·영 2개) |
| 언어 전환 | 28쪽 `a.lang` 대상이 dist에 전부 존재 |
| 메타 점검표(title·description·canonical·og·hreflang·JSON-LD) | 28쪽 통과, 404는 noindex라 description 없음(의도) |
| `html-validate`(valid-id 제외) | 29쪽 exit 0 |
| `sitemap-0.xml` | 28 URL, hreflang 56 |
| Lighthouse ko 홈 / ko showcase / en 홈 | 접근성 100·100·100, 검색 100·100·100, 모범 사례 96·96·96, 성능 62·78·81 |
| `check_i18n.py` / `check_links.py` / `check_size.sh` | 통과 / 39쪽 863건 깨진 것 0 / 대용량 없음 |
| `git ls-files` 영상 | `public/video/hero-hwaseong.mp4` 1건뿐 |
| 두 컴퓨터 빌드 비교 | Actions(ubuntu) 빌드 성공으로 부분 확인. artifact는 Pages 미설정 실패로 안 올라가 해시 비교 못 함 |

**현재 진행도**: 6단계 점검 완료. 배포는 저장소 설정 변경이라 사용자 결정 대기.

**남은 미해결**
- Pages 활성화(사용자가 Settings → Pages → Source: GitHub Actions, 또는 확인 뒤 워크플로 `enablement: true`).
- 비공개 저장소 Pages는 GitHub Pro 필요 → Q-1(ETRI 기관 정책) 확인 뒤 공개 전환 여부.
- 구 Google Sites 이전 안내(사용자 게시).
- favicon 자산(디자인에서 넘겨주면 `public/`에 두고 `BaseLayout.astro`에 `<link rel="icon">` 추가).
- 성능 개선 선택지(원하면): 서체 CSS를 본문 CSS와 분리해 비차단으로 싣기, 홈 poster `preload`, 굵기 900 제외 여부(시안 결정).
- 배포 뒤 실기기 검수: 홈 배경 클립 자동 재생·이음새, 실제 주소에서 375px 재확인.
- 이전부터 이월된 사용자 확인 항목 전부(위 오후 항목 참조).

**다음 단계**: 사용자 결정(Pages·공개 전환·Q-1) → 배포 → 배포 주소에서 재점검 → 구 사이트 안내.
