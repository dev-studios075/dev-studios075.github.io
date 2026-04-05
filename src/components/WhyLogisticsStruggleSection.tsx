
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Route,
  Truck,
  AlarmClock,
  EyeOff,
  FileText,
  Users
} from "lucide-react";

const problems = [
  {
    title: "Manual Route Planning That Doesn’t Scale",
    desc: "Reliance on spreadsheets or legacy tools results in high planning effort and low optimization.",
    icon: Route,
  },
  {
    title: "Underutilized Fleets & Wasted Capacity",
    desc: "Poor visibility into truck load, weight, and volume means more trips and higher cost per delivery.",
    icon: Truck,
  },
  {
    title: "Missed Delivery Windows",
    desc: "Inability to account for time slots, material constraints, or stop priorities causes delays.",
    icon: AlarmClock,
  },
  {
    title: "No End-to-End Visibility",
    desc: "From dispatch to delivery, fleet managers fly blind without real-time data and control.",
    icon: EyeOff,
  },
  {
    title: "Fragmented Workflows & Compliance Risk",
    desc: "Driver documents, trip logs, expenses, and maintenance live across disjointed tools.",
    icon: FileText,
  },
  {
    title: "Inefficient Driver Coordination",
    desc: "Lack of centralized task management and updates slows down every mile.",
    icon: Users,
  },
];

const ProblemCard = ({
  title,
  desc,
  icon: Icon,
  index,
}: {
  title: string;
  desc: string;
  icon: React.FC<React.ComponentProps<typeof Route>>;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  return (
    <div
      ref={cardRef}
      className={cn(
        "feature-card glass-card opacity-0 p-4 sm:p-6 transition-all duration-300",
        "lg:hover:bg-gradient-to-br lg:hover:from-white lg:hover:to-pulse-50"
      )}
      style={{
        animationDelay: `${0.1 * index}s`,
      }}
    >
      <div className="flex items-center gap-3 mb-2 sm:mb-3">
        <Icon
          size={28}
          className="text-pulse-500 flex-shrink-0"
          aria-hidden="true"
        />
        <h3 className="text-lg sm:text-xl font-semibold text-pulse-700 m-0 p-0">
          {title}
        </h3>
      </div>
      <p className="text-gray-600 text-sm sm:text-base">{desc}</p>
    </div>
  );
};

const WhyLogisticsStruggleSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements =
              entry.target.querySelectorAll(".fade-in-element");
            elements.forEach((el, idx) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, idx * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  return (
    <section
      className="py-12 sm:py-16 md:py-20 border-b bg-white"
      id="why-logistics-struggle"
      ref={sectionRef}
    >
      <div className="section-container max-w-7xl">
        <div className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-3 sm:mb-4 opacity-0 fade-in-element">
            <span>Problem</span>
          </div>
          <h2 className="section-title mb-3 sm:mb-4 opacity-0 fade-in-element">
            Why Logistics Teams<br className="hidden sm:block" /> Struggle Today
          </h2>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element">
            Today’s supply chain demands precision. But most logistics operations
            face outdated, disconnected systems that lead to:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {problems.map((item, idx) => (
            <ProblemCard
              key={item.title}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyLogisticsStruggleSection;
