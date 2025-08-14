import React, { useState } from 'react';
import styles from './CreatePackageModal.module.css';

export interface CreatePackageModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ open, onClose, onSave }) => {
  type FormState = {
    titulo: string;
    descripcion: string;
    tipo_paquete: string;
    duracion_dias: string;
    capacidad_maxima: string;
    nivel_dificultad: string;
    precio_por_persona: string;
    precio_niño: string;
    incluye_transporte: boolean;
    incluye_alojamiento: boolean;
    incluye_comidas: boolean;
    incluye_guia: boolean;
    pais_destino: string;
    ciudad_destino: string;
    punto_encuentro: string;
    latitud: string;
    longitud: string;
    hora_inicio: string;
    hora_fin: string;
    edad_minima: string;
    requiere_experiencia: boolean;
    permite_cancelacion: boolean;
    imagenes: File[];
  };

  const [form, setForm] = useState<FormState>({
    titulo: '',
    descripcion: '',
    tipo_paquete: '',
    duracion_dias: '',
    capacidad_maxima: '',
    nivel_dificultad: '',
    precio_por_persona: '',
    precio_niño: '',
    incluye_transporte: false,
    incluye_alojamiento: false,
    incluye_comidas: false,
    incluye_guia: false,
    pais_destino: '',
    ciudad_destino: '',
    punto_encuentro: '',
    latitud: '',
    longitud: '',
    hora_inicio: '',
    hora_fin: '',
    edad_minima: '',
    requiere_experiencia: false,
    permite_cancelacion: false,
    imagenes: [],
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, imagenes: Array.from(e.target.files) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar todos los campos requeridos
    const requiredFields: (keyof FormState)[] = [
      'titulo', 'descripcion', 'tipo_paquete', 'duracion_dias', 'capacidad_maxima', 'nivel_dificultad',
      'precio_por_persona', 'precio_niño', 'pais_destino', 'ciudad_destino', 'punto_encuentro',
      'latitud', 'longitud', 'hora_inicio', 'hora_fin', 'edad_minima'
    ];
    for (const field of requiredFields) {
      const value = form[field];
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        setError('Completa todos los campos obligatorios.');
        return;
      }
    }
    setError('');
    // Verifica si todas las imágenes son objetos tipo File antes de convertir
    const isFileArray = form.imagenes.length > 0 && form.imagenes.every(img => typeof img === 'object' && img !== null && 'name' in img && 'type' in img);
    if (isFileArray) {
      const files = form.imagenes as File[];
      Promise.all(files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })).then(base64Images => {
        onSave({ ...form, imagenes: base64Images });
      }).catch(() => {
        setError('Error al procesar las imágenes.');
      });
    } else {
      onSave(form);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
1234    q1      <div className={styles.modalContent}>
        <h2>Crear nuevo paquete turístico</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título del paquete" required />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" required />
          <input name="tipo_paquete" value={form.tipo_paquete} onChange={handleChange} placeholder="Tipo de paquete" required />
          <input name="duracion_dias" value={form.duracion_dias} onChange={handleChange} placeholder="Duración (días)" required type="number" min="1" />
          <input name="capacidad_maxima" value={form.capacidad_maxima} onChange={handleChange} placeholder="Capacidad máxima" required type="number" min="1" />
          <input name="nivel_dificultad" value={form.nivel_dificultad} onChange={handleChange} placeholder="Nivel de dificultad" required />
          <input name="precio_por_persona" value={form.precio_por_persona} onChange={handleChange} placeholder="Precio por persona" required type="number" min="0" />
          <input name="precio_niño" value={form.precio_niño} onChange={handleChange} placeholder="Precio por niño" required type="number" min="0" />
          <label><input type="checkbox" name="incluye_transporte" checked={form.incluye_transporte} onChange={e => setForm({ ...form, incluye_transporte: e.target.checked })} /> Incluye transporte</label>
          <label><input type="checkbox" name="incluye_alojamiento" checked={form.incluye_alojamiento} onChange={e => setForm({ ...form, incluye_alojamiento: e.target.checked })} /> Incluye alojamiento</label>
          <label><input type="checkbox" name="incluye_comidas" checked={form.incluye_comidas} onChange={e => setForm({ ...form, incluye_comidas: e.target.checked })} /> Incluye comidas</label>
          <label><input type="checkbox" name="incluye_guia" checked={form.incluye_guia} onChange={e => setForm({ ...form, incluye_guia: e.target.checked })} /> Incluye guía</label>
          <input name="pais_destino" value={form.pais_destino} onChange={handleChange} placeholder="País destino" required />
          <input name="ciudad_destino" value={form.ciudad_destino} onChange={handleChange} placeholder="Ciudad destino" required />
          <input name="punto_encuentro" value={form.punto_encuentro} onChange={handleChange} placeholder="Punto de encuentro" required />
          <input name="latitud" value={form.latitud} onChange={handleChange} placeholder="Latitud" required />
          <input name="longitud" value={form.longitud} onChange={handleChange} placeholder="Longitud" required />
          <input name="hora_inicio" value={form.hora_inicio} onChange={handleChange} placeholder="Hora de inicio" required type="time" />
          <input name="hora_fin" value={form.hora_fin} onChange={handleChange} placeholder="Hora de fin" required type="time" />
          <input name="edad_minima" value={form.edad_minima} onChange={handleChange} placeholder="Edad mínima" required type="number" min="0" />
          <label><input type="checkbox" name="requiere_experiencia" checked={form.requiere_experiencia} onChange={e => setForm({ ...form, requiere_experiencia: e.target.checked })} /> Requiere experiencia</label>
          <label><input type="checkbox" name="permite_cancelacion" checked={form.permite_cancelacion} onChange={e => setForm({ ...form, permite_cancelacion: e.target.checked })} /> Permite cancelación</label>
          <input name="imagenes" type="file" multiple accept="image/*" onChange={handleImageChange} />
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveButton}>Crear paquete</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePackageModal;
