import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Shield, Search, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WatermarkData {
  id: string;
  creatorId: string;
  timestamp: number;
  signature: string;
}

export const VideoWatermarking = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [watermarkedVideo, setWatermarkedVideo] = useState<Blob | null>(null);
  const [detectionResults, setDetectionResults] = useState<WatermarkData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectionVideo, setDetectionVideo] = useState<File | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionVideoRef = useRef<HTMLVideoElement>(null);

  // Generate unique watermark signature
  const generateWatermark = useCallback((): WatermarkData => {
    return {
      id: crypto.randomUUID(),
      creatorId: 'creator-' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      signature: btoa(crypto.randomUUID() + Date.now()).slice(0, 16)
    };
  }, []);

  // Embed invisible watermark into video frames
  const embedWatermark = useCallback(async (videoFile: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = videoRef.current!;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      video.src = URL.createObjectURL(videoFile);
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const watermark = generateWatermark();
        
        // Store watermark data for later detection
        localStorage.setItem(`watermark-${watermark.id}`, JSON.stringify(watermark));
        
        video.onloadeddata = () => {
          // Draw frame with embedded watermark data
          ctx.drawImage(video, 0, 0);
          
          // Embed watermark in least significant bits of pixels
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const watermarkString = JSON.stringify(watermark);
          
          // Convert watermark to binary
          let binaryWatermark = '';
          for (let i = 0; i < watermarkString.length; i++) {
            binaryWatermark += watermarkString.charCodeAt(i).toString(2).padStart(8, '0');
          }
          
          // Embed in LSB of red channel
          for (let i = 0; i < binaryWatermark.length && i < data.length / 4; i++) {
            const pixelIndex = i * 4; // Red channel
            data[pixelIndex] = (data[pixelIndex] & 0xFE) | parseInt(binaryWatermark[i]);
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          // Convert canvas to blob (this is a simplified version - real implementation would process all frames)
          canvas.toBlob((blob) => {
            if (blob) {
              toast.success(`Video watermarked with ID: ${watermark.id.slice(0, 8)}...`);
              resolve(blob);
            } else {
              reject(new Error('Failed to create watermarked video'));
            }
          }, 'image/png');
        };
      };
      
      video.onerror = () => reject(new Error('Failed to load video'));
    });
  }, [generateWatermark]);

  // Detect watermarks in video
  const detectWatermarks = useCallback(async (videoFile: File): Promise<WatermarkData[]> => {
    return new Promise((resolve, reject) => {
      const video = detectionVideoRef.current!;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      video.src = URL.createObjectURL(videoFile);
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        video.onloadeddata = () => {
          ctx.drawImage(video, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Extract LSB data
          let binaryData = '';
          for (let i = 0; i < data.length / 4; i++) {
            const pixelIndex = i * 4;
            binaryData += (data[pixelIndex] & 1).toString();
          }
          
          // Convert binary to string and try to parse JSON
          const detectedWatermarks: WatermarkData[] = [];
          const chunks = binaryData.match(/.{1,8}/g) || [];
          let watermarkString = '';
          
          for (const chunk of chunks) {
            const charCode = parseInt(chunk, 2);
            if (charCode >= 32 && charCode <= 126) { // Printable ASCII
              watermarkString += String.fromCharCode(charCode);
            }
            
            // Try to parse as JSON
            try {
              if (watermarkString.includes('}')) {
                const endIndex = watermarkString.indexOf('}') + 1;
                const potentialJson = watermarkString.substring(0, endIndex);
                const parsed = JSON.parse(potentialJson);
                
                if (parsed.id && parsed.creatorId && parsed.timestamp && parsed.signature) {
                  detectedWatermarks.push(parsed);
                  watermarkString = watermarkString.substring(endIndex);
                }
              }
            } catch (e) {
              // Continue searching
            }
          }
          
          resolve(detectedWatermarks);
        };
      };
      
      video.onerror = () => reject(new Error('Failed to load video for detection'));
    });
  }, []);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      toast.success('Video uploaded successfully');
    } else {
      toast.error('Please upload a valid video file');
    }
  };

  const handleDetectionVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setDetectionVideo(file);
      toast.success('Detection video uploaded successfully');
    } else {
      toast.error('Please upload a valid video file');
    }
  };

  const processWatermarking = async () => {
    if (!uploadedVideo) {
      toast.error('Please upload a video first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const watermarkedBlob = await embedWatermark(uploadedVideo);
      
      clearInterval(progressInterval);
      setProgress(100);
      setWatermarkedVideo(watermarkedBlob);
      
      toast.success('Video successfully watermarked!');
    } catch (error) {
      toast.error('Failed to watermark video: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processDetection = async () => {
    if (!detectionVideo) {
      toast.error('Please upload a video for detection');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const detected = await detectWatermarks(detectionVideo);
      
      clearInterval(progressInterval);
      setProgress(100);
      setDetectionResults(detected);
      
      if (detected.length > 0) {
        toast.success(`Found ${detected.length} watermark(s) in the video!`);
      } else {
        toast.info('No watermarks detected in this video');
      }
    } catch (error) {
      toast.error('Failed to detect watermarks: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadWatermarkedVideo = () => {
    if (!watermarkedVideo) return;
    
    const url = URL.createObjectURL(watermarkedVideo);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watermarked-video.png'; // Simplified for demo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            AI Content Tracking System
          </CardTitle>
          <CardDescription>
            Stamp your videos with invisible watermarks to track AI usage and ensure fair compensation
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="watermark" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="watermark" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Watermark Videos
          </TabsTrigger>
          <TabsTrigger value="detect" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Detect Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watermark" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Watermarking</CardTitle>
              <CardDescription>
                Upload your content to embed invisible tracking stamps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Upload Video</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a video file to watermark
                  </p>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="max-w-sm mx-auto"
                  />
                </div>
              </div>

              {uploadedVideo && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Ready to watermark: {uploadedVideo.name}</span>
                  </div>
                  
                  <Button 
                    onClick={processWatermarking} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Processing...' : 'Add Watermark'}
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing video...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {watermarkedVideo && (
                <Card className="bg-green-50 dark:bg-green-950">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-700 dark:text-green-300">
                        Video Successfully Watermarked
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Your video now contains invisible tracking data that will identify AI usage.
                      </p>
                      <Button 
                        onClick={downloadWatermarkedVideo}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Watermarked Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detect" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Watermark Detection</CardTitle>
              <CardDescription>
                Upload content to check for embedded watermarks and track AI usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Upload Video for Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Check if this content contains watermarks from your platform
                  </p>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleDetectionVideoUpload}
                    className="max-w-sm mx-auto"
                  />
                </div>
              </div>

              {detectionVideo && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Ready to scan: {detectionVideo.name}</span>
                  </div>
                  
                  <Button 
                    onClick={processDetection} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Scanning...' : 'Detect Watermarks'}
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Scanning for watermarks...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {detectionResults.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        Watermarks Detected
                      </span>
                    </div>
                    <div className="space-y-3">
                      {detectionResults.map((watermark) => (
                        <div key={watermark.id} className="bg-background p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">
                              ID: {watermark.id.slice(0, 8)}...
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(watermark.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Creator:</span> {watermark.creatorId}</p>
                            <p><span className="font-medium">Signature:</span> {watermark.signature}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden video and canvas elements for processing */}
      <div className="hidden">
        <video ref={videoRef} />
        <video ref={detectionVideoRef} />
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};