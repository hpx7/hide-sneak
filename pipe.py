import sys
import cv2.cv as cv
import binascii

inputData = sys.stdin.read()
filename, imgIdx, start, end = inputData.split(' ')
imgIdx = int(imgIdx)
start = int(start)
end = int(end)
print filename, imgIdx, start, end

NUM_SIZE_BITS = 33
NUM_IDX_BITS = 9

### ENCODE ###

def setBit(i, b):
  i = int(i)
  if b == None:
    return i
  elif b == 0:
    return i & ~1
  else:
    return i | 1

def getBit(data, count):
  if count >= len(data):
    return None
  return data[count]

def encode(im, data, idx):
  count = 0
  encodedLen = [int(x) for x in list("{0:b}".format(len(data)))]
  encodedSize = [0 for x in xrange(NUM_SIZE_BITS-len(encodedLen))] + encodedLen
  print 'len(data):', len(data)
  identifier = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]
  index = [int(x) for x in list("{0:b}".format(idx))]
  indexSize = [0 for x in xrange(NUM_IDX_BITS-len(index))] + index
  data = identifier + indexSize + encodedSize + data

  for i in xrange(im.height):
    for j in xrange(im.width):
      r, g, b = im[i, j]
      im[i, j] = (setBit(r, getBit(data, count)), setBit(g, getBit(data, count+1)), setBit(b, getBit(data, count+2)))
      count += 3
  return im

### END ENCODE ###


iconData = cv.LoadImage('self.png')
iconBinary = []
for i in xrange(iconData.height):
  for j in xrange(iconData.width):
    r, g, b = iconData[i, j]
    r, g, b = int(r), int(g), int(b)
    rstr = "{0:b}".format(r)
    pad_r = 8-len(rstr)
    rMask = ''.join(['0' for harsh in xrange(pad_r)]) + rstr
    gstr = "{0:b}".format(g)
    pad_g = 8-len(gstr)
    gMask = ''.join(['0' for mihir in xrange(pad_g)]) + gstr
    bstr = "{0:b}".format(b)
    pad_b = 8-len(bstr)
    bMask = ''.join(['0' for thirdidiot in xrange(pad_b)]) + bstr
    iconBinary.append(rMask)
    iconBinary.append(gMask)
    iconBinary.append(bMask)
iconBits = [int(x) for x in ''.join(iconBinary)]

print 'len(iconBits): ', len(iconBits)
newIm = encode(cv.LoadImage(filename), iconBits[start:end], imgIdx)
cv.SaveImage('enc-' + filename, newIm)

# newIm = encode(cv.LoadImage('contact.jpg.png'), iconBits[0:300], 0)
# cv.SaveImage('x1.png', newIm)

# newIm = encode(cv.LoadImage('contact.jpg.png'), iconBits[300:len(iconBits)], 1)
# cv.SaveImage('x2.png', newIm)
