import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Camera,
  AlertCircle,
} from "lucide-react";
import TabBar from "@/components/elements/TabBar";

// Mock camera data - in a real app, this would come from an API
const cameras = [
  {
    id: "cam1",
    name: "Main Entrance",
    location: "Building A, Floor 1",
    status: "active",
    lastUpdated: "2 minutes ago",
    resolution: "1080p",
    fps: 30,
  },
  {
    id: "cam2",
    name: "Loading Dock",
    location: "Building B, Rear",
    status: "active",
    lastUpdated: "1 minute ago",
    resolution: "720p",
    fps: 24,
  },
];

const LiveFootage = () => {
  const [selectedCamera, setSelectedCamera] = useState("cam1");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      message: "Motion detected at Main Entrance",
      time: "2:30 PM",
      severity: "warning",
    },
    {
      id: 2,
      message: "Person detected at Loading Dock",
      time: "2:15 PM",
      severity: "info",
    },
  ]);

  // Simulate recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Toggle recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <TabBar />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Live Camera Feeds
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            Camera Settings
          </Button>
          <Button variant="outline" className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed 1 */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                {cameras[0].name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {cameras[0].location}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {cameras[0].status}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black">
              {/* Camera feed would be here - using a placeholder for now */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-50">
                    Live Feed: {cameras[0].name}
                  </p>
                  <p className="text-xs opacity-30">
                    {cameras[0].resolution} • {cameras[0].fps}fps
                  </p>
                </div>
              </div>

              {/* Camera controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-24">
                      <Slider
                        value={[volume]}
                        onValueChange={(value) => setVolume(value[0])}
                        max={100}
                        step={1}
                        className="text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera Feed 2 */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                {cameras[1].name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {cameras[1].location}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {cameras[1].status}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black">
              {/* Camera feed would be here - using a placeholder for now */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-50">
                    Live Feed: {cameras[1].name}
                  </p>
                  <p className="text-xs opacity-30">
                    {cameras[1].resolution} • {cameras[1].fps}fps
                  </p>
                </div>
              </div>

              {/* Camera controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-24">
                      <Slider
                        value={[volume]}
                        onValueChange={(value) => setVolume(value[0])}
                        max={100}
                        step={1}
                        className="text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recording Controls and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recording Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Recording Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="recording">Record Feed</Label>
                <Switch
                  id="recording"
                  checked={isRecording}
                  onCheckedChange={toggleRecording}
                />
              </div>

              {isRecording && (
                <div className="bg-red-100 text-red-800 p-3 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span>Recording in progress</span>
                  </div>
                  <span className="font-mono">{formatTime(recordingTime)}</span>
                </div>
              )}

              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  Download Last Recording
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-md flex items-start ${
                    alert.severity === "warning"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <AlertCircle
                    className={`h-5 w-5 mr-3 mt-0.5 ${
                      alert.severity === "warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  View All Alerts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveFootage;
