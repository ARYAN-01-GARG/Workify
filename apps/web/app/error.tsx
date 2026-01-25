'use client';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Gradients */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2'></div>

      <Card className='w-full max-w-lg bg-slate-900/50 border-slate-800 backdrop-blur-md shadow-2xl relative z-10'>
        <CardHeader className='text-center space-y-2 pb-2'>
          <div className='mx-auto h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-red-500/20'>
            <AlertTriangle className='text-red-500 h-10 w-10' />
          </div>
          <CardTitle className='text-2xl font-bold text-white'>Something went wrong</CardTitle>
          <CardDescription className='text-slate-400 text-base'>
            An unexpected error has occurred. Our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6 pt-4'>
          <div className='bg-slate-950/50 border border-slate-800 rounded-lg p-4 font-mono text-sm text-red-400 break-words'>
            {error.message || 'Unknown error occurred'}
            {error.digest && (
              <div className='mt-2 text-slate-500 text-xs pt-2 border-t border-slate-800/50'>
                Error ID: {error.digest}
              </div>
            )}
          </div>

          <div className='flex gap-3'>
            <Button className='flex-1 bg-white text-slate-950 hover:bg-slate-200 font-bold' onClick={() => reset()}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Try Again
            </Button>
            <Button
              variant='outline'
              className='flex-1 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              asChild
            >
              <Link href='/'>
                <Home className='mr-2 h-4 w-4' />
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
