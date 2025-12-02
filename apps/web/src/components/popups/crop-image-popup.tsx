import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";
import React from "react";
import Cropper, { CropperProps } from "react-easy-crop";

export function CropImagePopUp({
  modalProps,
  ...props
}: {
  modalProps: Omit<ModalProps, "children">;
} & CropperProps) {
  const [crop, setCrop] = React.useState({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = React.useState(1);

  return (
    <Modal {...modalProps}>
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalBody>
          <Cropper
            {...props}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
        </ModalBody>
        <ModalFooter>
          <Button>Cancelar</Button>
          <Button>Aplicar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function createImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = source;
  });
}

export async function exportCropImage(source: string, pixelCrop: any) {
  const image = await createImage(source);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) return null;

  context.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedContext = croppedCanvas.getContext("2d");

  if (!croppedContext) return null;

  croppedContext.drawImage(canvas);

  return croppedCanvas.toDataURL("image/jpeg");
}
