'use client';

import { useParams, useRouter } from 'next/navigation';
import { useApplication, useUpdateApplicationStatus } from '@/hooks/use-application';
import { useAuth } from '@/contexts/AuthContext';
import { ApplicationStatus } from '@/types/application';
import { Button } from '@repo/ui/components/button';
import { Badge } from '@repo/ui/components/badge';
import { Skeleton } from '@repo/ui/components/skeleton';
import { InterviewList } from '@/components/applications/InterviewList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { ArrowLeft, Mail, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { format } from 'date-fns';

export default function ApplicationDetailPage() {
  const { id: jobId, appId } = useParams();
  const router = useRouter();
  const user = useAuth();

  const jId = Array.isArray(jobId) ? jobId[0] : jobId;
  const aId = Array.isArray(appId) ? appId[0] : appId;

  const { data: application, isLoading, isError } = useApplication(jId!, aId!);
  const updateStatus = useUpdateApplicationStatus(jId!, aId!);

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-5xl py-8 px-4 space-y-6'>
        <Skeleton className='h-8 w-48' />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            <Skeleton className='h-64 rounded-xl' />
            <Skeleton className='h-96 rounded-xl' />
          </div>
          <div className='space-y-6'>
            <Skeleton className='h-72 rounded-xl' />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center'>
        <h2 className='text-2xl font-bold mb-4'>Application Not Found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const isRecruiter = user?.role === 'RECRUITER';
  const isCandidate = user?.role === 'CANDIDATE';

  const handleStatusChange = (status: ApplicationStatus) => {
    updateStatus.mutate(status);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.REVIEWING:
        return 'bg-purple-100 text-purple-800';
      case ApplicationStatus.SHORTLISTED:
        return 'bg-amber-100 text-amber-800';
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ApplicationStatus.WITHDRAWN:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='min-h-screen bg-muted/10'>
      <div className='bg-background border-b'>
        <div className='container mx-auto max-w-5xl py-6 px-4'>
          <Button variant='ghost' className='mb-4 -ml-2' onClick={() => router.back()}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>

          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>Application for {application.job.title}</h1>
              <div className='flex items-center gap-4 text-muted-foreground mt-2 text-sm'>
                <span className='flex items-center gap-1'>
                  <Briefcase className='h-3 w-3' />
                  {application.job.company?.name || 'Company'}
                </span>
                <span className='flex items-center gap-1'>
                  <MapPin className='h-3 w-3' />
                  {application.job.location}
                </span>
                <span className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  Applied {format(new Date(application.appliedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <Badge className={`px-3 py-1 text-sm ${getStatusColor(application.status)}`}>{application.status}</Badge>

              {isCandidate && application.status === ApplicationStatus.PENDING && (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleStatusChange(ApplicationStatus.WITHDRAWN)}
                  disabled={updateStatus.isPending}
                >
                  Withdraw Application
                </Button>
              )}

              {isRecruiter && (
                <div className='w-[200px]'>
                  <Select
                    value={application.status}
                    onValueChange={(val) => handleStatusChange(val as ApplicationStatus)}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Update Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ApplicationStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={ApplicationStatus.REVIEWING}>Reviewing</SelectItem>
                      <SelectItem value={ApplicationStatus.SHORTLISTED}>Shortlisted</SelectItem>
                      <SelectItem value={ApplicationStatus.ACCEPTED}>Accepted</SelectItem>
                      <SelectItem value={ApplicationStatus.REJECTED}>Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto max-w-5xl py-8 px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            {/* Applicant Info (Visible to Recruiter) */}
            {isRecruiter && (
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-start gap-4'>
                    <Avatar className='h-16 w-16'>
                      <AvatarImage src={application.candidateProfile.user.avatarUrl} />
                      <AvatarFallback>{application.candidateProfile.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h3 className='font-semibold text-lg'>{application.candidateProfile.user.name}</h3>
                      <div className='flex items-center gap-2 text-muted-foreground'>
                        <Mail className='h-4 w-4' />
                        <span>{application.candidateProfile.user.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cover Letter */}
            {application.coverLetter && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='whitespace-pre-wrap text-sm leading-relaxed'>{application.coverLetter}</p>
                </CardContent>
              </Card>
            )}

            {/* Resume */}
            {application.resumeId && (
              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>Attached resume for this application</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='outline' className='w-full'>
                    View Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className='space-y-8'>
            {/* Interview Pipeline */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg px-1'>Interview Process</h3>
              <InterviewList interviews={application.interviews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
