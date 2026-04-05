import React from "react";
const ImageShowcaseSection = () => {
  return <section className="w-full pt-0 pb-8 sm:pb-12 bg-white" id="showcase">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">Experience the future of Yard Management Today !</h2>
        </div>
        
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant mx-auto max-w-4xl animate-on-scroll">
          <div className="w-full">
            <img alt="Yard management system showing vehicles parked in organized areas with clear entry and exit points" src="/lovable-uploads/a23cff54-805e-404d-8f12-b5259ea01edc.png" className="w-full h-auto object-contain" />
          </div>
          <div className="bg-white p-4 sm:p-8 py-[32px]">
            <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4">ClairTrack Yard Management Powered by AI & Image Recognition</h3>
            <p className="text-gray-700 text-sm sm:text-base">Transform how your yard runs—with AI-powered gate automation, smart dock scheduling, and real-time trailer and container tracking that keeps everything moving smoothly</p>
          </div>
        </div>
      </div>
    </section>;
};
export default ImageShowcaseSection;