import React, { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

export interface LoginFormProps {
  onSubmit?: (credentials: { email: string; password: string }) => void;
  loading?: boolean;
  error?: string;
  title?: string;
  subtitle?: string;
  showForgotPassword?: boolean;
  showRegisterLink?: boolean;
  onForgotPassword?: () => void;
  onRegisterClick?: () => void;
}

  // CAMBIAR A: Validación de celular
  // Validación de email

  export const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    loading = false,
    error,
    title = 'Iniciar Sesión',
    subtitle = 'Ingresa a tu cuenta de UBIKHA',
    showForgotPassword = true,
    showRegisterLink = true,
    onForgotPassword,
    onRegisterClick,
  }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Validación de email
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
      if (password.length < 6) {
        setPasswordError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      setPasswordError('');
      return true;
    };

    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      if (isEmailValid && isPasswordValid) {
        try {
          const response = await axios.post('http://localhost:8000/auth/login', {
            email,
            password,
          });
          localStorage.setItem('token', response.data.access_token);
          // Obtener el usuario para saber si es operador
          const userRes = await axios.get('http://localhost:8000/usuarios/me', {
            headers: {
              Authorization: `Bearer ${response.data.access_token}`,
            },
          });
          if (onSubmit) onSubmit({ email, password });
          if (userRes.data.es_operador) {
            navigate('/dashboard-operador');
          } else {
            navigate('/');
          }
        } catch (error) {
          const err = error as any;
          if (err.response && err.response.data && err.response.data.detail) {
            setEmailError(err.response.data.detail);
          } else {
            setEmailError('Error de conexión o credenciales incorrectas');
          }
        }
      }
    };

    return (
      <div className="ubikha-login-form">
        <div className="ubikha-login-form__header">
          <h2 className="ubikha-login-form__title">{title}</h2>
          <p className="ubikha-login-form__subtitle">{subtitle}</p>
        </div>

        {error && (
          <div className="ubikha-login-form__error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="ubikha-login-form__form">
          <Input
            type="email"
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            errorMessage={passwordError}
            required
            name="password"
          />

          {showForgotPassword && (
            <div className="ubikha-login-form__forgot">
              <button
                type="button"
                className="ubikha-login-form__forgot-link"
                onClick={onForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Iniciar Sesión
          </Button>
        </form>

        {showRegisterLink && (
          <div className="ubikha-login-form__register">
            <span>¿No tienes cuenta? </span>
            <button
              type="button"
              className="ubikha-login-form__register-link"
              onClick={onRegisterClick}
            >
              Regístrate aquí
            </button>
          </div>
        )}
      </div>
    );
  };
