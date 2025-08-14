import React from 'react';
import './UserCard.css';

interface UserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onLogout: () => void;
  expanded?: boolean;
  // onClose eliminado, ya no se usa
  onAvatarClick?: () => void;
}

const getInitial = (name: string) => {
  if (!name) return '?';
  return name.trim()[0].toUpperCase();
};

export const UserCard: React.FC<UserCardProps> = ({ name, email, avatarUrl, onLogout, expanded = false, onAvatarClick }) => {
  return (
    <>
      <div className="user-card__avatar" style={{cursor: 'pointer'}} onClick={onAvatarClick}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%'}} />
        ) : (
          <span style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', borderRadius: '50%', fontSize: '1.5rem', fontWeight: 'bold'}}>{getInitial(name)}</span>
        )}
      </div>
      {expanded && (
        <div className="user-card__panel" style={{position: 'fixed', top: '20px', right: '20px', zIndex: 1000, background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '32px 24px', minWidth: '220px'}}>
          <div className="user-card__avatar" style={{margin: '0 auto 12px auto', width: '60px', height: '60px'}}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
            ) : (
              <span style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', borderRadius: '50%', fontSize: '2rem', fontWeight: 'bold'}}>{getInitial(name)}</span>
            )}
          </div>
          <div className="user-card__name" style={{textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem'}}>{name}</div>
          <div className="user-card__email" style={{textAlign: 'center', color: '#666', marginBottom: '16px'}}>{email}</div>
          <button
            className="user-card__logout"
            style={{width: '100%', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer'}}
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </>
  );
};

export default UserCard;
