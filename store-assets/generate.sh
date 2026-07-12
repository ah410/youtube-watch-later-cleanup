#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

declare -a assets=(
    "promo-tile-440x280:440:280"
    "marquee-1400x560:1400:560"
    "screenshot-1-idle-1280x800:1280:800"
    "screenshot-2-running-1280x800:1280:800"
    "screenshot-3-done-1280x800:1280:800"
)

for entry in "${assets[@]}"; do
    IFS=':' read -r name width height <<< "$entry"
    rsvg-convert -w "$width" -h "$height" "${name}.svg" -o "${name}.png"
done

echo "Generated $(ls -1 *.png | wc -l) PNG(s) from store-assets/*.svg"
