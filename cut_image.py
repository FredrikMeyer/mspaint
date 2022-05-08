"""
Usage:

python cut_image.py

Cuts the toolbar.png image into 18 small PNG's.
"""

from typing import Tuple
from PIL import Image

im = Image.open("toolbar.png")


def number_to_xy(n) -> Tuple[int, int]:
    x = n % 2
    y = (n - (n % 2)) / 2
    return (x, y)


def get_crop(img: Image.Image, index: int):
    x, y = number_to_xy(index)  # Of the form (i,j) (ints)

    sw = 82
    sh = 86

    # top_left_x = 3 + x * (sw + 7)
    # top_left_y = 3 + y * (sh + 7.5)

    top_left_x = 3 + x * (sw + 7)
    top_left_y = 5 + y * (sh + 11.5)
    box = (top_left_x, top_left_y, top_left_x + sw, top_left_y + sh)

    im2 = img.copy()
    return im2.crop(box)


# ys 2 94 192 289 388
# diffs 90, 98, 97, 98, 99


def crop_a_little_bit(img: Image.Image):
    h = img.height
    w = img.width
    return img.copy().crop((0, 6, w, h))


if __name__ == "__main__":

    new_im = get_crop(im, 0)

    for i in range(18):
        l = get_crop(im, i)

        # l.show()

        l.save(f"public/icons/{i}.png", format="png", optimize=False)
