export default function checkLimit(user) {
    return user.participation.filter(participation => {
        const partDate = new Date(participation.date);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return (
            partDate.getMonth() === currentMonth &&
            partDate.getFullYear() === currentYear
        );
    });
}