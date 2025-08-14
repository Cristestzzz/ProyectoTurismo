import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/public/HomePage';
import OperatorDashboard from '../pages/operator/OperatorDashboard';
import CreatePackagePage from '../pages/operator/CreatePackagePage';
import RegisterPage from '../pages/public/RegisterPage';
import LoginPage from '../pages/public/LoginPage';
import ActivityDetailPage from '../pages/public/ActivityDetailPage';
import ReviewPage from '../components/features/tourist/ReviewPage/ReviewPage'; // Importa la nueva página

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
  <Route path="/dashboard-operador" element={<OperatorDashboard />} />
  <Route path="/dashboard-operador/crear-paquete" element={<CreatePackagePage />} />
      <Route path="/activity/:id" element={<ActivityDetailPage />} />
      <Route path="/activity/:id/review" element={<ReviewPage />} /> {/* Nueva ruta */}
    </Routes>
  );
};