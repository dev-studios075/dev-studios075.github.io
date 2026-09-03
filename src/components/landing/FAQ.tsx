import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessagesSquare } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const { localizePath, t, tObject } = useTranslation();
  const items = tObject<FAQItem[]>("faq.items");
  return (
    <section id="faq" className="pt-10 pb-8 lg:pt-12 lg:pb-10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-tight relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-3 font-semibold">
            {t("faq.badge")}
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white mb-6">
            {t("faq.title")}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            {t("faq.description")}
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
          {t("faq.stillHaveQuestions")}
          <a href={localizePath("/book-demo/")} className="text-primary hover:underline font-semibold underline-offset-4 pl-1">
            {t("faq.scheduleCallback")}
          </a>
        </div>
      </div>
    </section>
  );
}
