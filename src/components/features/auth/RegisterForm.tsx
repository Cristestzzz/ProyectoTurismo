import React, { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import axios from 'axios';
import './RegisterForm.css';

export interface RegisterFormProps {
  onSubmit?: (data: { nombre: string; apellido: string; email: string; password: string; es_operador: boolean }) => void;
  loading?: boolean;
  error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading = false, error }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esOperador, setEsOperador] = useState(false);
  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const validateApellido = (apellido: string): boolean => {
    if (!apellido) {
      setApellidoError('El apellido es requerido');
      return false;
    }
    setApellidoError('');
    return true;
  };

  const validateNombre = (nombre: string): boolean => {
    if (!nombre) {
      setNombreError('El nombre es requerido');
      return false;
    }
    setNombreError('');
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('El correo electrónico es requerido');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Ingresa un correo electrónico válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNombreValid = validateNombre(nombre);
    const isApellidoValid = validateApellido(apellido);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (isNombreValid && isApellidoValid && isEmailValid && isPasswordValid) {
      try {
        const response = await axios.post('http://localhost:8000/auth/register', {
          nombre,
          apellido,
          email,
          password,
          es_operador: esOperador,
        });
        if (onSubmit) onSubmit({ nombre, apellido, email, password, es_operador: esOperador });
      } catch (err: any) {
        // Mostrar error del backend si existe
        if (err.response?.data?.detail) {
          setEmailError(err.response.data.detail);
        } else {
          setEmailError('Error al registrar usuario');
        }
      }
    }
  };

  return (
    <div className="ubikha-register-form">
      <div className="ubikha-register-form__header">
        <h2 className="ubikha-register-form__title">Registrarse</h2>
      </div>
      {error && (
        <div className="ubikha-register-form__error">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="ubikha-register-form__form">
        <Input
          type="text"
          label="Nombre"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          error={!!nombreError}
          errorMessage={nombreError}
          required
          name="nombre"
        />
        <Input
          type="text"
          label="Apellido"
          placeholder="Apellido"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
          error={!!apellidoError}
          errorMessage={apellidoError}
          required
          name="apellido"
        />
        <Input
          type="email"
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={!!emailError}
          errorMessage={emailError}
          required
          name="email"
        />
        <Input
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={!!passwordError}
          errorMessage={passwordError}
          required
          name="password"
        />
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem'}}>
            <input
              type="checkbox"
              checked={esOperador}
              onChange={e => setEsOperador(e.target.checked)}
              style={{width: '18px', height: '18px'}}
            />
            ¿Registrarse como operador turístico?
          </label>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          Registrarse
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
