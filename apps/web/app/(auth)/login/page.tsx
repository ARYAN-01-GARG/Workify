import { LoginForm } from '@/components/auth/login-form';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen w-full bg-slate-950 text-white overflow-hidden'>
      {/* Left Panel - Hero / Brand */}
      <div className='relative hidden w-1/2 flex-col justify-between bg-slate-950 p-12 lg:flex'>
        {/* Background Effects */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-violet-600/20 blur-[120px]' />
          <div className='absolute -bottom-1/4 -right-1/4 h-[800px] w-[800px] rounded-full bg-cyan-500/10 blur-[120px]' />
          <div className='absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[80px]' />
        </div>

        {/* Content */}
        <div className='relative z-10'>
          <div className='flex items-center gap-2 text-2xl font-bold tracking-tighter'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600'>
              <Sparkles className='h-5 w-5 text-white' />
            </div>
            Workify
          </div>
        </div>

        <div className='relative z-10 max-w-lg'>
          <h1 className='text-5xl font-bold tracking-tight leading-tight'>
            Connect with the <span className='text-violet-400'>future</span> of work.
          </h1>
          <p className='mt-6 text-lg text-slate-400'>
            Join thousands of professionals and companies building the next generation of products. Experience a
            recruitment platform designed for the modern era.
          </p>
        </div>

        <div className='relative z-10 flex items-center gap-4 text-sm text-slate-500'>
          <p>© 2024 Workify Inc.</p>
          <div className='h-1 w-1 rounded-full bg-slate-700' />
          <p>Privacy Policy</p>
          <div className='h-1 w-1 rounded-full bg-slate-700' />
          <p>Terms of Service</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className='flex w-full flex-col justify-center items-center bg-slate-950 p-8 lg:w-1/2'>
        <div className='relative z-10 w-full max-w-md'>
          {/* Mobile Logo */}
          <div className='flex lg:hidden justify-center mb-8'>
            <div className='flex items-center gap-2 text-xl font-bold tracking-tighter'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600'>
                <Sparkles className='h-5 w-5 text-white' />
              </div>
              Workify
            </div>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
