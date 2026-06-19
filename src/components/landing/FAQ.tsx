import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessagesSquare } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does Fleetcodes' AI-powered dispatch planning work?",
    answer: "Our system reads your operational standards (SOPs), truck types, route history, and driver availability logs. The AI algorithm then auto-recommends optimal load matches and schedules, reducing vehicle dry-runs and admin planning time by over 50%."
  },
  {
    question: "Does it integrate with existing GPS hardware and FASTag accounts?",
    answer: "Yes, fully! Fleetcodes has pre-built API integrations for all leading GPS tracking devices (LocoNav, Trimble, etc.) and direct bank connections (ICICI, HDFC, SBI) for live toll deduction tracking and FASTag balance alerts."
  },  {
    question: "How long does it take to onboard our fleet?",
    answer: "A standard onboarding takes between 7 to 10 days. Our dedicated customer success team will setup your vehicle lists, driver KYC records, and client rates, and run training sessions for your managers and dispatch coordinators."
  },
  {
    question: "How does Fleetcodes prevent toll leakage and expense overcharging?",
    answer: "The platform dynamically correlates actual FASTag transactions with the vehicle's GPS route timeline. If a vehicle takes an unauthorized route, stands waiting excessively, or gets charged for an incorrect axle category, it gets flagged instantly on the reconciliation dashboard."
  },
  {
    question: "Is our shipper contract and customer data secure?",
    answer: "Absolutely. Security is central to our design. Fleetcodes utilizes multi-tenant architecture with row-level data isolation and end-to-end TLS encryption. Your commercial rates, client contracts, and driver records are completely secure and private to your account."
  },
  {
    question: "Can we request custom reports or connect Fleetcodes to our ERP?",
    answer: "Yes, we support enterprise integrations. Fleetcodes provides outbound REST APIs and Webhooks to sync trip sheets, POD confirmations, and billing invoices directly with standard ERPs like SAP, Oracle, and Tally Prime."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="relative py-24 bg-slate-950">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 px-4 mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            <HelpCircle className="w-4 h-4" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-400">
            Got questions about Fleetcodes? We've compiled answers to the most common queries from fleet owners and logistics managers.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-6 sm:p-10">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, idx) => (
              <AccordionItem 
                key={idx} 
                value={`faq-${idx}`}
                className="border-slate-800/60 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-white hover:text-indigo-400 hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 text-sm sm:text-base leading-relaxed pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-12 text-sm text-slate-400 flex items-center justify-center gap-2">
          <MessagesSquare className="w-4 h-4 text-indigo-400" />
          Still have questions? 
          <a href="/book-demo" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
            Schedule a callback with our team
          </a>
        </div>
      </div>
    </section>
  );
}
