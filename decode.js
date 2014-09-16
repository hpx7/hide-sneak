(function() {
  var ICON_WIDTH = 320, ICON_HEIGHT = 240;
  var demSize = 33;
  var NUM_IDX_BITS = 9;

  var c=document.createElement('canvas');
  c.width  = ICON_WIDTH;
  c.height = ICON_HEIGHT;
  var div = document.createElement('div');
  div.innerHTML="<a id='buttonJS' style='display:none;' href='#openModal'>Open Modal</a><div id='openModal' style='position: fixed; font-family: Arial, Helvetica, sans-serif; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0, 0, 0, 0.8); z-index: 99999; opacity:0; -webkit-transition: opacity 400ms ease-in; -moz-transition: opacity 400ms ease-in; transition: opacity 400ms ease-in; pointer-events: none;' class='modalDialog'><div id='harshDiv' style='width: 400px; position: relative; margin: 10% auto; padding: 5px 20px 13px 20px; border-radius: 10px; background: #fff; background: -moz-linear-gradient(#fff, #999); background: -webkit-linear-gradient(#fff, #999); background: -o-linear-gradient(#fff, #999);'> <a href='#close' title='Close' class='close' style='background: #606061; color: #FFFFFF; line-height: 25px; position: absolute; right: -12px; text-align: center; top: -10px; width: 24px; text-decoration: none; font-weight: bold; -webkit-border-radius: 12px; -moz-border-radius: 12px; border-radius: 12px; -moz-box-shadow: 1px 1px 3px #000; -webkit-box-shadow: 1px 1px 3px #000; box-shadow: 1px 1px 3px #000;'>X</a></div></div>";
  document.body.appendChild(div);
  document.getElementById('harshDiv').appendChild(c);
  var ctx=c.getContext("2d");
  var encImgData=ctx.createImageData(ICON_WIDTH,ICON_HEIGHT);

  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  var images = document.getElementsByTagName('img');

  var bitsMap = {};

  console.log(images.length + ' images found');
  for (i = 0; i < images.length; i++){
    var img = images[i];
    console.log('reading image: ' + img);
    // var img = document.getElementsByTagName('img')[0];
    // var img = document.createElement('img');
    // img.src = "http://2014f.pennapps.com/assets/images/contact.jpg";
    var origWidth = img.width;
    var origHeight = img.height;

    img.style.width='auto';
    img.style.height='auto';
    console.log(img.width + ', ' + img.height);
    canvas.width=img.width;
    canvas.height=img.height;
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    var identifier = context.getImageData(0, 0, 12, 1).data;
    var hasEncodedData = true;
    for (var z = 0; z < 12; z += 4) {
      if (identifier[z+0] & 1 !== 0 || identifier[z+1] & 1 !== 0 || identifier[z+2] & 1 !== 1) {
        hasEncodedData = false;
      }
    }
    if (!hasEncodedData)
      continue;
    console.log('found encoded image: ' + img);

    var imgData=context.getImageData(0, 0, img.width, img.height);
    var data = imgData.data;
    console.log('data.length: ' + data.length);
    context.clearRect(0,0 , img.width , img.height );

    img.width=origWidth;
    img.height=origHeight;
    // img.style.cursor='zoom-in';

    decode(data);
    // console.log(bits);
  }

  console.log(bitsMap);

  var stichedBits = '';
  for (var i = 0; i < Object.keys(bitsMap).length; i++) {
    stichedBits += bitsMap[i];
    console.log(bitsMap[i].length);
  }

  var rgbs = [];
  for (j = 0; j < stichedBits.length; j+=8) {
    var num = 0;
    for (k = 0; k < 8; k++)
      num = num + (stichedBits[j+k] << (7-k));
    rgbs.push(num);
  }

  var count = 0;
  // console.log(encImgData.data.length)
  for (var i=0; i<encImgData.data.length; i+=4) {
    encImgData.data[i+2]=rgbs[count];
    encImgData.data[i+1]=rgbs[count+1];
    encImgData.data[i+0]=rgbs[count+2];
    encImgData.data[i+3]=255;
    count += 3;
  }
  // console.log(count)
  ctx.putImageData(encImgData,0,0);
  document.getElementById('openModal').style.opacity=1;
  setTimeout(function () {
    document.getElementById('openModal').style.opacity=0;
  }, 5000);
  // console.log(encImgData.data);

  function decode (im) {
    var i=4*4;

    var index = []
    var idx = 0;
    var count=0;
    while (count<NUM_IDX_BITS) {
      index.push(im[i+2]);
      index.push(im[i+1]);
      index.push(im[i+0]);
      i += 4;
      count += 3;
    }
    for (j = 0; j < index.length; j++)
      idx += ((index[index.length-j-1]) & 1) << j;

    // console.log(index + ' ' + index.length);
    console.log('idx: ' + idx);

    var secrets = []
    var secretLen = 0
    var count=0;
    while (count<demSize) {
      secrets.push(im[i+2]);
      secrets.push(im[i+1]);
      secrets.push(im[i+0]);
      i += 4;
      count += 3;
    }
    for (j = 0; j < secrets.length; j++)
      secretLen += ((secrets[secrets.length-j-1]) & 1) << j;

    // console.log(secrets + ' ' + secrets.length)
    console.log('secretLen: ' + secretLen);
    // console.log('i: ' + i);

    var data = [];
    var bitsRead = 0;
    for (j = i; j < im.length; j+=4) {
      if (bitsRead >= secretLen) {
        bitsMap[idx] = data.slice(0, secretLen).join('');
        return;
      }
      data.push(im[j+2] & 1);
      data.push(im[j+1] & 1);
      data.push(im[j+0] & 1);
      bitsRead += 3;
    }
  }
}());