// Проверка на лимит участий в месяц
export default function checkLimit(participations) {
    return participations.filter(participation => {
        const partDate = new Date(participation.participation_date);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return (
            partDate.getMonth() === currentMonth &&
            partDate.getFullYear() === currentYear
        );
    });
}