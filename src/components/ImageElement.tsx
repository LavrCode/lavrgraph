import React, { useState, useEffect } from 'react';
import { useSelected, useFocused } from 'slate-react';

type ImageElementProps = {
  attributes: any;
  children: React.ReactNode;
  element: {
    type: 'image';
    url: string;
    alt?: string;
    caption?: string;
  };
};

const ImageElement: React.FC<ImageElementProps> = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const [caption, setCaption] = useState(element.caption || element.alt || '');
  
  const updateCaption = () => {
    const customEvent = new CustomEvent('update-image-caption', {
      detail: { element, caption }
    });
    document.dispatchEvent(customEvent);
  };
  
  useEffect(() => {
    setCaption(element.caption || element.alt || '');
  }, [element.caption, element.alt]);
  
  return (
    <div {...attributes} contentEditable={false}>
      <div
        contentEditable={false}
        className={`relative my-6 flex flex-col items-center ${
          selected && focused ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-700'
        }`}
      >
        <div className="rounded-lg overflow-hidden shadow-md max-w-lg mx-auto">
          <img
            src={element.url}
            alt={element.alt || 'Embedded image'}
            className="max-w-full h-auto object-contain"
          />
        </div>
        <div className="flex justify-center mt-2 w-full">
          <input
            className="text-xs dark:text-gray-400 italic bg-transparent border-b border-transparent focus:border-indigo-400 text-center w-full max-w-md px-2 py-1 outline-none"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={updateCaption}
            placeholder="Добавьте подпись к изображению..."
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default ImageElement; 