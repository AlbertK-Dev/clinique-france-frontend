/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import { CREATE_MODE, UPDATE_MODE, VIEW_MODE } from './constants';

function MontureForm({
  with: monture,
  isOpen,
  onClose,
  mode,
  onSave,
  onUpdate,
  process
}) {
  const isViewMode = mode === VIEW_MODE;

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    genre: '',
    alert: 5,
    quantity: 1,
    isInStock: true
  });

  useEffect(() => {
    if (monture) {
      setFormData({
        brand: monture?.brand || '',
        model: monture?.model || '',
        genre: monture?.genre || 'Homme',
        alert: monture?.alert || 5,
        quantity: monture?.quantity || 1,
        isInStock: monture?.isInStock !== undefined ? monture.isInStock : true
      });
    }
  }, [monture]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (mode === CREATE_MODE) {
      onSave(formData);
    } else if (mode === UPDATE_MODE) {
      onUpdate(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === CREATE_MODE ? 'Créer une nouvelle monture' :
            mode === UPDATE_MODE ? 'Modifier la monture' : 'Détails de la monture'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {process.error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {process.error}
            </Alert>
          )}
          {process.success && (
            <Alert status="success" mb={4}>
              <AlertIcon />
              {process.success}
            </Alert>
          )}
          <FormControl isRequired>
            <FormLabel>Marque</FormLabel>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Ex: Tom Ford"
              isDisabled={isViewMode}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Modèle</FormLabel>
            <Input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Ex: FT5178 - 52-18 - Noir/Doré"
              isDisabled={isViewMode}
            />
          </FormControl>
          <FormControl mt={4} >
            <FormLabel>Genre</FormLabel>
            <Select name='genre' value={formData.genre} onChange={handleChange}>
            <option value='Homme'>Homme</option>
            <option value='Femme'>Femme</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Quantité</FormLabel>
            <NumberInput
              onChange={(value)=>{
                setFormData({
                  ...formData,
                  quantity: value
                });
              }}
              value={`${formData.quantity}`}

              min={1}
              step={5}
              paddingLeft={2}
              paddingRight={10}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Alerte a moins de</FormLabel>
            <NumberInput
              onChange={(value)=>{
                setFormData({
                  ...formData,
                  alert: value
                });
              }}
              value={`${formData.alert}`}

              min={1}
              step={5}
              paddingLeft={2}
              paddingRight={10}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button isDisabled={process.success} onClick={onClose} mr={3}>
            {isViewMode ? 'Fermer' : 'Annuler'}
          </Button>
          {!isViewMode && (
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={process.loading}
              isDisabled={process.success}
            >
              {mode === CREATE_MODE ? 'Créer' : 'Mettre à jour'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default MontureForm;
