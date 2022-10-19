#!/usr/bin/python
import os
import sys
import pygame

from classes.TileSheetCreator import TileSheetCreator

# TileSheet Creator 2017-05-24 T.Schneider
# Reference for further pygame work: http://www.nerdparadise.com/programming/pygame    http://www.cogsci.rpi.edu/~destem/gamedev/pygame.pdf
#
# TODO : Write JSON mapping for JSON atlas for phasor use
# TODO : Create multiple tilesheets, when original one becomes too small
# TODO : Create multiple tilesheets, group tilesheets by source directory
# TODO : Trim source sprites (edge detection, preserve info in JSON mapping file)

if len(sys.argv)<2:
    print "TileSheetCreator Script\n"
    print "usage: ./tsc.py <asset_dir> <target_dir>"
    print "Loads all png files in <asset_dir> and creates a tilesheet.png and tilesheet_atlas.json file in <target_dir>."
    print "Target dir has to exist already."
    print "Example: ./tsc.py ../../necromancy/assets ."
    sys.exit(0)
    
filedir=sys.argv[1].rstrip("/")+"/"
targetdir=sys.argv[2].rstrip("/")+"/"

# LOAD IMAGES INTO images DICTIONARY
images={}
for file in sorted(os.listdir(filedir)):
    if ".png" not in file: continue
    extimage = pygame.image.load(filedir + file)
    ext_size = extimage.get_rect()[2] * extimage.get_rect()[3]
    if ext_size not in images: images[ext_size]=[]
    images[ext_size].append( (extimage,filedir+file) ) # Add to array as tuple (image,name)

# SORT images DICTIONARY BY IMAGE SIZE AND ADD AS NODES
# IN ORDER TO DETERMINE POSITION ON TILESHEET

tsc = TileSheetCreator(1280,1500)
for sizeval in sorted(images.keys(),reverse=True):
    for entry in images[sizeval]:

        extimage_name = entry[1]
        extimage = pygame.image.load(extimage_name)

        #print extimage_name, extimage.get_rect()[2],extimage.get_rect()[3]

        success = tsc.addImage(extimage, extimage_name)

        if success == -1:
            print "TileSheet creation failed. Could not place image "+extimage_name+"."
            sys.exit(1)

# WRITE IMAGES TO TILESHEET
tsc.writeToTileSheet()

# SAVE TILESHEET TO DISK
tsc.saveToDisk(targetdir + "tilesheet.png")
tsc.saveJsonAtlas(targetdir + "tilesheet_atlas.json")

print "Tilesheet was written to "+targetdir+"tilesheet.png"
print "Texture atlas was written to "+targetdir+"tilesheet_atlas.json"

#
# NOW WRITE THE JSON file for atlas loading...
#