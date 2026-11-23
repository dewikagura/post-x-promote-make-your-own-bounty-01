"""Draw photo.png for the post-x-promote entry: a clean text-only card (no logos,
no brand marks — plain type on a dark background with a gold accent)."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1080
BG = (17, 24, 39)        # dark charcoal
GOLD = (245, 179, 1)     # warm gold accent
WHITE = (255, 255, 255)
GREY = (209, 213, 219)   # light grey body text

BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# thin gold frame inset
d.rectangle([40, 40, W - 40, H - 40], outline=GOLD, width=4)

def center_text(y, text, font, fill):
    bbox = d.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    d.text(((W - w) / 2, y), text, font=font, fill=fill)
    return bbox[3] - bbox[1]

# top label
f_label = ImageFont.truetype(BOLD, 64)
center_text(120, "make.fun", f_label, GOLD)

# headline, two lines
f_head = ImageFont.truetype(BOLD, 118)
center_text(300, "MAKE YOUR", f_head, WHITE)
center_text(430, "OWN BOUNTY", f_head, WHITE)

# gold divider
d.rectangle([W // 2 - 130, 600, W // 2 + 130, 608], fill=GOLD)

# sub lines
f_sub = ImageFont.truetype(REG, 54)
center_text(660, "Describe any task.", f_sub, GREY)
center_text(730, "Set the reward.", f_sub, GREY)
center_text(800, "Keep a share of every fee.", f_sub, GREY)

# footer url
f_foot = ImageFont.truetype(BOLD, 56)
center_text(920, "make.fun/sponsor/new", f_foot, GOLD)

img.save("/home/hatch/workspace/makefun/post-x-promote-entry/photo.png")
print("saved photo.png", img.size)
