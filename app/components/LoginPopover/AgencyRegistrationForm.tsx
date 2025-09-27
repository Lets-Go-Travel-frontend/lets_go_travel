"use client";

import { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Box,
  Typography
} from '@mui/material';

interface AgencyRegistrationFormProps {
  onClose: () => void;
}

export default function AgencyRegistrationForm({ onClose }: AgencyRegistrationFormProps) {
  const [formData, setFormData] = useState({
    agencyName: '',
    dba: '',
    contactName: '',
    contactPhone: '',
    address: '',
    phone: '',
    email: '',
    sellerOfTravelPdf: null as File | null,
    w9Pdf: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Información de la Agencia - 2 columnas */}
      <Typography variant="subtitle1" className="font-semibold text-gray-700 mb-3">
        Información de la Agencia
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <TextField
          fullWidth
          label="Nombre de la Agencia"
          name="agencyName"
          value={formData.agencyName}
          onChange={handleInputChange}
          required
          size="small"
        />

        <TextField
          fullWidth
          label="DBA (Nombre Comercial)"
          name="dba"
          value={formData.dba}
          onChange={handleInputChange}
          size="small"
          helperText="Si aplica"
        />
      </div>

      {/* Información de Contacto - 2 columnas */}
      <Typography variant="subtitle1" className="font-semibold text-gray-700 mb-3">
        Información de Contacto
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <TextField
          fullWidth
          label="Nombre del Contacto"
          name="contactName"
          value={formData.contactName}
          onChange={handleInputChange}
          required
          size="small"
        />

        <TextField
          fullWidth
          label="Teléfono de Contacto"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleInputChange}
          required
          size="small"
        />

        {/* Dirección ocupa 2 columnas */}
        <div className="md:col-span-2">
          <TextField
            fullWidth
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            size="small"
            multiline
            rows={2}
          />
        </div>

        <TextField
          fullWidth
          label="Teléfono de la Agencia"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          size="small"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          size="small"
        />
      </div>

      {/* Documentos - 2 columnas */}
      <Typography variant="subtitle1" className="font-semibold text-gray-700 mb-3">
        Documentos Requeridos
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Seller Of Travel PDF */}
        <FormControl fullWidth>
          <Button
            variant="outlined"
            component="label"
            size="small"
          >
            Cargar Seller Of Travel (PDF)
            <input
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => handleFileChange(e, 'sellerOfTravelPdf')}
            />
          </Button>
          <FormHelperText>
            {formData.sellerOfTravelPdf ? formData.sellerOfTravelPdf.name : 'No se ha seleccionado archivo'}
          </FormHelperText>
        </FormControl>

        {/* W-9 PDF (Deshabilitado) */}
        <FormControl fullWidth>
          <Box className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <Typography variant="body2" className="text-yellow-700 text-center">
              ⏳ Sección W-9 en desarrollo
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            component="label"
            size="small"
            disabled
            className="bg-gray-100 text-gray-400"
          >
            Cargar W-9 Firmado (PDF)
            <input
              type="file"
              accept=".pdf"
              hidden
              disabled
            />
          </Button>
        </FormControl>
      </div>

      {/* Botones de acción - 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Button
          type="button"
          variant="outlined"
          onClick={handleCancel}
          className="text-gray-600 border-gray-300 hover:bg-gray-50"
          size="large"
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          className="bg-blue-900 hover:bg-blue-800"
          size="large"
        >
          Enviar Registro
        </Button>
      </div>
    </form>
  );
}