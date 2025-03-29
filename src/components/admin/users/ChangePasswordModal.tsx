
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Schema for password change
const changePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  isUpdatingPassword: boolean;
  userEmail?: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isUpdatingPassword,
  userEmail,
}) => {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit = (values: ChangePasswordFormValues) => {
    onSubmit(values.password);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Set a new password for {userEmail}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="New password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
