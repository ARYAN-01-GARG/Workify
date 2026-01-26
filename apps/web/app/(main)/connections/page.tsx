'use client';

import { useState } from 'react';
import { Users, Clock, Loader2, UserX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { useSession } from 'next-auth/react';
import { useConnections, usePendingConnections } from '@/hooks/use-connections';
import { ConnectionCard } from '@/components/connections/ConnectionCard';
import { PendingRequestCard } from '@/components/connections/PendingRequestCard';

export default function ConnectionsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('connections');

    const { data: connections, isLoading: isLoadingConnections, error: connectionsError } = useConnections();
    const { data: pendingRequests, isLoading: isLoadingPending, error: pendingError } = usePendingConnections();

    const currentUserId = session?.user?.id ?? '';
    const pendingCount = pendingRequests?.length ?? 0;

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-white'>My Network</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='bg-slate-900/50 border border-slate-800 p-1'>
                    <TabsTrigger
                        value='connections'
                        className='data-[state=active]:bg-violet-600 data-[state=active]:text-white'
                    >
                        <Users className='h-4 w-4 mr-2' />
                        Connections
                        {connections?.length ? (
                            <span className='ml-2 text-xs bg-slate-700 px-2 py-0.5 rounded-full'>
                                {connections.length}
                            </span>
                        ) : null}
                    </TabsTrigger>
                    <TabsTrigger
                        value='pending'
                        className='data-[state=active]:bg-violet-600 data-[state=active]:text-white'
                    >
                        <Clock className='h-4 w-4 mr-2' />
                        Requests
                        {pendingCount > 0 && (
                            <span className='ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full'>
                                {pendingCount}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Connections Tab */}
                <TabsContent value='connections' className='mt-6'>
                    {isLoadingConnections ? (
                        <div className='flex items-center justify-center py-12'>
                            <Loader2 className='h-8 w-8 text-violet-500 animate-spin' />
                        </div>
                    ) : connectionsError ? (
                        <Card className='bg-red-500/10 border-red-500/20'>
                            <CardContent className='p-6 text-center text-red-500'>
                                Failed to load connections. Please try again.
                            </CardContent>
                        </Card>
                    ) : !connections?.length ? (
                        <Card className='bg-slate-900/50 border-slate-800'>
                            <CardContent className='p-12 text-center'>
                                <div className='h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <UserX className='h-8 w-8 text-slate-500' />
                                </div>
                                <h3 className='text-lg font-medium text-white mb-2'>No connections yet</h3>
                                <p className='text-slate-400 text-sm'>
                                    Start building your network by sending connection requests!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className='grid gap-4 md:grid-cols-2'>
                            {connections.map((connection) => (
                                <ConnectionCard key={connection.id} connection={connection} currentUserId={currentUserId} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Pending Requests Tab */}
                <TabsContent value='pending' className='mt-6'>
                    {isLoadingPending ? (
                        <div className='flex items-center justify-center py-12'>
                            <Loader2 className='h-8 w-8 text-violet-500 animate-spin' />
                        </div>
                    ) : pendingError ? (
                        <Card className='bg-red-500/10 border-red-500/20'>
                            <CardContent className='p-6 text-center text-red-500'>
                                Failed to load pending requests. Please try again.
                            </CardContent>
                        </Card>
                    ) : !pendingRequests?.length ? (
                        <Card className='bg-slate-900/50 border-slate-800'>
                            <CardContent className='p-12 text-center'>
                                <div className='h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <Clock className='h-8 w-8 text-slate-500' />
                                </div>
                                <h3 className='text-lg font-medium text-white mb-2'>No pending requests</h3>
                                <p className='text-slate-400 text-sm'>When someone sends you a connection request, it will appear here.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className='space-y-4'>
                            {pendingRequests.map((request) => (
                                <PendingRequestCard key={request.id} connection={request} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
