
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Pencil, Trash, Search, ExternalLink } from 'lucide-react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import UserForm from '@/components/users/UserForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Link } from 'react-router-dom';

// Mock users data - in a real app this would come from an API
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'mentor',
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

  // Only mentors can access this page
  if (user?.role !== 'mentor') {
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
    // Don't allow deleting yourself
    if (userId === user?.id) {
      toast.error(t('users.cannotDeleteSelf'));
      return;
    }
    
    setUsers(users.filter(u => u.id !== userId));
    toast.success(t('users.deleted'));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">{t('users.title')}</h1>
          <p className="text-muted-foreground">{t('users.description')}</p>
        </div>
        {!isAddingUser && !editingUser && (
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
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-gray-700">
                      <TableCell className="font-medium text-gray-300">{user.name}</TableCell>
                      <TableCell className="text-gray-300">{user.email}</TableCell>
                      <TableCell className="text-gray-300">
                        {user.role === 'mentor' ? t('users.mentor') : t('users.mentored')}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {user.mentorId ? 
                          users.find(u => u.id === user.mentorId)?.name || '-' : 
                          '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingUser(user)}
                            className="border-gray-600 hover:bg-gray-700"
                          >
                            <Pencil className="h-4 w-4 text-orange-400" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
                            className="border-gray-600 hover:bg-gray-700"
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </Button>
                          {user.role === 'mentored' && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              <Link to={`/user-stats/${user.id}`}>
                                <ExternalLink className="h-4 w-4 text-blue-400" />
                              </Link>
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
    </div>
  );
};

export default UsersPage;
