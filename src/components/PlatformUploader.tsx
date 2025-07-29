import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Youtube, 
  Instagram, 
  Twitter, 
  Video,
  Globe,
  Eye,
  Clock,
  Zap,
  PlayCircle,
  Tv,
  Radio
} from 'lucide-react';
import { toast } from 'sonner';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  maxSize: number; // in MB
  supportedFormats: string[];
  requiresAuth: boolean;
}

interface UploadMetadata {
  title: string;
  description: string;
  tags: string;
  visibility: 'public' | 'private' | 'unlisted';
}

const platforms: Platform[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <Youtube className="w-5 h-5" />,
    color: 'text-red-500',
    maxSize: 256000, // 256GB
    supportedFormats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
    requiresAuth: true
  },
  {
    id: 'beasttube',
    name: 'BeastTube',
    icon: <PlayCircle className="w-5 h-5" />,
    color: 'text-purple-500',
    maxSize: 500000, // 500GB
    supportedFormats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'],
    requiresAuth: true
  },
  {
    id: 'metahub',
    name: 'Meta Hub',
    icon: <Tv className="w-5 h-5" />,
    color: 'text-blue-600',
    maxSize: 100000, // 100GB
    supportedFormats: ['mp4', 'mov', 'avi', 'webm'],
    requiresAuth: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
    color: 'text-pink-500',
    maxSize: 4000, // 4GB
    supportedFormats: ['mp4', 'mov'],
    requiresAuth: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: <Video className="w-5 h-5" />,
    color: 'text-black',
    maxSize: 4000, // 4GB
    supportedFormats: ['mp4', 'mov', 'avi'],
    requiresAuth: true
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: <Twitter className="w-5 h-5" />,
    color: 'text-blue-500',
    maxSize: 512, // 512MB
    supportedFormats: ['mp4', 'mov'],
    requiresAuth: true
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-blue-600',
    maxSize: 500000, // 500GB
    supportedFormats: ['mp4', 'mov', 'avi', 'wmv', 'flv'],
    requiresAuth: true
  },
  {
    id: 'rumble',
    name: 'Rumble',
    icon: <Radio className="w-5 h-5" />,
    color: 'text-green-600',
    maxSize: 50000, // 50GB
    supportedFormats: ['mp4', 'mov', 'avi', 'wmv'],
    requiresAuth: true
  }
];

export const PlatformUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    title: '',
    description: '',
    tags: '',
    visibility: 'public'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'upload' | 'watermark' | 'platform' | 'complete'>('upload');
  const [watermarkId, setWatermarkId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      // Check if file is compatible with selected platform
      if (selectedPlatform) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension && !selectedPlatform.supportedFormats.includes(fileExtension)) {
          toast.error(`${selectedPlatform.name} doesn't support .${fileExtension} files`);
          return;
        }
        
        if (file.size > selectedPlatform.maxSize * 1024 * 1024) {
          toast.error(`File too large for ${selectedPlatform.name} (max ${selectedPlatform.maxSize}MB)`);
          return;
        }
      }
      
      setSelectedFile(file);
      setMetadata(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
      toast.success('Video selected successfully');
    } else {
      toast.error('Please select a valid video file');
    }
  };

  const handlePlatformSelect = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      setSelectedPlatform(platform);
      
      // Check if current file is compatible
      if (selectedFile) {
        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
        if (fileExtension && !platform.supportedFormats.includes(fileExtension)) {
          toast.warning(`Your current file (.${fileExtension}) isn't supported by ${platform.name}`);
          setSelectedFile(null);
        } else if (selectedFile.size > platform.maxSize * 1024 * 1024) {
          toast.warning(`Your current file is too large for ${platform.name} (max ${platform.maxSize}MB)`);
          setSelectedFile(null);
        }
      }
    }
  };

  const simulateWatermarking = async (): Promise<string> => {
    return new Promise((resolve) => {
      const watermarkId = `meta_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve(watermarkId);
        }
        setProgress(progress);
      }, 200);
    });
  };

  const simulatePlatformUpload = async (): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 10 + 3;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setProgress(progress);
      }, 300);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedPlatform) {
      toast.error('Please select a video file and platform');
      return;
    }

    if (!metadata.title.trim()) {
      toast.error('Please enter a title for your video');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Step 1: Apply Meta-Stamp tracking
      setCurrentStep('watermark');
      toast.info('Applying Meta-Stamp AI tracking...');
      const wmId = await simulateWatermarking();
      setWatermarkId(wmId);
      
      // Step 2: Upload to platform
      setCurrentStep('platform');
      setProgress(0);
      toast.info(`Uploading to ${selectedPlatform.name}...`);
      await simulatePlatformUpload();
      
      // Step 3: Complete
      setCurrentStep('complete');
      toast.success(`Successfully uploaded to ${selectedPlatform.name} with Meta-Stamp protection!`);
      
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setSelectedPlatform(null);
    setMetadata({
      title: '',
      description: '',
      tags: '',
      visibility: 'public'
    });
    setProgress(0);
    setCurrentStep('upload');
    setWatermarkId('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'watermark': return <Shield className="w-4 h-4" />;
      case 'platform': return selectedPlatform?.icon || <Upload className="w-4 h-4" />;
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Upload className="w-4 h-4" />;
    }
  };

  const getStepText = () => {
    switch (currentStep) {
      case 'watermark': return 'Applying Meta-Stamp AI tracking...';
      case 'platform': return `Uploading to ${selectedPlatform?.name}...`;
      case 'complete': return 'Upload complete!';
      default: return 'Ready to upload';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          🚀 Upload & Protect Your Content
          <Badge variant="outline" className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">Rebel-Protected</Badge>
        </CardTitle>
        <CardDescription>
          Upload your videos anywhere without letting corporate AI steal your ideas for free! 
          Automatic Meta-Stamp protection ensures you get paid when they use your content.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">🎯 Pick Your Platform (Don't let them win!)</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {platforms.map((platform) => (
              <Button
                key={platform.id}
                variant={selectedPlatform?.id === platform.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handlePlatformSelect(platform.id)}
                disabled={isProcessing}
              >
                <div className={platform.color}>
                  {platform.icon}
                </div>
                <span className="text-xs font-medium">{platform.name}</span>
              </Button>
            ))}
          </div>
          
          {selectedPlatform && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription>
                <strong>🎪 {selectedPlatform.name} specs:</strong> Max {selectedPlatform.maxSize}MB, 
                Formats: {selectedPlatform.supportedFormats.join(', ')}
                {selectedPlatform.id === 'beasttube' && <span className="block text-sm mt-1 text-purple-600">🔥 Next-gen creator platform - unlimited potential!</span>}
                {selectedPlatform.id === 'metahub' && <span className="block text-sm mt-1 text-blue-600">🌟 Creator-first community - built by us, for us!</span>}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">📹 Drop Your Masterpiece Here</Label>
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              {selectedFile ? `🎬 ${selectedFile.name}` : '🎯 Upload your content here to protect it from corporate appropriation'}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedPlatform 
                ? `Ready for ${selectedPlatform.name}: ${selectedPlatform.supportedFormats.join(', ')} (max ${selectedPlatform.maxSize}MB)`
                : 'Pick a platform first, then we\'ll show you what they accept'
              }
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Video Metadata */}
        {selectedFile && selectedPlatform && (
          <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <h3 className="font-semibold">📝 Make it Legendary (Your call, your content)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">🏆 Title * (Make it count!)</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Your masterpiece deserves a killer title..."
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">📖 Tell Your Story</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What makes this content uniquely yours? Let the world know..."
                rows={3}
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">🏷️ Tags (Help rebels find you)</Label>
                <Input
                  id="tags"
                  value={metadata.tags}
                  onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="creator, original, protected, rebel, authentic..."
                  disabled={isProcessing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visibility">👁️ Who Gets to See This?</Label>
                <Select 
                  value={metadata.visibility} 
                  onValueChange={(value) => setMetadata(prev => ({ ...prev, visibility: value as any }))}
                  disabled={isProcessing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="unlisted">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Unlisted
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Private
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isProcessing && (
          <div className="space-y-4 p-4 border rounded-lg bg-primary/5">
            <div className="flex items-center gap-2">
              {getStepIcon(currentStep)}
              <span className="font-medium">{getStepText()}</span>
              {currentStep === 'complete' && (
                <Badge variant="outline" className="ml-auto text-green-600 border-green-600">
                  <Zap className="w-3 h-3 mr-1" />
                  Protected
                </Badge>
              )}
            </div>
            
            {currentStep !== 'complete' && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}
            
            {currentStep === 'complete' && watermarkId && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium text-green-800">
                      Video uploaded successfully with Meta-Stamp protection!
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Tracking ID:</strong> {watermarkId}
                    </p>
                    <p className="text-sm text-green-700">
                      Your video is now protected and any AI usage will be automatically tracked.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {currentStep === 'complete' ? (
            <Button onClick={resetUpload} className="w-full">
              Upload Another Video
            </Button>
          ) : (
            <>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedPlatform || !metadata.title.trim() || isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : `Upload to ${selectedPlatform?.name || 'Platform'}`}
              </Button>
              
              {(selectedFile || selectedPlatform) && (
                <Button onClick={resetUpload} variant="outline" disabled={isProcessing}>
                  Reset
                </Button>
              )}
            </>
          )}
        </div>

        {/* Info Alert */}
        <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <Shield className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <strong>🛡️ Meta-Stamp Rebel Protection:</strong> Every video uploaded through this tool gets 
            invisible AI tracking stamps. When corporate AI tries to steal your content, you'll know 
            about it AND get compensated. Fight back against the machine! 🤖💪
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};