import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessagesSquare } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

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
  },
  {
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

const faqDataHindi: FAQItem[] = [
  { question: "Fleetcodes की AI-पावर्ड डिस्पैच प्लानिंग कैसे काम करती है?", answer: "सिस्टम आपकी SOP, ट्रक प्रकार, रूट इतिहास और ड्राइवर उपलब्धता को समझकर बेहतर लोड मैच और शेड्यूल सुझाता है। इससे खाली वाहन चलने और मैनुअल प्लानिंग में लगने वाला समय कम होता है।" },
  { question: "क्या यह मौजूदा GPS हार्डवेयर और FASTag अकाउंट से जुड़ता है?", answer: "हाँ। Fleetcodes प्रमुख GPS ट्रैकिंग डिवाइस और समर्थित बैंक कनेक्शन के साथ इंटीग्रेट होकर टोल ट्रांजैक्शन और FASTag बैलेंस अलर्ट दिखा सकता है।" },
  { question: "हमारी फ्लीट को ऑनबोर्ड करने में कितना समय लगता है?", answer: "मानक ऑनबोर्डिंग आमतौर पर 7 से 10 दिन लेती है। हमारी टीम वाहन सूची, ड्राइवर रिकॉर्ड, ग्राहक रेट और ऑपरेशनल ट्रेनिंग सेट करने में सहायता करती है।" },
  { question: "Fleetcodes टोल लीकेज और अधिक खर्च को कैसे रोकता है?", answer: "प्लेटफ़ॉर्म FASTag ट्रांजैक्शन को वाहन की GPS रूट टाइमलाइन से मिलाता है। गलत रूट, असामान्य प्रतीक्षा या गलत एक्सल श्रेणी का शुल्क मिलने पर मामला रीकन्सिलिएशन डैशबोर्ड पर फ्लैग होता है।" },
  { question: "क्या हमारे कॉन्ट्रैक्ट और ग्राहक डेटा सुरक्षित हैं?", answer: "सुरक्षा हमारे डिज़ाइन का महत्वपूर्ण हिस्सा है। Fleetcodes एक्सेस कंट्रोल, डेटा आइसोलेशन और सुरक्षित HTTPS/TLS कनेक्शन जैसे उपायों के साथ व्यावसायिक डेटा की सुरक्षा के लिए बनाया गया है।" },
  { question: "क्या हम कस्टम रिपोर्ट या ERP इंटीग्रेशन ले सकते हैं?", answer: "हाँ। Fleetcodes समर्थित API और वेबहुक के माध्यम से ट्रिप शीट, POD और बिलिंग डेटा को एंटरप्राइज़ सिस्टम के साथ सिंक करने में सहायता कर सकता है।" },
];

export default function FAQ() {
  const { isHindi, localizePath } = useLanguage();
  const items = isHindi ? faqDataHindi : faqData;
  return (
    <section id="faq" className="pt-10 pb-8 lg:pt-12 lg:pb-10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-tight relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-3 font-semibold">
            {isHindi ? "सामान्य सवाल" : "Common Questions"}
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white mb-6">
            {isHindi ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            {isHindi ? "Fleetcodes से जुड़े सवाल हैं? यहाँ फ्लीट मालिकों और लॉजिस्टिक्स मैनेजरों के सामान्य सवालों के जवाब दिए गए हैं।" : "Got questions about Fleetcodes? We've compiled answers to the most common queries from fleet owners and logistics managers."}
          </p>
        </div>

        {/* Accordion Container */}
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-sm">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {items.map((item, idx) => (
              <AccordionItem 
                key={idx} 
                value={`faq-${idx}`}
                className="border-slate-200 dark:border-slate-800/60 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-slate-800 dark:text-white hover:text-primary hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <MessagesSquare className="w-4 h-4 text-primary" />
          {isHindi ? "अभी भी कोई सवाल है?" : "Still have questions?"}
          <a href={localizePath("/book-demo/")} className="text-primary hover:underline font-semibold underline-offset-4 pl-1">
            {isHindi ? "हमारी टीम से कॉलबैक तय करें" : "Schedule a callback with our team"}
          </a>
        </div>
      </div>
    </section>
  );
}
