import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Wand2, Shield, Zap, ImageIcon, Video, FileText } from "lucide-react"
import MetadataWatermarking from "@/components/MetadataWatermarking"
import { VideoWatermarking } from "@/components/VideoWatermarking"

export default function CreatorStudio() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creator Studio</h1>
          <p className="text-muted-foreground">
            Protect your creative work with AI-powered watermarking and tracing
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Protected Workspace
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Image Protection</CardTitle>
            <CardDescription>
              Add invisible watermarks to your images for tracking and protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-secondary/20 hover:border-secondary/40 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-secondary" />
            </div>
            <CardTitle>Video Protection</CardTitle>
            <CardDescription>
              Embed advanced watermarks into your video content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Videos
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-accent/20 hover:border-accent/40 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <CardTitle>Document Security</CardTitle>
            <CardDescription>
              Protect PDFs, text files, and other documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Advanced Watermarking
            </CardTitle>
            <CardDescription>
              Configure metadata and invisible watermarks for your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetadataWatermarking />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Processing
            </CardTitle>
            <CardDescription>
              Add temporal watermarks and frame-level protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VideoWatermarking />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Protection Status
          </CardTitle>
          <CardDescription>
            Monitor your content protection and AI detection network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">247</div>
              <div className="text-sm text-muted-foreground">Protected Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.8%</div>
              <div className="text-sm text-muted-foreground">Detection Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">$1,247.83</div>
              <div className="text-sm text-muted-foreground">Earnings Protected</div>
            </div>
          </div>
          <Button className="w-full mt-4" variant="default">
            <Zap className="w-4 h-4 mr-2" />
            Boost Protection Level
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}