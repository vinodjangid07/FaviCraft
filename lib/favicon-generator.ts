export interface FaviconResult {
  urls: Record<number, string>;
  htmlCode: string;
}

const FAVICON_SIZES = [16, 32, 48, 57, 60, 72, 76, 96, 114, 120, 144, 152, 180, 192, 512];

export async function generateFavicons(file: File): Promise<FaviconResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const urls: Record<number, string> = {};
        
        FAVICON_SIZES.forEach(size => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          
          canvas.width = size;
          canvas.height = size;
          
          ctx.clearRect(0, 0, size, size);
          
          const scale = Math.min(size / img.width, size / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (size - scaledWidth) / 2;
          const y = (size - scaledHeight) / 2;
          
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          canvas.toBlob((blob) => {
            if (blob) {
              urls[size] = URL.createObjectURL(blob);
            }
          }, 'image/png', 1.0);
        });
        
        const htmlCode = generateHtmlCode();
        setTimeout(() => {
          resolve({ urls, htmlCode });
        }, 100);
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load the image
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function generateHtmlCode(): string {
  return `<!-- Standard favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">

<!-- Apple Touch Icons (iOS & macOS) -->
<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">

<!-- Android/Chrome (PWA) -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#8b5cf6">

<!-- Windows 8/10/11 Tiles -->
<meta name="msapplication-TileImage" content="/favicon-144x144.png">
<meta name="msapplication-TileColor" content="#8b5cf6">
<meta name="msapplication-config" content="/browserconfig.xml">

<!-- Safari Pinned Tab -->
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#8b5cf6">`;
}

export async function downloadAllFavicons(urls: Record<number, string>): Promise<void> {
  const downloads = [
    // png formats
    { url: urls[16], name: 'favicon-16x16.png' },
    { url: urls[32], name: 'favicon-32x32.png' },
    { url: urls[48], name: 'favicon-48x48.png' },
    { url: urls[96], name: 'favicon-96x96.png' },
    { url: urls[144], name: 'favicon-144x144.png' },
    { url: urls[192], name: 'favicon-192x192.png' },
    { url: urls[512], name: 'favicon-512x512.png' },
    
    // ico format
    { url: urls[32], name: 'favicon.ico' },
    
    // apple touch
    { url: urls[180], name: 'apple-touch-icon.png' },
    { url: urls[152], name: 'apple-touch-icon-152x152.png' },
    { url: urls[144], name: 'apple-touch-icon-144x144.png' },
    { url: urls[120], name: 'apple-touch-icon-120x120.png' },
    { url: urls[114], name: 'apple-touch-icon-114x114.png' },
    { url: urls[76], name: 'apple-touch-icon-76x76.png' },
    { url: urls[72], name: 'apple-touch-icon-72x72.png' },
    { url: urls[60], name: 'apple-touch-icon-60x60.png' },
    { url: urls[57], name: 'apple-touch-icon-57x57.png' },
  ];

  // download each file with a small delay to prevent browser blocking
  for (let i = 0; i < downloads.length; i++) {
    const download = downloads[i];
    if (download.url) {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = download.url;
        a.download = download.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, i * 100);
    }
  }
}

export function downloadIndividualFavicon(urls: Record<number, string>, size: number, format: 'png' | 'ico' = 'png'): void {
  const url = urls[size];
  if (url) {
    const filename = format === 'ico' ? 'favicon.ico' : `favicon-${size}x${size}.png`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export function cleanupBlobUrls(urls: Record<number, string>): void {
  Object.values(urls).forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}