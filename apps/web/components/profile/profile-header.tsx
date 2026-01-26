'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Camera, Edit2, MapPin, Link as LinkIcon, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ConnectButton } from '@/components/connections/ConnectButton';
import { UploadService } from '@/services/upload.service';
import { UserService } from '@/services/user.service';
import { ImageCropperDialog } from './image-cropper-dialog';
import type { UserProfile } from '@/types';

interface ProfileHeaderProps {
  user: UserProfile;
  isOwnProfile: boolean;
  onEditClick?: () => void;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
  onCoverUpdate?: (newCoverUrl: string) => void;
}

export function ProfileHeader({ user, isOwnProfile, onEditClick, onAvatarUpdate, onCoverUpdate }: ProfileHeaderProps) {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [coverUrl, setCoverUrl] = useState(user.coverUrl || '');
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [showCoverCropper, setShowCoverCropper] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState<'avatar' | 'cover'>('avatar');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const headline =
    user.candidateProfile?.headline ||
    (user.recruiterProfile?.company?.name ? `Recruiter at ${user.recruiterProfile.company.name}` : user.role);

  const connectionCount = (user._count?.sentRequests || 0) + (user._count?.receivedRequests || 0);
  const location = user.location;
  const website = user.website;

  const handleAvatarClick = () => {
    if (isOwnProfile && avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleCoverClick = () => {
    if (isOwnProfile && coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
      setCropMode(type);
      if (type === 'avatar') {
        setShowAvatarCropper(true);
      } else {
        setShowCoverCropper(true);
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    event.target.value = '';
  };

  const handleAvatarCropComplete = async (croppedBlob: Blob) => {
    setIsUploadingAvatar(true);
    try {
      const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
      const uploadResult = await UploadService.uploadFile(file, 'avatars');
      await UserService.updateAvatar(uploadResult.url);
      setAvatarUrl(uploadResult.url);
      onAvatarUpdate?.(uploadResult.url);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile picture');
    } finally {
      setIsUploadingAvatar(false);
      setSelectedImageSrc(null);
    }
  };

  const handleCoverCropComplete = async (croppedBlob: Blob) => {
    setIsUploadingCover(true);
    try {
      const file = new File([croppedBlob], 'cover.jpg', { type: 'image/jpeg' });
      const uploadResult = await UploadService.uploadFile(file, 'covers');
      await UserService.updateCover(uploadResult.url);
      setCoverUrl(uploadResult.url);
      onCoverUpdate?.(uploadResult.url);
      toast.success('Cover image updated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update cover image');
    } finally {
      setIsUploadingCover(false);
      setSelectedImageSrc(null);
    }
  };

  return (
    <>
      <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg shadow-black/20'>
        {/* Hidden file inputs */}
        <input
          ref={avatarInputRef}
          type='file'
          accept='image/jpeg,image/png,image/gif,image/webp'
          onChange={(e) => handleFileSelect(e, 'avatar')}
          className='hidden'
        />
        <input
          ref={coverInputRef}
          type='file'
          accept='image/jpeg,image/png,image/gif,image/webp'
          onChange={(e) => handleFileSelect(e, 'cover')}
          className='hidden'
        />

        {/* Cover Image */}
        <div
          className='h-48 relative overflow-hidden group'
          style={{
            background: coverUrl
              ? `url(${coverUrl}) center/cover no-repeat`
              : 'linear-gradient(to right, #7c3aed, #4f46e5, #2563eb)'
          }}
        >
          {!coverUrl && (
            <>
              <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] opacity-30 mix-blend-overlay'></div>
            </>
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
          {isOwnProfile && (
            <Button
              variant='ghost'
              size='icon'
              onClick={handleCoverClick}
              disabled={isUploadingCover}
              className='absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity'
            >
              {isUploadingCover ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Camera className='h-4 w-4' />
              )}
            </Button>
          )}
        </div>

        {/* Profile Info */}
        <div className='px-6 pb-6 relative'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end -mt-16 mb-4 gap-4'>
            <div className='relative'>
              <Avatar className='h-32 w-32 border-4 border-slate-950 shadow-xl ring-2 ring-slate-800'>
                <AvatarImage src={avatarUrl} alt={user.name} />
                <AvatarFallback className='bg-slate-800 text-violet-400 text-4xl font-bold'>
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                  className='absolute bottom-0 right-0 bg-slate-800 hover:bg-slate-700 text-white rounded-full h-8 w-8 border border-slate-700'
                >
                  {isUploadingAvatar ? (
                    <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  ) : (
                    <Camera className='h-3.5 w-3.5' />
                  )}
                </Button>
              )}
            </div>

            <div className='flex gap-2 sm:mb-2'>
              {isOwnProfile ? (
                <Button
                  variant='outline'
                  onClick={onEditClick}
                  className='bg-slate-900/50 border-slate-700 text-slate-200 hover:text-white hover:border-violet-500 hover:bg-violet-500/10'
                >
                  <Edit2 className='h-4 w-4 mr-2' />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <ConnectButton
                    userId={user.id}
                    connectionStatus={user.connectionStatus}
                    connectionId={user.connectionId}
                  />
                  <Button
                    variant='outline'
                    className='bg-slate-900/50 border-slate-700 text-slate-200 hover:text-white hover:border-slate-600'
                  >
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className='space-y-3'>
            <div>
              <h1 className='text-2xl font-bold text-white'>{user.name}</h1>
              <p className='text-slate-400 mt-1'>{headline}</p>
            </div>

            {user.bio && <p className='text-slate-300 text-sm'>{user.bio}</p>}

            <div className='flex flex-wrap gap-4 text-sm text-slate-500'>
              {location && (
                <div className='flex items-center gap-1'>
                  <MapPin className='h-4 w-4' />
                  <span>{location}</span>
                </div>
              )}
              {website && (
                <div className='flex items-center gap-1'>
                  <LinkIcon className='h-4 w-4' />
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-violet-400 hover:underline'
                  >
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                <span>Joined {user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently'}</span>
              </div>
            </div>

            <div className='flex gap-6 pt-2'>
              <Link href='/connections' className='text-sm hover:opacity-80 transition-opacity'>
                <span className='font-bold text-white'>{connectionCount}</span>
                <span className='text-slate-500 ml-1'>connections</span>
              </Link>
              <div className='text-sm'>
                <span className='font-bold text-white'>{user._count?.posts || 0}</span>
                <span className='text-slate-500 ml-1'>posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Cropper Dialog */}
      {selectedImageSrc && cropMode === 'avatar' && (
        <ImageCropperDialog
          open={showAvatarCropper}
          onClose={() => {
            setShowAvatarCropper(false);
            setSelectedImageSrc(null);
          }}
          imageSrc={selectedImageSrc}
          onCropComplete={handleAvatarCropComplete}
        />
      )}

      {/* Cover Cropper Dialog */}
      {selectedImageSrc && cropMode === 'cover' && (
        <ImageCropperDialog
          open={showCoverCropper}
          onClose={() => {
            setShowCoverCropper(false);
            setSelectedImageSrc(null);
          }}
          imageSrc={selectedImageSrc}
          onCropComplete={handleCoverCropComplete}
          aspectRatio={3}
          cropShape="rect"
          title="Crop Cover Image"
        />
      )}
    </>
  );
}
