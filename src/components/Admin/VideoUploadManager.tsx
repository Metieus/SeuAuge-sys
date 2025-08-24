import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Trash2,
  Settings,
  FileVideo,
  Clock,
  Users
} from 'lucide-react';
import { videoUploadService, type VideoUploadOptions, type UploadProgress } from '../../services/videoUploadService';
import toast from 'react-hot-toast';

interface VideoUploadData {
  title: string;
  description: string;
  category: string;
  instructor: string;
  isFree: boolean;
  tags: string[];
}

const VideoUploadManager: React.FC = () => {
  const [uploadData, setUploadData] = useState<VideoUploadData>({
    title: '',
    description: '',
    category: '',
    instructor: '',
    isFree: false,
    tags: []
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Treino',
    'Nutrição',
    'Mindfulness',
    'Yoga',
    'Cardio',
    'Força',
    'Flexibilidade',
    'Meditação'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-preencher título se estiver vazio
      if (!uploadData.title) {
        setUploadData(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '') // Remove extensão
        }));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo de vídeo');
      return;
    }

    if (!uploadData.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const options: VideoUploadOptions = {
        title: uploadData.title,
        description: uploadData.description,
        category: uploadData.category,
        instructor: uploadData.instructor,
        isFree: uploadData.isFree,
        tags: uploadData.tags,
        onProgress: (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        }
      };

      const result = await videoUploadService.uploadVideo(selectedFile, options);
      
      setUploadedVideos(prev => [result, ...prev]);
      
      toast.success('Vídeo enviado com sucesso!');
      
      // Reset form
      setUploadData({
        title: '',
        description: '',
        category: '',
        instructor: '',
        isFree: false,
        tags: []
      });
      setSelectedFile(null);
      setUploadProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const loadVideos = async () => {
    try {
      setLoadingVideos(true);
      const videos = await videoUploadService.listVideos();
      setUploadedVideos(videos);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Erro ao carregar vídeos');
    } finally {
      setLoadingVideos(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Tem certeza que deseja deletar este vídeo?')) {
      return;
    }

    try {
      await videoUploadService.deleteVideo(videoId);
      setUploadedVideos(prev => prev.filter(v => v.id !== videoId));
      toast.success('Vídeo deletado com sucesso');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Erro ao deletar vídeo');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !uploadData.tags.includes(tagInput.trim())) {
      setUploadData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setUploadData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Gerenciador de Upload de Vídeos
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Upload e gerenciamento de conteúdo de vídeo
            </p>
          </div>
          <button
            onClick={loadVideos}
            disabled={loadingVideos}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingVideos ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Carregar Vídeos
          </button>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Título do Vídeo *
              </label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Digite o título do vídeo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Descrição
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Descreva o conteúdo do vídeo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Categoria
                </label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Instrutor
                </label>
                <input
                  type="text"
                  value={uploadData.instructor}
                  onChange={(e) => setUploadData(prev => ({ ...prev, instructor: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="Nome do instrutor"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={uploadData.isFree}
                  onChange={(e) => setUploadData(prev => ({ ...prev, isFree: e.target.checked }))}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Vídeo gratuito
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="Adicionar tag"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Arquivo de Vídeo *
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                {selectedFile ? (
                  <div className="space-y-4">
                    <FileVideo className="w-12 h-12 mx-auto text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover arquivo
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      Clique para selecionar um arquivo de vídeo
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      MP4, WebM, AVI, MOV (máx. 100MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Selecionar Arquivo
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enviando vídeo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading || !uploadData.title.trim()}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Vídeo
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Uploaded Videos List */}
      {uploadedVideos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Vídeos Enviados ({uploadedVideos.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate">
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(video.uploadDate)}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {video.isFree ? 'Gratuito' : 'Premium'}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {video.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300 text-xs rounded">
                      +{video.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoUploadManager;
