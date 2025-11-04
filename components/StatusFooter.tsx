import React from 'react';
import { StatusMessage } from '../types';

interface StatusFooterProps {
    status: StatusMessage;
}

const StatusFooter: React.FC<StatusFooterProps> = ({ status }) => {
    const statusColor = status.isError 
        ? 'bg-red-100 border-red-300 text-red-800' 
        : 'bg-blue-100 border-blue-300 text-blue-800';

    return (
        <div className="mt-6">
            <div className={`p-3 rounded-md border text-sm ${statusColor}`}>
                <strong>Status:</strong> {status.text}
            </div>
            <footer className="mt-4 text-xs text-gray-500">
                <strong className="text-red-600">Atenção:</strong> abrir links externos pode expor seu navegador a riscos. Use links confiáveis. O arquivo roda localmente no seu navegador — nada é enviado a servidores.
            </footer>
        </div>
    );
};

export default StatusFooter;
