import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePackageModal from '../../components/operator/CreatePackageModal/CreatePackageModal';

const CreatePackagePage: React.FC = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleSave = (data: any) => {
    // Aquí iría la lógica para enviar el paquete al backend
    console.log('Nuevo paquete:', data);
    setOpen(false);
    navigate('/dashboard-operador');
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/dashboard-operador');
  };

  return (
    <div>
      <CreatePackageModal open={open} onClose={handleClose} onSave={handleSave} />
    </div>
  );
};

export default CreatePackagePage;
