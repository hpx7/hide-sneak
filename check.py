import cv2.cv as cv
import sys

im = cv.LoadImage('enc-contact.jpg.png')

# for i in xrange(4):
#   print im[0, i]
for i in xrange(15):
  r, g, b = im[0, i]
  print b, g, r
  # print im[0, i]

# for i in xrange(im.height):
#   for j in xrange(im.width):
#     r, g, b = im[i, j]
#     sys.stdout.write(str(int(b)) + ',' + str(int(g)) + ',' + str(int(r)) + ',255,')

# def to2D(x):
#   return (x / 30, x % 30)

# def foo(im, i):
#   if i % 4 == 3:
#     return 255.0
#   return im[to2D(i/4)][i%4]

# for i in xrange(868,900,4):
#   print foo(im, i+2)
#   print foo(im, i+1)
#   print foo(im, i+0)
#   print foo(im, i+3)

# for i in xrange(30):
#   for j in xrange(30):
#     r, g, b = im[i, j]
#     if r != 255:
#       print r

# 0 -> to2D(0)[0]
# 1 -> to2D(0)[1]
# 2 -> to2D(0)[2]
# 3 -> 255

# 4 -> to2D(1)[0]
# 5 -> to2D(1)[1]
# 6 -> to2D(1)[2]
# 7 -> 255