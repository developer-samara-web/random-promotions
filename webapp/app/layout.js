"use client";

// Импорт стилей
import "./globals.css";

// Импорт компонентов
import { useEffect, useState } from 'react';
import getAuth from "@/controllers/Auth";
import Page from "@/components/ui/Page/Page";
import Preloader from "@/components/ui/Preloader/Preloader";
import Error from "@/components/ui/Error/Error";
import Script from 'next/script';

export default function RootLayout({ children }) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [check, setCheck] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isScriptLoaded) return;

    const fetchAuth = async () => {
      try {
        if (window.Telegram && Telegram.WebApp) {
          if (Telegram.WebApp.initData === '') {
            setCheck(false);
            return;
          }

          const { error } = await getAuth(Telegram.WebApp.initData);

          if (error) setError(error);
          setCheck(!error);
        }
      } catch (error) {
        setCheck(false);
      }
    };

    fetchAuth();
  }, [isScriptLoaded]);

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
            <Error title="Произошла ошибка" description="Произошла ошибка при авторизации. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин." />
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
