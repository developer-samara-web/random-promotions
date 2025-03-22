"use client";

// Импорт стилей
import "./globals.css";

// Импорт компонентов
import { useEffect, useState } from 'react';
import { useTelegramData } from "@/hooks/useTelegramData";
import getAuth from "@/controllers/Auth";
import Page from "@/components/ui/Page/Page";
import Preloader from "@/components/ui/Preloader/Preloader";
import Error from "@/components/ui/Error/Error";
import Script from 'next/script';

export default function RootLayout({ children }) {
  const [check, setCheck] = useState(null);
  const [error, setError] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const initData = useTelegramData();

  useEffect(() => {
    if (!isScriptLoaded || initData === null) return;

    const fetchAuth = async () => {
      try {
        if (initData === false) {
          setCheck(false);
          return;
        }

        const { error } = await getAuth(initData);
        if (error) setError(error);
        setCheck(!error);
      } catch (error) {
        console.error('Ошибка доступа:', error);
        setCheck(false);
      }
    };

    fetchAuth();
  }, [initData, isScriptLoaded]);

  // Если проверка еще не завершена
  if (check === null) {
    return (
      <html lang="ru">
        <head>
          <Script src="https://telegram.org/js/telegram-web-app.js" onLoad={() => setIsScriptLoaded(true)} />
        </head>
        <body className="root">
          <Page>
            <Preloader />
          </Page>
        </body>
      </html>
    );
  }

  // Если авторизация не пройдена
  if (check === false) {
    return (
      <html lang="ru">
        <head>
          <Script src="https://telegram.org/js/telegram-web-app.js" onLoad={() => setIsScriptLoaded(true)} />
        </head>
        <body className="root">
          <Page>
            <Error title="Произошла ошибка" description={error} />
          </Page>
        </body>
      </html>
    );
  }

  // Успешная авторизация
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          onLoad={() => setIsScriptLoaded(true)}
        />
      </head>
      <body className="root">{children}</body>
    </html>
  );
}
