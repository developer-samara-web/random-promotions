// Импорт стилей
import "@/components/ui/Preloader/Preloader.modules.css";

// Импорт компонентов
import Page from "@/components/ui/Page/Page";

// Компонент
export default function Preloader({ title }) {
	return (
		<Page>
			<div className="preloader w-full">
				<div className="preloader_spinner"></div>
				<div className="preloader_content"> {title ? title : 'Загружаю данные'}</div>
			</div>
		</Page>
	)
}