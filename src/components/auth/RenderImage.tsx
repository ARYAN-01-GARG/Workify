import React from 'react';

interface RenderImageProps {
  image: string,
  alt: string,
  width?: string,
  className?: string,
  title: string,
  subTitle: string
}

const RenderImage: React.FC<RenderImageProps> = ({
  image,
  alt,
  width,
  className,
  title,
  subTitle
}: RenderImageProps) => {
  return (
    <div className={`flex flex-col justify-start items-center ${className}`}>
      <div className="text-center mt-3">
        <h1 className="text-4xl font-semibold mb-1">{title}</h1>
        <p className="text-lg font-semibold">{subTitle}</p>
      </div>
      <div className="mt-4">
        <img
          src={image}
          alt={alt}
          width={width}
        />
      </div>
    </div>
  )
}

export default RenderImage