import subprocess as sp
import sys
import numpy

command = [ 'ffmpeg',
            '-i', 'vid.mp4',
            '-f', 'image2pipe',
            '-pix_fmt', 'rgb24',
            '-vcodec', 'rawvideo', '-']

pipe = sp.Popen(command, stdout = sp.PIPE, bufsize=10**8)

width, height = 416, 240

images = []
while  True:
  raw_image = pipe.stdout.read(width*height*3)
  if len(raw_image) < width*height*3:
    break
  image = numpy.fromstring(raw_image, dtype='uint8')
  image = image.reshape((width,height,3))
  images.append(image)
  pipe.stdout.flush()

for image in images:
  for i in xrange(height):
    for j in xrange(width):
      r, g, b = tuple(image[j][i])
      #avg = int(0.299*r+0.587*g+0.114*b)
      image[j][i] = [r|1,g|1,b|1]
  sys.stdout.write(image.tostring())
