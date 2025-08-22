import { useState, useEffect } from "react";

interface SeasonBadgeImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * SeasonBadgeImage component with loading state and error handling
 * Shows a skeleton loader while the image is loading
 */
export function SeasonBadgeImage({
  src,
  alt,
  className = "",
}: SeasonBadgeImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="w-full h-32 flex items-center justify-center bg-muted/50 rounded animate-pulse">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}

      {error ? (
        <div className="w-full h-32 flex items-center justify-center text-muted-foreground bg-muted/30 rounded">
          <div className="text-center">
            <div className="text-xs">Badge not available</div>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-32 object-contain mx-auto rounded transition-opacity duration-200 ${
            loading ? "opacity-0 absolute inset-0" : "opacity-100"
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
