import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, FileBarChart, ArrowRightLeft, Send } from "lucide-react";
const features = [{
  icon: FileBarChart,
  title: "Import Orders in Seconds",
  desc: "Pull orders from Excel, TMS, ERP, or API—ready for planning."
}, {
  icon: Brain,
  title: "AI-Powered Optimization",
  desc: "Generate delivery routes optimized for volume, weight, time windows, and cost."
}, {
  icon: ArrowRightLeft,
  title: "Reduce Fuel & Miles",
  desc: "Avoid route overlaps, empty miles, and reassign vehicles in real time."
}, {
  icon: Send,
  title: "One-Click Dispatch",
  desc: "Push trips to drivers instantly, along with digital manifests and instructions."
}];
const dispatchPlannerImage = "/lovable-uploads/bf57c34c-cf3c-4ad8-9621-870883203691.png";
const DispatchPlannerSection = () => {
  return <section className="w-full bg-gradient-to-br from-pulse-50 to-white py-12 px-4 sm:py-16" id="dispatch-planner">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="pulse-chip mb-2 text-xs sm:text-sm">Our Solution</span>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl mb-2">
            Smarter Logistics operations, Stronger Business
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <Card className="rounded-3xl min-w-0 flex-1 glass-card shadow-elegant border border-pulse-100 self-stretch h-full">
            <CardHeader className="p-6 pb-2 flex flex-row items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-pulse-700 mb-0">ClairTrack Dispatch Planner: AI That Plans Better, Faster</CardTitle>
                <CardDescription className="!text-base text-gray-700 font-normal">
                  <br />
                  Say goodbye to spreadsheets. Dispatch smarter with our automated planning engine.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                {features.map(({
                icon: Icon,
                title,
                desc
              }) => <div key={title} className="flex gap-4 items-start rounded-xl bg-white/90 hover:bg-pulse-50 transition px-4 py-3">
                    <Icon size={24} className="mt-1.5 text-pulse-500" strokeWidth={2.2} />
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{title}</div>
                      <div className="text-gray-700 text-sm">{desc}</div>
                    </div>
                  </div>)}
              </div>
              <img src={dispatchPlannerImage} alt="Dispatch planner UI with order management and route optimization" className="w-full rounded-2xl object-cover mt-3" style={{
              maxHeight: 240
            }} loading="lazy" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default DispatchPlannerSection;