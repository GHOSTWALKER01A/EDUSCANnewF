
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ModalBase from '../ModalBase';

export default function FullscreenImage({ open,src, alt, onClose }:
  { open: boolean; src: string; alt?: string; onClose: () => void; }) {

  if (!open) return null;
  return (
    <ModalBase open={open} title={undefined} onClose={onClose}>
      <div className="flex flex-col items-end">
        <button onClick={onClose} aria-label="Close"
         className="mb-2 px-3 py-1 rounded bg-red-600 text-white">X</button>
      </div>
      <div className="w-full h-[70vh] flex items-center justify-center">
        <TransformWrapper initialScale={1}>
          <TransformComponent>
            
            <img src={src} alt={alt || 'Attachment'} 
            className="max-h-[70vh] max-w-full object-contain" />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </ModalBase>
  );
}
