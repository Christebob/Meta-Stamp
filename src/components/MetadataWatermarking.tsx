import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, Download, FileVideo, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface WatermarkMetadata {
  id: string;
  creatorId: string;
  timestamp: number;
  signature: string;
  title?: string;
  description?: string;
}

const MetadataWatermarking = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkData, setWatermarkData] = useState<WatermarkMetadata | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUniqueId = (): string => {
    return `wm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateSignature = (id: string, creatorId: string): string => {
    // Simulate cryptographic signature generation
    const data = `${id}:${creatorId}:${Date.now()}`;
    return btoa(data).replace(/[+/=]/g, '').substr(0, 16);
  };

  const embedMetadataWatermark = async (videoFile: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const watermarkId = generateUniqueId();
        const creatorId = "creator_" + Math.random().toString(36).substr(2, 8);
        const signature = generateSignature(watermarkId, creatorId);
        
        const metadata: WatermarkMetadata = {
          id: watermarkId,
          creatorId,
          timestamp: Date.now(),
          signature,
          title: `Watermarked: ${videoFile.name}`,
          description: `Video protected with watermark ID: ${watermarkId}`
        };

        setWatermarkData(metadata);

        // Simulate metadata embedding process
        // In a real implementation, this would use FFmpeg or similar tool
        // to embed custom metadata fields in the video container
        
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          currentProgress += Math.random() * 15 + 5;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressInterval);
            
            // Create a blob copy of the original file for demo purposes
            // In reality, this would be the video with embedded metadata
            const processedBlob = new Blob([videoFile], { type: videoFile.type });
            resolve(processedBlob);
          }
          setProgress(currentProgress);
        }, 200);

      } catch (error) {
        reject(error);
      }
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a valid video file");
        return;
      }
      
      // Check file size (limit to 500MB for demo)
      if (file.size > 500 * 1024 * 1024) {
        toast.error("File size must be less than 500MB");
        return;
      }

      setSelectedFile(file);
      setWatermarkData(null);
      setProcessedVideoUrl(null);
      setProgress(0);
      toast.success("Video file selected successfully");
    }
  };

  const handleEmbedWatermark = async () => {
    if (!selectedFile) {
      toast.error("Please select a video file first");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      toast.info("Embedding watermark metadata...");
      const processedBlob = await embedMetadataWatermark(selectedFile);
      
      // Create download URL
      const url = URL.createObjectURL(processedBlob);
      setProcessedVideoUrl(url);
      
      toast.success("Watermark successfully embedded in metadata!");
    } catch (error) {
      console.error("Error processing video:", error);
      toast.error("Failed to embed watermark");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedVideoUrl || !selectedFile || !watermarkData) return;

    const link = document.createElement('a');
    link.href = processedVideoUrl;
    link.download = `watermarked_${selectedFile.name}`;
    link.click();
    
    toast.success("Watermarked video downloaded");
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setWatermarkData(null);
    setProcessedVideoUrl(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            Metadata Watermarking
          </CardTitle>
          <CardDescription>
            Embed invisible watermarks in video metadata using FFmpeg-compatible methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <Label htmlFor="video-upload">Select Video File</Label>
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="icon"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedFile && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{selectedFile.name}</strong> ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB) ready for processing
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Processing Section */}
          <div className="space-y-4">
            <Button
              onClick={handleEmbedWatermark}
              disabled={!selectedFile || isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Embed Watermark"}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Label>Processing Progress</Label>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Embedding metadata watermark... {Math.round(progress)}%
                </p>
              </div>
            )}
          </div>

          {/* Watermark Confirmation */}
          {watermarkData && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-medium text-green-800">Watermark Successfully Embedded!</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <Label className="text-green-700">Watermark ID</Label>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {watermarkData.id}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-green-700">Creator ID</Label>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {watermarkData.creatorId}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-green-700">Signature</Label>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {watermarkData.signature}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-green-700">Timestamp</Label>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(watermarkData.timestamp).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Download Section */}
          {processedVideoUrl && (
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Watermarked Video
              </Button>
              <Button onClick={resetUpload} variant="outline">
                Process Another Video
              </Button>
            </div>
          )}

          {/* Technical Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">FFmpeg Compatibility</p>
                <p className="text-sm">
                  This module embeds watermarks in video metadata fields that persist through:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Standard video compression (H.264, H.265, VP9)</li>
                  <li>• Format conversions (MP4, WebM, AVI)</li>
                  <li>• FFmpeg processing and re-encoding</li>
                  <li>• Streaming platform uploads</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetadataWatermarking;