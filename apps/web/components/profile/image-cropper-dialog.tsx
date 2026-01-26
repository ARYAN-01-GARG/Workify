'use client';

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { Slider } from '@repo/ui/components/slider';
import { ZoomIn, ZoomOut, RotateCw, Check, X, Loader2 } from 'lucide-react';

interface ImageCropperDialogProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: Blob) => Promise<void>;
  aspectRatio?: number;
  cropShape?: 'round' | 'rect';
  title?: string;
}

// Helper to create cropped image from canvas
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Set canvas size to desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Get as blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      },
      'image/jpeg',
      0.9,
    );
  });
}

export function ImageCropperDialog({
  open,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
  cropShape = 'round',
  title = 'Crop Profile Picture',
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      await onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const dialogWidth = aspectRatio > 1 ? 'sm:max-w-[600px]' : 'sm:max-w-[500px]';
  const cropperHeight = aspectRatio > 1 ? 'h-[250px]' : 'h-[350px]';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={`${dialogWidth} bg-slate-950 border-slate-800`}>
        <DialogHeader>
          <DialogTitle className='text-white'>{title}</DialogTitle>
        </DialogHeader>

        <div className={`relative ${cropperHeight} bg-slate-900 rounded-lg overflow-hidden`}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={cropShape === 'rect'}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        <div className='space-y-4 pt-2'>
          {/* Zoom Control */}
          <div className='flex items-center gap-4'>
            <ZoomOut className='h-4 w-4 text-slate-400' />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0] ?? 1)}
              className='flex-1'
            />
            <ZoomIn className='h-4 w-4 text-slate-400' />
          </div>

          {/* Rotation Button */}
          <div className='flex justify-center'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={handleRotate}
              className='bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            >
              <RotateCw className='h-4 w-4 mr-2' />
              Rotate
            </Button>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isProcessing}
            className='bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
          >
            <X className='h-4 w-4 mr-2' />
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleConfirm}
            disabled={isProcessing}
            className='bg-violet-600 hover:bg-violet-700 text-white'
          >
            {isProcessing ? <Loader2 className='h-4 w-4 mr-2 animate-spin' /> : <Check className='h-4 w-4 mr-2' />}
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
