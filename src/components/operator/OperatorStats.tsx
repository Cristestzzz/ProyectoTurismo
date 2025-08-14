import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './OperatorStats.module.css';

export interface OperatorStatsData {
  total: number;
  activos: number;
  pendientes: number;
  accion: number;
}

const OperatorStats: React.FC = () => {
  const [stats, setStats] = useState<OperatorStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:8000/paquetes-turisticos/operador/mis-paquetes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const paquetes = res.data;
        // Calcula las estadísticas según el estado de cada paquete
        const total = paquetes.length;
        const activos = paquetes.filter((p: any) => p.estado === 'activo').length;
        const pendientes = paquetes.filter((p: any) => p.estado === 'pendiente').length;
        const accion = paquetes.filter((p: any) => p.estado === 'accion_necesaria').length;
        setStats({ total, activos, pendientes, accion });
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar las estadísticas');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loading}>Cargando estadísticas...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!stats) return null;

  return (
    <div className={styles.statsRow}>
      <div className={styles.statCard}><div className={styles.statNumber}>{stats.total}</div><div>TOTAL</div></div>
      <div className={styles.statCard}><div className={styles.statNumber}>{stats.activos}</div><div>ACTIVOS</div></div>
      <div className={styles.statCard}><div className={styles.statNumber}>{stats.pendientes}</div><div>PENDIENTES</div></div>
      <div className={styles.statCard}><div className={styles.statNumber}>{stats.accion}</div><div>ACCIÓN NECESARIA</div></div>
    </div>
  );
};

export default OperatorStats;
