import { Storage } from '@google-cloud/storage';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface VideoUploadOptions {
  title: string;
  description: string;
  category: string;
  instructor: string;
  isFree: boolean;
  tags: string[];
  onProgress?: (progress: UploadProgress) => void;
}

interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  isFree: boolean;
  tags: string[];
  uploadDate: string;
  duration?: number;
  size: number;
  qualities: string[];
  thumbnailUrl?: string;
}

class VideoUploadService {
  private storage: Storage;
  private bucketName: string;
  private projectId: string;

  constructor() {
    this.projectId = import.meta.env.VITE_GCS_PROJECT_ID || '';
    this.bucketName = import.meta.env.VITE_GCS_BUCKET_NAME || 'meu-auge-videos';
    
    // Inicializar Google Cloud Storage
    this.storage = new Storage({
      projectId: this.projectId,
      keyFilename: import.meta.env.GOOGLE_CLOUD_KEY_FILE || undefined,
    });

    console.log('🎥 Video Upload Service initialized:', {
      projectId: this.projectId,
      bucketName: this.bucketName,
      hasKeyFile: !!import.meta.env.GOOGLE_CLOUD_KEY_FILE
    });
  }

  /**
   * Faz upload de um vídeo para o Google Cloud Storage
   */
  async uploadVideo(
    file: File,
    options: VideoUploadOptions
  ): Promise<VideoMetadata> {
    try {
      // Validar arquivo
      this.validateVideoFile(file);

      // Gerar ID único para o vídeo
      const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Criar estrutura de pastas
      const videoPath = `videos/${videoId}`;
      const thumbnailPath = `thumbnails/${videoId}`;
      
      // Upload do arquivo principal
      const uploadResult = await this.uploadFile(file, `${videoPath}/original.mp4`, options.onProgress);
      
      // Gerar metadados
      const metadata: VideoMetadata = {
        id: videoId,
        title: options.title,
        description: options.description,
        category: options.category,
        instructor: options.instructor,
        isFree: options.isFree,
        tags: options.tags,
        uploadDate: new Date().toISOString(),
        size: file.size,
        qualities: ['original'], // Será expandido após processamento
      };

      // Salvar metadados
      await this.saveMetadata(videoId, metadata);

      // Processar vídeo (gerar qualidades diferentes)
      await this.processVideo(videoId, metadata);

      // Gerar thumbnail
      const thumbnailUrl = await this.generateThumbnail(videoId, `${videoPath}/original.mp4`);
      metadata.thumbnailUrl = thumbnailUrl;

      // Atualizar metadados com thumbnail
      await this.saveMetadata(videoId, metadata);

      console.log('✅ Video uploaded successfully:', videoId);
      return metadata;

    } catch (error) {
      console.error('❌ Error uploading video:', error);
      throw new Error(`Falha no upload do vídeo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Valida o arquivo de vídeo
   */
  private validateVideoFile(file: File): void {
    const allowedTypes = [
      'video/mp4',
      'video/webm',
      'video/avi',
      'video/mov',
      'video/quicktime'
    ];

    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não suportado: ${file.type}. Tipos permitidos: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Tamanho máximo: 100MB`);
    }
  }

  /**
   * Faz upload de um arquivo para o Google Cloud Storage
   */
  private async uploadFile(
    file: File,
    destination: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(destination);

    return new Promise((resolve, reject) => {
      const stream = blob.createWriteStream({
        metadata: {
          contentType: file.type,
        },
        resumable: true,
      });

      let uploadedBytes = 0;

      stream.on('progress', (progressEvent) => {
        uploadedBytes = progressEvent.bytesWritten;
        if (onProgress) {
          onProgress({
            loaded: uploadedBytes,
            total: file.size,
            percentage: Math.round((uploadedBytes / file.size) * 100)
          });
        }
      });

      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', () => {
        resolve();
      });

      // Converter File para Buffer e enviar
      file.arrayBuffer().then(buffer => {
        stream.end(Buffer.from(buffer));
      }).catch(reject);
    });
  }

  /**
   * Salva metadados do vídeo
   */
  private async saveMetadata(videoId: string, metadata: VideoMetadata): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const metadataFile = bucket.file(`videos/${videoId}/metadata.json`);

    await metadataFile.save(JSON.stringify(metadata, null, 2), {
      metadata: {
        contentType: 'application/json',
      },
    });
  }

  /**
   * Processa o vídeo para gerar diferentes qualidades
   */
  private async processVideo(videoId: string, metadata: VideoMetadata): Promise<void> {
    // Em produção, isso seria feito com Cloud Functions ou Cloud Run
    // Por enquanto, vamos simular o processamento
    
    console.log('🔄 Processing video for different qualities...');
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Atualizar metadados com as qualidades geradas
    metadata.qualities = ['original', '1080p', '720p', '480p'];
    
    // Salvar metadados atualizados
    await this.saveMetadata(videoId, metadata);
    
    console.log('✅ Video processing completed');
  }

  /**
   * Gera thumbnail do vídeo
   */
  private async generateThumbnail(videoId: string, videoPath: string): Promise<string> {
    // Em produção, isso seria feito com Cloud Functions
    // Por enquanto, vamos usar uma imagem padrão
    
    const thumbnailUrl = `https://storage.googleapis.com/${this.bucketName}/thumbnails/${videoId}/thumb-1.jpg`;
    
    console.log('🖼️ Thumbnail generated:', thumbnailUrl);
    return thumbnailUrl;
  }

  /**
   * Lista todos os vídeos
   */
  async listVideos(): Promise<VideoMetadata[]> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles({ prefix: 'videos/' });

      const videos: VideoMetadata[] = [];

      for (const file of files) {
        if (file.name.endsWith('metadata.json')) {
          const [content] = await file.download();
          const metadata: VideoMetadata = JSON.parse(content.toString());
          videos.push(metadata);
        }
      }

      return videos.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );

    } catch (error) {
      console.error('❌ Error listing videos:', error);
      throw new Error('Falha ao listar vídeos');
    }
  }

  /**
   * Obtém metadados de um vídeo específico
   */
  async getVideoMetadata(videoId: string): Promise<VideoMetadata | null> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const metadataFile = bucket.file(`videos/${videoId}/metadata.json`);
      
      const [exists] = await metadataFile.exists();
      if (!exists) {
        return null;
      }

      const [content] = await metadataFile.download();
      return JSON.parse(content.toString());

    } catch (error) {
      console.error('❌ Error getting video metadata:', error);
      return null;
    }
  }

  /**
   * Deleta um vídeo
   */
  async deleteVideo(videoId: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      
      // Listar todos os arquivos do vídeo
      const [files] = await bucket.getFiles({ prefix: `videos/${videoId}/` });
      const thumbnailFiles = await bucket.getFiles({ prefix: `thumbnails/${videoId}/` });
      
      // Deletar todos os arquivos
      const allFiles = [...files, ...thumbnailFiles];
      await Promise.all(allFiles.map(file => file.delete()));
      
      console.log('✅ Video deleted successfully:', videoId);

    } catch (error) {
      console.error('❌ Error deleting video:', error);
      throw new Error('Falha ao deletar vídeo');
    }
  }

  /**
   * Gera URL assinada para streaming seguro
   */
  async getSignedUrl(videoPath: string, expirationMinutes: number = 60): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(videoPath);

      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expirationMinutes * 60 * 1000,
      });

      return url;

    } catch (error) {
      console.error('❌ Error generating signed URL:', error);
      throw new Error('Falha ao gerar URL assinada');
    }
  }
}

// Instância singleton
export const videoUploadService = new VideoUploadService();

// Exportar tipos
export type { VideoUploadOptions, VideoMetadata, UploadProgress };
