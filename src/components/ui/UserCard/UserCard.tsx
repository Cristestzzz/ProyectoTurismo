import React from 'react';
import './UserCard.css';

interface UserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onLogout: () => void;
}

const getInitial = (name: string) => {
  if (!name) return '?';
  return name.trim()[0].toUpperCase();
};

export const UserCard: React.FC<UserCardProps> = ({ name, email, avatarUrl, onLogout }) => {
  return (
    <div className="user-card">
      <div className="user-card__avatar">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
        ) : (
          getInitial(name)
        )}
      </div>
      <div className="user-card__name">{name}</div>
      <div className="user-card__email">{email}</div>
      <button
        className="user-card__logout"
        onClick={onLogout}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default UserCard;
