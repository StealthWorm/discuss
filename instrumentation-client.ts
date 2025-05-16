// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Função para capturar o uso de memória
const captureMemoryUsage = () => {
  if ('memory' in performance) {
    const memoryUsed = (performance as any).memory.usedJSHeap; // Memória usada em bytes
    Sentry.setMeasurement("memoryUsed", memoryUsed, "byte");
  } else {
    console.warn("API de memória não disponível no navegador.");
  }
};

// Função para monitorar acessos ao localStorage
const monitorLocalStorage = () => {
  let readCount = 0; // Contador de leituras do localStorage

  const originalGetItem = localStorage.getItem;
  localStorage.getItem = function (key) {
    readCount++; // Incrementa o contador de leituras
    Sentry.setMeasurement("localStorageRead", readCount, "read"); // Registra a medição
    return originalGetItem.apply(this, arguments);
  };
};

export const initSentry = () => {
  Sentry.init({
    dsn: "https://a5b4b6dae4c984a663e74333aa7a3e95@o4505417268854784.ingest.us.sentry.io/4507449459015680",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    replaysOnErrorSampleRate: 1.0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      Sentry.replayIntegration({
        // Additional Replay configuration goes in here, for example:
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration()
    ],

    // Para enviar a integridade de falhas da rede (opcional)
    sendDefaultPii: true, // Habilitar envio de informações pessoais como IPs, emails, etc.
  });
  // Iniciar as funções de monitoramento
  setInterval(captureMemoryUsage, 60000); // Captura de memória a cada 60 segundos
  monitorLocalStorage(); // Monitorar localStorage
}
