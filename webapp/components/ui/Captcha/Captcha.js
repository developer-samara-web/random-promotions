// Импорт компонентов
import { useEffect } from 'react';

// Компонент
export default function Captcha() {
    // Подключаем скрипт Cloudflare
    useEffect(() => {
        // Загрузка скрипта Turnstile
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        document.body.appendChild(script);

        return () => { document.body.removeChild(script) };
    }, []);

    return (
        <div className="cf-turnstile" data-sitekey="0x4AAAAAABBibm1-GBlBxhqo" data-callback="onSubmitCallback"></div>
    );
}