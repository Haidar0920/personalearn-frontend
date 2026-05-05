import {useState} from 'react';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import Icon from '../components/Icon';
import Button from '../components/Button';
import trainingMaterialsData from '../data/trainingMaterials2.json';

export default function TrainingMaterials() {
    const [activeTab, setActiveTab] = useState('all');
    const [showUploadModal, setShowUploadModal] = useState(false);

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            Видео: 'bg-blue-500/90',
            PDF: 'bg-orange-500/90',
            Аудио: 'bg-purple-600/90',
        };
        return colors[type] || 'bg-blue-500/90';
    };

    const filteredMaterials =
        activeTab === 'all'
            ? trainingMaterialsData.materials
            : trainingMaterialsData.materials.filter((m) => {
                const tab = trainingMaterialsData.tabs.find((t) => t.id === activeTab);
                if (!tab) return false;
                return m.type === tab.label;
            });

    return (
        <PersonaLearnLayout title="Материалы обучения" showSearch>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 m-8">
                <div>
                    <h2 className="text-[#111418] text-3xl font-black leading-tight tracking-tight">
                        Материалы обучения
                    </h2>
                    <p className="text-[#617289] mt-1">
                        Управляйте контентом и учебными модулями для ваших менеджеров
                    </p>
                </div>
            </div>

            <div className="m-8 flex border-b border-[#dbe0e6] mb-8 overflow-x-auto scrollbar-hide">
                {trainingMaterialsData.tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 border-b-2 px-4 pb-4 font-bold text-sm transition-colors whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-[#617289] hover:text-blue-500'
                        }`}
                    >
                        {tab.icon && <Icon name={tab.icon} className="text-lg"/>}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className="bg-blue-500/10 px-2 py-0.5 rounded text-[10px]">{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="m-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMaterials.map((material) => (
                    <div
                        key={material.id}
                        className="group bg-white border border-[#dbe0e6] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                        <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{backgroundImage: `url("${material.thumbnail}")`}}
                            />
                            {material.duration && (
                                <div
                                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {material.duration}
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 flex gap-1">
                <span
                    className={`${getTypeColor(material.type)} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider`}>
                  {material.type}
                </span>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-[#111418] font-bold text-base leading-tight mb-3 line-clamp-2">
                                {material.title}
                            </h3>
                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs text-[#617289] font-medium">Мастерство</span>
                                    <span className="text-xs text-blue-500 font-bold">{material.mastery}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full"
                                         style={{width: `${material.mastery}%`}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-[#111418]">Загрузить новый материал</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-[#617289] hover:text-black transition-colors"
                            >
                                <Icon name="close"/>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div
                                className="border-2 border-dashed border-[#dbe0e6] rounded-xl p-8 flex flex-col items-center justify-center bg-[#f6f7f8] hover:border-blue-500 transition-colors cursor-pointer">
                                <Icon name="cloud_upload" className="text-4xl text-blue-500 mb-2"/>
                                <p className="text-sm font-semibold text-[#111418]">Выберите файл или перетащите его
                                    сюда</p>
                                <p className="text-xs text-[#617289] mt-1">Поддерживаемые форматы: MP4, MP3, PDF (макс.
                                    100MB)</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#111418] mb-1.5">
                                        Название материала
                                    </label>
                                    <input
                                        className="w-full bg-white border-[#dbe0e6] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2"
                                        placeholder="Введите название курса или файла"
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#111418] mb-1.5">
                                        Цель обучения
                                    </label>
                                    <textarea
                                        className="w-full bg-white border-[#dbe0e6] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2"
                                        placeholder="Чему научится сотрудник после изучения?"
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[#111418] mb-1.5">
                                            Целевая аудитория
                                        </label>
                                        <select
                                            className="w-full bg-white border-[#dbe0e6] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2">
                                            <option>Все сотрудники</option>
                                            <option>Новички (Onboarding)</option>
                                            <option>Менеджеры по продажам</option>
                                            <option>Аккаунт-менеджеры</option>
                                            <option>Руководители групп</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#111418] mb-1.5">
                                            Тип контента
                                        </label>
                                        <select
                                            className="w-full bg-white border-[#dbe0e6] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2">
                                            <option>Видео-урок</option>
                                            <option>Аудио-тренинг</option>
                                            <option>PDF-инструкция</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="px-6 py-2.5 text-sm font-bold text-[#617289] hover:text-[#111418] transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                className="px-8 py-2.5 bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
                                Опубликовать
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PersonaLearnLayout>
    );
}
