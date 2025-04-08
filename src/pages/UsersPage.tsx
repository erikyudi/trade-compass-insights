
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Pencil, Trash, Search, BarChart } from 'lucide-react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import UserForm from '@/components/users/UserForm';
import TraderAnalyticsModal from '@/components/users/TraderAnalyticsModal';

// Mock users data - in a real app this would come from an API
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin', // Updated to admin
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'mentored',
    mentorId: '1',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Maria Silva',
    email: 'maria@example.com',
    role: 'mentored',
    mentorId: '1',
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Trading Coach',
    email: 'coach@example.com',
    role: 'mentor',
    createdAt: new Date()
  }
];

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserForAnalytics, setSelectedUserForAnalytics] = useState<User | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  // Use admin role for demo purposes when testing
  const currentUserRole = user?.role || 'admin';

  // Only admin or mentor can access this page (should be handled by ProtectedRoute)
  if (currentUserRole !== 'mentor' && currentUserRole !== 'admin') {
    return <div>{t('users.accessDenied')}</div>;
  }

  // Filter users based on search text and role
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleUserSubmit = (userData: Partial<User>) => {
    // Only admin can create/edit users
    if (currentUserRole !== 'admin' && editingUser?.id !== user?.id) {
      toast.error(t('users.notAuthorized'));
      return;
    }

    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(u => 
        u.id === editingUser.id ? { ...u, ...userData, id: u.id } : u
      );
      setUsers(updatedUsers);
      toast.success(t('users.updated'));
      setEditingUser(null);
    } else {
      // Add new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'mentored',
        mentorId: userData.mentorId,
        createdAt: new Date()
      };
      setUsers([...users, newUser]);
      toast.success(t('users.added'));
      setIsAddingUser(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    // Only admin can delete users, and no one can delete themselves
    if (currentUserRole !== 'admin') {
      toast.error(t('users.notAuthorized'));
      return;
    }
    
    // Don't allow deleting yourself
    if (userId === user?.id) {
      toast.error(t('users.cannotDeleteSelf'));
      return;
    }
    
    setUsers(users.filter(u => u.id !== userId));
    toast.success(t('users.deleted'));
  };

  // Check if current user can edit users (only admin or self-edit)
  const canEdit = (userId: string) => {
    return currentUserRole === 'admin' || userId === user?.id;
  };

  // Check if current user can delete users (only admin)
  const canDelete = () => {
    return currentUserRole === 'admin';
  };

  // Handle opening the analytics modal
  const handleViewAnalytics = (selectedUser: User) => {
    setSelectedUserForAnalytics(selectedUser);
    setIsAnalyticsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">{t('users.title')}</h1>
          <p className="text-muted-foreground">{t('users.description')}</p>
        </div>
        {!isAddingUser && !editingUser && currentUserRole === 'admin' && (
          <Button onClick={() => setIsAddingUser(true)} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            {t('users.new')}
          </Button>
        )}
      </div>
      
      {(isAddingUser || editingUser) ? (
        <UserForm 
          user={editingUser}
          mentors={users.filter(u => u.role === 'mentor')}
          onSubmit={handleUserSubmit}
          onCancel={() => {
            setIsAddingUser(false);
            setEditingUser(null);
          }}
        />
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">{t('users.list')}</CardTitle>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('users.search')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8 bg-gray-700 border-gray-600"
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                  <SelectValue placeholder={t('users.filterByRole')} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">{t('users.allRoles')}</SelectItem>
                  <SelectItem value="admin">{t('users.admin')}</SelectItem>
                  <SelectItem value="mentor">{t('users.mentor')}</SelectItem>
                  <SelectItem value="mentored">{t('users.mentored')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow>
                  <TableHead className="text-gray-300">{t('users.name')}</TableHead>
                  <TableHead className="text-gray-300">{t('users.email')}</TableHead>
                  <TableHead className="text-gray-300">{t('users.role')}</TableHead>
                  <TableHead className="text-gray-300">{t('users.mentor')}</TableHead>
                  <TableHead className="text-gray-300">{t('users.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-400">
                      {t('users.noUsersFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((userItem) => (
                    <TableRow key={userItem.id} className="border-gray-700">
                      <TableCell className="font-medium text-gray-300">{userItem.name}</TableCell>
                      <TableCell className="text-gray-300">{userItem.email}</TableCell>
                      <TableCell className="text-gray-300">
                        {userItem.role === 'admin' ? t('users.admin') : 
                         userItem.role === 'mentor' ? t('users.mentor') : 
                         t('users.mentored')}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {userItem.mentorId ? 
                          users.find(u => u.id === userItem.mentorId)?.name || '-' : 
                          '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {canEdit(userItem.id) && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingUser(userItem)}
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              <Pencil className="h-4 w-4 text-orange-400" />
                            </Button>
                          )}
                          {canDelete() && userItem.id !== user?.id && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              <Trash className="h-4 w-4 text-red-400" />
                            </Button>
                          )}
                          {/* Open analytics in modal instead of redirect */}
                          {(userItem.role === 'mentored' || currentUserRole === 'admin') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewAnalytics(userItem)}
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              <BarChart className="h-4 w-4 text-blue-400" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Trader Analytics Modal */}
      <TraderAnalyticsModal
        user={selectedUserForAnalytics}
        isOpen={isAnalyticsModalOpen}
        onClose={() => {
          setIsAnalyticsModalOpen(false);
          setSelectedUserForAnalytics(null);
        }}
      />
    </div>
  );
};

export default UsersPage;
