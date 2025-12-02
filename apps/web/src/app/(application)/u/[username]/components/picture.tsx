"use client";

import { motion } from "framer-motion";

import React from "react";
import { createPortal } from "react-dom";

import { Avatar, AvatarProps } from "@heroui/avatar";

export function Picture(props: AvatarProps) {
  const [showDialog, setShowDialog] = React.useState(false);

  function handleOpenDialog() {
    setShowDialog(true);
  }

  function handleCloseDialog() {
    setShowDialog(false);
  }

  return (
    <>
      <Avatar
        {...props}
        as="div"
        className="size-28 cursor-pointer"
        onClick={handleOpenDialog}
      />
      {showDialog &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="bg-background/80 absolute inset-0 z-9000 h-screen w-full backdrop-blur-xl transition-opacity"
              onClick={handleCloseDialog}
            >
              <div className="flex min-h-full flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18, duration: 0.5 }}
                >
                  <Avatar
                    {...props}
                    className="shadow-medium size-64"
                    isBordered={false}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}
