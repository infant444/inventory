import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Square, Scan } from 'lucide-react';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onClose, onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Camera access denied. Please allow camera permissions and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setCameraError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    stopCamera();
    setManualCode('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setManualCode('');
    }
    return () => stopCamera();
  }, [isOpen]);

  const handleManualSubmit = () => {
    const code = manualCode.trim();
    if (code) {
      onScan(code);
      handleClose();
    }
  };

  const simulateScan = () => {
    const randomBarcode = Math.floor(Math.random() * 900000000000) + 100000000000;
    onScan(randomBarcode.toString());
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Barcode Scanner</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close scanner"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            <button
              onClick={startCamera}
              disabled={isScanning || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <Camera size={18} />
              {isLoading ? 'Starting...' : 'Start Camera'}
            </button>
            
            <button
              onClick={stopCamera}
              disabled={!isScanning}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <Square size={18} />
              Stop Camera
            </button>
          </div>

          {cameraError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <div className="flex items-center gap-2">
                <X size={16} className="text-red-500" />
                {cameraError}
              </div>
            </div>
          )}

          {isScanning && (
            <div className="border-2 border-blue-300 rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-48 object-cover"
              />
              <div className="p-3 bg-gray-50 text-center">
                <button
                  onClick={simulateScan}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  <Scan size={16} className="inline mr-2" />
                  Simulate Scan
                </button>
                <p className="text-xs text-gray-600 mt-2">Point camera at barcode or click simulate</p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manual Entry:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter barcode number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSubmit();
                  }
                }}
                autoComplete="off"
              />
              <button
                onClick={handleManualSubmit}
                disabled={!manualCode.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
              >
                Use
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter or click Use to apply</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;