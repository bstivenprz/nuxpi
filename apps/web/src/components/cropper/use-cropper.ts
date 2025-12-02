import React from "react";
import { Point, Area, CropperProps } from "react-easy-crop";

export function useCropper(props: CropperProps) {
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null
  );
  const [croppedImage, setCroppedImage] = React.useState(null);

  function onCropComplete(_, croppedAreaPixels: Area) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function getCroppedImage(
    source: string,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ) {
    const image = await createImageElement(source);
  }
}

function createImageElement(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = source;
  });
}
