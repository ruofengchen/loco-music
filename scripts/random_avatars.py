import random
import os
import shutil

folder = "/home/lomus/original_images/"
filenames = os.listdir(folder)
out_folder = "/home/lomus/avatars/"

f = open("usernames.txt", "r")
for l in f.readlines():
    username = l.strip()
    if random.random() < 0.05:
        continue
    filename = random.choice(filenames)
    ext = os.path.splitext(filename)[1]
    shutil.copyfile(folder+filename, out_folder+username+ext)

f.close()
