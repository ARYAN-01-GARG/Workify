'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { MessageCircle } from 'lucide-react';
import type { Connection, ConnectionUser } from '@/types';

interface ConnectionCardProps {
    connection: Connection;
    currentUserId: string;
}

export function ConnectionCard({ connection, currentUserId }: ConnectionCardProps) {
    // Determine who the "other" user is
    const otherUser: ConnectionUser | undefined =
        connection.senderId === currentUserId ? connection.receiver : connection.sender;

    if (!otherUser) return null;

    return (
        <Card className='bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors'>
            <CardContent className='p-4'>
                <div className='flex items-center gap-4'>
                    <Link href={`/profile/${otherUser.id}`}>
                        <Avatar className='h-14 w-14 border-2 border-slate-700 hover:border-violet-500 transition-colors cursor-pointer'>
                            <AvatarImage src={otherUser.avatarUrl || ''} alt={otherUser.name} />
                            <AvatarFallback className='bg-slate-800 text-white font-bold'>
                                {otherUser.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>

                    <div className='flex-1 min-w-0'>
                        <Link href={`/profile/${otherUser.id}`}>
                            <h3 className='font-semibold text-white hover:text-violet-400 transition-colors truncate'>
                                {otherUser.name}
                            </h3>
                        </Link>
                        {otherUser.bio && (
                            <p className='text-sm text-slate-400 truncate'>{otherUser.bio}</p>
                        )}
                    </div>

                    <Button
                        variant='outline'
                        size='sm'
                        className='border-slate-700 hover:border-violet-500 hover:bg-violet-500/10'
                    >
                        <MessageCircle className='h-4 w-4 mr-2' />
                        Message
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
