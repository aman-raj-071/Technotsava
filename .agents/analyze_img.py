from PIL import Image
import sys

def analyze(path):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    print(f'size={w}x{h}')
    # Detect dark text rows: count dark pixels per row
    px = im.load()
    dark_rows = []
    for y in range(h):
        cnt = 0
        for x in range(0, w, 3):
            r, g, b = px[x, y]
            if r < 120 and g < 120 and b < 120:
                cnt += 1
        if cnt > 3:
            dark_rows.append((y, cnt))
    # group into bands
    bands = []
    for y, cnt in dark_rows:
        if bands and y - bands[-1][1] <= 3:
            bands[-1] = (bands[-1][0], y, max(bands[-1][2], cnt))
        else:
            bands.append((y, y, cnt))
    for b in bands:
        print(f'row {b[0]}-{b[1]} darkpx={b[2]}')

if __name__ == '__main__':
    analyze(sys.argv[1])
