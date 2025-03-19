// Импорт стилей
import "@/components/ui/Form/Form.modules.css";

// Импорт компонентов
import Form from "next/form";
import Button from "@/components/ui/Button/Button";

// Компонент
export default function FormQuery({ action, fields, button }) {
    return (
        <Form className="form" action={action}>
            {fields.map(({ id, name, placeholder }) => (
                <input className="form-input" key={id} name={name} placeholder={placeholder}></input>
            ))}
            <Button title={button} type="submit" />
        </Form>
    );
}