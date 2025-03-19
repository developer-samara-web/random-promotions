// Импорт компонентов
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Promotion from "@/components/ui/Promotion/Promotion";
import Button from "@/components/ui/Button/Button";

// Component
export default function Home() {
    return (
        <Page>
            <Header title="Раздача № {id}" description="ID: {id}" />
            <Promotion title="{ Название акции }" description="{ Описание акции... }" />
            <Button title="Принять участие" />
        </Page>
    );
}