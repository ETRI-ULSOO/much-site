#!/bin/sh
# 커밋 전 대용량 파일 검사.
# GitHub는 파일당 100 MB를 넘으면 push를 거부하고, 50 MB를 넘으면 경고한다.
# 이 저장소에는 7.1 GB 발표자료와 4K 영상 원본이 함께 있는 작업 폴더가 딸려 있으므로
# .gitignore만 믿지 않고 스테이징 단계에서 한 번 더 막는다.
#
# 사용법:  sh tools/check_size.sh
# 훅으로 걸려면:  ln -s ../../tools/check_size.sh .git/hooks/pre-commit

LIMIT_MB=50
over=0

for f in $(git diff --cached --name-only --diff-filter=ACM); do
    [ -f "$f" ] || continue
    mb=$(( $(wc -c < "$f") / 1048576 ))
    if [ "$mb" -ge "$LIMIT_MB" ]; then
        echo "너무 큽니다: $f (${mb} MB, 기준 ${LIMIT_MB} MB)"
        over=$((over + 1))
    fi
done

if [ "$over" -gt 0 ]; then
    echo ""
    echo "위 파일 ${over}개가 커밋 대상에 올라와 있습니다."
    echo "영상과 원본 문서는 저장소 밖에 두고, 웹용으로 줄인 파일만 넣으십시오."
    exit 1
fi

echo "대용량 파일 없음 (기준 ${LIMIT_MB} MB)"
exit 0
