'use client';

import { useState } from 'react';
import { useResumes, useUploadResume, useDeleteResume } from '@/hooks/use-resume';
import { useApplyJob } from '@/hooks/use-jobs';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { Label } from '@repo/ui/components/label';
import { Textarea } from '@repo/ui/components/textarea';
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/radio-group';
import { Loader2, Plus, Trash2, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ApplyJobDialogProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyJobDialog({ jobId, jobTitle, open, onOpenChange }: ApplyJobDialogProps) {
  const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>();
  const [coverLetter, setCoverLetter] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: resumes, isLoading: isLoadingResumes } = useResumes();
  const { mutate: uploadResume } = useUploadResume();
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();
  const { mutate: applyJob, isPending: isApplying } = useApplyJob();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    setIsUploading(true);
    uploadResume(file, {
      onSuccess: (resume) => {
        setIsUploading(false);
        setSelectedResumeId(resume.id);
        toast.success('Resume uploaded');
      },
      onError: () => {
        setIsUploading(false);
        toast.error('Failed to upload resume');
      },
    });
  };

  const handleDeleteResume = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteResume(id, {
      onSuccess: () => {
        if (selectedResumeId === id) setSelectedResumeId(undefined);
        toast.success('Resume deleted');
      },
      onError: () => toast.error('Failed to delete resume'),
    });
  };

  const handleSubmit = () => {
    applyJob(
      { id: jobId, data: { resumeId: selectedResumeId, coverLetter } },
      {
        onSuccess: () => {
          toast.success('Applied successfully!');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Failed to apply');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>Select a resume and review your application details.</DialogDescription>
        </DialogHeader>

        <div className='grid gap-6 py-4'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Label className='text-base font-semibold'>Resume</Label>
              <div className='relative'>
                <input
                  type='file'
                  accept='.pdf'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed'
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <Button variant='outline' size='sm' className='h-8 gap-1' disabled={isUploading}>
                  {isUploading ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Plus className='w-3.5 h-3.5' />}
                  Add Resume
                </Button>
              </div>
            </div>

            {isLoadingResumes ? (
              <div className='flex justify-center p-4'>
                <Loader2 className='animate-spin text-muted-foreground' />
              </div>
            ) : !resumes?.length ? (
              <div className='text-center p-8 border border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/50'>
                <Upload className='w-8 h-8 mx-auto text-muted-foreground mb-3' />
                <p className='text-sm text-muted-foreground'>No resumes found. Upload one to apply.</p>
              </div>
            ) : (
              <RadioGroup value={selectedResumeId} onValueChange={setSelectedResumeId} className='grid gap-2'>
                {resumes.map((resume) => (
                  <div key={resume.id} className='relative'>
                    <RadioGroupItem value={resume.id} id={resume.id} className='peer sr-only' />
                    <Label
                      htmlFor={resume.id}
                      className='flex items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400'>
                          <FileText className='w-4 h-4' />
                        </div>
                        <div className='grid gap-1'>
                          <span className='font-medium'>{resume.name}</span>
                          <span className='text-xs text-muted-foreground'>
                            PDF • {(resume.size / 1024 / 1024).toFixed(2)} MB •{' '}
                            {new Date(resume.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        type='button'
                        className='h-8 w-8 text-muted-foreground hover:text-destructive'
                        onClick={(e) => handleDeleteResume(resume.id, e)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Trash2 className='w-4 h-4' />}
                      </Button>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <div className='space-y-2'>
            <Label>Cover Letter (Optional)</Label>
            <Textarea
              placeholder='Why are you a good fit for this role?'
              className='min-h-[100px]'
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isApplying || !selectedResumeId || isUploading}>
            {isApplying ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Applying...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
