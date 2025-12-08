// Импорт стилей
import "@/components/ui/List/List.modules.css";

// Импорт компонентов
import { useState } from "react";
import PromotionFields from "@/data/fields/Promotion.json";
import Error from "@/components/ui/Error/Error";
import Image from "next/image";
// Компонент
export default function List({ name, search, items, button }) {
	const [searchQuery, setSearchQuery] = useState('');

	// Фильтрация акций
	const filteredItems = items.filter(item => {
		const searchField = item.title || item.name;
		return searchField.toLowerCase().includes(searchQuery.toLowerCase());
	});

	return (
		<section className="list">
			<div className="list-items flex flex-col gap-5">
				<div className="list-header">
					{search && (
						<input
							className="list-input"
							placeholder="Поиск..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					)}
				</div>

				<h2 className="list-title">{name}</h2>

				{search ? (
					filteredItems && filteredItems.length > 0 ? (
						filteredItems.map((item) => (
							<div key={item._id} className="list-item">
								<div className="flex justify-center w-full py-4 bg-[#2b7fff24] rounded-t-xl border-b border-[#224684]">
									<div className="list-badge bg-[#2b7fff] rounded-4xl px-3 py-1 text-xs font-medium uppercase truncate mx-10">
										{item.title}
									</div>
								</div>

								<div className="divide-y divide-[#224684] w-full">
									{PromotionFields.map((field, index) => {

										if (!item.hasOwnProperty(field.name)) return null;

										if (field.type === 'image') {
											return (
												<div key={field.id} className="w-full p-3 flex justify-center">
													<Image
														src={item[field.name]}
														alt={field.placeholder}
														className="max-h-20 object-cover rounded-lg"
														width={500}
														height={500}
													/>
												</div>
											);
										}

										let value;
										switch (field.type) {
											case 'toogle':
												value = item[field.name] ? 'Да' : 'Нет';
												break;
											default:
												value = item[field.name];
										}

										return (
											<div key={field.id} className="w-full p-3 flex justify-between">
												<span className="font-medium text-xs truncate">{field.placeholder}:</span>
												<span className="font-medium text-xs truncate">{value}</span>
											</div>
										);
									})}
								</div>
							</div>
						))
					) : (
						<Error
							title="Раздачи не найдены"
							description="Попробуйте изменить поисковый запрос или повторите попытку позже."
						/>
					)
				) : null}
			</div>
		</section>
	);
}