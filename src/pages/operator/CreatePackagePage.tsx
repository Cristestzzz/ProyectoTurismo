import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePackageModal from '../../components/operator/CreatePackageModal/CreatePackageModal';

const CreatePackagePage: React.FC = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate('/dashboard-operador'); // Redirige al dashboard del operador
  };

  return (
    <div>
      <CreatePackageModal open={open} onClose={handleClose} />
    </div>
  );
};

export default CreatePackagePage;