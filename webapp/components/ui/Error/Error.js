// Импорт стилей
import "@/components/ui/Error/Error.modules.css";

// Импорт компонентов
import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";
import Page from "@/components/ui/Page/Page";

// Компонент "Ошибка"
export default function Error({ title, description }) {
	return (
		<Page>
			<div className="error">
				<div className="error-content">
					<div className="error-title">{title}</div>
					<div className="error-badge">
						<Icon name="ExclamationCircleIcon" className="size-4" />
						<span>ERROR</span>
					</div>
				</div>
				<div className="error-description">{description}</div>
				<Link className="error-button" href="https://t.me/gar_sem">Тех. поддержка</Link>
			</div>
		</Page>
	);
}