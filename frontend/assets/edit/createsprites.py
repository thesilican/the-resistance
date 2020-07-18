#!/usr/bin/python3
import sys
import os
import math

if sys.platform != "linux" and sys.platform != "linux2":
    print("You must be runing linux")
    exit(1)
if sys.version_info < (3, 6):
    print("You must be running at least python 3.6")
print("Making spritesheet")

# Recolor: Cortesy of https://stackoverflow.com/questions/15121220/imagemagick-replace-color-but-keep-transparency
colors = {
    "black": "#000000",
    "red": "#ff0000",
    "orange": "#e18700",
    "yellow": "#b0b000",
    "green": "#3cff00",
    "teal": "#00ff67",
    "cyan": "#00b4b4",
    "blue": "#0067ff",
    "indigo": "#3c00ff",
    "purple": "#a000c8",
    "pink": "#e10087",
}
createdFiles = []
for c in colors:
    for d in ("left", "right"):
        # Add stick figure files
        filename = f"sprite-stickman-{c}-{d}.png"
        createdFiles.append(filename)
        flop = ' -flop ' if d == 'left' else ' '
        os.system(
            f"magick convert pre-stickman.png xc:\"{colors[c]}\" -channel RGB " +
            f"-clut{flop}{filename}")
for d in ("left", "right"):
    # At hat files
    filename = f"sprite-hat-{d}.png"
    createdFiles.append(filename)
    flop = '-flop' if d == 'left' else ''
    os.system(f"magick convert pre-hat.png {flop} {filename}")

os.system(
    f"magick montage -geometry 320x480 -background \"#00000000\" sprite-*.png ../spritesheet.png"
)
os.system(
    f"magick montage -geometry 128x128 -background \"#00000000\" icon-*.png ../iconsheet.png"
)

# Clean up
for f in createdFiles:
    os.system("rm " + f)
