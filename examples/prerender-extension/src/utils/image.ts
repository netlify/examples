/**
 * Generate a Netlify Image CDN URL
 * https://docs.netlify.com/image-cdn/overview/
 */
export const getNetlifyImageUrl = (
  src: string,
  options: {
    width?: number;
    height?: number;
    fit?: 'contain' | 'cover';
    position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  } = {}
): string => {
  // In development or if no options, return the original src
  if (Object.keys(options).length === 0) {
    return src;
  }

  const params = new URLSearchParams();

  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.fit) params.append('fit', options.fit);
  if (options.position) params.append('position', options.position);

  // Netlify Image CDN format: /.netlify/images?url=/path/to/image&w=800
  return `/.netlify/images?url=${encodeURIComponent(src)}&${params.toString()}`;
};
