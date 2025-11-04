import React, { useState, useCallback } from 'react';
import { INITIAL_JSON_DATA, INITIAL_JSON_STRING } from './constants';
import { JsonData, StatusMessage } from './types';
import JsonEditorCard from './components/JsonEditorCard';
import LinkOpenerCard from './components/LinkOpenerCard';
import BookmarkletCard from './components/BookmarkletCard';
import StatusFooter from './components/StatusFooter';

function App() {
  const [jsonData, setJsonData] = useState<JsonData>(INITIAL_JSON_DATA);
  const [jsonEditText, setJsonEditText] = useState<string>(INITIAL_JSON_STRING);
  const [jsonKey, setJsonKey] = useState<string>('abrirImagem');
  const [freeUrl, setFreeUrl] = useState<string>('');
  const [searchEngine, setSearchEngine] = useState<string>('google');
  const [bookmarkletText, setBookmarkletText] = useState<string>('');
  const [status, setStatus] = useState<StatusMessage>({ text: 'Pronto. Edite o JSON ou cole um link e use os botões.', isError: false });

  const tryParseJson = (text: string): { ok: boolean; obj?: JsonData; error?: string } => {
    try {
      const obj = JSON.parse(text);
      return { ok: true, obj };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  };

  const isValidUrlScheme = (s: string): boolean => {
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };
  
  const openUrl = (url: string, newTab: boolean): void => {
      if(newTab) {
          window.open(url, '_blank', 'noopener,noreferrer');
      } else {
          window.location.href = url;
      }
  };

  const handleApplyJson = useCallback(() => {
    const txt = jsonEditText.trim();
    if (!txt) {
      setStatus({ text: 'Textarea vazio — nada aplicado.', isError: true });
      return;
    }
    const parsed = tryParseJson(txt);
    if (!parsed.ok) {
      setStatus({ text: 'JSON inválido: ' + parsed.error, isError: true });
      return;
    }
    setJsonData(parsed.obj!);
    setStatus({ text: 'JSON aplicado com sucesso.', isError: false });
  }, [jsonEditText]);

  const handleValidateJson = useCallback(() => {
    const txt = jsonEditText.trim();
    if (!txt) {
      setStatus({ text: 'Textarea vazio — nada para validar.', isError: true });
      return;
    }
    const parsed = tryParseJson(txt);
    if (!parsed.ok) {
      setStatus({ text: 'JSON inválido: ' + parsed.error, isError: true });
    } else {
      setStatus({ text: 'JSON válido ✔', isError: false });
    }
  }, [jsonEditText]);

  const handleClearJson = useCallback(() => {
    setJsonEditText('');
    setStatus({ text: 'Textarea limpa — crie um novo JSON.', isError: false });
  }, []);

  const handleResetJson = useCallback(() => {
    setJsonData(INITIAL_JSON_DATA);
    setJsonEditText(INITIAL_JSON_STRING);
    setStatus({ text: 'Exemplo restaurado.', isError: false });
  }, []);

  const handleOpenJson = useCallback((newTab: boolean) => {
    const key = jsonKey || 'abrirImagem';
    if (!jsonData || typeof jsonData !== 'object' || !(key in jsonData)) {
      setStatus({ text: `Chave "${key}" não encontrada no JSON.`, isError: true });
      return;
    }
    const url = String(jsonData[key]);
    if (!url) {
      setStatus({ text: 'Valor vazio para a chave selecionada.', isError: true });
      return;
    }
    openUrl(url, newTab);
    setStatus({ text: `Solicitado: abrir valor da chave "${key}" em ${newTab ? 'nova' : 'mesma'} aba.`, isError: false });
  }, [jsonData, jsonKey]);

  const handleOpenFree = useCallback((newTab: boolean) => {
    const url = freeUrl.trim();
    if (!url) {
      setStatus({ text: 'Insira uma URL na caixa livre.', isError: true });
      return;
    }
    if (!isValidUrlScheme(url)) {
      if (!window.confirm('A URL não parece ter esquema (http/https) ou é inválida. Deseja tentar abrir mesmo assim?')) {
        setStatus({ text: 'Ação cancelada pelo usuário (URL parece inválida).', isError: true });
        return;
      }
    }
    openUrl(url, newTab);
    setStatus({ text: `Solicitado: abrir URL livre em ${newTab ? 'nova' : 'mesma'} aba.`, isError: false });
  }, [freeUrl]);

  const handleTestScheme = useCallback(() => {
      const url = freeUrl.trim();
      if (!url) {
        setStatus({ text: 'Caixa livre vazia.', isError: true });
        return;
      }
      if (isValidUrlScheme(url)) {
        setStatus({ text: 'OK — URL válida com esquema http/https.', isError: false });
      } else {
        setStatus({ text: 'Atenção — a URL não parece válida. Considere adicionar "https://" no início.', isError: true });
      }
  }, [freeUrl]);
  
  const handleSearch = useCallback((useJson: boolean) => {
      const textToSearch = useJson ? String(jsonData[jsonKey] || '') : freeUrl.trim();
      if (!textToSearch) {
          setStatus({ text: useJson ? `Valor vazio para a chave "${jsonKey}".` : 'Caixa livre vazia para pesquisa.', isError: true });
          return;
      }
      const engineUrl = searchEngine === 'google'
          ? `https://www.google.com/search?q=${encodeURIComponent(textToSearch)}`
          : `https://www.bing.com/search?q=${encodeURIComponent(textToSearch)}`;
      
      openUrl(engineUrl, true);
      setStatus({ text: `Pesquisa aberta no ${searchEngine} para: "${textToSearch.substring(0, 30)}..."`, isError: false });
  }, [jsonData, jsonKey, freeUrl, searchEngine]);

  const makeBookmarkletFromUrl = (url: string) => {
    const esc = url.replace(/'/g, "\\'");
    return `javascript:(function(){window.open('${esc}','_blank','noopener,noreferrer');})();`;
  };

  const generateBookmarklet = useCallback(async (copy: boolean) => {
    const key = jsonKey || 'abrirImagem';
    if (!jsonData || !(key in jsonData)) {
        setStatus({ text: `Chave "${key}" não encontrada no JSON.`, isError: true });
        return;
    }
    const url = String(jsonData[key]);
    if (!url) {
        setStatus({ text: 'Valor vazio para a chave (bookmarklet não gerado).', isError: true });
        return;
    }
    const bm = makeBookmarkletFromUrl(url);
    setBookmarkletText(bm);

    if (copy) {
        try {
            await navigator.clipboard.writeText(bm);
            setStatus({ text: 'Bookmarklet gerado e copiado para a área de transferência.', isError: false });
        } catch (e) {
            setStatus({ text: 'Bookmarklet gerado (não copiado automaticamente).', isError: false });
        }
    } else {
        setStatus({ text: 'Bookmarklet exibido abaixo.', isError: false });
    }
  }, [jsonData, jsonKey]);
  
  const handleDownloadHtml = useCallback(() => {
    const key = jsonKey || 'abrirImagem';
    if (!jsonData || !(key in jsonData)) {
      setStatus({ text: `Chave "${key}" não encontrada no JSON.`, isError: true });
      return;
    }
    const url = String(jsonData[key]);
    const escapeHtml = (unsafe: string) => 
        unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");

    const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Abrir link direto</title></head>
<body>
  <h1>Abrir link embutido</h1>
  <p>Link embutido exatamente como recebido (campo: ${escapeHtml(key)}):</p>
  <pre>${escapeHtml(url)}</pre>
  <p><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Abrir em nova aba</a></p>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'abrir-link-embutido.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    setStatus({ text: 'Download iniciado: HTML gerado com a URL embutida.', isError: false });
  }, [jsonData, jsonKey]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Abrir link — Editor JSON & Ferramentas</h1>
          <p className="text-gray-600 mt-1">
            Edite o JSON, aplique, gere bookmarklet, abra links. Aviso: abrir links arbitrários pode ser perigoso — confie nas fontes.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <JsonEditorCard
                jsonString={JSON.stringify(jsonData, null, 2)}
                jsonEditText={jsonEditText}
                onJsonEditTextChange={setJsonEditText}
                onApply={handleApplyJson}
                onValidate={handleValidateJson}
                onClear={handleClearJson}
                onReset={handleResetJson}
            />
            <LinkOpenerCard
                jsonKey={jsonKey}
                onJsonKeyChange={setJsonKey}
                onOpenJsonNew={() => handleOpenJson(true)}
                onOpenJsonSame={() => handleOpenJson(false)}
                freeUrl={freeUrl}
                onFreeUrlChange={setFreeUrl}
                onOpenFreeNew={() => handleOpenFree(true)}
                onOpenFreeSame={() => handleOpenFree(false)}
                onTestScheme={handleTestScheme}
                searchEngine={searchEngine}
                onSearchEngineChange={setSearchEngine}
                onSearchJson={() => handleSearch(true)}
                onSearchFree={() => handleSearch(false)}
            />
            <BookmarkletCard
                jsonKey={jsonKey}
                jsonData={jsonData}
                onGenerateAndCopyBookmarklet={() => generateBookmarklet(true)}
                onShowBookmarklet={() => generateBookmarklet(false)}
                onRunBookmarklet={() => handleOpenJson(true)}
                bookmarkletText={bookmarkletText}
                onDownloadHtml={handleDownloadHtml}
            />
        </div>

        <StatusFooter status={status} />
      </main>
    </div>
  );
}

export default App;
