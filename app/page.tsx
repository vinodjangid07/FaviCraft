'use client';

import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import Image from 'next/image';
import FileUpload from '@/components/FileUpload';
import FaviconPreview from '@/components/FaviconPreview';
import { generateFavicons, downloadAllFavicons, cleanupBlobUrls, FaviconResult } from '@/lib/favicon-generator';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [faviconResult, setFaviconResult] = useState<FaviconResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    try {
      setError('');
      setIsProcessing(true);
      setSelectedFile(file);

      // preview url
      const imageUrl = URL.createObjectURL(file);
      setOriginalImageUrl(imageUrl);

      const result = await generateFavicons(file);
      setFaviconResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (faviconResult) {
      await downloadAllFavicons(faviconResult.urls);
    }
  };

  const handleReset = () => {
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    if (faviconResult) {
      cleanupBlobUrls(faviconResult.urls);
    }

    setSelectedFile(null);
    setOriginalImageUrl('');
    setFaviconResult(null);
    setError('');
  };

  useEffect(() => {
    return () => {
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
      if (faviconResult) {
        cleanupBlobUrls(faviconResult.urls);
      }
    };
  }, [originalImageUrl, faviconResult]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/logo.png"
                  alt="FaviCraft Logo"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">FaviCraft</h1>
                <p className="text-sm text-slate-500">Craft perfect favicons instantly</p>
              </div>
            </div>
            
            {selectedFile && (
              <button
                onClick={handleReset}
                className="bg-white hover:bg-slate-50 text-purple-600 font-medium py-3 px-6 rounded-lg border border-purple-200 transition-all duration-200 hover:border-purple-300 inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!selectedFile ? (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4 py-12">
              <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                Craft Perfect Favicons
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Upload any image and generate all the favicon sizes you need for your website. 
                Get industry-standard HTML code and download everything in seconds.
              </p>
            </div>


            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          </div>
        ) : (
          <FaviconPreview
            originalImage={originalImageUrl}
            faviconUrls={faviconResult?.urls || {}}
            htmlCode={faviconResult?.htmlCode || ''}
            onDownloadAll={handleDownloadAll}
          />
        )}
      </main>

      {/* footer */}
      <footer className="bg-slate-900 text-slate-300 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-3">
            <p className="text-sm">
              Built by <span className="font-medium text-white">Vinod Jangid</span>
            </p>
            <a
              href="https://github.com/vinodjangid07"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              github.com/vinodjangid07
            </a>
            <p className="text-xs text-slate-500 pt-2">
              © 2025 FaviCraft. Open source favicon generator.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
