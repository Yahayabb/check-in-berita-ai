import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { validateImageFile } from './validateImageFile';

const PREPARED_DEMO_TEXT = "Malaysia's inflation rate was 1.8% in 2024.";
const DEMO_FALLBACK_LABEL =
  'Demo OCR fallback — prepared text, not arbitrary-image recognition.';

type OcrStatus = 'idle' | 'reading' | 'success' | 'fallback' | 'error';

interface ScreenshotOcrProps {
  onUseText: (text: string) => void;
}

function isDemoFileName(fileName: string): boolean {
  const normalizedName = fileName.toLowerCase();
  return normalizedName.includes('demo') || normalizedName.includes('check-in-berita');
}

export default function ScreenshotOcr({ onUseText }: ScreenshotOcrProps) {
  const inputId = useId();
  const requestIdRef = useRef(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDemoFile, setIsDemoFile] = useState(false);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<OcrStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
    };
  }, []);

  const resetResult = () => {
    setText('');
    setError('');
    setStatusMessage('');
    setProgress(0);
    setUsedFallback(false);
  };

  const usePreparedDemoText = () => {
    requestIdRef.current += 1;
    setText(PREPARED_DEMO_TEXT);
    setStatus('fallback');
    setStatusMessage('');
    setProgress(0);
    setError('');
    setUsedFallback(true);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    resetResult();

    if (!validateImageFile(file)) {
      setPreviewUrl(null);
      setFileName('');
      setIsDemoFile(false);
      setStatus('error');
      setError('Unsupported file. Please choose a PNG or JPG image.');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setIsDemoFile(isDemoFileName(file.name));
    setStatus('reading');
    setStatusMessage('Loading the browser OCR engine…');

    try {
      const { recognize } = await import('tesseract.js');
      const result = await recognize(file, 'eng', {
        logger: (message) => {
          if (requestIdRef.current !== requestId) {
            return;
          }

          if (message.status === 'recognizing text') {
            setStatusMessage('Recognizing text…');
            setProgress(Math.round(message.progress * 100));
          } else {
            setStatusMessage('Preparing OCR and language data…');
          }
        },
      });

      if (requestIdRef.current !== requestId) {
        return;
      }

      const extractedText = result.data.text.trim();
      if (!extractedText) {
        throw new Error('No text was recognized.');
      }

      setText(extractedText);
      setStatus('success');
      setStatusMessage('Text extracted. Review and edit it before checking.');
      setProgress(100);
    } catch {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setProgress(0);
      if (isDemoFileName(file.name)) {
        setText(PREPARED_DEMO_TEXT);
        setStatus('fallback');
        setStatusMessage('');
        setUsedFallback(true);
      } else {
        setStatus('error');
        setStatusMessage('');
        setError(
          'OCR could not complete. The image preview is preserved. Language data may be unavailable offline; reconnect and try again, or choose a clearer image.',
        );
      }
    }
  };

  const handleUseText = () => {
    const checkedText = text.trim();
    if (checkedText) {
      onUseText(checkedText);
    }
  };

  return (
    <section className="ocr-panel" aria-labelledby={`${inputId}-title`}>
      <h3 className="sr-only" id={`${inputId}-title`}>Check text from a screenshot</h3>
      <p className="ocr-privacy" id={`${inputId}-help`}>
        Choose a PNG or JPG image. OCR runs in your browser; this component does not upload
        your image.
      </p>

      <label className="ocr-file-label" htmlFor={`${inputId}-file`}>Screenshot (PNG or JPG)</label>
      <input
        id={`${inputId}-file`}
        type="file"
        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        aria-describedby={`${inputId}-help`}
        onChange={handleFileChange}
      />

      {error && <p className="ocr-message ocr-error" role="alert">{error}</p>}

      {previewUrl && (
        <div className="ocr-preview">
          <p>{fileName}</p>
          <img src={previewUrl} alt={`Preview of ${fileName}`} />
        </div>
      )}

      {status === 'reading' && (
        <div className="ocr-progress" role="status" aria-live="polite">
          <p>{statusMessage}</p>
          <div>
            <progress max="100" value={progress} aria-label="OCR progress">
              {progress}%
            </progress>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {status === 'success' && statusMessage && (
        <p className="ocr-message ocr-success" role="status">{statusMessage}</p>
      )}

      {isDemoFile && previewUrl && status === 'reading' && (
        <div className="ocr-demo-option">
          <button className="secondary-button" type="button" onClick={usePreparedDemoText}>
            Use prepared demo OCR text
          </button>
          <p>This optional shortcut uses the filename, not text recognized from the image.</p>
        </div>
      )}

      {usedFallback && <p className="ocr-message ocr-fallback" role="status">{DEMO_FALLBACK_LABEL}</p>}

      <label className="ocr-text-label" htmlFor={`${inputId}-text`}>Extracted text (editable)</label>
      <textarea
        id={`${inputId}-text`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={5}
        placeholder="Recognized text will appear here for review."
      />
      <button className="primary-button ocr-check-button" type="button" onClick={handleUseText} disabled={!text.trim()}>
        Check this text
      </button>
    </section>
  );
}
