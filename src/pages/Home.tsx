import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight,
  Plus,
  LogIn,
  Globe,
  Mic,
  Monitor,
  Clock
} from "lucide-react";

export default function HomePage() {
  const [meetingId, setMeetingId] = useState("");
  const [userName, setUserName] = useState("");

  const handleJoinMeeting = () => {
    if (meetingId.trim() && userName.trim()) {
      console.log("Joining meeting:", meetingId, "as", userName);
      // Navigate to room - replace with your actual navigation
      // navigate(`/room/${meetingId}?name=${userName}`);
    }
  };

  const handleCreateMeeting = () => {
    if (userName.trim()) {
      // Generate new meeting ID
      const newMeetingId = `meeting-${Date.now()}`;
      console.log("Creating meeting:", newMeetingId, "for", userName);
      // Navigate to room - replace with your actual navigation
      // navigate(`/room/${newMeetingId}?name=${userName}`);
    }
  };

  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "HD Video Calls",
      description: "Crystal clear video quality with adaptive streaming"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-participant",
      description: "Connect with multiple people simultaneously"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "End-to-end encryption keeps your conversations safe"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Low latency for smooth real-time communication"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">VideoMeet</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-600 text-white">
                <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connect.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Collaborate.
            </span>{" "}
            Create.
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience seamless video meetings with crystal-clear quality, 
            robust security, and powerful collaboration tools.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Meeting Actions */}
          <div className="space-y-8">
            
            {/* User Name Input */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Your Identity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 text-lg py-6"
                />
              </CardContent>
            </Card>

            {/* Join Meeting */}
            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-green-400" />
                  Join Existing Meeting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter Meeting ID"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 text-lg py-6"
                />
                <Button 
                  onClick={handleJoinMeeting}
                  disabled={!meetingId.trim() || !userName.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Join Meeting
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Create Meeting */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  Start New Meeting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleCreateMeeting}
                  disabled={!userName.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Meeting
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-8 text-center lg:text-left">
              Why Choose VideoMeet?
            </h2>
            
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-sm text-gray-300">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">< 50ms</div>
                    <div className="text-sm text-gray-300">Latency</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-gray-300">Support</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Features Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Mic className="w-5 h-5" />, label: "HD Audio" },
            { icon: <Monitor className="w-5 h-5" />, label: "Screen Share" },
            { icon: <Globe className="w-5 h-5" />, label: "Global Access" },
            { icon: <Clock className="w-5 h-5" />, label: "24/7 Available" }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="text-blue-400">{item.icon}</div>
              <span className="text-gray-300 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 VideoMeet. Connecting people worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}