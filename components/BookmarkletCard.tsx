import React from 'react';
import Card from './Card';
import Button from './Button';
import { JsonData } from '../types';

interface BookmarkletCardProps {
    jsonKey: string;
    jsonData: JsonData;
    onGenerateAndCopyBookmarklet: () => void;
    onShowBookmarklet: () => void;
    onRunBookmarklet: () => void;
    bookmarkletText: string;
    onDownloadHtml: () => void;
}

const BookmarkletCard: React.FC<BookmarkletCardProps> = ({
    jsonKey,
    jsonData,
    onGenerateAndCopyBookmarklet,
    onShowBookmarklet,
    onRunBookmarklet,
    bookmarkletText,
    onDownloadHtml,
}) => {

    const previewValue = jsonData[jsonKey] ? String(jsonData[jsonKey]) : '(não definido)';

    return (
        <Card title="3) Bookmarklet / Download">
            <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={onGenerateAndCopyBookmarklet}>Gerar & Copiar Bookmarklet</Button>
                <Button onClick={onShowBookmarklet}>Mostrar Bookmarklet</Button>
                <Button onClick={onRunBookmarklet}>Executar Bookmarklet</Button>
            </div>

            <div className="mt-4">
                <label htmlFor="bookmarklet" className="block text-sm font-medium text-gray-700 mb-1">Bookmarklet:</label>
                <textarea
                    id="bookmarklet"
                    readOnly
                    value={bookmarkletText}
                    className="w-full p-2 border-gray-300 rounded-md font-mono text-xs bg-gray-50 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Aqui aparece o bookmarklet"
                ></textarea>
                 <small className="block text-gray-500 mt-1 text-xs">Arraste o texto do bookmarklet para a barra de favoritos ou copie-o.</small>
            </div>

            <div className="mt-4">
                <Button variant="primary" onClick={onDownloadHtml}>Download HTML com URL embutida</Button>
            </div>
            
            <hr className="my-4 border-gray-200" />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>Exemplo rápido do JSON atual</strong>
                </label>
                <pre className="bg-white p-3 rounded-md border border-gray-200 text-xs whitespace-pre-wrap break-all">
                    {`Chave atual: ${jsonKey}\nValor:\n${previewValue}`}
                </pre>
            </div>
        </Card>
    );
};

export default BookmarkletCard;
