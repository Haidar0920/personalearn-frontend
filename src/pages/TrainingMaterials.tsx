import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import Icon from '../components/Icon';
import { materialsApi, type Material } from '../api/materials';

type Tab = { id: string; label: string; icon?: string };

const TABS: Tab[] = [
  { id: 'all', label: 'Все', icon: 'grid_view' },
  { id: 'video', label: 'Видео', icon: 'play_circle' },
  { id: 'audio', label: 'Аудио', icon: 'headphones' },
  { id: 'pdf', label: 'PDF', icon: 'picture_as_pdf' },
];

export default function TrainingMaterials() {
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('Все сотрудники');
  const [contentType, setContentType] = useState<'video' | 'audio' | 'pdf'>('video');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMaterials = () => {
    setLoading(true);
    materialsApi
      .list()
      .then(setMaterials)
      .catch(() => toast.error('Не удалось загрузить материалы'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      video: 'bg-blue-500/90',
      Видео: 'bg-blue-500/90',
      pdf: 'bg-orange-500/90',
      PDF: 'bg-orange-500/90',
      audio: 'bg-purple-600/90',
      Аудио: 'bg-purple-600/90',
    };
    return colors[type] || 'bg-blue-500/90';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video: 'Видео',
      pdf: 'PDF',
      audio: 'Аудио',
    };
    return labels[type] || type;
  };

  const filteredMaterials =
    activeTab === 'all' ? materials : materials.filter((m) => m.type === activeTab);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Выберите файл');
      return;
    }
    if (!title.trim()) {
      toast.error('Введите название материала');
      return;
    }
    setUploading(true);
    try {
      await materialsApi.upload(file, {
        title: title.trim(),
        type: contentType,
        goal: goal.trim() || undefined,
        audience: targetAudience,
        publish: true,
      });
      toast.success('Материал загружен');
      setShowUploadModal(false);
      setTitle('');
      setGoal('');
      setFile(null);
      loadMaterials();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as { message?: string })?.message ??
        'Ошибка загрузки';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

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
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-blue-500 text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors"
        >
          <Icon name="upload" className="text-[18px]" />
          Загрузить материал
        </button>
      </div>

      <div className="m-8 flex border-b border-[#dbe0e6] mb-8 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 pb-4 font-bold text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-[#617289] hover:text-blue-500'
            }`}
          >
            {tab.icon && <Icon name={tab.icon} className="text-lg" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="m-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.length === 0 ? (
            <div className="col-span-full text-center py-16 text-slate-500">
              <Icon name="inbox" className="text-5xl mb-3 text-slate-300" />
              <p className="font-semibold">Материалы не найдены</p>
            </div>
          ) : (
            filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="group bg-white border border-[#dbe0e6] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full aspect-video bg-gray-100 overflow-hidden flex items-center justify-center">
                  <div className="text-slate-300">
                    <Icon name="play_circle" className="text-5xl" />
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    <span
                      className={`${getTypeColor(material.type)} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider`}
                    >
                      {getTypeLabel(material.type)}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-[#111418] font-bold text-base leading-tight mb-3 line-clamp-2">
                    {material.title}
                  </h3>
                  {material.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{material.description}</p>
                  )}
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-[#617289] font-medium">Опубликован</span>
                      <span className="text-xs font-bold">
                        {material.isPublished ? (
                          <span className="text-emerald-600">Да</span>
                        ) : (
                          <span className="text-orange-500">Нет</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#111418]">Загрузить новый материал</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#617289] hover:text-black transition-colors"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div
                className="border-2 border-dashed border-[#dbe0e6] rounded-xl p-8 flex flex-col items-center justify-center bg-[#f6f7f8] hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="cloud_upload" className="text-4xl text-blue-500 mb-2" />
                {file ? (
                  <p className="text-sm font-semibold text-[#111418]">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#111418]">
                      Выберите файл или перетащите его сюда
                    </p>
                    <p className="text-xs text-[#617289] mt-1">
                      Поддерживаемые форматы: MP4, MP3, PDF (макс. 100MB)
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp4,.mp3,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                    if (f) {
                      const ext = f.name.split('.').pop()?.toLowerCase();
                      if (ext === 'mp4') setContentType('video');
                      else if (ext === 'mp3') setContentType('audio');
                      else if (ext === 'pdf') setContentType('pdf');
                    }
                  }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111418] mb-1.5">
                    Название материала
                  </label>
                  <input
                    className="w-full bg-white border border-[#dbe0e6] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2"
                    placeholder="Введите название курса или файла"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111418] mb-1.5">
                    Цель обучения
                  </label>
                  <textarea
                    className="w-full bg-white border border-[#dbe0e6] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2"
                    placeholder="Чему научится сотрудник после изучения?"
                    rows={3}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#111418] mb-1.5">
                      Целевая аудитория
                    </label>
                    <select
                      className="w-full bg-white border border-[#dbe0e6] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    >
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
                      className="w-full bg-white border border-[#dbe0e6] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2"
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as 'video' | 'audio' | 'pdf')}
                    >
                      <option value="video">Видео-урок</option>
                      <option value="audio">Аудио-тренинг</option>
                      <option value="pdf">PDF-инструкция</option>
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
                onClick={handleUpload}
                disabled={uploading}
                className="px-8 py-2.5 bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Загрузка...' : 'Опубликовать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PersonaLearnLayout>
  );
}
