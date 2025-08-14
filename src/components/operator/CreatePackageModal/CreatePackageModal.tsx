import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreatePackageModal.module.css';

export interface CreatePackageModalProps {
  open: boolean;
  onClose: () => void;
}

type FormState = {
  titulo: string;
  tipo_paquete: string;
  duracion_dias: string;
  capacidad_maxima: string;
  nivel_dificultad: string;
  precio_por_persona: string;
  pais_destino: string;
  ciudad_destino: string;
  punto_encuentro: string;
};


const initialForm: FormState = {
  titulo: '',
  tipo_paquete: '',
  duracion_dias: '',
  capacidad_maxima: '',
  nivel_dificultad: '',
  precio_por_persona: '',
  pais_destino: '',
  ciudad_destino: '',
  punto_encuentro: '',
};




const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Estado para imágenes base64 (debe estar dentro del componente)
  const [imagenes, setImagenes] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && 'checked' in e.target) {
      setForm(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  // Manejo de imágenes base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const promises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then(base64Imgs => {
        setImagenes(prev => [...prev, ...base64Imgs]);
      });
    }
  };

  const validateFields = () => {
    const required = [
      'titulo', 'tipo_paquete', 'duracion_dias', 'capacidad_maxima', 'nivel_dificultad',
      'precio_por_persona', 'pais_destino', 'ciudad_destino', 'punto_encuentro'
    ];
    for (const field of required) {
      const value = (form as any)[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        setError('Completa todos los campos obligatorios.');
        return false;
      }
    }
    // Validar numéricos obligatorios
    const numericFields = [
      'duracion_dias', 'capacidad_maxima', 'precio_por_persona'
    ];
    for (const field of numericFields) {
      const value = Number((form as any)[field]);
      if (isNaN(value) || value <= 0) {
        setError('Los campos numéricos deben ser mayores a cero.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateFields()) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);

    // Convertir campos numéricos
    const payload = {
      titulo: form.titulo,
      tipo_paquete: form.tipo_paquete,
      duracion_dias: Number(form.duracion_dias),
      capacidad_maxima: Number(form.capacidad_maxima),
      nivel_dificultad: form.nivel_dificultad,
      precio_por_persona: form.precio_por_persona.toString(),
      pais_destino: form.pais_destino,
      ciudad_destino: form.ciudad_destino,
      punto_encuentro: form.punto_encuentro,
      operador_id: Number(localStorage.getItem('operador_id')),
      imagenes: imagenes,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/paquetes-turisticos/', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.detail) {
        setError('Error: ' + JSON.stringify(err.response.data.detail));
      } else {
        setError('Error al crear el paquete. Verifica los datos e intenta nuevamente.');
      }
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Crear nuevo paquete turístico</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título del paquete" required />
          <select name="tipo_paquete" value={form.tipo_paquete} onChange={handleChange} required>
            <option value="">Selecciona tipo de paquete</option>
            <option value="aventura">Aventura</option>
            <option value="cultural">Cultural</option>
            <option value="gastronomico">Gastronómico</option>
            <option value="playa">Playa</option>
            <option value="montaña">Montaña</option>
            <option value="ciudad">Ciudad</option>
            <option value="ecoturismo">Ecoturismo</option>
            <option value="romantico">Romántico</option>
            <option value="familiar">Familiar</option>
            <option value="negocios">Negocios</option>
          </select>
          <input name="duracion_dias" value={form.duracion_dias} onChange={handleChange} placeholder="Duración (días)" required type="number" min="1" />
          <input name="capacidad_maxima" value={form.capacidad_maxima} onChange={handleChange} placeholder="Capacidad máxima" required type="number" min="1" />
          <select name="nivel_dificultad" value={form.nivel_dificultad} onChange={handleChange} required>
            <option value="">Selecciona nivel de dificultad</option>
            <option value="facil">Fácil</option>
            <option value="moderado">Moderado</option>
            <option value="dificil">Difícil</option>
            <option value="extremo">Extremo</option>
          </select>
          <input name="precio_por_persona" value={form.precio_por_persona} onChange={handleChange} placeholder="Precio por persona" required type="number" min="0" />
          <input name="pais_destino" value={form.pais_destino} onChange={handleChange} placeholder="País destino" required />
          <input name="ciudad_destino" value={form.ciudad_destino} onChange={handleChange} placeholder="Ciudad destino" required />
          <input name="punto_encuentro" value={form.punto_encuentro} onChange={handleChange} placeholder="Punto de encuentro" required />
          {/* Input para subir imágenes */}
          <label htmlFor="imagenesInput" style={{ display: 'block', margin: '10px 0 5px' }}>Subir imágenes:</label>
          <input id="imagenesInput" type="file" accept="image/*" multiple onChange={handleImageChange} />
          {imagenes.length > 0 && (
            <div>
              <p>Imágenes seleccionadas:</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {imagenes.map((img, idx) => (
                  <img key={idx} src={img} alt={`Imagen ${idx + 1}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }} />
                ))}
              </div>
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className={styles.saveButton} disabled={loading}>{loading ? 'Creando...' : 'Crear paquete'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePackageModal;