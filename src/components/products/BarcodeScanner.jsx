import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

export function BarcodeScanner({ onScan, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: {width: 250, height: 100} },
      false
    );

    scanner.render((decodedText) => {
      onScan(decodedText);
      scanner.clear();
      onClose();
    }, () => {});

    return () => {
      scanner.clear().catch(e => console.error(e));
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
          <h3 className="font-bold">Escanear Código de Barras</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="bg-white p-2">
          <div id="qr-reader" className="w-full"></div>
        </div>
      </div>
    </div>
  );
}
