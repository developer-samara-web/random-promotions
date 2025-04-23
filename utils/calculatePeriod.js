// Функция подсчёта периода дат
export default function (period) {
    const startDate = new Date();
    const endDate = new Date(startDate);

    let numericPeriod;

    // Проверяем тип периода
    if (typeof period === "string") {
        if (!isNaN(parseInt(period, 10))) {
            numericPeriod = parseInt(period, 10);
        } else {
            switch (period) {
                case "Month":
                    endDate.setMonth(endDate.getMonth() + 1);
                    break;
                case "Week":
                    endDate.setDate(endDate.getDate() + 7);
                    break;
                default:
                    throw new Error("Неподдерживаемый период: " + period);
            }
        }
    } else if (typeof period === "number") {
        numericPeriod = period;
    } else {
        throw new Error("Период должен быть строкой или числом");
    }

    // Проверяем числовой период
    if (numericPeriod !== undefined) {
        if (numericPeriod <= 0) {
            throw new Error("Период должен быть положительным числом");
        }
        endDate.setDate(endDate.getDate() + numericPeriod);
    }

    // Возвращаем даты
    return {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
    };
}