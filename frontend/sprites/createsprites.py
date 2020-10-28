import math
import os
import shutil
import sys

from PIL import Image


if sys.version_info < (3, 6):
    print("You must be running at least python 3.6")
os.chdir(os.path.dirname(os.path.realpath(__file__)))


def combineImages(images, dim, sheet_width):
    numImages = len(images)
    width = dim[0] * sheet_width
    height = dim[1] * math.ceil(numImages / sheet_width)
    spritesheet = Image.new("RGBA", (width, height))
    x_off = 0
    y_off = 0
    for img in images:
        spritesheet.paste(img, (x_off * dim[0], y_off * dim[1]))
        x_off += 1
        if x_off == sheet_width:
            x_off = 0
            y_off += 1
    return spritesheet


# ----- Make Sprites -----
SPRITE_W = 400
SPRITE_H = 600
ICON_W = 100
ICON_H = 100
COLORS = {
    "red": "#ea3818",
    "orange": "#e58a00",
    "yellow": "#dbbd0d",
    "green": "#5ec90c",
    "teal": "#00e07f",
    "cyan": "#17dbdb",
    "blue": "#70aaff",
    "indigo": "#a899ff",
    "purple": "#c45cff",
    "pink": "#e617a0",
}
spriteList = []
iconList = []
try:
    os.mkdir("tmp")
except FileExistsError as err:
    pass

# Create sprites
# Layers:
# 0 - background
# 1 - selection
# 2 - player
# 3 - hat
os.system(
    f"magick sprites.xcf -geometry {SPRITE_W}x{SPRITE_H} tmp/sprite.png"
)
spriteList += [f"tmp/sprite-{x}.png" for x in range(0, 4)]

# Recolor (temporary)
for color in COLORS.values():
    os.system(
        f'magick convert tmp/sprite-2.png ' +
        f'xc:"{color}" -channel RGB -clut tmp/sprite-2-{color}.png')
    spriteList.append(f"tmp/sprite-2-{color}.png")
spriteList.remove("tmp/sprite-2.png")

# Make spritesheet
images = [Image.open(x) for x in spriteList]
spritesheet = combineImages(images, (SPRITE_W, SPRITE_H), 6)
spritesheet.save("../public/assets/spritesheet.png")


# Create icons
# Layers:
# 0 - accept
# 1 - reject
os.system(
    f"magick icons.xcf -geometry {ICON_W}x{ICON_H} tmp/icon.png"
)
iconList += [f"tmp/icon-{x}.png" for x in range(2)]

# Make iconsheet
images = [Image.open(x) for x in iconList]
iconsheet = combineImages(images, (ICON_W, ICON_H), 2)
iconsheet.save("../public/assets/iconsheet.png")

# Clean up
shutil.rmtree("tmp", True)
