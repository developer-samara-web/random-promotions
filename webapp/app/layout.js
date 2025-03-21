"use client"

// Импорт стилей
import "./globals.css";

// Импорт компонентов
import { useEffect, useState } from 'react';
import { useTelegramData } from "@/hooks/useTelegramData";
import Page from "@/components/ui/Page/Page";
import Preloader from "@/components/ui/Preloader/Preloader";
import Error from "@/components/ui/Error/Error";
import Script from 'next/script';

// Компонент
export default function RootLayout({ children }) {
  const [check, setCheck] = useState(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const initData = useTelegramData()

  useEffect(() => {
    // Ждём загрузки скрипта и initData
    if (!isScriptLoaded || initData === null) return

    const fetchAuth = async () => {
      try {
        // Проверка данных
        if (initData === false) {
          setCheck(false);
          return;
        }

        // Проверяем авторизацию
        const { error } = await getAuth(initData);
        if (error) setError(error);
        setCheck(!error);
      } catch (error) {
        console.error('Ошибка доступа:', error);
        setCheck(false);
      }
    }

    fetchAuth()
  }, [initData, isScriptLoaded])

  // Если загрузка данных
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
    )
  }

  // Если не прошёл проверку
  if (check === false) {
    return (
      <html lang="ru">
        <head>
          <Script src="https://telegram.org/js/telegram-web-app.js" onLoad={() => setIsScriptLoaded(true)} />
        </head>
        <body className="root">
          <Page>
            <Error />
          </Page>
        </body>
      </html>
    )
  }

  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" onLoad={() => setIsScriptLoaded(true)} />
      </head>
      <body className="root">
        {children}
      </body>
    </html>
  );
}
