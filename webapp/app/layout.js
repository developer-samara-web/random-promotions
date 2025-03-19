// Импорт стилей
import "./globals.css";

// Компонент
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="root flex justify-center bg-slate-900">
        {children}
      </body>
    </html>
  );
}
