
import React, { useState } from 'react';
import styles from './RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/features/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: { nombre: string; email: string; password: string }) => {
    setError('');
    setLoading(true);
    try {
      await fetch('http://localhost:8000/usuarios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      navigate('/login');
    } catch (err: any) {
      setError('Error al registrar');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerForm}>
        <RegisterForm
          onSubmit={handleRegister}
          loading={loading}
          error={error}
        />
        <div className={styles.loginLink}>
          ¿Ya tienes cuenta? <span onClick={() => navigate('/login')}>Inicia sesión</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
