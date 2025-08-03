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
  Radio,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
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
  const [uploadedContentId, setUploadedContentId] = useState<string>('');
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);
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
      setSelectedFile(file);
      setMetadata(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
      toast.success('🎬 Content locked and loaded!');
    } else {
      toast.error('Please select a valid video file');
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      setSelectedPlatforms(prev => {
        const isSelected = prev.some(p => p.id === platformId);
        if (isSelected) {
          return prev.filter(p => p.id !== platformId);
        } else {
          return [...prev, platform];
        }
      });
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

  // Generate content hash from file
  const generateContentHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 16); // Shorter hash for display
  };

  // Simulate AI usage and add to database
  const simulateAIUsage = async () => {
    if (!uploadedContentId) {
      toast.error('No content uploaded yet');
      return;
    }

    setIsSimulatingAI(true);
    
    try {
      // Random AI usage data
      const aiModels = ['GPT-4', 'Claude', 'Midjourney', 'DALL-E'];
      const usageTypes = ['Training', 'Generation', 'Analysis'];
      const randomModel = aiModels[Math.floor(Math.random() * aiModels.length)];
      const randomUsageType = usageTypes[Math.floor(Math.random() * usageTypes.length)];
      const randomDuration = Math.floor(Math.random() * 26) + 5; // 5-30 seconds
      const earnings = randomDuration * 0.15;

      // Insert into ai_usage_logs using raw supabase client
      const { error: logError } = await (supabase as any)
        .from('ai_usage_logs')
        .insert([{
          content_id: uploadedContentId,
          ai_model: randomModel,
          usage_type: randomUsageType,
          duration_seconds: randomDuration,
          earnings: earnings
        }]);

      if (logError) throw logError;

      // Update content_registry counters - manual update
      const { data: currentData } = await (supabase as any)
        .from('content_registry')
        .select('ai_touches, total_earned')
        .eq('id', uploadedContentId)
        .single();

      if (currentData) {
        await (supabase as any)
          .from('content_registry')
          .update({
            ai_touches: (currentData.ai_touches || 0) + 1,
            total_earned: (currentData.total_earned || 0) + earnings
          })
          .eq('id', uploadedContentId);
      }

      toast.success(`🤖 AI used your content! +$${earnings.toFixed(4)} earned from ${randomModel}`, {
        description: `${randomUsageType} for ${randomDuration} seconds`
      });

    } catch (error) {
      console.error('Error simulating AI usage:', error);
      toast.error('Failed to simulate AI usage');
    } finally {
      setIsSimulatingAI(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a video file first');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
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
      toast.info('🛡️ Applying Meta-Stamp AI tracking...');
      const wmId = await simulateWatermarking();
      setWatermarkId(wmId);
      
      // Step 2: Upload to platforms and save to database
      setCurrentStep('platform');
      setProgress(0);
      toast.info(`🚀 Uploading to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}...`);
      await simulatePlatformUpload();
      
      // Generate content hash and save to database
      const contentHash = await generateContentHash(selectedFile);
      const platformName = selectedPlatforms[0]?.name || 'Unknown';
      
      const { data, error } = await (supabase as any)
        .from('content_registry')
        .insert([{
          content_hash: contentHash,
          creator_name: 'Demo Creator',
          platform: platformName,
          title: metadata.title
        }])
        .select();

      if (error) throw error;
      
      setUploadedContentId(data?.[0]?.id || '');
      
      // Step 3: Complete
      setCurrentStep('complete');
      const platformNames = selectedPlatforms.map(p => p.name).join(', ');
      toast.success(`🎉 Successfully uploaded to ${platformNames} with Meta-Stamp protection!`, {
        description: `Content Hash: ${contentHash}`
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setSelectedPlatforms([]);
    setMetadata({
      title: '',
      description: '',
      tags: '',
      visibility: 'public'
    });
    setProgress(0);
    setCurrentStep('upload');
    setWatermarkId('');
    setUploadedContentId('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'watermark': return <Shield className="w-4 h-4" />;
      case 'platform': return <Upload className="w-4 h-4" />;
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Upload className="w-4 h-4" />;
    }
  };

  const getStepText = () => {
    switch (currentStep) {
      case 'watermark': return 'Applying Meta-Stamp AI tracking...';
      case 'platform': return `Uploading to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}...`;
      case 'complete': return 'Mission accomplished!';
      default: return 'Ready to upload';
    }
  };

  const totalViews = importedContent.reduce((sum, content) => sum + content.views, 0);
  const totalEstimatedValue = importedContent.reduce((sum, content) => sum + content.estimatedValue, 0);
  const earningsProjections = totalViews > 0 ? calculateEarningsProjections(totalViews) : [];

  return (
    <Card className="w-full max-w-5xl mx-auto bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 shadow-2xl">
      <CardHeader className="text-center space-y-4 bg-gradient-to-r from-primary/5 via-accent/5 to-electric/5 rounded-t-lg">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-creator rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-creator bg-clip-text text-transparent">
            Content Command Center
          </CardTitle>
          <div className="w-10 h-10 bg-gradient-analytics rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-muted-foreground">Upload once. Deploy everywhere. Get paid forever.</p>
      </CardHeader>
      
      <CardContent className="p-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload" className="text-sm">⚡ Launch Mission</TabsTrigger>
            <TabsTrigger value="import" className="text-sm">📊 Import & Analyze</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-0">
            {/* Single Streamlined Upload Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: File Upload */}
              <div className="lg:col-span-5 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2 text-foreground">1. Deploy Content</h3>
                  <p className="text-sm text-muted-foreground">Start here. Upload your masterpiece.</p>
                </div>
                
                <div 
                  className="relative border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/60 transition-all duration-300 hover:shadow-glow bg-gradient-to-br from-background to-primary/5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-50"></div>
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
                      {selectedFile ? <FileVideo className="w-8 h-8 text-white" /> : <Upload className="w-8 h-8 text-white" />}
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      {selectedFile ? `✅ ${selectedFile.name}` : 'Drop content here'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Any video format • Max 500GB
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

                {selectedFile && (
                  <div className="space-y-4 animate-fade-in">
                    <Input
                      placeholder="Video title"
                      value={metadata.title}
                      onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-background/50"
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={metadata.description}
                      onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-background/50 min-h-[80px]"
                    />
                  </div>
                )}
              </div>

              {/* Center: Arrow */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <div className="hidden lg:flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-electric rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-electric"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-electric to-success rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Right: Platform Selection */}
              <div className="lg:col-span-5 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2 text-foreground">2. Select Targets</h3>
                  <p className="text-sm text-muted-foreground">Choose your distribution channels.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatforms.some(p => p.id === platform.id);
                    return (
                      <Button
                        key={platform.id}
                        variant={isSelected ? "default" : "outline"}
                        className={`h-20 flex flex-col items-center gap-2 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg' 
                            : 'hover:bg-accent/50 hover:border-primary/30'
                        }`}
                        onClick={() => handlePlatformToggle(platform.id)}
                        disabled={isProcessing}
                      >
                        <div className={isSelected ? 'text-white' : platform.color}>
                          {platform.icon}
                        </div>
                        <span className="text-xs font-medium">{platform.name}</span>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </Button>
                    );
                  })}
                </div>

                {selectedPlatforms.length > 0 && (
                  <Alert className="border-success/30 bg-success/5 animate-fade-in">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <AlertDescription>
                      <strong>{selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} selected</strong>
                      <div className="text-sm mt-1 text-success">
                        💰 Estimated: ${(selectedPlatforms.reduce((sum, p) => sum + (p.avgRevenue || 0), 0) * 4.2).toFixed(2)} per 1k views with Meta-Stamp
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Mission Launch Zone */}
            {selectedFile && selectedPlatforms.length > 0 && (
              <div className="mt-8 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-creator bg-clip-text text-transparent">3. Launch Mission</h3>
                  <p className="text-sm text-muted-foreground">Final details and deploy.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      placeholder="Mission title"
                      value={metadata.title}
                      onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg font-medium h-12"
                    />
                    <Textarea
                      placeholder="Mission brief (optional)"
                      value={metadata.description}
                      onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Select 
                      value={metadata.visibility} 
                      onValueChange={(value) => setMetadata(prev => ({ ...prev, visibility: value as any }))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">🌍 Public - Full visibility</SelectItem>
                        <SelectItem value="unlisted">🔗 Unlisted - Link only</SelectItem>
                        <SelectItem value="private">🔒 Private - Personal vault</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Tags: creator, original, protected..."
                      value={metadata.tags}
                      onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || selectedPlatforms.length === 0 || !metadata.title.trim() || isProcessing}
                    className="h-14 px-12 text-lg bg-gradient-to-r from-primary via-electric to-success hover:shadow-glow"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Mission in progress...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-3" />
                        Deploy & Protect ({selectedPlatforms.length} targets)
                      </>
                    )}
                  </Button>
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
                      <div className="space-y-3">
                        <p className="font-medium text-green-800">
                          Video uploaded successfully with Meta-Stamp protection!
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Tracking ID:</strong> {watermarkId}
                        </p>
                        <p className="text-sm text-green-700">
                          Your video is now protected and any AI usage will be automatically tracked.
                        </p>
                        {uploadedContentId && (
                          <Button
                            onClick={simulateAIUsage}
                            disabled={isSimulatingAI}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          >
                            {isSimulatingAI ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Simulating AI Usage...
                              </>
                            ) : (
                              <>
                                <Bot className="w-4 h-4 mr-2" />
                                🤖 Simulate AI Usage
                              </>
                            )}
                          </Button>
                        )}
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
                    disabled={!selectedFile || selectedPlatforms.length === 0 || !metadata.title.trim() || isProcessing}
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
                  
                  {(selectedFile || selectedPlatforms.length > 0) && (
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