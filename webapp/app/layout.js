"use client";

// Импорт стилей
import "./globals.css";

// Импорт компонентов
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { checkAuth } from "@/controllers/Auth";
import Registration from "@/components/ui/Registration/Registration";
import Preloader from "@/components/ui/Preloader/Preloader";
import Page from "@/components/ui/Page/Page";
import Error from "@/components/ui/Error/Error";
import Script from 'next/script';

// Компонент
export default function RootLayout({ children }) {
  const [isTelegramScriptLoaded, setIsTelegramScriptLoaded] = useState(false);
  const [isPaymentScriptLoaded, setIsPaymentScriptLoaded] = useState(false);
  const [check, setCheck] = useState(null);
  const [error, setError] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isTelegramScriptLoaded) return;
    if (!isPaymentScriptLoaded) return;

    // Список исключенных маршрутов
    const excludedRoutes = ['/policy', '/oferta'];

    // Если путь не входит в список исключенных маршрутов
    if (excludedRoutes.includes(pathname)) {
      setCheck(true);
      return;
    }

    const fetchAuth = async () => {
      try {
        if (window.Telegram && Telegram.WebApp) {
          if (Telegram.WebApp.initData === '') {
            setCheck(false);
            return;
          }
          // Проверяем авторизацию пользователя
          const { access, error } = await checkAuth(Telegram.WebApp.initData);
          // Если нет ошибки
          if (!error) { setCheck(true) };
          // Если авторизация не пройдена
          if (access === 'registration') { setCheck('registration') };
          // Если произошла ошибка
          if (error) { setError(error); setCheck(error) }
        }
      } catch (error) {
        setCheck(false);
      }
    };

    fetchAuth();
  }, [isTelegramScriptLoaded, isPaymentScriptLoaded, pathname]);

  // Если проверка еще не завершена
  if (check === null) {
    return (
      <html lang="ru">
        <head>
          <Script src="https://telegram.org/js/telegram-web-app.js" onLoad={() => setIsTelegramScriptLoaded(true)} />
          <Script src="https://widget.cloudpayments.ru/bundles/cloudpayments.js" onLoad={() => setIsPaymentScriptLoaded(true)} />
        </head>
        <body className="root">
          <Page>
            <Preloader />
          </Page>
        </body>
      </html>
    );
  }

  // Если ошибка авторизации
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

  // Если авторизация не пройдена
  if (check === 'registration') {
    return (
      <html lang="ru">
        <head>
          <Script src="https://telegram.org/js/telegram-web-app.js" onLoad={() => setIsScriptLoaded(true)} />
        </head>
        <body className="root">
          <Registration />
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
