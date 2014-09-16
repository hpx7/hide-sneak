import cv2.cv as cv
import binascii

# im = cv.LoadImage('darealpanda.png')
demSize = 33

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

def encode(data):
  count = 0
  encodedLen = [int(x) for x in list("{0:b}".format(len(data)))]
  encodedSize = [0 for x in xrange(demSize-len(encodedLen))] + encodedLen
  print 'len(data):', len(data)
  data = encodedSize + data

  for i in xrange(im.height):
    for j in xrange(im.width):
      r, g, b = im[i, j]
      im[i, j] = (setBit(r, getBit(data, count)), setBit(g, getBit(data, count+1)), setBit(b, getBit(data, count+2)))
      count += 3

### END ENCODE ###


### DECODE ###

def decode():
  secrets=[]
  for i in xrange(demSize/3):
    r, g, b = im[0,i]
    secrets+=[r,g,b]
  # print [int(x) & 1 for x in secrets], len(secrets)

  secretLen = 0
  for i in xrange(len(secrets)):
    secretLen += ((int(secrets[len(secrets)-i-1]) & 1) << i)

  # print secrets
  print 'secretLen:', secretLen

  data = []
  bitsRead = 0
  for i in xrange(im.height):
    for j in xrange(im.width):
      if i == 0 and j < demSize/3:
        continue
      if bitsRead >= secretLen:
        return data[:secretLen]

      r, g, b = im[i, j]
      data += [int(r) & 1, int(g) & 1, int(b) & 1]
      bitsRead += 3

### END DECODE ###


def bitsToRGB(bits):
  rgbs = [];
  for j in xrange(0, len(bits), 8):
    num = 0
    for k in xrange(8):
      num += (bits[j+k] << (7-k))
    if num != int(''.join([str(x) for x in bits[j:j+8]]), 2):
      print '$$$$', num
    rgbs.append(num)
  return rgbs


iconData = cv.LoadImage('icon.png')
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

    if r != int(rMask, 2):
      print '@@@', r, rMask
    iconBinary.append(rMask)
    iconBinary.append(gMask)
    iconBinary.append(bMask)

# testBits = [int(x) for x in "0110100001100101011011000110110001101111"]
# encode(testBits)

# print ''.join(iconBinary)
# iconBits = [int(x) for x in ''.join(iconBinary)]
# encode(iconBits)

# cv.SaveImage('pandaicon.png', im)

def check(decoded, original):
  # print ''.join([str(x) for x in decoded])

  rgbs = bitsToRGB(decoded)
  # print rgbs

  # for i in xrange(len(rgbs)):
  #   val = rgbs[i]
  #   if val != 255:
  #     print i, val

  # for i in xrange(500,600):
  #   print rgbs[i]

  count = 0
  for i in xrange(30):
    for j in xrange(30):
      r1, g1, b1 = original[i, j]
      r2, g2, b2 = (rgbs[count], rgbs[count+1], rgbs[count+2])
      if (int(r1) != int(r2)):
        print '!!!!!!!', r1, r2, i, j
      count += 3

im = cv.LoadImage('pandaicon.png')
decoded = decode()
print ''.join([str(x) for x in decoded])
# check(decoded, cv.LoadImage('icon.png'))
