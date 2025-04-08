// Импорт стилей
import "@/components/ui/List/List.modules.css";

// Импорт компонентов
import { useState, useEffect } from "react";
import { getPromotions } from "@/controllers/Promotions";
import TarifFields from "@/data/fields/Tariff.json";
import PromotionFields from "@/data/fields/Promotion.json";
import Button from "@/components/ui/Button/Button";
import Preloader from "@/components/ui/Preloader/Preloader";
import Error from "@/components/ui/Error/Error";
import Image from "@/components/ui/Image/Image";

// Компонент
export default function List({ name, search, items }) {
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
                    {search && (<input className="list-input" placeholder={`Поиск...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />)}
                </div>
                <h2 className="list-title">{name}</h2>
                {search ? filteredItems ? (
                    filteredItems.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="flex justify-center w-full py-4 bg-[#2b7fff24] rounded-t-xl border-b border-[#224684]">
                                <div className="list-badge bg-[#2b7fff] rounded-4xl px-3 py-1 text-xs font-medium uppercase truncate mx-10">
                                    {item.title}
                                </div>
                            </div>

                            <div className="divide-y divide-[#224684] w-full">
                                {PromotionFields.map((field) => {
                                    if (!item.hasOwnProperty(field.name)) return null;

                                    return (
                                        <div key={field.id} className="w-full p-3 flex justify-between">
                                            <span className="font-medium text-xs truncate">{field.placeholder}:</span>
                                            <span className="font-medium text-xs truncate">
                                                {item[field.name]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <Error title="Акции не найдены" description="Попробуйте изменить поисковый запрос или попробуйте повторить попытку позже." />
                ) : (
                    items.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="flex justify-center w-full py-4 bg-[#2b7fff24] rounded-t-xl border-b border-[#224684]">
                                <div className="list-badge bg-[#2b7fff] rounded-4xl px-3 py-1 text-xs font-medium uppercase">
                                    {item.name}
                                </div>
                            </div>

                            <div className="divide-y divide-[#224684] w-full">
                                {TarifFields.map((field) => {
                                    if (!item.hasOwnProperty(field.name)) return null;

                                    return (
                                        <div key={field.id} className="w-full p-3 flex justify-between">
                                            <span className="font-medium text-xs">{field.placeholder}:</span>
                                            <span className="font-medium text-xs">
                                                {item[field.name]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}