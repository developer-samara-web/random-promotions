// Импорт стилей
import "@/components/ui/Form/Form.modules.css";

// Импорт компонентов
import { useState } from "react"
import { MuiFileInput } from "mui-file-input"
import uploadDigitalOcean from "@/controllers/Upload";
import styleFileInput from "@/data/style/File"
import Button from "@/components/ui/Button/Button";
import Switch from "@/components/ui/Switch/Switch";
import Success from "@/components/ui/Success/Success"

// Компонент
export default function Form({ onSubmit, fields, buttonName, buttonIcon, formData, setFormData, Telegram }) {
    const [files, setFiles] = useState({});
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState([]);

    // Обработка переключателя
    const handleSwitchChange = (newValue) => {
        setFormData(prev => ({
            ...prev,
            requires_subscription: newValue,
        }));
    };

    // Обработка переключателя картинок
    const handleFileChange = async (newFile, fieldName) => {
        const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
        const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
        const isImage = allowedFormats.includes(newFile.type);
        const isSizeValid = newFile.size <= MAX_FILE_SIZE;

        if (!isImage || !isSizeValid) {
            setError((prevData) => {
                const newError = isImage
                    ? "Размер файла не должен превышать 3 MB."
                    : "Доступные форматы PNG, JPG, JPEG.";
                return prevData.includes(newError) ? prevData : [...prevData, newError];
            });
            setFiles((prevFiles) => ({ ...prevFiles, [fieldName]: null }));
            return;
        }

        try {
            // Загружаем файл в DigitalOcean
            const { file_url } = await uploadDigitalOcean(newFile);


            // Обновляем files для локального хранения файла (если нужно)
            setFiles((prevFiles) => ({ ...prevFiles, [fieldName]: newFile }));

            // Записываем URL в formData
            setFormData((prevData) => ({ ...prevData, [fieldName]: file_url }));
        } catch (uploadError) {
            console.error("Ошибка загрузки файла:", uploadError);
            setError((prevData) => [
                ...prevData,
                "Не удалось загрузить файл. Попробуйте еще раз.",
            ]);
            setFiles((prevFiles) => ({ ...prevFiles, [fieldName]: null }));
        }
    };

    // Обработка ввода данных
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (error.length > 0) {
            return;
        }

        try {
            const data = {
                ...formData,
                start_date: new Date(formData.start_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString()
            }
            await onSubmit(data);

            setFormData({});
            setFiles({});
            setError([]);
            setSuccess(true);

            // Скрываем уведомление через 5 секунды (опционально)
            setTimeout(() => setSuccess(false), 5000);
        } catch (submitError) {
            console.error("Ошибка при отправке формы:", submitError);
            setError((prevData) => [
                ...prevData,
                "Не удалось отправить форму. Попробуйте еще раз.",
            ]);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            {success && (
                <div className="sticky top-5 left-0">
                    <Success title="Акция создалась" description="Акция отправлена в очередь и будет опубликована согласно расписанию." />
                </div>
            )}
            {error.length > 0 && (
                <div className="form-error text-red-500 mb-4">
                    {error.map((err, index) => (
                        <p key={index}>{err}</p>
                    ))}
                </div>
            )}
            {fields?.map(({ id, name, placeholder, type, required, visible }) => (
                visible && (
                    <div key={id}>
                        {type === 'toogle' ? (
                            <Switch
                                value={formData.requires_subscription || false}
                                placeholder="Только для подписчиков"
                                onChange={handleSwitchChange}
                            />
                        ) : name === 'description' ? (
                            <div>
                                <label className="form-label" htmlFor={name}>
                                    {placeholder}: {required && <span className="text-red-600 text-lg">*</span>}
                                </label>
                                <textarea
                                    className="form-input"
                                    name={name}
                                    value={formData[name] || ""}
                                    onChange={handleChange}
                                    required={required}
                                    placeholder={placeholder}
                                    rows="4" // Задаем высоту в строках
                                />
                            </div>
                        ) : type === 'image' ? (
                            <>
                                <label className="form-label">{placeholder}: {required && <span className="text-red-600 text-lg">*</span>}</label>
                                <MuiFileInput
                                    value={files[name] || null}
                                    onChange={(newFile) => handleFileChange(newFile, name)}
                                    sx={styleFileInput}
                                    placeholder="Выберите файл..."
                                />
                            </>
                        ) : (
                            <div>
                                <label className="form-label" htmlFor={name}>
                                    {placeholder}: {required && <span className="text-red-600 text-lg">*</span>}
                                </label>
                                <input
                                    className="form-input"
                                    type={
                                        name === 'start_date' || name === 'end_date'
                                            ? 'datetime-local'
                                            : type
                                    }
                                    name={name}
                                    value={formData[name] || ""}
                                    onChange={handleChange}
                                    required={required}
                                    placeholder={placeholder}
                                />
                            </div>
                        )}
                    </div>
                )
            ))}
            <Button name={buttonName} icon={buttonIcon} />
        </form>
    );
}