import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Slider,
} from "@heroui/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";
import Cropper, { Area, CropperProps } from "react-easy-crop";

export function ImageCropPopUp({
  cropperProps,
  onCropComplete,
  ...props
}: {
  cropperProps: Partial<CropperProps>;
  onCropComplete: (croppedImage: File) => void;
} & Omit<ModalProps, "children">) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null
  );

  const [isProccessing, setIsProccessing] = React.useState(false);

  async function save() {
    if (!croppedAreaPixels) return;
    setIsProccessing(true);

    try {
      const croppedImage = await getCroppedImage(
        cropperProps.image!,
        croppedAreaPixels,
        cropperProps.cropShape === "round"
      );

      if (croppedImage) {
        onCropComplete(croppedImage);
        props.onClose?.();
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      addToast({
        color: "danger",
        title: "Hubo un error",
        description: "Tuvimos un error al procesar la imagen.",
      });
    } finally {
      setIsProccessing(false);
    }
  }

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="justify-center">Preview</ModalHeader>
            <ModalBody className="p-0 bg-stone-600">
              <div className="relative w-full h-[400px]">
                <Cropper
                  {...cropperProps}
                  crop={crop}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedAreaPixels) =>
                    setCroppedAreaPixels(croppedAreaPixels)
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter className="flex-col gap-6">
              <Slider
                size="sm"
                color="foreground"
                value={zoom}
                minValue={1}
                maxValue={5}
                step={0.1}
                onChange={(value) => setZoom(value as number)}
                startContent={<MinusIcon />}
                endContent={<PlusIcon />}
              />

              <div className="flex mobile:flex-col desktop:flex-row gap-2">
                <Button
                  variant="bordered"
                  isDisabled={isProccessing}
                  onPress={onClose}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  isDisabled={isProccessing}
                  onPress={save}
                  fullWidth
                >
                  Aplicar
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
  isRound: boolean = false
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Configurar dimensiones del canvas
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Si es circular, crear clip path
  if (isRound) {
    ctx.beginPath();
    ctx.arc(
      pixelCrop.width / 2,
      pixelCrop.height / 2,
      pixelCrop.width / 2,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.clip();
  }

  // Dibujar imagen recortada
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convertir canvas a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        const file = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        resolve(file);
      },
      "image/jpeg",
      0.9
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
