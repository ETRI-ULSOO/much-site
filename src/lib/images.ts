/**
 * src/assets/img/ 안의 그림을 파일 이름(확장자 없이)으로 찾는다.
 * Figure·Video·Consortium이 같은 폴더를 보므로 조회 규칙을 한 곳에 둔다.
 * 빌드 때 astro:assets가 webp로 바꾸고 폭별 사본을 만든다.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/img/**/*.{png,jpg,jpeg}');

export async function findImage(name: string): Promise<ImageMetadata> {
  const key = Object.keys(files).find((k) => k.endsWith('/' + name) || k.replace(/^.*\//, '').replace(/\.[^.]+$/, '') === name);
  if (!key) throw new Error(`src/assets/img/에 ${name} 그림이 없습니다`);
  return (await files[key]()).default;
}
