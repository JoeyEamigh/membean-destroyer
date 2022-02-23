import React, { useEffect, useState } from 'react';

export default function Popup() {
  const [url, setUrl] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = tab.url;
      setUrl(url || '');
    });
    chrome.storage.sync.get('enabled', (result) => setEnabled(result.enabled));
  }, []);

  // if (!url.includes('membean.com')) return <NotOnMembean />;
  // if (!url.includes('training_sessions')) return <NotOnTrainingSessions />;

  return (
    <main>
      <h1 className="text-2xl text-center px-4">Membean Training Session</h1>
      <section className="flex flex-col mt-4 items-center">
        <h2 className="text-xl">Settings</h2>
        <div className="flex flex-col mt-4 items-center">
          <button
            onClick={enableOrDisable}
            className="justify-self-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {enabled
              ? 'Enabled (click to disable)'
              : 'Disabled (click to enable)'}
          </button>
        </div>
      </section>
    </main>
  );

  function enableOrDisable() {
    chrome.storage.sync.set({ enabled: !enabled });
    setEnabled(!enabled);
  }
}

function NotOnTrainingSessions() {
  return (
    <main className="justify-center">
      <h1 className="text-2xl text-center px-4">
        To activate the extension, start a training session.
      </h1>
    </main>
  );
}

function NotOnMembean() {
  return (
    <main>
      <h1 className="text-2xl text-center">
        This extension automatically does Membean work.
      </h1>

      <a
        className="mt-12 justify-self-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        href="https://membean.com/dashboard?"
        target="_blank"
        rel="noopener noreferrer"
      >
        Go there now!
      </a>
    </main>
  );
}
