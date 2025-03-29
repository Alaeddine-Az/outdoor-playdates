
import React from 'react';
import UserManagement from '@/components/admin/UserManagement';

const AdminUsers: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagement />
    </div>
  );
};

export default AdminUsers;
