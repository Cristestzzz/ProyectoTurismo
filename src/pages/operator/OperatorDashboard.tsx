import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './OperatorDashboard.module.css';
import OperatorStats from '../../components/operator/OperatorStats';
import UserCard from '../../components/ui/UserCard/UserCard';
import ProfileCompletionModal from '../../components/operator/ProfileCompletionModal/ProfileCompletionModal';
import { useNavigate } from 'react-router-dom';

const OperatorDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [paquetes, setPaquetes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:8000/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        // Verificar campos obligatorios
        const required = [
          'nombre', 'apellido', 'email', 'telefono', 'pais', 'ciudad', 'direccion', 'codigo_postal', 'descripcion_perfil'
        ];
        const missing = required.some(field => !data[field] || data[field].toString().trim() === '');
        setShowProfileModal(missing);
      })
      .catch(() => {
        setUser({ nombre: 'Operador', email: '' });
      });

    // Obtener paquetes turísticos del operador
    axios.get('http://localhost:8000/paquetes-turisticos/operador/mis-paquetes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setPaquetes(res.data))
      .catch(() => setPaquetes([]));
  }, []);

  const handleProfileSave = (formData: any) => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/usuarios/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setShowProfileModal(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAvatarClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleCreatePackage = () => {
    navigate('/dashboard-operador/crear-paquete');
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Bienvenido a tu Dashboard</h1>
        <p>Gestiona Paquetes Turísticos</p>
      </header>
      <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 1100 }}>
        {user && (
          <UserCard
            name={user.nombre || user.name}
            email={user.email}
            avatarUrl={user.avatar_url || user.avatarUrl}
            onLogout={handleLogout}
            expanded={expanded}
            onAvatarClick={handleAvatarClick}
          />
        )}
      </div>
      <ProfileCompletionModal open={showProfileModal} user={user || {}} onSave={handleProfileSave} />
      <OperatorStats />
      <div className={styles.actionsRow}>
        <button className={styles.actionButton}>Buscar</button>
        <button className={styles.actionButton}>Ver todos</button>
        <button className={styles.actionButton} onClick={handleCreatePackage}>Crear nuevo paquete turístico</button>
      </div>
      <div className={styles.cardsRow}>
        {paquetes.length === 0 ? (
          <div>No tienes paquetes turísticos creados aún.</div>
        ) : (
          paquetes.map((p) => (
            <div className={styles.propertyCard} key={p.id}>
              <img src={p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'} alt={p.titulo} />
              <div className={styles.cardInfo}>
                <div className={styles.cardTitle}>{p.titulo}</div>
                <div className={
                  styles.cardStatus + ' ' +
                  (p.estado === 'activo' ? styles.active :
                   p.estado === 'pendiente' ? styles.pending :
                   p.estado === 'accion_necesaria' ? styles.action : '')
                }>
                  {p.estado === 'activo' ? 'Activo' :
                   p.estado === 'pendiente' ? 'Pendiente' :
                   p.estado === 'accion_necesaria' ? 'Acción necesaria' : p.estado}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OperatorDashboard;
