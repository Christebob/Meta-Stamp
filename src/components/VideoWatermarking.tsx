import React, { useState, useRef, useCallback, useEffect } from 'react';
import Web3 from 'web3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Shield, Search, Download, CheckCircle, AlertCircle, Link, ExternalLink, Bot, Clock, Hash } from 'lucide-react';
import { toast } from 'sonner';

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WatermarkData {
  id: string;
  creatorId: string;
  timestamp: number;
  signature: string;
  blockchainTxHash?: string;
}

interface AIUsageLog {
  id: string;
  watermarkId: string;
  aiModel: string;
  extractionType: string;
  duration: number;
  timestamp: number;
  txHash?: string;
}

export const VideoWatermarking = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [watermarkedVideo, setWatermarkedVideo] = useState<Blob | null>(null);
  const [detectionResults, setDetectionResults] = useState<WatermarkData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectionVideo, setDetectionVideo] = useState<File | null>(null);
  const [aiUsageLogs, setAiUsageLogs] = useState<AIUsageLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Blockchain integration
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionVideoRef = useRef<HTMLVideoElement>(null);

  // Smart contract ABI for watermark logging
  const contractABI = [
    {
      "inputs": [{"internalType": "string", "name": "_watermarkId", "type": "string"}],
      "name": "logWatermark",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "string", "name": "_watermarkId", "type": "string"},
        {"internalType": "string", "name": "_aiModel", "type": "string"},
        {"internalType": "string", "name": "_extractionType", "type": "string"},
        {"internalType": "uint256", "name": "_duration", "type": "uint256"}
      ],
      "name": "logAIUsage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Auto-connect wallet on component mount
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            setAccount(accounts[0]);
            setIsConnected(true);
            // Try to connect to existing contract if available
            const savedContract = localStorage.getItem('watermark-contract-address');
            if (savedContract) {
              const contractInstance = new web3Instance.eth.Contract(contractABI, savedContract);
              setContract(contractInstance);
            }
          }
        });
    }
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Switch to Sepolia
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
          }
        }

        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);
        toast.success("Wallet connected for blockchain watermarking");
      } else {
        toast.error("MetaMask required for blockchain features");
      }
    } catch (error) {
      toast.error("Failed to connect wallet");
    }
  };

  // Log watermark to blockchain
  const logToBlockchain = async (watermarkId: string): Promise<string | null> => {
    if (!contract || !account) return null;
    
    try {
      const tx = await contract.methods.logWatermark(watermarkId).send({
        from: account
      });
      return tx.transactionHash;
    } catch (error) {
      console.error("Blockchain logging failed:", error);
      return null;
    }
  };

  // Log AI usage to blockchain
  const logAIUsageToBlockchain = async (usageLog: AIUsageLog): Promise<string | null> => {
    if (!contract || !account) return null;
    
    try {
      const tx = await contract.methods.logAIUsage(
        usageLog.watermarkId,
        usageLog.aiModel,
        usageLog.extractionType,
        usageLog.duration
      ).send({
        from: account
      });
      return tx.transactionHash;
    } catch (error) {
      console.error("AI usage logging failed:", error);
      return null;
    }
  };

  // Simulate AI extracting content from watermarked video
  const simulateAIExtraction = async () => {
    // First check if we have any watermarked content
    const storedWatermarks = Object.keys(localStorage).filter(key => key.startsWith('watermark-'));
    if (storedWatermarks.length === 0) {
      toast.error("No watermarked content found. Please watermark a video first.");
      return;
    }

    setIsSimulating(true);
    
    try {
      // Get the latest watermark
      const latestWatermarkKey = storedWatermarks[storedWatermarks.length - 1];
      const watermarkData = JSON.parse(localStorage.getItem(latestWatermarkKey) || '{}');
      
      // Simulate AI processing
      toast.info("Simulating Claude AI extracting 10-second clip...");
      
      // Create AI usage log
      const usageLog: AIUsageLog = {
        id: crypto.randomUUID(),
        watermarkId: watermarkData.id,
        aiModel: "Claude-3.5-Sonnet",
        extractionType: "Video Clip Extraction",
        duration: 10, // 10 seconds
        timestamp: Date.now()
      };

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log to blockchain if connected
      if (contract && account) {
        toast.info("Logging AI usage to blockchain...");
        const txHash = await logAIUsageToBlockchain(usageLog);
        if (txHash) {
          usageLog.txHash = txHash;
          toast.success("AI usage logged to blockchain!");
        }
      }

      // Add to local logs
      setAiUsageLogs(prev => [usageLog, ...prev]);
      
      toast.success("AI extraction detected and logged!");
      
    } catch (error) {
      toast.error("Failed to simulate AI extraction");
    } finally {
      setIsSimulating(false);
    }
  };

  // Generate unique watermark signature
  const generateWatermark = useCallback((): WatermarkData => {
    return {
      id: crypto.randomUUID(),
      creatorId: account || 'creator-' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      signature: btoa(crypto.randomUUID() + Date.now()).slice(0, 16)
    };
  }, [account]);

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
        setProgress(prev => Math.min(prev + 5, 70));
      }, 200);

      const watermarkedBlob = await embedWatermark(uploadedVideo);
      
      setProgress(75);
      
      // If blockchain connected, log the watermark
      let blockchainTxHash = null;
      if (contract && account) {
        toast.info("Logging watermark to blockchain...");
        const watermarkData = JSON.parse(localStorage.getItem(`watermark-${(watermarkedBlob as any).watermarkId}`) || '{}');
        blockchainTxHash = await logToBlockchain(watermarkData.id);
        if (blockchainTxHash) {
          // Update stored watermark with blockchain hash
          watermarkData.blockchainTxHash = blockchainTxHash;
          localStorage.setItem(`watermark-${watermarkData.id}`, JSON.stringify(watermarkData));
          toast.success("Watermark logged to blockchain!");
        }
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      setWatermarkedVideo(watermarkedBlob);
      
      if (blockchainTxHash) {
        toast.success('Video watermarked and logged to blockchain!');
      } else {
        toast.success('Video successfully watermarked!');
      }
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
            {isConnected && <Badge variant="outline" className="ml-auto"><Link className="w-3 h-3 mr-1" />Blockchain Ready</Badge>}
          </CardTitle>
          <CardDescription>
            Stamp your videos with invisible meta-stamps to track AI usage and ensure fair compensation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Blockchain Connection Status */}
      {!isConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Connect wallet to enable blockchain watermark logging</span>
              <Button size="sm" onClick={connectWallet}>
                Connect Wallet
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isConnected && !contract && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <span className="text-yellow-800">
              Wallet connected but no smart contract found. Watermarks will be created locally only.
            </span>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="watermark" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="watermark" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Watermark Videos
          </TabsTrigger>
          <TabsTrigger value="detect" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Detect Usage
          </TabsTrigger>
          <TabsTrigger value="simulate" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AI Simulation
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

        <TabsContent value="simulate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Content Extraction Simulation</CardTitle>
              <CardDescription>
                Simulate an AI like Claude extracting content from your watermarked videos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-blue-50/50">
                <Bot className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Simulate AI Touch</h3>
                  <p className="text-sm text-muted-foreground">
                    Test how your watermarked content is detected when used by AI models
                  </p>
                  <Button 
                    onClick={simulateAIExtraction}
                    disabled={isSimulating}
                    className="mt-4"
                  >
                    {isSimulating ? "Simulating..." : "Simulate Claude AI Extraction"}
                  </Button>
                </div>
              </div>

              {/* AI Usage Logs */}
              {aiUsageLogs.length > 0 && (
                <Card className="bg-red-50 dark:bg-red-950">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-red-700 dark:text-red-300">
                        AI Usage Detected & Logged
                      </span>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {aiUsageLogs.map((log) => (
                        <div key={log.id} className="bg-background p-4 rounded-lg border">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-red-600">AI Model</p>
                              <p className="text-muted-foreground">{log.aiModel}</p>
                            </div>
                            <div>
                              <p className="font-medium text-red-600">Extraction Type</p>
                              <p className="text-muted-foreground">{log.extractionType}</p>
                            </div>
                            <div>
                              <p className="font-medium text-red-600">Duration</p>
                              <p className="text-muted-foreground">{log.duration} seconds</p>
                            </div>
                            <div>
                              <p className="font-medium text-red-600">Timestamp</p>
                              <p className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2 text-xs">
                              <Hash className="w-3 h-3" />
                              <span className="font-mono">Watermark: {log.watermarkId.slice(0, 8)}...</span>
                            </div>
                            {log.txHash && (
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <Link className="w-3 h-3" />
                                <span className="font-mono text-green-600">Blockchain: {log.txHash.slice(0, 16)}...</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => window.open(`https://sepolia.etherscan.io/tx/${log.txHash}`, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
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