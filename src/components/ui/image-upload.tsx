"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Plus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: File[];
  onChange: (files: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    if (files.length > 0) {
      const newImages = [...images, ...files].slice(0, maxImages);
      onChange(newImages);
    }
  }, [images, onChange, maxImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = [...images, ...files].slice(0, maxImages);
      onChange(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-500 group",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl" 
            : "border-white/20 dark:border-white/10 hover:border-primary/50 hover:bg-white/5"
        )}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className={cn(
            "w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500",
            isDragging ? "bg-primary text-white scale-110 rotate-12" : "bg-primary/10 text-primary group-hover:scale-110"
          )}>
            <Upload className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Drop your images here</h3>
            <p className="text-lg text-muted-foreground font-medium">
              or <span className="text-primary underline decoration-2 underline-offset-4">browse files</span> to upload
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span>JPG, PNG, WEBP</span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>MAX {maxImages} PHOTOS</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {images.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
          >
            {images.map((file, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-3xl overflow-hidden group shadow-xl"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeImage(idx)}
                    className="w-12 h-12 bg-destructive text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {idx === 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                    Main Photo
                  </div>
                )}
              </motion.div>
            ))}
            
            {images.length < maxImages && (
              <label className="aspect-square rounded-3xl border-2 border-dashed border-white/20 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black uppercase text-muted-foreground">Add More</span>
              </label>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
