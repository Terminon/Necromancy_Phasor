class Area:
    def __init__(self, _x, _y, _w, _h, _t):
        self.x = _x
        self.y = _y
        self.width = _w
        self.height = _h
        self.type = _t  # r=rightNode, d=downNode, o=Origin

    def fitsToImage(self,img):
        return self.width >= img.get_rect()[2] and self.height >= img.get_rect()[3]

    def getSize(self):
        return self.x * self.y

    def equals(self,area):
        return self.x == area.x and self.y == area.y and self.width == area.width and self.height == area.height

    def asString(self):
        print str(self.x)+","+str(self.y)+" "+str(self.width)+","+str(self.height)