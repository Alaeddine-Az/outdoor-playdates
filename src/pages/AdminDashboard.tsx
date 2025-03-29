
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, FileBarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link to="/admin/users">
          <Card className="transition-all hover:shadow-md cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>Create, update, and manage user accounts</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/signups">
          <Card className="transition-all hover:shadow-md cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Early Signups</CardTitle>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>Review and approve early access requests</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/logs">
          <Card className="transition-all hover:shadow-md cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Logs</CardTitle>
              <FileBarChart2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>Monitor system activity and events</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Admin</CardTitle>
            <CardDescription>
              Logged in as {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is the admin dashboard for GoPlayNow. You can manage users, review early signups, and monitor system activity from here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
