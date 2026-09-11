import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { parse as parseYaml } from 'yaml';

/**
 * 콘텐츠와 데이터를 나누어 둔다 (CHIC의 D-06 방식을 계승).
 *   본문이 있는 쪽       → src/content/<언어>/…  Markdown. 파일 이름이 언어 간 연결 열쇠다.
 *   반복되는 항목·수치   → src/data/*.yaml       ko·en 키를 병기한다.
 * 3단계(뼈대)에서는 홈과 꼬리말이 쓰는 데이터만 컬렉션으로 잡았다.
 * 나머지 YAML(awards·events·standards·videos·press·datasets·papers·patents·software)은
 * 4단계에서 쪽을 옮길 때 같은 방식으로 추가한다 (2026-09-11).
 */

const yaml = (path: string) => file(path, { parser: (text) => parseYaml(text) });

/** 언어별 본문. id는 'ko/much/awards'처럼 언어 접두사를 포함하고, index.md는 접미사가 떨어진다
 *  ('ko/index.md' → 'ko', 'ko/much/index.md' → 'ko/much'). */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** 원고를 마지막으로 고친 날. 쪽 아래에 표시한다. */
    updated: z.coerce.date(),
    /** 원고의 근거 문서. 저장소 안 문서를 [[위키링크]]로 가리킨다. 화면에는 내지 않는다. */
    source: z.string().optional(),
    /** 홈처럼 본문 외 구성 요소가 있는 쪽의 구분. 없으면 본문만 렌더한다. */
    layout: z.string().optional(),
    /** 영어판이 아직 번역 전인 자리표시자. true면 안내 띠를 띄운다. */
    stub: z.boolean().optional(),
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
    ko: z.object({ label: z.string() }),
    en: z.object({ label: z.string() }),
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

export const collections = { pages, stats, timeline, consortium, site };
