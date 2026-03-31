import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export function DeleteConfirmModal({ product, customMessage, onConfirm, onClose }) {
  const { deleteProduct } = useStore();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else if (product) {
      deleteProduct(product.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Excluir Registro</h2>
          <p className="text-slate-600 mb-6">
            {customMessage || (
              <>
                Tem certeza que deseja excluir o produto <br/><strong className="text-slate-800">{product?.nome}</strong>?<br/>
                Esta ação não poderá ser desfeita.
              </>
            )}
          </p>
          
          <div className="w-full flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 py-3 text-slate-700 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirm} 
              className="flex-1 py-3 text-white font-semibold bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Excluir Confirmado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
