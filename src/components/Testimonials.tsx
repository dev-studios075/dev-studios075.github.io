import React, { useRef } from "react";
interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  gradient: string;
  backgroundImage?: string;
}
const testimonials: TestimonialProps[] = [{
  content: "Before switching to this planner, we were spending hours on route planning and load optimization, With this planner, we’re managing 4x more orders and reduced our daily planning time by over 50%.",
  author: "Rahul Verma",
  role: "Logistics Head",
  gradient: "from-blue-700 via-indigo-800 to-purple-900",
  backgroundImage: "/background-section1.png"
}, {
  content: "We now schedule 100% of maintenance based on vehicle usage data. Downtime has dropped by 28%, and on-road breakdowns are rare.",
  author: "Manoj Pillai",
  role: "Transport Supervisor",
  gradient: "from-indigo-900 via-purple-800 to-orange-500",
  backgroundImage: "/background-section2.png"
}, {
  content: "What stood out to us was the ability to plan with 30+ variables—driver availability, material type, weight, and even dock availability. We now plan smarter, faster, and with fewer errors.",
  author: "Surbhi Goyal",
  role: "Logistics Lead",
  gradient: "from-purple-800 via-pink-700 to-red-500",
  backgroundImage: "/background-section3.png"
}, {
  content: "With real-time tracking and automated alerts, we’ve cut down on delivery delays by 33% and improved driver compliance by over 40%.",
  author: "Anjali Deshmukh",
  role: "Fleet Director",
  gradient: "from-purple-800 via-pink-700 to-red-500",
  backgroundImage: "/background-section3.png"
}];
const TestimonialCard = ({
  content,
  author,
  role,
  backgroundImage = "/background-section1.png"
}: TestimonialProps) => {
  return <div className="bg-cover bg-center rounded-lg p-8 h-full flex flex-col justify-between text-white transform transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden" style={{
    backgroundImage: `url('${backgroundImage}')`
  }}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white z-10"></div>
      
      <div className="relative z-0">
        <p className="text-xl mb-8 font-medium leading-relaxed pr-20">{`"${content}"`}</p>
        <div>
          <h4 className="font-semibold text-xl">{author}</h4>
          <p className="text-white/80">{role}</p>
        </div>
      </div>
    </div>;
};
const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  return <section id="testimonials" ref={sectionRef} className="bg-white relative py-0"> {/* Reduced from py-20 */}
      <div className="section-container opacity-0 animate-on-scroll">
        
        
        <h2 className="text-5xl font-display font-bold mb-12 text-left">What others say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => <TestimonialCard key={index} content={testimonial.content} author={testimonial.author} role={testimonial.role} gradient={testimonial.gradient} backgroundImage={testimonial.backgroundImage} />)}
        </div>
      </div>
    </section>;
};
export default Testimonials;