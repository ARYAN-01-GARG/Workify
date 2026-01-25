'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Card, CardContent, CardFooter } from '@repo/ui/components/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/form';
import { AuthService } from '@/services/auth.service';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
});

type Step = 'email' | 'otp' | 'details';

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState<z.infer<typeof signupSchema> | null>(null);

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema as any),
    defaultValues: { name: '', email: '', password: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema as any),
    defaultValues: { otp: '' },
  });

  const onSignupSubmit = async (data: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      await AuthService.sendOtp(data.email);
      setSignupData(data);
      setStep('otp');
    } catch (error: any) {
      signupForm.setError('root', {
        type: 'manual',
        message: error.message || 'Failed to send OTP.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
    if (!signupData) return;
    setLoading(true);
    try {
      await AuthService.register({
        email: signupData.email,
        otp: data.otp,
        name: signupData.name,
        password: signupData.password,
      });

      // Auto login after signup
      await signIn('credentials', {
        email: signupData.email,
        password: signupData.password,
        redirect: true,
        callbackUrl: '/dashboard',
      });
    } catch (error: any) {
      if (error.message?.includes('OTP')) {
        otpForm.setError('otp', { type: 'manual', message: 'Invalid or expired OTP' });
      } else {
        // If registration failed generally, maybe go back to details?
        // But preserving state relies on `signupData` which is fine.
        // We show error on OTP step for now unless it's a "User already exists" which presumably happens at register time?
        // Actually user existence logic is in register. If user exists, we probably should have checked earlier or fail here.
        otpForm.setError('root', { type: 'manual', message: error.message || 'Registration failed.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md space-y-8'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2'>
          <Sparkles className='h-6 w-6 text-violet-500' />
          Create Account
        </h2>
        <p className='mt-2 text-sm text-slate-400'>
          {step === 'details' && 'Enter your details to get started'}
          {step === 'otp' && `Enter the code sent to ${signupData?.email}`}
        </p>
      </div>

      <Card className='bg-slate-900/50 border-slate-800 backdrop-blur-xl'>
        <CardContent className='pt-6'>
          <AnimatePresence mode='wait'>
            {step === 'details' && (
              <motion.div
                key='details'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className='space-y-4'>
                    <FormField
                      control={signupForm.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-slate-200'>Full Name</FormLabel>
                          <div className='relative'>
                            <User className='absolute left-3 top-2.5 h-5 w-5 text-slate-500' />
                            <FormControl>
                              <Input
                                placeholder='John Doe'
                                className='pl-10 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-violet-500'
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-slate-200'>Email address</FormLabel>
                          <div className='relative'>
                            <Mail className='absolute left-3 top-2.5 h-5 w-5 text-slate-500' />
                            <FormControl>
                              <Input
                                placeholder='name@company.com'
                                className='pl-10 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-violet-500'
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-slate-200'>Password</FormLabel>
                          <div className='relative'>
                            <Lock className='absolute left-3 top-2.5 h-5 w-5 text-slate-500' />
                            <FormControl>
                              <Input
                                type='password'
                                placeholder='••••••••'
                                className='pl-10 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-violet-500'
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {signupForm.formState.errors.root && (
                      <p className='text-sm text-red-500'>{signupForm.formState.errors.root.message}</p>
                    )}
                    <Button
                      type='submit'
                      className='w-full bg-violet-600 hover:bg-violet-700 text-white'
                      disabled={loading}
                    >
                      {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                      Sign Up <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key='otp'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className='space-y-4'>
                    <FormField
                      control={otpForm.control}
                      name='otp'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex items-center justify-between'>
                            <FormLabel className='text-slate-200'>Verification Code</FormLabel>
                            <button
                              type='button'
                              onClick={() => setStep('details')}
                              className='text-xs text-violet-400 hover:text-violet-300'
                            >
                              Change details
                            </button>
                          </div>
                          <div className='relative'>
                            <Lock className='absolute left-3 top-2.5 h-5 w-5 text-slate-500' />
                            <FormControl>
                              <Input
                                placeholder='123456'
                                maxLength={6}
                                className='pl-10 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-violet-500 tracking-widest font-mono'
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {otpForm.formState.errors.root && (
                      <p className='text-sm text-red-500'>{otpForm.formState.errors.root.message}</p>
                    )}
                    <Button
                      type='submit'
                      className='w-full bg-violet-600 hover:bg-violet-700 text-white'
                      disabled={loading}
                    >
                      {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                      Verify & Create Account <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className='justify-center border-t border-slate-800 pt-4'>
          <p className='text-sm text-slate-400'>
            Already have an account?{' '}
            <Link href='/login' className='text-violet-400 hover:text-violet-300 transition-colors font-medium'>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
