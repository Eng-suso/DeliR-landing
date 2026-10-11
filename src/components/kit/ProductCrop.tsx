type CropRegion = {
  /** Visible region in intrinsic image pixels. The frame takes its aspect ratio. */
  x: number;
  y: number;
  w: number;
  h: number;
};

type ProductCropProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  region: CropRegion;
  priority?: boolean;
  className?: string;
};

// Zooms a product screenshot onto the detail that matters instead of framing the whole screen.
export default function ProductCrop({ src, alt, width, height, region, priority = false, className = '' }: ProductCropProps) {
  return (
    <div className={`overflow-hidden bg-white ${className}`}>
      <div className="relative w-full" style={{ aspectRatio: `${region.w} / ${region.h}` }}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          style={{
            width: `${(width / region.w) * 100}%`,
            transform: `translate(${(-region.x / width) * 100}%, ${(-region.y / height) * 100}%)`,
          }}
          className="absolute left-0 top-0 h-auto max-w-none"
        />
      </div>
    </div>
  );
}
