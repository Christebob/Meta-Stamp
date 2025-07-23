import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Network, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Upload,
  Eye,
  Users,
  Globe
} from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSeen: number;
  detectionCount: number;
}

interface DetectionAlert {
  id: string;
  contentHash: string;
  detectedAt: number;
  nodeId: string;
  confidence: number;
  status: 'pending' | 'verified' | 'false_positive';
}

interface ContentRegistration {
  id: string;
  contentHash: string;
  creatorId: string;
  registeredAt: number;
  title: string;
  verified: boolean;
}

export const AIDetectionNetwork: React.FC = () => {
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [detectionAlerts, setDetectionAlerts] = useState<DetectionAlert[]>([]);
  const [registeredContent, setRegisteredContent] = useState<ContentRegistration[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contentTitle, setContentTitle] = useState('');
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    const mockNodes: NetworkNode[] = [
      { id: 'node-1', name: 'Primary Detection Hub', status: 'online', lastSeen: Date.now(), detectionCount: 1247 },
      { id: 'node-2', name: 'Content Verification Node', status: 'online', lastSeen: Date.now() - 30000, detectionCount: 892 },
      { id: 'node-3', name: 'Community Guardian', status: 'offline', lastSeen: Date.now() - 300000, detectionCount: 445 },
      { id: 'node-4', name: 'Global Watchdog', status: 'online', lastSeen: Date.now() - 5000, detectionCount: 1834 }
    ];

    const mockAlerts: DetectionAlert[] = [
      { id: 'alert-1', contentHash: 'hash_abc123', detectedAt: Date.now() - 3600000, nodeId: 'node-1', confidence: 0.95, status: 'verified' },
      { id: 'alert-2', contentHash: 'hash_def456', detectedAt: Date.now() - 1800000, nodeId: 'node-2', confidence: 0.87, status: 'pending' },
      { id: 'alert-3', contentHash: 'hash_ghi789', detectedAt: Date.now() - 900000, nodeId: 'node-4', confidence: 0.92, status: 'verified' }
    ];

    const mockContent: ContentRegistration[] = [
      { id: 'content-1', contentHash: 'hash_abc123', creatorId: 'creator-1', registeredAt: Date.now() - 86400000, title: 'Original Video Content', verified: true },
      { id: 'content-2', contentHash: 'hash_xyz789', creatorId: 'creator-2', registeredAt: Date.now() - 172800000, title: 'Creative Tutorial Series', verified: true },
      { id: 'content-3', contentHash: 'hash_def456', creatorId: 'creator-1', registeredAt: Date.now() - 259200000, title: 'Music Performance Video', verified: false }
    ];

    setNetworkNodes(mockNodes);
    setDetectionAlerts(mockAlerts);
    setRegisteredContent(mockContent);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const registerContent = async () => {
    if (!selectedFile || !contentTitle) {
      toast({
        title: "Missing Information",
        description: "Please select a file and enter a title",
        variant: "destructive"
      });
      return;
    }

    // Simulate content registration
    const newRegistration: ContentRegistration = {
      id: `content-${Date.now()}`,
      contentHash: `hash_${Math.random().toString(36).substring(7)}`,
      creatorId: 'current-user',
      registeredAt: Date.now(),
      title: contentTitle,
      verified: false
    };

    setRegisteredContent(prev => [newRegistration, ...prev]);
    setSelectedFile(null);
    setContentTitle('');

    toast({
      title: "Content Registered",
      description: "Your content has been registered with the detection network",
    });
  };

  const scanNetwork = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate network scan
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Add a new mock detection
          const newAlert: DetectionAlert = {
            id: `alert-${Date.now()}`,
            contentHash: `hash_${Math.random().toString(36).substring(7)}`,
            detectedAt: Date.now(),
            nodeId: networkNodes[Math.floor(Math.random() * networkNodes.length)]?.id || 'node-1',
            confidence: 0.85 + Math.random() * 0.15,
            status: 'pending'
          };
          
          setDetectionAlerts(prev => [newAlert, ...prev]);
          
          toast({
            title: "Network Scan Complete",
            description: "Found potential content matches across the network",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const verifyAlert = (alertId: string, isValid: boolean) => {
    setDetectionAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: isValid ? 'verified' : 'false_positive' }
          : alert
      )
    );

    toast({
      title: isValid ? "Alert Verified" : "False Positive Marked",
      description: isValid ? "Detection confirmed as valid" : "Alert marked as false positive",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'false_positive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          AI Detection Network
        </CardTitle>
        <CardDescription>
          Distributed content protection and unauthorized usage detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="register">Register Content</TabsTrigger>
            <TabsTrigger value="alerts">Detection Alerts</TabsTrigger>
            <TabsTrigger value="network">Network Nodes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Nodes</p>
                      <p className="text-2xl font-bold">{networkNodes.filter(n => n.status === 'online').length}</p>
                    </div>
                    <Globe className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Alerts</p>
                      <p className="text-2xl font-bold">{detectionAlerts.filter(a => a.status === 'pending').length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Protected Content</p>
                      <p className="text-2xl font-bold">{registeredContent.length}</p>
                    </div>
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Network Scan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={scanNetwork} 
                    disabled={isScanning}
                    className="w-full"
                  >
                    {isScanning ? 'Scanning Network...' : 'Start Network Scan'}
                  </Button>
                  
                  {isScanning && (
                    <div className="space-y-2">
                      <Progress value={scanProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        Scanning {scanProgress}% complete
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Register New Content</CardTitle>
                <CardDescription>
                  Add your content to the protection network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content-title">Content Title</Label>
                  <Input
                    id="content-title"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    placeholder="Enter content title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content-file">Select File</Label>
                  <Input
                    id="content-file"
                    type="file"
                    onChange={handleFileSelect}
                    accept="video/*,image/*"
                  />
                </div>
                
                <Button onClick={registerContent} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Register Content
                </Button>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Registered content will be monitored across the entire detection network for unauthorized usage.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Registered Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {registeredContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Registered {new Date(content.registeredAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={content.verified ? "default" : "secondary"}>
                        {content.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detection Alerts</CardTitle>
                <CardDescription>
                  Recent unauthorized usage detections across the network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detectionAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">Content Hash: {alert.contentHash.substring(0, 12)}...</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(alert.status)}`} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Detected {new Date(alert.detectedAt).toLocaleString()} • 
                          Confidence: {(alert.confidence * 100).toFixed(1)}% • 
                          Node: {networkNodes.find(n => n.id === alert.nodeId)?.name}
                        </p>
                      </div>
                      
                      {alert.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => verifyAlert(alert.id, true)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyAlert(alert.id, false)}
                          >
                            False Positive
                          </Button>
                        </div>
                      )}
                      
                      {alert.status !== 'pending' && (
                        <Badge variant={alert.status === 'verified' ? "default" : "destructive"}>
                          {alert.status === 'verified' ? 'Verified' : 'False Positive'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Nodes</CardTitle>
                <CardDescription>
                  Connected detection nodes in the AI network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {networkNodes.map((node) => (
                    <div key={node.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
                        <div>
                          <h4 className="font-medium">{node.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last seen: {new Date(node.lastSeen).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          {node.detectionCount} detections
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};