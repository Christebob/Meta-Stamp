import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Upload, Hash, Bot, Link, DollarSign } from "lucide-react";

const SignalFlowDemo = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Upload Video",
      emoji: "🎬",
      icon: Upload,
      description: "Creator uploads content",
      color: "text-blue-500"
    },
    {
      id: 2,
      title: "Assign ID",
      emoji: "🔑",
      icon: Hash,
      description: "System generates tracking ID",
      color: "text-purple-500"
    },
    {
      id: 3,
      title: "AI Access",
      emoji: "🤖",
      icon: Bot,
      description: "AI systems use content",
      color: "text-green-500"
    },
    {
      id: 4,
      title: "Blockchain Log",
      emoji: "⛓️",
      icon: Link,
      description: "Usage logged on-chain",
      color: "text-orange-500"
    },
    {
      id: 5,
      title: "Get Paid",
      emoji: "💰",
      icon: DollarSign,
      description: "Creator receives payment",
      color: "text-emerald-500"
    }
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-background via-muted/30 to-background border-primary/20">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">How Meta-Stamp Works</h3>
        <p className="text-muted-foreground">Watch the flow of content protection and monetization</p>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="relative flex items-center justify-between max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Box */}
              <div className={`relative transition-all duration-500 ${
                activeStep === index ? 'scale-110 z-10' : 'scale-100 z-0'
              }`}>
                <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
                  activeStep === index 
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20' 
                    : 'bg-card border-border'
                }`}>
                  <div className="text-center space-y-3">
                    <div className={`text-4xl transition-transform duration-500 ${
                      activeStep === index ? 'animate-bounce' : ''
                    }`}>
                      {step.emoji}
                    </div>
                    <step.icon className={`w-8 h-8 mx-auto transition-colors duration-500 ${
                      activeStep === index ? step.color : 'text-muted-foreground'
                    }`} />
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Arrow */}
              {index < steps.length - 1 && (
                <div className="flex-1 relative mx-4">
                  <div className="h-0.5 bg-border relative overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000 ${
                        activeStep === index ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-500 ${
                    activeStep === index ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                  }`}>
                    <div className="w-0 h-0 border-l-4 border-l-primary border-y-2 border-y-transparent" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className={`transition-all duration-500 ${
              activeStep === index ? 'scale-105' : 'scale-100'
            }`}>
              <div className={`p-4 rounded-xl border-2 transition-all duration-500 ${
                activeStep === index 
                  ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20' 
                  : 'bg-card border-border'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl transition-transform duration-500 ${
                    activeStep === index ? 'animate-bounce' : ''
                  }`}>
                    {step.emoji}
                  </div>
                  <step.icon className={`w-6 h-6 transition-colors duration-500 ${
                    activeStep === index ? step.color : 'text-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Arrow for Mobile */}
            {index < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="relative">
                  <div className="w-0.5 h-8 bg-border relative overflow-hidden">
                    <div 
                      className={`absolute inset-x-0 top-0 bg-gradient-to-b from-primary to-primary/60 transition-all duration-1000 ${
                        activeStep === index ? 'h-full' : 'h-0'
                      }`}
                    />
                  </div>
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-500 ${
                    activeStep === index ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                  }`}>
                    <div className="w-0 h-0 border-t-4 border-t-primary border-x-2 border-x-transparent" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeStep === index ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </Card>
  );
};

export default SignalFlowDemo;