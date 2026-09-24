import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LicenseInfo } from '@mui/x-license';
import theme from './src/theme';
import MainStyles from './src/main.styles';
import store from './src/store';
import { SnackbarProvider } from './src/context/snackbarContext';
import Main from './src/screens/Main/Main';
import Form1 from './src/screens/Main/Form1/Form1';

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_PRO);

const withDocs = new URLSearchParams(window.location.search).get('docs') === '1';
const tab = new URLSearchParams(window.location.search).get('tab') || '1';

const docket = {
  caseType: 'Driver License Suspension',
  county: 'Fulton',
  status: 'Pending',
  documents: withDocs
    ? [
        {
          id: 1,
          documentType: 'Notice of Hearing',
          name: 'notice-of-hearing-final-version-2026.pdf',
          date: '01/15/2026',
          description: 'Notice sent to petitioner regarding upcoming administrative hearing',
        },
      ]
    : [],
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <MainStyles />
          <SnackbarProvider>
            <MemoryRouter initialEntries={[{ pathname: '/form1/2', state: { docket, initialTab: tab } }]}>
              <Routes>
                <Route path="/" element={<Main />}>
                  <Route path="form1/:docketId" element={<Form1 />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </SnackbarProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  );
}

createRoot(document.getElementById('root')).render(<App />);

const clickTabLabel = new URLSearchParams(window.location.search).get('click');
if (clickTabLabel) {
  setTimeout(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const target = tabs.find((el) => el.textContent.toUpperCase().includes(clickTabLabel.toUpperCase()));
    target?.click();
  }, 1200);
}

setTimeout(() => {
  const info = document.createElement('div');
  info.id = 'measure';
  info.style.cssText =
    'position:fixed;top:0;left:0;background:black;color:white;padding:8px;z-index:99999;font-size:14px;white-space:pre;max-width:100vw;font-family:monospace';
  info.textContent = `scrollWidth=${document.documentElement.scrollWidth} clientWidth=${document.documentElement.clientWidth} innerWidth=${window.innerWidth} scrollHeight=${document.documentElement.scrollHeight} innerHeight=${window.innerHeight}`;
  document.body.appendChild(info);

  // Find the widest offenders: any element whose right edge exceeds the viewport width.
  const vw = window.innerWidth;
  const offenders = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && r.width > 0) {
      offenders.push({ el, right: r.right, width: r.width, left: r.left });
    }
  });
  offenders.sort((a, b) => b.right - a.right);
  const top = offenders.slice(0, 15).map((o) => {
    const el = o.el;
    const cls = typeof el.className === 'string' ? el.className : '';
    return `${el.tagName}.${cls.split(' ').slice(0, 3).join('.')} right=${Math.round(o.right)} width=${Math.round(o.width)} left=${Math.round(o.left)}`;
  });
  info.textContent += '\n' + top.join('\n');
  document.title = 'measured';
}, 3000);
