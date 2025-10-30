// components/AgencyRegistrationForm.tsx
"use client";

import { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Add, Delete, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AgencyRegistrationFormProps {
  onClose: () => void;
}

// Interfaces para el estado (deben coincidir con las del hook)
interface Specializations {
  destinations: string[];
  types: string[];
  languages: string[];
}

interface ServiceRegions {
  countries: string[];
  states: string[];
}

interface Certification {
  certification_name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string;
  certificate_number: string;
  document_url: string;
}

interface FormDataState {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agencyName: string;
  licenseNumber: string;
  commissionRate: string;
  yearsOfExperience: string;
  bio: string;
  website: string;
  officePhone: string;
  officeAddress: string;
  specializations: Specializations;
  serviceRegions: ServiceRegions;
  certifications: Certification[];
  sellerOfTravelPdf: File | null;
  w9Pdf: File | null;
}

// Opciones predefinidas
const DESTINATION_OPTIONS = [
  'Asia', 'Europe', 'North America', 'South America', 
  'Africa', 'Oceania', 'Caribbean', 'Central America'
];

const TRAVEL_TYPE_OPTIONS = [
  'adventure', 'luxury', 'family', 'business', 'honeymoon',
  'cultural', 'beach', 'cruise', 'eco-tourism'
];

const LANGUAGE_OPTIONS = [
  'English', 'Spanish', 'French', 'German', 'Italian',
  'Portuguese', 'Chinese', 'Japanese', 'Arabic', 'Russian'
];

const COUNTRY_OPTIONS = [
  'USA', 'Canada', 'Mexico', 'Brazil', 'Argentina',
  'UK', 'France', 'Germany', 'Italy', 'Spain'
];

const STATE_OPTIONS = [
  'CA', 'NY', 'FL', 'TX', 'IL', 'WA', 'OR', 'NV', 'AZ', 'CO'
];

export default function AgencyRegistrationForm({ onClose }: AgencyRegistrationFormProps) {
  const router = useRouter();
  const { registerAgent, loading, error } = useAuth();
  
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Estado formData con interfaz definida
  const [formData, setFormData] = useState<FormDataState>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agencyName: '',
    licenseNumber: '',
    commissionRate: '',
    yearsOfExperience: '',
    bio: '',
    website: '',
    officePhone: '',
    officeAddress: '',
    specializations: {
      destinations: [],
      types: [],
      languages: [],
    },
    serviceRegions: {
      countries: [],
      states: [],
    },
    certifications: [],
    sellerOfTravelPdf: null,
    w9Pdf: null
  });

  // Validaciones de contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un email válido';
        return '';
      
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!/[a-z]/.test(value)) return 'Debe contener al menos una minúscula';
        if (!/[A-Z]/.test(value)) return 'Debe contener al menos una mayúscula';
        if (!/\d/.test(value)) return 'Debe contener al menos un número';
        if (!/[@$!%*?&]/.test(value)) return 'Debe contener al menos un símbolo (@$!%*?&)';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
      
      case 'firstName':
        if (!value) return 'El nombre es requerido';
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      
      case 'lastName':
        if (!value) return 'El apellido es requerido';
        if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
        return '';
      
      case 'agencyName':
        if (!value) return 'El nombre de la agencia es requerido';
        return '';
      
      case 'licenseNumber':
        if (!value) return 'El número de licencia es requerido';
        return '';
      
      case 'commissionRate':
        if (!value) return 'La tasa de comisión es requerida';
        if (parseFloat(value) < 0 || parseFloat(value) > 100) return 'La comisión debe estar entre 0 y 100';
        return '';
      
      case 'yearsOfExperience':
        if (!value) return 'Los años de experiencia son requeridos';
        if (parseFloat(value) < 0) return 'Los años no pueden ser negativos';
        return '';
      
      case 'officePhone':
        if (!value) return 'El teléfono de oficina es requerido';
        return '';
      
      case 'officeAddress':
        if (!value) return 'La dirección de oficina es requerida';
        return '';
      
      case 'bio':
        if (!value) return 'La biografía es requerida';
        if (value.length < 50) return 'La biografía debe tener al menos 50 caracteres';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    if (formErrors.length > 0) setFormErrors([]);
  };

  // Función corregida para arrays
  const handleArrayChange = (field: keyof FormDataState, subfield: string, value: string[]) => {
    setFormData(prev => {
      const fieldData = prev[field];
      
      if (typeof fieldData === 'object' && fieldData !== null && !Array.isArray(fieldData)) {
        return {
          ...prev,
          [field]: {
            ...fieldData,
            [subfield]: value
          }
        };
      }
      
      return prev;
    });
  };

  const handleSelectChange = (field: keyof FormDataState, subfield: string) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    handleArrayChange(field, subfield, value);
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          certification_name: '',
          issuing_organization: '',
          issue_date: '',
          expiry_date: '',
          certificate_number: '',
          document_url: ''
        }
      ]
    }));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormDataState) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    const fieldErrs: {[key: string]: string} = {};

    // Validar campos individuales
    const fieldsToValidate = [
      'email', 'password', 'confirmPassword', 'firstName', 'lastName',
      'agencyName', 'licenseNumber', 'commissionRate', 'yearsOfExperience',
      'officePhone', 'officeAddress', 'bio'
    ];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof FormDataState] as string);
      if (error) {
        fieldErrs[field] = error;
      }
    });

    // Validar especializaciones
    if (formData.specializations.destinations.length === 0) {
      errors.push('Selecciona al menos un destino');
    }
    if (formData.specializations.types.length === 0) {
      errors.push('Selecciona al menos un tipo de viaje');
    }
    if (formData.specializations.languages.length === 0) {
      errors.push('Selecciona al menos un idioma');
    }

    // Validar regiones de servicio
    if (formData.serviceRegions.countries.length === 0) {
      errors.push('Selecciona al menos un país');
    }

    setFieldErrors(fieldErrs);
    setFormErrors(errors);

    return Object.keys(fieldErrs).length === 0 && errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Preparar los datos para la API según la estructura esperada
        const apiData = {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          agent_data: {
            agency_name: formData.agencyName,
            license_number: formData.licenseNumber,
            commission_rate: parseFloat(formData.commissionRate),
            specializations: formData.specializations,
            service_regions: formData.serviceRegions,
            years_of_experience: parseInt(formData.yearsOfExperience),
            bio: formData.bio,
            website: formData.website,
            office_phone: formData.officePhone,
            office_address: formData.officeAddress,
            certifications: formData.certifications.map(cert => ({
              ...cert,
              // Asegurar que las fechas estén en formato correcto
              issue_date: cert.issue_date || new Date().toISOString().split('T')[0],
              expiry_date: cert.expiry_date || new Date().toISOString().split('T')[0],
            }))
          }
        };

        await registerAgent(apiData);
        // La redirección se maneja automáticamente en el hook useAuth
        
      } catch (err) {
        console.error('Error en registro:', err);
        // El error se muestra automáticamente desde el hook
      }
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Componente para mostrar requisitos de contraseña
  const PasswordRequirements = () => (
    <Box className="mt-2 p-3 bg-blue-50 rounded-lg">
      <Typography variant="caption" className="text-blue-800 font-semibold block mb-2">
        La contraseña debe contener:
      </Typography>
      <ul className="text-xs text-blue-700 space-y-1">
        <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
          ✓ Mínimo 8 caracteres
        </li>
        <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Una letra minúscula
        </li>
        <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Una letra mayúscula
        </li>
        <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Un número
        </li>
        <li className={/[@$!%*?&]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Un símbolo (@$!%*?&)
        </li>
      </ul>
    </Box>
  );

  return (
    <Box className="max-w-4xl mx-auto space-y-8">
      {/* Botón volver */}
      <Box className="flex items-center">
        <Button
          onClick={handleBackToHome}
          startIcon={<ArrowBack />}
          className="text-gray-600 hover:text-gray-800"
        >
          Volver al inicio
        </Button>
      </Box>

      {/* Errores generales */}
      {formErrors.length > 0 && (
        <Alert severity="error" className="mb-6">
          <Typography variant="subtitle2" className="font-semibold mb-2">
            Por favor corrige los siguientes errores:
          </Typography>
          <ul className="list-disc list-inside space-y-1">
            {formErrors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Error del hook useAuth */}
      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Datos Personales */}
        <Paper elevation={1} className="p-6">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Datos Personales
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              size="small"
              error={!!fieldErrors.firstName}
              helperText={fieldErrors.firstName}
            />

            <TextField
              fullWidth
              label="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              size="small"
              error={!!fieldErrors.lastName}
              helperText={fieldErrors.lastName}
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
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />

            <Box>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                size="small"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formData.password && <PasswordRequirements />}
            </Box>

            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              size="small"
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Paper>

        {/* Información de la Agencia */}
        <Paper elevation={1} className="p-6">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Información de la Agencia
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Nombre de la Agencia"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleInputChange}
              required
              size="small"
              error={!!fieldErrors.agencyName}
              helperText={fieldErrors.agencyName}
            />

            <TextField
              fullWidth
              label="Número de Licencia"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
              size="small"
              error={!!fieldErrors.licenseNumber}
              helperText={fieldErrors.licenseNumber}
            />

            <TextField
              fullWidth
              label="Tasa de Comisión (%)"
              name="commissionRate"
              type="number"
              value={formData.commissionRate}
              onChange={handleInputChange}
              required
              size="small"
              error={!!fieldErrors.commissionRate}
              helperText={fieldErrors.commissionRate}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />

            <TextField
              fullWidth
              label="Años de Experiencia"
              name="yearsOfExperience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              required
              size="small"
              error={!!fieldErrors.yearsOfExperience}
              helperText={fieldErrors.yearsOfExperience}
            />

            <TextField
              fullWidth
              label="Teléfono de Oficina"
              name="officePhone"
              value={formData.officePhone}
              onChange={handleInputChange}
              required
              size="small"
              error={!!fieldErrors.officePhone}
              helperText={fieldErrors.officePhone}
            />

            <TextField
              fullWidth
              label="Sitio Web"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              size="small"
              placeholder="https://ejemplo.com"
            />

            <div className="md:col-span-2">
              <TextField
                fullWidth
                label="Dirección de Oficina"
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleInputChange}
                required
                size="small"
                multiline
                rows={2}
                error={!!fieldErrors.officeAddress}
                helperText={fieldErrors.officeAddress}
              />
            </div>

            <div className="md:col-span-2">
              <TextField
                fullWidth
                label="Biografía"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                size="small"
                multiline
                rows={3}
                error={!!fieldErrors.bio}
                helperText={fieldErrors.bio || "Describe tu experiencia y especialidades (mínimo 50 caracteres)"}
              />
            </div>
          </div>
        </Paper>

        {/* Especializaciones */}
        <Paper elevation={1} className="p-6">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Especializaciones
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormControl fullWidth size="small" error={formErrors.some(e => e.includes('destino'))}>
              <InputLabel>Destinos *</InputLabel>
              <Select
                multiple
                value={formData.specializations.destinations}
                onChange={handleSelectChange('specializations', 'destinations')}
                input={<OutlinedInput label="Destinos *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {DESTINATION_OPTIONS.map((destination) => (
                  <MenuItem key={destination} value={destination}>
                    {destination}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecciona al menos un destino</FormHelperText>
            </FormControl>

            <FormControl fullWidth size="small" error={formErrors.some(e => e.includes('tipo de viaje'))}>
              <InputLabel>Tipos de Viaje *</InputLabel>
              <Select
                multiple
                value={formData.specializations.types}
                onChange={handleSelectChange('specializations', 'types')}
                input={<OutlinedInput label="Tipos de Viaje *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {TRAVEL_TYPE_OPTIONS.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecciona al menos un tipo</FormHelperText>
            </FormControl>

            <FormControl fullWidth size="small" error={formErrors.some(e => e.includes('idioma'))}>
              <InputLabel>Idiomas *</InputLabel>
              <Select
                multiple
                value={formData.specializations.languages}
                onChange={handleSelectChange('specializations', 'languages')}
                input={<OutlinedInput label="Idiomas *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {LANGUAGE_OPTIONS.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecciona al menos un idioma</FormHelperText>
            </FormControl>
          </div>
        </Paper>

        {/* Regiones de Servicio */}
        <Paper elevation={1} className="p-6">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Regiones de Servicio
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormControl fullWidth size="small" error={formErrors.some(e => e.includes('país'))}>
              <InputLabel>Países *</InputLabel>
              <Select
                multiple
                value={formData.serviceRegions.countries}
                onChange={handleSelectChange('serviceRegions', 'countries')}
                input={<OutlinedInput label="Países *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {COUNTRY_OPTIONS.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecciona al menos un país</FormHelperText>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Estados/Provincias</InputLabel>
              <Select
                multiple
                value={formData.serviceRegions.states}
                onChange={handleSelectChange('serviceRegions', 'states')}
                input={<OutlinedInput label="Estados/Provincias" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {STATE_OPTIONS.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Opcional - estados donde operas</FormHelperText>
            </FormControl>
          </div>
        </Paper>

        {/* Certificaciones */}
        <Paper elevation={1} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Certificaciones
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={addCertification}
              className="bg-blue-900 hover:bg-blue-800 text-white"
              size="small"
            >
              Agregar Certificación
            </Button>
          </div>

          <Typography variant="body2" className="text-gray-600 mb-4">
            Agrega tus certificaciones profesionales (opcional)
          </Typography>

          {formData.certifications.map((cert, index) => (
            <Box key={index} className="p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="subtitle1" className="font-medium">
                  Certificación #{index + 1}
                </Typography>
                <IconButton
                  onClick={() => removeCertification(index)}
                  size="small"
                  className="text-red-500 hover:bg-red-50"
                >
                  <Delete />
                </IconButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="Nombre de Certificación"
                  value={cert.certification_name}
                  onChange={(e) => updateCertification(index, 'certification_name', e.target.value)}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Organización Emisora"
                  value={cert.issuing_organization}
                  onChange={(e) => updateCertification(index, 'issuing_organization', e.target.value)}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Número de Certificado"
                  value={cert.certificate_number}
                  onChange={(e) => updateCertification(index, 'certificate_number', e.target.value)}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="URL del Documento S3"
                  value={cert.document_url}
                  onChange={(e) => updateCertification(index, 'document_url', e.target.value)}
                  size="small"
                  placeholder="s3://bucket/path/to/file.pdf"
                  helperText="Path del documento en Amazon S3"
                />

                <TextField
                  fullWidth
                  label="Fecha de Emisión"
                  type="date"
                  value={cert.issue_date}
                  onChange={(e) => updateCertification(index, 'issue_date', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="Fecha de Expiración"
                  type="date"
                  value={cert.expiry_date}
                  onChange={(e) => updateCertification(index, 'expiry_date', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            </Box>
          ))}

          {formData.certifications.length === 0 && (
            <Typography variant="body2" className="text-gray-500 text-center py-4">
              No hay certificaciones agregadas. Opcional.
            </Typography>
          )}
        </Paper>

        {/* Documentos Requeridos */}
        <Paper elevation={1} className="p-6">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Documentos Requeridos
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </Paper>

        {/* Botones de acción */}
        <Box className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outlined"
            onClick={handleBackToHome}
            className="text-gray-600 border-gray-300 hover:bg-gray-50 py-3 flex-1"
            size="large"
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            className="bg-blue-900 hover:bg-blue-800 py-3 flex-1"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Registrando Agente...' : 'Completar Registro'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}