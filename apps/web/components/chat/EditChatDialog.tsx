'use client';

import type { ChatType, UpdateChatInput } from '@repo/shared-types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateChatSchema } from '@repo/shared-types/schemas';
import { Button } from '@repo/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWRInfinite from 'swr/infinite';
import { useUpdateChat } from '@/queries/chat';
import LoadingButton from '../general/LoadingButton';
import { getChatHistoryPaginationKey } from './ChatHistory';

interface EditChatProps {
  chat: ChatType;
  isOpen: boolean;
  onClose: () => void;
}

const EditChatDialog = ({ chat, isOpen, onClose }: EditChatProps) => {
  const form = useForm<UpdateChatInput>({
    resolver: zodResolver(UpdateChatSchema),
    defaultValues: {
      title: chat.title,
    },
  });

  const { mutate: updateChat, isPending } = useUpdateChat();
  const { mutate } = useSWRInfinite(getChatHistoryPaginationKey);

  useEffect(() => {
    if (isOpen) {
      form.reset({ title: chat.title });
    }
  }, [isOpen, chat.title, form]);

  const onSubmit = (data: UpdateChatInput) => {
    updateChat(
      { chatId: chat.id, body: { title: data.title } },
      {
        onSuccess: () => {
          onClose();
          mutate();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-lg overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Chat Title</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter chat title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <LoadingButton type='submit' isLoading={isPending}>
                Save
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChatDialog;
