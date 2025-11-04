import React from 'react';
import Card from './Card';
import Button from './Button';

interface LinkOpenerCardProps {
    jsonKey: string;
    onJsonKeyChange: (value: string) => void;
    onOpenJsonNew: () => void;
    onOpenJsonSame: () => void;
    freeUrl: string;
    onFreeUrlChange: (value: string) => void;
    onOpenFreeNew: () => void;
    onOpenFreeSame: () => void;
    onTestScheme: () => void;
    searchEngine: string;
    onSearchEngineChange: (value: string) => void;
    onSearchJson: () => void;
    onSearchFree: () => void;
}

const LinkOpenerCard: React.FC<LinkOpenerCardProps> = ({
    jsonKey, onJsonKeyChange, onOpenJsonNew, onOpenJsonSame,
    freeUrl, onFreeUrlChange, onOpenFreeNew, onOpenFreeSame, onTestScheme,
    searchEngine, onSearchEngineChange, onSearchJson, onSearchFree
}) => {
    return (
        <Card title="2) Abrir links">
            <div>
                <label htmlFor="jsonKey" className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>Abrir URL do JSON</strong> — chave (campo) a usar:
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                    <input
                        type="text"
                        id="jsonKey"
                        value={jsonKey}
                        onChange={(e) => onJsonKeyChange(e.target.value)}
                        className="flex-grow p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                    />
                    <Button variant="primary" onClick={onOpenJsonNew}>Abrir na nova aba</Button>
                    <Button onClick={onOpenJsonSame}>Abrir na mesma aba</Button>
                </div>
                 <small className="block text-gray-500 mt-2 text-xs">
                    Ex.: se seu JSON tiver {`{"abrirImagem":"https://..."}`}, use a chave <code>abrirImagem</code>.
                </small>
            </div>

            <hr className="my-4 border-gray-200" />

            <div>
                 <label htmlFor="freeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>Abrir qualquer link (entrada livre)</strong>
                </label>
                <input
                    type="text"
                    id="freeUrl"
                    value={freeUrl}
                    onChange={(e) => onFreeUrlChange(e.target.value)}
                    className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cole aqui qualquer URL, ex.: https://example.com/arquivo.jpg"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="primary" onClick={onOpenFreeNew}>Abrir nova aba</Button>
                    <Button onClick={onOpenFreeSame}>Abrir mesma aba</Button>
                    <Button onClick={onTestScheme}>Testar/Normalizar</Button>
                </div>
                 <small className="block text-gray-500 mt-2 text-xs">
                    Se o texto não contém esquema (http/https) será alertado. Você pode inserir qualquer URL — atenção à segurança.
                </small>
            </div>
            
            <hr className="my-4 border-gray-200" />

            <div>
                <label htmlFor="searchEngine" className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>PESQUISAR a URL (Motor)</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                    <select
                        id="searchEngine"
                        value={searchEngine}
                        onChange={(e) => onSearchEngineChange(e.target.value)}
                        className="p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="google">Google</option>
                        <option value="bing">Bing</option>
                    </select>
                    <Button onClick={onSearchJson}>Pesquisar URL do JSON</Button>
                    <Button onClick={onSearchFree}>Pesquisar texto da caixa livre</Button>
                </div>
            </div>
        </Card>
    );
};

export default LinkOpenerCard;
