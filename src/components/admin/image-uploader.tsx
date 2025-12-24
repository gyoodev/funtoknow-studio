'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Progress } from '../ui/progress';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  initialUrl?: string;
}

export function ImageUploader({ onUpload, initialUrl }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast({
        title: 'Upload Error',
        description: 'ImgBB API key is not configured.',
        variant: 'destructive',
      });
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.imgbb.com/1/upload?key=${apiKey}`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percentCompleted);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const imageUrl = response.data.url;
          setPreview(imageUrl);
          onUpload(imageUrl);
          toast({ title: 'Upload Successful', description: 'Image has been uploaded.' });
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          throw new Error(errorResponse?.error?.message || 'Failed to upload image.');
        }
        setIsUploading(false);
      };
      
      xhr.onerror = () => {
        throw new Error('Network error during upload.');
      };

      xhr.send(formData);

    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.jpg'] },
    multiple: false,
  });
  
  const handleClear = () => {
    setPreview(null);
    onUpload(''); 
  }

  if (preview) {
    return (
        <div className="relative group w-full aspect-video rounded-md border p-2">
            <Image src={preview} alt="Image preview" fill className="object-contain rounded-md" />
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button type="button" variant="destructive" size="icon" onClick={handleClear}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </div>
        </div>
    );
  }

  if (isUploading) {
    return (
        <div className="flex flex-col items-center justify-center h-32 w-full rounded-md border border-dashed">
            <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
            <Progress value={uploadProgress} className="w-3/4 mt-2" />
        </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`flex items-center justify-center h-32 w-full rounded-md border-2 border-dashed cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-accent' : 'border-input hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center text-muted-foreground">
        <FontAwesomeIcon icon={faUpload} className="h-6 w-6 mx-auto mb-2" />
        <p className="text-sm">
          {isDragActive ? 'Drop the image here...' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );
}
