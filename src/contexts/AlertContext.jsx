import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const AlertContext = createContext(null);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = useCallback((message, type = 'info', title = '') => {
        setAlert({ message, type, title });
    }, []);

    const hideAlert = useCallback(() => {
        setAlert(null);
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {alert && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-200"
                        role="alertdialog"
                    >
                        <div className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                                {alert.type === 'success' && (
                                    <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                )}
                                {alert.type === 'error' && (
                                    <div className="p-3 bg-red-500/20 rounded-full text-red-400">
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                )}
                                {alert.type === 'warning' && (
                                    <div className="p-3 bg-amber-500/20 rounded-full text-amber-400">
                                        <AlertTriangle className="w-8 h-8" />
                                    </div>
                                )}
                                {alert.type === 'info' && (
                                    <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                                        <Info className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            
                            {alert.title && (
                                <h3 className="text-xl font-bold text-white mb-2">{alert.title}</h3>
                            )}
                            <p className="text-neutral-300 text-sm leading-relaxed">
                                {alert.message}
                            </p>
                        </div>
                        
                        <div className="p-4 border-t border-white/5 flex gap-3">
                            <button
                                onClick={hideAlert}
                                className={`w-full py-3 rounded-xl font-bold transition active:scale-95 ${
                                    alert.type === 'success' ? 'bg-green-600 hover:bg-green-500 text-white' :
                                    alert.type === 'error' ? 'bg-red-600 hover:bg-red-500 text-white' :
                                    alert.type === 'warning' ? 'bg-amber-600 hover:bg-amber-500 text-white' :
                                    'bg-indigo-600 hover:bg-indigo-500 text-white'
                                }`}
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};
