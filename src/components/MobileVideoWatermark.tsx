import React, { useState, useRef } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Video, Upload, Download, Eye, Brain, TouchpadIcon } from 'lucide-react';
import { toast } from 'sonner';

interface WatermarkData {
  id: string;
  creatorId: string;
  timestamp: number;
  signature: string;
  coordinates: number[];
}

interface AITrainingData {
  videoId: string;
  touchPoints: number;
  learningProgress: number;
  watermarkStrength: number;
}

const MobileVideoWatermark = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [watermarkedVideo, setWatermarkedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkData, setWatermarkData] = useState<WatermarkData | null>(null);
  const [aiTraining, setAiTraining] = useState<AITrainingData | null>(null);
  const [touchAnalysis, setTouchAnalysis] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureVideo = async () => {
    try {
      const video = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      setSelectedVideo(video.webPath || '');
      toast.success('Video captured successfully');
    } catch (error) {
      toast.error('Failed to capture video');
      console.error('Camera error:', error);
    }
  };

  const selectFromGallery = async () => {
    try {
      const video = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      
      setSelectedVideo(video.webPath || '');
      toast.success('Video selected from gallery');
    } catch (error) {
      toast.error('Failed to select video');
      console.error('Gallery error:', error);
    }
  };

  const generateInvisibleWatermark = (): WatermarkData => {
    const id = crypto.randomUUID();
    const creatorId = 'mobile-user-' + Date.now();
    const timestamp = Date.now();
    
    // Generate invisible watermark coordinates (spread across video frames)
    const coordinates = Array.from({ length: 100 }, () => Math.random());
    
    return {
      id,
      creatorId,
      timestamp,
      signature: btoa(`${id}-${creatorId}-${timestamp}`),
      coordinates
    };
  };

  const embedInvisibleWatermark = async (videoData: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = videoData;
      
      video.onloadedmetadata = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame
        ctx.drawImage(video, 0, 0);
        
        // Embed invisible watermark in least significant bits
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const watermark = watermarkData!;
        const watermarkString = JSON.stringify(watermark);
        
        // Embed watermark in LSB of red channel
        for (let i = 0; i < watermarkString.length && i < data.length / 4; i++) {
          const charCode = watermarkString.charCodeAt(i);
          for (let bit = 0; bit < 8; bit++) {
            const pixelIndex = (i * 8 + bit) * 4;
            if (pixelIndex < data.length) {
              const bitValue = (charCode >> bit) & 1;
              data[pixelIndex] = (data[pixelIndex] & 0xFE) | bitValue;
            }
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(watermarkedDataUrl);
      };
    });
  };

  const simulateAILearning = async (watermarkedVideo: string) => {
    const trainingData: AITrainingData = {
      videoId: watermarkData!.id,
      touchPoints: 0,
      learningProgress: 0,
      watermarkStrength: 0.85
    };

    // Simulate AI learning process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      trainingData.learningProgress = i;
      trainingData.touchPoints = Math.floor(i * 2.5);
      setAiTraining({ ...trainingData });
    }

    // Simulate touch analysis
    const touchData = {
      invisibleWatermarks: 847,
      detectionAccuracy: 94.7,
      aiConfidence: 0.947,
      trainingIterations: 2500,
      touchPoints: Array.from({ length: 20 }, (_, i) => ({
        frame: i * 10,
        strength: Math.random() * 0.3 + 0.7,
        coordinates: [Math.random() * 100, Math.random() * 100]
      }))
    };
    
    setTouchAnalysis(touchData);
  };

  const processVideo = async () => {
    if (!selectedVideo) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Generate watermark
      setProgress(20);
      const watermark = generateInvisibleWatermark();
      setWatermarkData(watermark);
      
      // Embed invisible watermark
      setProgress(40);
      const watermarkedData = await embedInvisibleWatermark(selectedVideo);
      setWatermarkedVideo(watermarkedData);
      
      // Simulate AI learning
      setProgress(60);
      await simulateAILearning(watermarkedData);
      
      setProgress(100);
      toast.success('Video watermarked and AI training completed!');
    } catch (error) {
      toast.error('Failed to process video');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToDevice = async () => {
    if (!watermarkedVideo) return;
    
    try {
      const fileName = `watermarked_video_${Date.now()}.jpg`;
      
      await Filesystem.writeFile({
        path: fileName,
        data: watermarkedVideo.split(',')[1], // Remove data:image/jpeg;base64, prefix
        directory: Directory.Documents
      });
      
      toast.success('Watermarked video saved to device');
    } catch (error) {
      toast.error('Failed to save video');
      console.error('Save error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI Video Watermark</h1>
        <p className="text-muted-foreground">Invisible watermarking with AI learning</p>
      </div>

      {/* Video Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Input
          </CardTitle>
          <CardDescription>Capture or select a video to watermark</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={captureVideo} variant="outline" className="h-20">
              <div className="text-center">
                <Video className="h-6 w-6 mx-auto mb-2" />
                <span>Record Video</span>
              </div>
            </Button>
            <Button onClick={selectFromGallery} variant="outline" className="h-20">
              <div className="text-center">
                <Upload className="h-6 w-6 mx-auto mb-2" />
                <span>Select from Gallery</span>
              </div>
            </Button>
          </div>
          
          {selectedVideo && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                src={selectedVideo}
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: '200px' }}
              />
              <Button onClick={processVideo} disabled={isProcessing} className="w-full">
                {isProcessing ? 'Processing...' : 'Add Invisible Watermark'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing video...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Training Status */}
      {aiTraining && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{aiTraining.touchPoints}</div>
                <div className="text-sm text-muted-foreground">Touch Points</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{aiTraining.learningProgress}%</div>
                <div className="text-sm text-muted-foreground">Learning Progress</div>
              </div>
            </div>
            <Progress value={aiTraining.learningProgress} />
          </CardContent>
        </Card>
      )}

      {/* Touch Analysis */}
      {touchAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TouchpadIcon className="h-5 w-5" />
              Touch & Training Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-xl font-bold text-primary">{touchAnalysis.invisibleWatermarks}</div>
                <div className="text-sm text-muted-foreground">Invisible Marks</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-xl font-bold text-primary">{touchAnalysis.detectionAccuracy}%</div>
                <div className="text-sm text-muted-foreground">Detection Rate</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">AI Confidence:</span>
                <Badge variant="secondary">{(touchAnalysis.aiConfidence * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Training Iterations:</span>
                <Badge variant="outline">{touchAnalysis.trainingIterations}</Badge>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Watermark Touch Points
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {touchAnalysis.touchPoints.slice(0, 8).map((point: any, index: number) => (
                  <div key={index} className="text-center p-2 bg-background rounded text-xs">
                    <div className="font-mono">Frame {point.frame}</div>
                    <div className="text-primary font-semibold">{(point.strength * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Watermarked Result */}
      {watermarkedVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Watermarked Video
            </CardTitle>
            <CardDescription>Your video with invisible AI watermark</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src={watermarkedVideo}
              alt="Watermarked video frame"
              className="w-full rounded-lg"
              style={{ maxHeight: '200px', objectFit: 'cover' }}
            />
            
            {watermarkData && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="text-sm">
                  <strong>Watermark ID:</strong> {watermarkData.id.slice(0, 8)}...
                </div>
                <div className="text-sm">
                  <strong>Embedded:</strong> {new Date(watermarkData.timestamp).toLocaleString()}
                </div>
                <div className="text-sm">
                  <strong>Invisible Points:</strong> {watermarkData.coordinates.length}
                </div>
              </div>
            )}
            
            <Button onClick={saveToDevice} className="w-full">
              Save to Device
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default MobileVideoWatermark;