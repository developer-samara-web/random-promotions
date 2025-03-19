// Создание акции
export default async function createPromotion(formData) {
    const data = {
        title: formData.title,
        description: formData.description,
        winners_count: formData.winners_count,
        image: formData.image,
        subscribe: formData.subscribe,
        start_date: formData.start_date,
        end_date: formData.end_date,
    }

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}