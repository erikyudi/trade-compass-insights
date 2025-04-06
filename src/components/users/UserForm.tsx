
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { User, UserRole } from '@/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface UserFormProps {
  user: User | null;
  mentors: User[];
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  role: z.enum(['admin', 'mentor', 'mentored']),
  mentorId: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const UserForm: React.FC<UserFormProps> = ({ user, mentors, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const isEditing = !!user;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'mentored',
      mentorId: user?.mentorId || undefined
    }
  });
  
  const watchRole = form.watch('role');
  
  const handleSubmit = (data: FormValues) => {
    const userData: Partial<User> = {
      name: data.name,
      email: data.email,
      role: data.role,
      mentorId: data.role === 'mentored' ? data.mentorId : undefined
    };
    
    onSubmit(userData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? t('users.editUser') : t('users.addUser')}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('users.emailNote')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.role')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('users.selectRole')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">{t('users.admin')}</SelectItem>
                      <SelectItem value="mentor">{t('users.mentor')}</SelectItem>
                      <SelectItem value="mentored">{t('users.mentored')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchRole === 'mentored' && (
              <FormField
                control={form.control}
                name="mentorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.assignMentor')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('users.selectMentor')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mentors.map(mentor => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            {mentor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {isEditing ? t('users.saveChanges') : t('users.createUser')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default UserForm;
