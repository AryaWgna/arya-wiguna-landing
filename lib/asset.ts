// Load an HTMLImageElement asynchronously without blocking the main thread.
export function loadImg(
  src: string,
  highPriority = false
): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    if (highPriority) {
      img.fetchPriority = "high";
    }
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Build a pre-cropped 4:3 rounded thumbnail canvas for fast instanced drawing.
export function makeThumbCanvas(
  img: HTMLImageElement,
  lowPower: boolean
): HTMLCanvasElement {
  const tw = lowPower ? 112 : 144;
  const th = lowPower ? 84 : 108;
  const cv = document.createElement("canvas");
  cv.width = tw;
  cv.height = th;
  const c = cv.getContext("2d");
  if (!c) return cv;

  const r = 7;
  c.beginPath();
  c.moveTo(r, 0);
  c.lineTo(tw - r, 0);
  c.quadraticCurveTo(tw, 0, tw, r);
  c.lineTo(tw, th - r);
  c.quadraticCurveTo(tw, th, tw - r, th);
  c.lineTo(r, th);
  c.quadraticCurveTo(0, th, 0, th - r);
  c.lineTo(0, r);
  c.quadraticCurveTo(0, 0, r, 0);
  c.closePath();
  c.clip();

  // Center-crop to 4:3
  const iw = img.naturalWidth || img.width || tw;
  const ih = img.naturalHeight || img.height || th;
  const targetAspect = tw / th;
  const imgAspect = iw / ih;
  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;
  if (imgAspect > targetAspect) {
    sw = ih * targetAspect;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / targetAspect;
    sy = (ih - sh) / 2;
  }
  c.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
  return cv;
}
