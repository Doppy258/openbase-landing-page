type StaticImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
};

/** Static asset from /public — no Next.js image optimization (keeps dev memory low). */
export default function StaticImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
}: StaticImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
