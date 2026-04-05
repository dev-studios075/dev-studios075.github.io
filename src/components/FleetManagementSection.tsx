import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Truck, Map, AlignHorizontalDistributeCenter, CheckCircle2, ClipboardEdit, Navigation, UserCheck, MessageCircle, Image as ImageIcon, FileBarChart, Bot, PieChart, CalendarCheck2 } from "lucide-react";

// Use the uploaded fleet management dashboard image
const fleetImage = "/lovable-uploads/bf377bbd-378a-4a0c-bdb2-d8c23899cd57.png";
const preTransit = [{
  icon: Map,
  text: "Route planning by cost, load, and windows"
}, {
  icon: AlignHorizontalDistributeCenter,
  text: "Auto vehicle-driver matching"
}, {
  icon: CheckCircle2,
  text: "Pre-trip checks & document compliance"
}, {
  icon: ClipboardEdit,
  text: "Assign digital trip sheets with task details"
}];
const inTransit = [{
  icon: Navigation,
  text: "Live GPS tracking & delay alerts"
}, {
  icon: UserCheck,
  text: "Driver behavior insights"
}, {
  icon: MessageCircle,
  text: "In-app messaging with drivers"
}, {
  icon: ImageIcon,
  text: "ePOD: proof of delivery with photos & signatures"
}];
const postTransit = [{
  icon: FileBarChart,
  text: "Auto trip reports & expense logging"
}, {
  icon: Bot,
  text: "Issue logging & fuel tracking"
}, {
  icon: PieChart,
  text: "Performance analytics for drivers & vehicles"
}, {
  icon: CalendarCheck2,
  text: "Maintenance scheduling based on real-time data"
}];
const FleetManagementSection = () => {
  return <section className="w-full bg-gradient-to-br from-pulse-100 to-white py-12 px-4 sm:py-16" id="fleet-management">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="pulse-chip mb-2 text-xs sm:text-sm">Our Solution</span>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl mb-2">
            Fleet Management: Own Every Mile of the Journey
          </h2>
          <div className="section-subtitle text-gray-700">
            From the first mile to the last — get full visibility and control over your fleet.
          </div>
        </div>
        <div className="w-full">
          <Card className="rounded-3xl min-w-0 flex-1 glass-card shadow-elegant border border-pulse-100 h-full">
            <CardHeader className="p-6 pb-2 flex flex-row items-center gap-4">
              <Truck size={32} className="text-pulse-700 bg-pulse-50 rounded-full p-2" />
              <div>
                <CardTitle className="text-xl font-bold text-pulse-700 mb-0">ClairTrack Fleet Management</CardTitle>
                <CardDescription className="!text-base text-gray-700 font-normal">
                  <span className="font-semibold text-pulse-600"></span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-3">
              <div className="flex flex-col md:flex-row gap-6 items-stretch min-h-[340px] md:min-h-[440px]">
                {/* Features List */}
                <div className="w-full md:w-7/12 flex flex-col">
                  <div className="space-y-5 flex-1">
                    <div>
                      <div className="font-semibold text-pulse-700 mb-2 text-left py-[15px]">Pre-Transit</div>
                      <div className="grid grid-cols-1 gap-2">
                        {preTransit.map(({
                        icon: Icon,
                        text
                      }) => <div key={text} className="flex items-center gap-3 text-gray-800 px-2 py-1 rounded hover:bg-pulse-50 transition">
                            <Icon size={20} className="text-pulse-500" />
                            <span className="text-sm">{text}</span>
                          </div>)}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-pulse-700 mb-2 text-left py-[15px]">In-Transit</div>
                      <div className="grid grid-cols-1 gap-2">
                        {inTransit.map(({
                        icon: Icon,
                        text
                      }) => <div key={text} className="flex items-center gap-3 text-gray-800 px-2 py-1 rounded hover:bg-pulse-50 transition">
                            <Icon size={20} className="text-pulse-500" />
                            <span className="text-sm">{text}</span>
                          </div>)}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-pulse-700 mb-2 text-left py-[15px]">Post-Transit</div>
                      <div className="grid grid-cols-1 gap-2">
                        {postTransit.map(({
                        icon: Icon,
                        text
                      }) => <div key={text} className="flex items-center gap-3 text-gray-800 px-2 py-1 rounded hover:bg-pulse-50 transition">
                            <Icon size={20} className="text-pulse-500" />
                            <span className="text-sm">{text}</span>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Fleet Image */}
                <div className="w-full md:w-5/12 flex items-center">
                  <img src={fleetImage} alt="Fleet management dashboard with live tracking and lane management" style={{
                  minHeight: '340px',
                  height: '440px'
                }} loading="lazy" className="rounded-3xl w-full h-full shadow-lg object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default FleetManagementSection;