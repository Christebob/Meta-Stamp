import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileVideo, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X,
  Shield,
  Zap,
  TrendingUp,
  Sparkles,
  Download,
  DollarSign,
  BarChart3,
  Target,
  Youtube,
  Instagram,
  Twitter,
  Video,
  Globe,
  Eye,
  Clock,
  PlayCircle,
  Tv,
  Radio
} from 'lucide-react';
import { toast } from 'sonner';

// Platform definitions
interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  maxFileSize: number; // in MB
  supportedFormats: string[];
  requiresAuth: boolean;
  importable?: boolean;
  avgRevenue?: number; // avg monthly revenue per 1k views
}

interface UploadMetadata {
  title: string;
  description: string;
  tags: string;
  visibility: 'public' | 'unlisted' | 'private';
}

interface EarningsProjection {
  timeframe: string;
  estimatedEarnings: number;
  confidence: number;
  comparisonToYouTube: number;
}

interface ImportedContent {
  id: string;
  title: string;
  views: number;
  duration: string;
  platform: string;
  estimatedValue: number;
  thumbnail?: string;
}

const platforms: Platform[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <Youtube className="w-5 h-5" />,
    color: 'text-red-500',
    maxFileSize: 256000, // 256GB
    supportedFormats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
    requiresAuth: true,
    importable: true,
    avgRevenue: 1.5
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: <Video className="w-5 h-5" />,
    color: 'text-black',
    maxFileSize: 4000, // 4GB
    supportedFormats: ['mp4', 'mov', 'avi'],
    requiresAuth: true,
    importable: true,
    avgRevenue: 0.8
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
    color: 'text-pink-500',
    maxFileSize: 4000, // 4GB
    supportedFormats: ['mp4', 'mov'],
    requiresAuth: true,
    importable: true,
    avgRevenue: 0.9
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: <Twitter className="w-5 h-5" />,
    color: 'text-blue-500',
    maxFileSize: 512, // 512MB
    supportedFormats: ['mp4', 'mov'],
    requiresAuth: true,
    importable: true,
    avgRevenue: 0.4
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-blue-600',
    maxFileSize: 4000, // 4GB
    supportedFormats: ['mp4', 'mov', 'avi'],
    requiresAuth: true,
    importable: true,
    avgRevenue: 0.6
  },
  {
    id: 'beasttube',
    name: 'BeastTube',
    icon: <PlayCircle className="w-5 h-5" />,
    color: 'text-purple-500',
    maxFileSize: 500000, // 500GB
    supportedFormats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'],
    requiresAuth: true,
    importable: false,
    avgRevenue: 2.2
  },
  {
    id: 'metahub',
    name: 'Meta Hub',
    icon: <Tv className="w-5 h-5" />,
    color: 'text-blue-600',
    maxFileSize: 100000, // 100GB
    supportedFormats: ['mp4', 'mov', 'avi', 'webm'],
    requiresAuth: true,
    importable: false,
    avgRevenue: 3.1
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
  const [isImporting, setIsImporting] = useState(false);
  const [importedContent, setImportedContent] = useState<ImportedContent[]>([]);
  const [showEarningsProjection, setShowEarningsProjection] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'import'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for imported content
  const generateMockImportedContent = (platform: Platform): ImportedContent[] => {
    return [
      {
        id: `${platform.id}_1`,
        title: "My Viral Hit That Went Crazy",
        views: 2500000,
        duration: "3:24",
        platform: platform.name,
        estimatedValue: 2500000 * (platform.avgRevenue || 1) / 1000
      },
      {
        id: `${platform.id}_2`,
        title: "Behind The Scenes Magic",
        views: 850000,
        duration: "8:15",
        platform: platform.name,
        estimatedValue: 850000 * (platform.avgRevenue || 1) / 1000
      },
      {
        id: `${platform.id}_3`,
        title: "Tutorial Everyone Loves",
        views: 1200000,
        duration: "12:45",
        platform: platform.name,
        estimatedValue: 1200000 * (platform.avgRevenue || 1) / 1000
      }
    ];
  };

  const calculateEarningsProjections = (totalViews: number): EarningsProjection[] => {
    const metaStampMultiplier = 4.2; // 420% increase over platform average
    const baseEarning = totalViews * 0.003 * metaStampMultiplier; // $3 per 1k views with Meta-Stamp
    
    return [
      {
        timeframe: '3 months',
        estimatedEarnings: baseEarning * 0.25,
        confidence: 85,
        comparisonToYouTube: 420
      },
      {
        timeframe: '6 months',
        estimatedEarnings: baseEarning * 0.6,
        confidence: 78,
        comparisonToYouTube: 380
      },
      {
        timeframe: '12 months',
        estimatedEarnings: baseEarning * 1.2,
        confidence: 72,
        comparisonToYouTube: 350
      },
      {
        timeframe: '24 months',
        estimatedEarnings: baseEarning * 2.8,
        confidence: 65,
        comparisonToYouTube: 320
      },
      {
        timeframe: '36 months',
        estimatedEarnings: baseEarning * 4.5,
        confidence: 58,
        comparisonToYouTube: 300
      }
    ];
  };

  const handlePlatformImport = async (platform: Platform) => {
    if (!platform.importable) {
      toast.error(`${platform.name} import not available yet`);
      return;
    }

    setIsImporting(true);
    toast.info(`Connecting to your ${platform.name} account...`);
    
    // Simulate API call
    setTimeout(() => {
      const mockContent = generateMockImportedContent(platform);
      setImportedContent(prev => [...prev, ...mockContent]);
      setShowEarningsProjection(true);
      setIsImporting(false);
      toast.success(`Found ${mockContent.length} videos from ${platform.name}!`);
    }, 2000);
  };

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
        
        if (file.size > selectedPlatform.maxFileSize * 1024 * 1024) {
          toast.error(`File too large for ${selectedPlatform.name} (max ${selectedPlatform.maxFileSize}MB)`);
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
        } else if (selectedFile.size > platform.maxFileSize * 1024 * 1024) {
          toast.warning(`Your current file is too large for ${platform.name} (max ${platform.maxFileSize}MB)`);
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

  const totalViews = importedContent.reduce((sum, content) => sum + content.views, 0);
  const totalEstimatedValue = importedContent.reduce((sum, content) => sum + content.estimatedValue, 0);
  const earningsProjections = totalViews > 0 ? calculateEarningsProjections(totalViews) : [];

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          🚀 Upload & Protect Your Content
          <Badge variant="outline" className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">Rebel-Protected</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">🚀 Re-upload now and plug into the future of commerce</TabsTrigger>
            <TabsTrigger value="import">💰 Import & Re-Upload with Confidence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">🎯 Pick Your Platform (Don't let them win!)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
                    <strong>🎪 {selectedPlatform.name} specs:</strong> Max {selectedPlatform.maxFileSize}MB, 
                    Formats: {selectedPlatform.supportedFormats.join(', ')}
                    {selectedPlatform.avgRevenue && (
                      <span className="block text-sm mt-1 text-green-600">
                        💰 With Meta-Stamp: ${(selectedPlatform.avgRevenue * 4.2).toFixed(2)} per 1k views vs ${selectedPlatform.avgRevenue} standard
                      </span>
                    )}
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
                    ? `Ready for ${selectedPlatform.name}: ${selectedPlatform.supportedFormats.join(', ')} (max ${selectedPlatform.maxFileSize}MB)`
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
                    className="flex-1 bg-gradient-creator hover:bg-gradient-creator/90"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        🎯 Claim Your Cut
                      </>
                    )}
                  </Button>
                  
                  {(selectedFile || selectedPlatform) && (
                    <Button
                      variant="outline"
                      onClick={resetUpload}
                      disabled={isProcessing}
                      className="px-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">💰 Import Your Existing Content</h2>
              <p className="text-lg text-muted-foreground">
                Already have content on other platforms? Import it and re-upload with confidence that you'll start seeing money. 
                We'll do the math for you and show you exactly what you'll make.
              </p>
            </div>

            {/* Platform Import Buttons */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">📱 Choose Your Platform to Import From</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {platforms.filter(p => p.importable).map((platform) => (
                  <Button
                    key={platform.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5"
                    onClick={() => handlePlatformImport(platform)}
                    disabled={isImporting}
                  >
                    <div className={platform.color}>
                      {platform.icon}
                    </div>
                    <span className="text-xs font-medium">{platform.name}</span>
                    <Download className="w-3 h-3 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </div>

            {isImporting && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Connecting to your account and analyzing your content...
                </AlertDescription>
              </Alert>
            )}

            {/* Imported Content & Earnings Projection */}
            {importedContent.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Summary */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileVideo className="w-5 h-5" />
                      Your Content Portfolio
                    </h3>
                    <div className="space-y-3">
                      {importedContent.slice(0, 3).map((content) => (
                        <div key={content.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium text-sm">{content.title}</p>
                            <p className="text-xs text-muted-foreground">{content.views.toLocaleString()} views • {content.duration}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${content.estimatedValue.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center font-bold">
                          <span>Total Portfolio Value:</span>
                          <span className="text-green-600">${totalEstimatedValue.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {totalViews.toLocaleString()} total views across {importedContent.length} videos
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Earnings Projection */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Your Meta-Stamp Earnings Projection
                    </h3>
                    <div className="space-y-3">
                      {earningsProjections.map((projection) => (
                        <div key={projection.timeframe} className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded">
                          <div>
                            <p className="font-medium">{projection.timeframe}</p>
                            <p className="text-xs text-muted-foreground">{projection.confidence}% confidence</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${projection.estimatedEarnings.toFixed(2)}</p>
                            <p className="text-xs text-blue-600">+{projection.comparisonToYouTube}% vs YouTube</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Call to Action */}
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold">🚀 Ready to Re-Upload with Confidence?</h3>
                    <p className="text-lg">
                      Your content is already out there anyway - might as well get paid for it when AI uses it.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        className="bg-gradient-creator hover:bg-gradient-creator/90"
                        onClick={() => setActiveTab('upload')}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Start Re-Uploading to Claim Your Cut
                      </Button>
                      <Button variant="outline">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Bulk Upload All Content
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Voluntary participation - you're choosing to open up your work but ensuring you get paid for it.
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Protection Alert */}
        <Alert className="border-purple-200 bg-purple-50">
          <Shield className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-purple-800">
                🛡️ Meta-Stamp Protection Active
              </p>
              <p className="text-sm text-purple-700">
                Every video gets invisible watermarking that tracks AI usage and ensures automatic royalty collection.
                Your content, your rules, your money.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};