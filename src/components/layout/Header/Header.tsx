import './Header.css';
import { LuSearch, LuMenu, LuUser, LuPhone } from 'react-icons/lu';
import UserCard from '../../ui/UserCard/UserCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  isHomePage?: boolean;
  onUserLoaded?: (user: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ isHomePage, onUserLoaded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/LoginPage';
  const [user, setUser] = useState<any>(null);
  const [userPanelOpen, setUserPanelOpen] = useState(false);
  // Destructurar onUserLoaded correctamente

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8000/usuarios/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setUser(res.data);
          if (typeof onUserLoaded === 'function') onUserLoaded(res.data);
        })
        .catch(() => setUser(null));
    } else {
      setUser(null);
      if (typeof onUserLoaded === 'function') onUserLoaded(null);
    }
  }, [localStorage.getItem('token')]);

  // Cierra el panel al hacer click fuera
  useEffect(() => {
    if (!userPanelOpen) return;
    const handleClick = (e: MouseEvent) => {
      const panel = document.querySelector('.user-card__panel');
      if (panel && !panel.contains(e.target as Node)) {
        setUserPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userPanelOpen]);

  const handleUserIconClick = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserPanelOpen(false);
    navigate('/login');
  };

  const headerStyle = {
    backgroundColor: isHomePage ? 'transparent' : 'var(--color-deep-blue)',
  };

  return (
    <header className="header" style={headerStyle}>
      <div className="header-left">
        <div className="logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <span className="logo-text">KANDAMO</span>
          <span className="logo-icon"></span> {/* Icono rosa */}
        </div>
      </div>
      <nav className="header-nav">
        <a href="#" className="nav-link"><LuSearch size={20} /></a>
        <a href="#" className="nav-link">DESTINOS</a>
        <a href="#" className="nav-link">EXPERIENCIAS</a>
        <a href="#" className="nav-link">ACERCA DE</a>
        <a href="#" className="nav-link"><LuMenu size={20} /></a>
      </nav>
      <div className="header-right">
        <span className="phone-number"><LuPhone size={16} /> +51 987471463</span>
        {user ? (
          <div style={{position: 'relative', display: 'inline-block'}}>
            <UserCard
              name={user.nombre || user.name || user.email || ''}
              email={user.email}
              avatarUrl={user.avatar_url || user.avatarUrl || undefined}
              onLogout={handleLogout}
              expanded={userPanelOpen}
             
              onAvatarClick={() => setUserPanelOpen((open) => !open)}
            />
          </div>
        ) : (
          <a href="#" className="user-icon" onClick={handleUserIconClick}><LuUser size={20} /></a>
        )}
        
      </div>
    </header>
  );
};
