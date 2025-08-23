import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Camera, 
  Upload, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Scan,
  Clock,
  TrendingUp,
  Eye
} from "lucide-react"

export default function ContentScanner() {
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const recentScans = [
    {
      id: 1,
      name: "Digital Art Collection #47",
      type: "Image",
      status: "Protected",
      confidence: 98.7,
      timestamp: "2 mins ago",
      aiUsage: 23
    },
    {
      id: 2,
      name: "Music Video - Night Lights",
      type: "Video", 
      status: "Violation",
      confidence: 89.2,
      timestamp: "15 mins ago",
      aiUsage: 156
    },
    {
      id: 3,
      name: "Portfolio Showcase 2024",
      type: "Document",
      status: "Clean",
      confidence: 95.1,
      timestamp: "1 hour ago",
      aiUsage: 7
    }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Protected": return "bg-green-100 text-green-800"
      case "Violation": return "bg-red-100 text-red-800"
      case "Clean": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Protected": return <Shield className="w-4 h-4" />
      case "Violation": return <AlertTriangle className="w-4 h-4" />
      case "Clean": return <CheckCircle className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Scanner</h1>
          <p className="text-muted-foreground">
            Detect AI usage and verify content authenticity across platforms
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Scan className="w-4 h-4 mr-2" />
          AI Detection Active
        </Badge>
      </div>

      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="results">Scan Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Content Analysis
              </CardTitle>
              <CardDescription>
                Upload content or paste URLs to scan for AI usage and authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Upload Content to Scan</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop files or click to browse
                </p>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Scanning content...</span>
                    <span className="text-sm text-muted-foreground">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="w-full" />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={startScan} disabled={isScanning} className="flex-1">
                  <Search className="w-4 h-4 mr-2" />
                  {isScanning ? "Scanning..." : "Start Scan"}
                </Button>
                <Button variant="outline">
                  Batch Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>
                View your latest content scanning results and AI usage detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        {getStatusIcon(scan.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{scan.name}</h4>
                        <p className="text-sm text-muted-foreground">{scan.type} • {scan.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(scan.status)}>
                          {scan.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {scan.confidence}% confidence
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{scan.aiUsage} AI touches</div>
                        <p className="text-xs text-muted-foreground">detected</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Total Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">+12% this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Violations Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">23</div>
                <p className="text-sm text-muted-foreground">-5% this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Avg Scan Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2.3s</div>
                <p className="text-sm text-muted-foreground">-0.5s faster</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}