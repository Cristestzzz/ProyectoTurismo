import React, { useState } from 'react';
import axios from 'axios';
import styles from './EditPackageModal.module.css';

export interface EditPackageModalProps {
  open: boolean;
  onClose: () => void;
  paquete: any; // Recibe el paquete a editar
}

const EditPackageModal: React.FC<EditPackageModalProps> = ({ open, onClose, paquete }) => {
  // Solo campos opcionales
  const [descripcion, setDescripcion] = useState(paquete.descripcion || '');
  const [incluyeTransporte, setIncluyeTransporte] = useState(paquete.incluye_transporte || false);
  const [incluyeAlojamiento, setIncluyeAlojamiento] = useState(paquete.incluye_alojamiento || false);
  const [incluyeComidas, setIncluyeComidas] = useState(paquete.incluye_comidas || false);
  const [incluyeGuia, setIncluyeGuia] = useState(paquete.incluye_guia || false);
  const [horaInicio, setHoraInicio] = useState(paquete.hora_inicio || '09:00');
  const [horaFin, setHoraFin] = useState(paquete.hora_fin || '18:00');
  const [edadMinima, setEdadMinima] = useState(paquete.edad_minima || 0);
  const [requiereExperiencia, setRequiereExperiencia] = useState(paquete.requiere_experiencia || false);
  const [permiteCancelacion, setPermiteCancelacion] = useState(paquete.permite_cancelacion || true);
  const [diasCancelacion, setDiasCancelacion] = useState(paquete.dias_cancelacion || 7);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  // Solo incluir campos que realmente tienen valor definido
  const payload: any = {};
  if (descripcion !== undefined && descripcion !== null) payload.descripcion = descripcion;
  if (horaInicio !== undefined && horaInicio !== null) payload.hora_inicio = horaInicio;
  if (horaFin !== undefined && horaFin !== null) payload.hora_fin = horaFin;
  if (edadMinima !== undefined && edadMinima !== null) payload.edad_minima = Number(edadMinima);
  if (requiereExperiencia !== undefined && requiereExperiencia !== null) payload.requiere_experiencia = Boolean(requiereExperiencia);
  if (permiteCancelacion !== undefined && permiteCancelacion !== null) payload.permite_cancelacion = Boolean(permiteCancelacion);
  if (diasCancelacion !== undefined && diasCancelacion !== null) payload.dias_cancelacion = Number(diasCancelacion);
  payload.incluye_transporte = Boolean(incluyeTransporte);
  payload.incluye_alojamiento = Boolean(incluyeAlojamiento);
  payload.incluye_comidas = Boolean(incluyeComidas);
  payload.incluye_guia = Boolean(incluyeGuia);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8000/paquetes-turisticos/${paquete.id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError('Error al editar el paquete.');
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar paquete turístico</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" style={{ minHeight: 80 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={incluyeTransporte} onChange={e => setIncluyeTransporte(e.target.checked)} /> Transporte
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={incluyeAlojamiento} onChange={e => setIncluyeAlojamiento(e.target.checked)} /> Alojamiento
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={incluyeComidas} onChange={e => setIncluyeComidas(e.target.checked)} /> Comidas
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={incluyeGuia} onChange={e => setIncluyeGuia(e.target.checked)} /> Guía
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input value={horaInicio} onChange={e => setHoraInicio(e.target.value)} placeholder="Hora inicio" type="text" style={{ flex: 1 }} />
            <input value={horaFin} onChange={e => setHoraFin(e.target.value)} placeholder="Hora fin" type="text" style={{ flex: 1 }} />
          </div>
          <input value={edadMinima} onChange={e => setEdadMinima(e.target.value)} placeholder="Edad mínima" type="number" min="0" />
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={requiereExperiencia} onChange={e => setRequiereExperiencia(e.target.checked)} /> Requiere experiencia
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={permiteCancelacion} onChange={e => setPermiteCancelacion(e.target.checked)} /> Permite cancelación
          </label>
          <input value={diasCancelacion} onChange={e => setDiasCancelacion(e.target.value)} placeholder="Días para cancelar" type="number" min="0" />
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className={styles.saveButton} disabled={loading}>{loading ? 'Guardando...' : 'Guardar cambios'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPackageModal;
