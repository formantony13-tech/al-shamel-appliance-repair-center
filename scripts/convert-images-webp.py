from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'src' / 'assets' / 'images'
for source in sorted(root.glob('*.jpg')):
    target = source.with_suffix('.webp')
    with Image.open(source) as image:
        image = image.convert('RGB')
        image.save(target, 'WEBP', quality=82, method=6)
    print(f'{source.name} -> {target.name} ({target.stat().st_size} bytes)')
