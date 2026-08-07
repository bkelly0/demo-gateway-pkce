import { useEffect, useState } from 'react';
import { Spinner } from './Spinner';


export default function ResourceRequestComponent({
    url, expectedStatus, resultMessage
}: {
    url: string;
    expectedStatus: number;
    resultMessage: string;
}) {
  const [retryTrigger, setRetryTrigger] = useState(false);
  const [resourceRequestState, setResourceRequestState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [resourceResponse, setResourceResponse] = useState('');
  const [statusCodeState, setStatusCodeState] = useState<number>(0);

  useEffect(() => {

    const abortController = new AbortController();

    const loadProtectedResource = async () => {
      setResourceRequestState('loading');

      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          signal: abortController.signal,
        });
        const responseBody = await response.text();
        setStatusCodeState(response.status);

        if (!response.ok) {
          setResourceRequestState('error');
          setResourceResponse(
            responseBody
              ? `Request failed with ${response.status}: ${responseBody}`
              : `Request failed with ${response.status}.`,
          );
          return;
        }

        setResourceRequestState('success');
        setResourceResponse(responseBody || 'Request completed successfully.');
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setResourceRequestState('error');
        setResourceResponse(error instanceof Error ? error.message : 'Request failed.');
      }
    };

    void loadProtectedResource();

    return () => {
      abortController.abort();
    };
  }, [retryTrigger, url]);

  return (

        <div
          className={`protected-api-result${
            resourceRequestState === 'error' ? ' protected-api-result--error' : ''
          }`}
        >
          <p className="protected-api-status">
            {resourceRequestState === 'loading'
              ? `Requesting ${url}...`
              : resourceRequestState === 'success'
                ? <>Response from {url} <span className="success">succeeded</span></>
                : resourceRequestState === 'error'
                        ? <>
                          Request to {url} <span className="failed">failed</span>
                        </>
                : `Waiting to request ${url}...`}
          </p>
          <pre className="protected-api-body">{resourceResponse}</pre>
          <div className="protected-api-feedback">
            {statusCodeState === expectedStatus
                ? <p><span className="success">Expected Result! </span>{resultMessage}</p>
                : null}
            {(statusCodeState != expectedStatus)
                ? <p><span className="failed">This is not the expected result based on the user!</span></p>
                : null}
          </div>
          <div className="protected-api-spinner-slot">
            {resourceRequestState === 'loading' ? <Spinner /> : null}
          </div>
          <button
            type="button"
            className="protected-api-retry-button"
            onClick={() => setRetryTrigger((currentValue) => !currentValue)}
            disabled={resourceRequestState === 'loading'}
          >
            {resourceRequestState === 'loading' ? 'Requesting...' : 'Request again'}
          </button>
        </div>
  );
}
