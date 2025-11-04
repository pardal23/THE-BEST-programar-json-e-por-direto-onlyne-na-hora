import React from 'react';
import Card from './Card';
import Button from './Button';

interface JsonEditorCardProps {
    jsonString: string;
    jsonEditText: string;
    onJsonEditTextChange: (value: string) => void;
    onApply: () => void;
    onValidate: () => void;
    onClear: () => void;
    onReset: () => void;
}

const JsonEditorCard: React.FC<JsonEditorCardProps> = ({
    jsonString,
    jsonEditText,
    onJsonEditTextChange,
    onApply,
    onValidate,
    onClear,
    onReset
}) => {
    return (
        <Card title="1) JSON atual" className="lg:col-span-2 xl:col-span-1">
            <pre className="bg-gray-50 border border-dashed border-gray-300 p-3 rounded-md whitespace-pre-wrap break-all text-sm h-48 overflow-auto">
                {jsonString}
            </pre>

            <div className="mt-4">
                <label htmlFor="jsonEdit" className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>Editar / criar novo JSON</strong> (ex.: {`{"chave":"valor"}`})
                </label>
                <textarea
                    id="jsonEdit"
                    value={jsonEditText}
                    onChange={(e) => onJsonEditTextChange(e.target.value)}
                    className="w-full min-h-[160px] p-2 border-gray-300 rounded-md font-mono text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cole ou escreva seu JSON aqui"
                ></textarea>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="primary" onClick={onApply}>Aplicar JSON</Button>
                    <Button onClick={onValidate}>Validar JSON</Button>
                    <Button onClick={onClear}>Limpar / Novo JSON</Button>
                    <Button onClick={onReset}>Restaurar Exemplo</Button>
                </div>
                <small className="block text-gray-500 mt-2 text-xs">
                    Ao aplicar, o JSON válido substituirá a base de dados usada pelos botões abaixo. A aplicação não modifica URLs — usa-as como estão.
                </small>
            </div>
        </Card>
    );
};

export default JsonEditorCard;
