import React, { useState } from 'react';
import styles from './ProfileCompletionModal.module.css';

export interface ProfileCompletionModalProps {
  open: boolean;
  user: any;
  onSave: (data: any) => void;
}

const requiredFields = [
  'telefono', 'pais', 'ciudad', 'direccion', 'codigo_postal', 'descripcion_perfil'
];

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ open, user, onSave }) => {
  const [form, setForm] = useState({ ...user });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === '') {
        setError('Por favor completa todos los campos obligatorios.');
        return;
      }
    }
    setError('');
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Completa tu perfil para publicar paquetes</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Solo pedir datos editables, nunca nombre/apellido/email si ya existen */}
          <input name="telefono" value={form.telefono || ''} onChange={handleChange} placeholder="Teléfono" required />
          <input name="pais" value={form.pais || ''} onChange={handleChange} placeholder="País" required />
          <input name="ciudad" value={form.ciudad || ''} onChange={handleChange} placeholder="Ciudad" required />
          <input name="direccion" value={form.direccion || ''} onChange={handleChange} placeholder="Dirección" required />
          <input name="codigo_postal" value={form.codigo_postal || ''} onChange={handleChange} placeholder="Código Postal" required />
          <textarea name="descripcion_perfil" value={form.descripcion_perfil || ''} onChange={handleChange} placeholder="Descripción de la empresa" required />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.saveButton}>Guardar y continuar</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
