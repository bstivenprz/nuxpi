"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { Modal, type ModalProps } from "@heroui/react";

export type PopUpId = string;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PopUpComponent<P = {}> = React.ComponentType<
  P & { __popupKey?: string }
>;
export type PopUpRegistry = Record<PopUpId, PopUpComponent<any>>;

export interface PopUpEntry<P = any> {
  id: PopUpId;
  key: string;
  props?: P;
  modalProps?: Omit<ModalProps, "children">;
}

interface PopUpContextValue {
  open: <P = object>(
    id: PopUpId,
    props?: P,
    modalProps?: Omit<ModalProps, "children">
  ) => void;
  close: () => void;
  entry?: PopUpEntry;
}

const PopUpContext = React.createContext<PopUpContextValue | null>(null);

export function PopUpProvider({
  children,
  registry,
}: {
  children: React.ReactNode;
  registry: PopUpRegistry;
}) {
  const [entry, setEntry] = React.useState<PopUpEntry>();

  const open = React.useCallback(
    <P,>(id: PopUpId, props?: P, modalProps?: Omit<ModalProps, "children">) => {
      setEntry({ id, props, modalProps, key: `${id}-${crypto.randomUUID()}` });
    },
    []
  );

  const close = React.useCallback(() => {
    setEntry(undefined);
  }, [setEntry]);

  const value = React.useMemo<PopUpContextValue>(
    () => ({
      open,
      close,
      entry,
    }),
    [open, close, entry]
  );

  return (
    <PopUpContext.Provider value={value}>
      {children}
      <PopUpRoot registry={registry} />
    </PopUpContext.Provider>
  );
}

export function usePopUp() {
  const context = React.useContext(PopUpContext);
  if (!context) throw new Error("usePopUp must be used within a PopUpProvider");
  return context;
}

function PopUpRoot({ registry }: { registry: PopUpRegistry }) {
  const { entry, close } = usePopUp();

  const Component = entry ? registry[entry.id] : null;

  return (
    <Modal
      {...entry?.modalProps}
      scrollBehavior="inside"
      hideCloseButton
      isOpen={!!Component}
      onClose={() => close()}
    >
      {Component ? <Component {...entry?.props} /> : null}
    </Modal>
  );
}
