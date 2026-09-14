import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { parse as parseYaml } from 'yaml';

/**
 * 콘텐츠와 데이터를 나누어 둔다 (CHIC의 D-06 방식을 계승).
 *   본문이 있는 쪽       → src/content/<언어>/…  Markdown. 파일 이름이 언어 간 연결 열쇠다.
 *   반복되는 항목·수치   → src/data/*.yaml       ko·en 키를 병기한다.
 * 3단계(뼈대)에서는 홈과 꼬리말이 쓰는 데이터만 잡았고, 4단계(2026-09-11)에서 나머지 YAML 아홉 개를
 * 같은 방식으로 더했다. file 로더는 배열이면 항목의 id를, 객체면 최상위 키를 항목 열쇠로 쓴다.
 * 스키마에는 쪽이 실제로 읽는 항목만 적는다 — 적지 않은 항목은 조용히 버려진다.
 */

const yaml = (path: string) => file(path, { parser: (text) => parseYaml(text) });

/** 언어별 본문. id는 'ko/much/awards'처럼 언어 접두사를 포함하고, index.mdx는 접미사가 떨어진다
 *  ('ko/index.mdx' → 'ko', 'ko/much/index.mdx' → 'ko/much'). */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** 원고를 마지막으로 고친 날. 쪽 아래에 표시한다. */
    updated: z.coerce.date(),
    /** 원고의 근거 문서. 저장소 안 문서를 [[위키링크]]로 가리킨다. 화면에는 내지 않는다. */
    source: z.string().optional(),
    /** 홈처럼 본문 외 구성 요소가 있는 쪽의 구분. 없으면 본문만 렌더한다.
     *  `layout`이라 부르지 않는 이유: MDX 프론트매터의 layout은 Astro가 레이아웃 파일 경로로 해석한다. */
    kind: z.string().optional(),
    /** 영어판이 아직 번역 전인 자리표시자. true면 안내 띠를 띄운다. */
    stub: z.boolean().optional(),
    /** 번역 초안이라 검수 전인 쪽. true면 안내 띠를 띄운다 (4단계 영어판). */
    draft: z.boolean().optional(),
    /** 홈 첫 화면. 제목·한 문단·사실 불릿. 본문(MDX)은 그 아래 절부터 시작한다. */
    hero: z.object({ heading: z.string(), lead: z.string(), facts: z.array(z.string()) }).optional(),
  }),
});

const localised = <T extends z.ZodTypeAny>(shape: T) => z.object({ ko: shape, en: shape });

/** 정량 성과. 홈 숫자 띠는 highlight가 참인 항목만 쓴다. */
const stats = defineCollection({
  loader: yaml('./src/data/stats.yaml'),
  schema: z.object({
    /** 협약 목표치. 정해지지 않은 항목은 없다. */
    target: z.number().optional(),
    actual: z.number(),
    unit: localised(z.string()),
    highlight: z.boolean(),
    ko: z.object({ label: z.string(), note: z.string().optional() }),
    en: z.object({ label: z.string(), note: z.string().optional() }),
  }),
});

/** 과제 시리즈 연표 (CHIC → MUCH → 후속). */
const timeline = defineCollection({
  loader: yaml('./src/data/timeline.yaml'),
  schema: z.object({
    status: z.enum(['done', 'current', 'planned']),
    start: z.string().optional(),
    end: z.string().optional(),
    /** 사이트 안 경로 (언어 접두사 없이). */
    url: z.string().optional(),
    /** 원본 사이트 주소. */
    external: z.string().optional(),
    ko: z.object({ name: z.string(), fullname: z.string(), program: z.string(), desc: z.string() }),
    en: z.object({ name: z.string(), fullname: z.string(), program: z.string(), desc: z.string() }),
  }),
});

/** 참여 기관. 나열 순서는 과제 문서상의 서열이라 order로 고정한다. */
const consortium = defineCollection({
  loader: yaml('./src/data/consortium.yaml'),
  schema: z.object({
    role: z.enum(['ministry', 'lead', 'partner', 'demand']),
    order: z.number(),
    url: z.string().optional(),
    logo: z.string().optional(),
    ko: z.object({ name: z.string(), abbr: z.string() }),
    en: z.object({ name: z.string(), abbr: z.string() }),
  }),
});

/** 사이트 전역 문구. footer.funding은 최종보고서 79쪽이 요구하는 의무 표기다. */
const site = defineCollection({
  loader: yaml('./src/data/site.yaml'),
  schema: z.object({
    funding: localised(z.string()),
    period: localised(z.string()),
    institution: localised(z.string()),
  }),
});

/** 발표자료 영상 19편. youtube가 비었거나 confirmed가 거짓이면 쪽에는 자리표시 패널만 나온다. */
const videos = defineCollection({
  loader: yaml('./src/data/videos.yaml'),
  schema: z.object({
    width: z.number(),
    height: z.number(),
    /** 이 영상을 놓을 쪽. Videos 구성 요소가 place로 골라 낸다. */
    place: z.string(),
    youtube: z.string(),
    confirmed: z.boolean(),
    /** 대표 그림. src/assets/img/ 안의 파일 이름(확장자 없이). 영상의 첫 장면을 발표자료에서 뽑은 것 */
    poster: z.string().optional(),
    ko: z.object({ title: z.string(), desc: z.string(), alt: z.string() }),
    en: z.object({ title: z.string(), desc: z.string(), alt: z.string() }),
  }),
});

/** 수상 한 건의 언어별 문구. source는 근거(공식 수상작 쪽·보도)의 표시명, url이 있을 때 링크 글자로 쓴다. */
const award = z.object({
  title: z.string(), organization: z.string(), work: z.string(), desc: z.string(),
  source: z.string().optional(), alt: z.string().optional(),
});

/** 수상 4건. partners_pending이 참이면 공동 기관 이름을 화면에 내지 않는다 (TRIC 표기 미확인). */
const awards = defineCollection({
  loader: yaml('./src/data/awards.yaml'),
  schema: z.object({
    year: z.number(),
    grade: z.enum(['finalist', 'winner']),
    url: z.string().optional(),
    partners_pending: z.boolean().optional(),
    ko: award, en: award,
  }),
});

/** 언론 보도. ready가 거짓인 항목(기사 주소·일자 미확보)은 어느 쪽에도 내지 않는다. */
const press = defineCollection({
  loader: yaml('./src/data/press.yaml'),
  schema: z.object({
    outlet: localised(z.string()),
    ready: z.boolean(),
    date: z.coerce.string().optional(),
    url: z.string().optional(),
    /** 방송 영상의 유튜브 ID. 보관만 하고 임베드는 사용자 확인 뒤에 정한다 (2026-09-14). */
    youtube: z.string().optional(),
    ko: z.object({ title: z.string() }).optional(),
    en: z.object({ title: z.string() }).optional(),
  }),
});

/** 행사·국제 협력 9건. date는 YAML이 날짜로 읽을 수 있으므로 문자열로 강제한다. */
const events = defineCollection({
  loader: yaml('./src/data/events.yaml'),
  schema: z.object({
    kind: z.enum(['colloquium', 'exhibition', 'cooperation', 'international']),
    date: z.coerce.string().optional(),
    year: z.number().optional(),
    ko: z.object({ title: z.string(), venue: z.string(), desc: z.string() }),
    en: z.object({ title: z.string(), venue: z.string(), desc: z.string() }),
  }),
});

/** 표준·가이드라인 6건. */
const standards = defineCollection({
  loader: yaml('./src/data/standards.yaml'),
  schema: z.object({
    kind: z.enum(['standard', 'guideline', 'plan']),
    organization: z.string(),
    status: z.enum(['enacted', 'published', 'planned']),
    date: z.coerce.string().optional(),
    number: z.string().optional(),
    // 표준 원문을 볼 수 있는 외부 주소. 있으면 표에서 제목에 링크를 건다 (2026-09-14).
    url: z.string().url().optional(),
    year: z.number().optional(),
    // 기관명이 언어마다 다를 때만 ko/en 안에 organization을 두고, 없으면 위의 organization을 쓴다.
    ko: z.object({ title: z.string(), desc: z.string(), organization: z.string().optional() }),
    en: z.object({ title: z.string(), desc: z.string(), organization: z.string().optional() }),
  }),
});

/** 조합형 데이터셋. 항목은 'dataset' 하나다. */
const datasets = defineCollection({
  loader: yaml('./src/data/datasets.yaml'),
  schema: z.object({
    total: z.number(),
    target: z.number(),
    unit: localised(z.string()),
    composition: z.array(
      z.object({
        id: z.string(),
        ko: z.object({ label: z.string(), desc: z.string() }),
        en: z.object({ label: z.string(), desc: z.string() }),
      }),
    ),
    detail: z.object({
      artifacts: z.number(),
      pieces: z.number(),
      breakdown: z.array(
        z.object({ id: z.string(), count: z.number(), ko: z.object({ label: z.string() }), en: z.object({ label: z.string() }) }),
      ),
      ko: z.object({ note: z.string() }),
      en: z.object({ note: z.string() }),
    }),
  }),
});

/** 논문·특허·소프트웨어. 서지가 오기 전(Q-2)까지 비어 있고, 비어 있으면 쪽에 목록을 내지 않는다. */
const papers = defineCollection({
  loader: yaml('./src/data/papers.yaml'),
  schema: z.object({
    kind: z.enum(['journal', 'conference']),
    index: z.string().optional(),
    year: z.number(),
    doi: z.string().optional(),
    url: z.string().optional(),
    authors: z.array(z.string()),
    ko: z.object({ title: z.string(), venue: z.string() }),
    en: z.object({ title: z.string(), venue: z.string() }),
  }),
});

const patents = defineCollection({
  loader: yaml('./src/data/patents.yaml'),
  schema: z.object({
    scope: z.enum(['domestic', 'international']),
    status: z.enum(['filed', 'registered']),
    // false면 화면에 내보내지 않는다 (특허청 공개 전 출원 건 보류용, 2026-09-14)
    public: z.boolean().default(true),
    application_no: z.string().optional(),
    application_date: z.coerce.string().optional(),
    registration_no: z.string().optional(),
    registration_date: z.coerce.string().optional(),
    ko: z.object({ title: z.string() }),
    en: z.object({ title: z.string() }),
  }),
});

const software = defineCollection({
  loader: yaml('./src/data/software.yaml'),
  schema: z.object({
    registration_no: z.string(),
    registration_date: z.coerce.string(),
    ko: z.object({ title: z.string(), desc: z.string() }),
    en: z.object({ title: z.string(), desc: z.string() }),
  }),
});

export const collections = {
  pages, stats, timeline, consortium, site,
  videos, awards, press, events, standards, datasets, papers, patents, software,
};
