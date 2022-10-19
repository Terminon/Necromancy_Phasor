import pygame
from Area import Area

class TileSheetCreator:
    def __init__(self,sheet_width,sheet_height):
        self.sheet_width = sheet_width
        self.sheet_height = sheet_height

        area = Area(0,0,sheet_width,sheet_height,"o")
        self.areas=[area]
        self.images=[]

        self.tileSheet = pygame.Surface((sheet_width, sheet_height), pygame.SRCALPHA)

    def addImage(self,img,imgName):
        imgWidth=img.get_rect()[2]
        imgHeight=img.get_rect()[3]

        chosen_areas=[]
        for area in self.areas:
            if area.fitsToImage(img):
                chosen_areas.append([area.getSize(),area])

        if len(chosen_areas)==0:
            return -1

        placement_area = sorted(chosen_areas)[0][1]

        px = placement_area.x
        py = placement_area.y
        pw = placement_area.width
        ph = placement_area.height

        self.images.append([img, imgName, px, py])

        subarea_right = Area(px + imgWidth, py, pw - imgWidth, imgHeight, "r")
        subarea_down  = Area(px, py + imgHeight, pw, ph - imgHeight ,"d")

        self.areas.remove(placement_area)
        self.areas.append(subarea_right)
        self.areas.append(subarea_down)



        return 0

    def saveToDisk(self,fileName):
        pygame.image.save(self.tileSheet, fileName)

    def saveJsonAtlas(self,fileName):
        content='{"frames": [\n\n'

        frames=[]
        for image in self.images: # image tuples: (img,imgName,x,y) , you can detect dimensions with img.get_rect()[2] and [3]
            name = image[1].split("/")[-1].replace(".png","")
            x=str(image[2])
            y=str(image[3])
            width=str(image[0].get_rect()[2])
            height=str(image[0].get_rect()[3])

            frame ='    {\n'
            frame+='        "filename":"'+name+'",\n'
            frame+='        "frame": {"x":'+x+',"y":'+y+',"w":'+width+',"h":'+height+'},\n'
            frame+='        "rotated": false,\n'
            frame+='        "trimmed": false,\n'
            frame+='        "spriteSourceSize": {"x":0,"y":0,"w":'+width+',"h":'+height+'},\n'
            frame+='        "sourceSize": {"w":'+width+', "h":'+height+'}\n'
            frame+='    }\n'
            frames.append(frame)
        content += ','.join(frames)+"\n"
        content += '],"meta": {\n'
        content += '        "app": "TileSheetCreator.py",\n'
        content += '        "version": "1.0",\n'
        content += '        "image": "tilesheet.png",\n'
        content += '        "format": "RGBA8888",\n'
        content += '        "size": {"w":'+str(self.sheet_width)+', "h":'+str(self.sheet_height)+'},\n'
        content += '        "scale": 1\n'
        content += '}\n}'

        f=open(fileName,'w')
        f.write(content)
        f.close()








    def writeToTileSheet(self):
        self.tileSheet = pygame.Surface((self.sheet_width, self.sheet_height), pygame.SRCALPHA)
        for image in self.images:
            self.tileSheet.blit(image[0],(image[2],image[3]))

""" enable this for demo mode. it display all open areas. green ones are right-subareas, red ones are down-subareas
            r = image[0].get_rect()
            x=image[2]
            y=image[3]
            w=r[2]
            h=r[3]
   
        for area in self.areas:
            color=(255,255,255)

            off=1
            if area.type=="d": color=(255,0,0)
            if area.type=="r":
                color=(0,255,0)
                off=2

            x=area.x
            y=area.y
            w=area.width
            h=area.height
            pygame.draw.polygon(self.tileSheet, color, ((x+off, y+off), (x + w - off, y), (x + w - off, y + h - off), (x + off, y + h - off), (x+off, y+off)), 2)
"""
