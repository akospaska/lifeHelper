//@ts-nocheck
import React from "react";
import { Button, Modal, Stack, FormControl, Input, Center, NativeBaseProvider, Spinner, HStack } from "native-base";
import { useState } from "react";

const LoadingSpinner = () => {
  const [placement, setPlacement] = useState(undefined);
  const [open, setOpen] = useState(true);

  const openModal = (placement) => {
    setOpen(true);
    setPlacement(placement);
  };

  return (
    <>
      <Stack
        direction={{
          base: "column",
          md: "row",
        }}
        space={2}
      ></Stack>
      <Modal isOpen={open} onClose={() => setOpen(false)} mt={12}>
        <Modal.Content color="red" maxWidth="350" style={{ backgroundColor: "transparent", boxShadow: "none 'important" }}>
          <HStack space={8} justifyContent="center" alignItems="center">
            <Spinner size="lg" />
          </HStack>
          ;
        </Modal.Content>
      </Modal>
    </>
  );
};

const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0,
  },
  bottom: {
    marginBottom: 0,
    marginTop: "auto",
  },
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
  },
  center: {},
};

export default LoadingSpinner;
