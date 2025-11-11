'use client';

import { Download, Copy, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { downloadIndividualFavicon } from '@/lib/favicon-generator';

interface FaviconSize {
  size: number;
  name: string;
  purpose: string;
  category: string;
}

interface FaviconPreviewProps {
  originalImage: string;
  faviconUrls: Record<number, string>;
  htmlCode: string;
  onDownloadAll: () => void;
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, name: 'favicon-16x16.png', purpose: 'Browser tab (small)', category: 'Standard' },
  { size: 32, name: 'favicon-32x32.png', purpose: 'Browser tab (standard)', category: 'Standard' },
  { size: 48, name: 'favicon-48x48.png', purpose: 'Browser tab (large)', category: 'Standard' },
  
  // apple touch
  { size: 57, name: 'apple-touch-icon-57x57.png', purpose: 'iPhone (iOS 6)', category: 'Apple' },
  { size: 60, name: 'apple-touch-icon-60x60.png', purpose: 'iPhone (iOS 7+)', category: 'Apple' },
  { size: 72, name: 'apple-touch-icon-72x72.png', purpose: 'iPad (iOS 6)', category: 'Apple' },
  { size: 76, name: 'apple-touch-icon-76x76.png', purpose: 'iPad (iOS 7+)', category: 'Apple' },
  { size: 114, name: 'apple-touch-icon-114x114.png', purpose: 'iPhone Retina (iOS 6)', category: 'Apple' },
  { size: 120, name: 'apple-touch-icon-120x120.png', purpose: 'iPhone Retina (iOS 7+)', category: 'Apple' },
  { size: 144, name: 'apple-touch-icon-144x144.png', purpose: 'iPad Retina (iOS 6)', category: 'Apple' },
  { size: 152, name: 'apple-touch-icon-152x152.png', purpose: 'iPad Retina (iOS 7+)', category: 'Apple' },
  { size: 180, name: 'apple-touch-icon-180x180.png', purpose: 'iPhone 6 Plus', category: 'Apple' },
  
  // Android & PWA
  { size: 192, name: 'android-chrome-192x192.png', purpose: 'Android home screen', category: 'Android/PWA' },
  { size: 512, name: 'android-chrome-512x512.png', purpose: 'PWA & Android splash', category: 'Android/PWA' },
  
  // Windows
  { size: 96, name: 'favicon-96x96.png', purpose: 'Desktop shortcut', category: 'Windows' },
];

export default function FaviconPreview({ 
  originalImage, 
  faviconUrls, 
  htmlCode, 
  onDownloadAll 
}: FaviconPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [downloadMode, setDownloadMode] = useState<'all' | 'individual'>('all');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'ico'>('png');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const copyHtmlCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleIndividualDownload = () => {
    if (selectedSize) {
      downloadIndividualFavicon(faviconUrls, selectedSize, selectedFormat);
    }
  };

  const availableSizes = FAVICON_SIZES.filter(favicon => faviconUrls[favicon.size]);
  const selectedFavicon = availableSizes.find(f => f.size === selectedSize);

  const isDownloadEnabled = downloadMode === 'all' || (downloadMode === 'individual' && selectedSize);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* original image*/}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Original Image</h3>
        <div className="flex justify-center">
          <div className="border border-slate-200 rounded-lg p-2 bg-white flex items-center justify-center w-32 h-32 relative">
            <Image
              src={originalImage}
              alt="Original upload"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Download Options</h3>
        
        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="downloadMode"
              value="all"
              checked={downloadMode === 'all'}
              onChange={(e) => setDownloadMode(e.target.value as 'all' | 'individual')}
              className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
            />
            <div className="flex-1">
              <div className="font-medium text-slate-800">Download All ({availableSizes.length} files)</div>
              <div className="text-sm text-slate-500 mt-1">
                Get all favicon sizes in PNG format + favicon.ico + Apple touch icons + Android icons
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Package with all required formats for web, mobile, and desktop
              </div>
            </div>
          </label>

          {/* individual downloads*/}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="downloadMode"
              value="individual"
              checked={downloadMode === 'individual'}
              onChange={(e) => setDownloadMode(e.target.value as 'all' | 'individual')}
              className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
            />
            <div className="flex-1">
              <div className="font-medium text-slate-800">Download Individual</div>
              <div className="text-sm text-slate-500 mt-1">
                Select specific size and format
              </div>
            </div>
          </label>
        </div>

        {downloadMode === 'individual' && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Size Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Size
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 flex items-center justify-between"
                  >
                    <span className={selectedSize ? 'text-slate-900' : 'text-slate-500'}>
                      {selectedFavicon ? `${selectedFavicon.size}×${selectedFavicon.size}px - ${selectedFavicon.purpose}` : 'Choose size...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {Object.entries(
                        availableSizes.reduce((groups, favicon) => {
                          if (!groups[favicon.category]) groups[favicon.category] = [];
                          groups[favicon.category].push(favicon);
                          return groups;
                        }, {} as Record<string, typeof availableSizes>)
                      ).map(([category, favicons]) => (
                        <div key={category}>
                          <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50 border-b border-slate-100">
                            {category}
                          </div>
                          {favicons.map((favicon) => (
                            <button
                              key={favicon.size}
                              onClick={() => {
                                setSelectedSize(favicon.size);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-purple-50 hover:text-purple-700 focus:bg-purple-50 focus:text-purple-700 focus:outline-none border-b border-slate-50 last:border-b-0 cursor-pointer"
                            >
                              <div className="font-medium">{favicon.size}×{favicon.size}px</div>
                              <div className="text-xs text-slate-500">{favicon.purpose}</div>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as 'png' | 'ico')}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="png">PNG (Recommended)</option>
                  <option value="ico">ICO (Legacy browsers)</option>
                </select>
              </div>
            </div>

            {selectedSize && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="border border-slate-200 rounded-lg p-2 bg-white flex items-center justify-center relative w-12 h-12">
                  <Image
                    src={faviconUrls[selectedSize]}
                    alt={`Favicon ${selectedSize}x${selectedSize}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{selectedFavicon?.name}</div>
                  <div className="text-sm text-slate-500">{selectedFavicon?.purpose}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Download Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={downloadMode === 'all' ? onDownloadAll : handleIndividualDownload}
            disabled={!isDownloadEnabled}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {downloadMode === 'all' ? 'Download All Files' : 'Download Selected'}
          </button>
        </div>
      </div>

      {/* HTML*/}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">HTML Code</h3>
          <button
            onClick={copyHtmlCode}
            className={`bg-white cursor-pointer hover:bg-slate-50 text-purple-600 font-medium py-3 px-6 rounded-lg border border-purple-200 transition-all duration-200 hover:border-purple-300 inline-flex items-center gap-2 ${copied ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
        </div>
        
        <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
          <pre className="whitespace-pre-wrap">{htmlCode}</pre>
        </div>
        
        <p className="text-sm text-slate-500 mt-3">
          Add this code to the <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;head&gt;</code> section of your HTML document.
        </p>
      </div>
    </div>
  );
}