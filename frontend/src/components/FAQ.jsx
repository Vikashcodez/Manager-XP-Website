import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PageBackground from './PageBackground';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

/**
 * Answers are limited to what the product actually models: the two software
 * products, branch-aware plans, PC limits per plan, time-based sessions and the
 * free-trial plan. Trial length / PC counts are deliberately not hard-coded here
 * because they come from the subscription plan shown in the trial banner.
 */
const faqs = [
  {
    q: 'What does ManagerXP actually do?',
    a: 'It is management software for gaming and internet cafes. You register each PC in the system, control and time customer sessions, bill from those sessions, and see the state of the floor from one dashboard.'
  },
  {
    q: 'What is the difference between GamingXP and CafeXP?',
    a: 'GamingXP is built for gaming cafes, with game and system control, session handling and telemetry. CafeXP targets internet cafes and browsing centres, focusing on user access, time-based billing and reporting.'
  },
  {
    q: 'Can I manage more than one branch?',
    a: 'Yes. A cafe can have multiple branches, and each PC belongs to a branch, so you can look at one location or the whole business. How many branches you can add depends on your plan.'
  },
  {
    q: 'How is billing worked out?',
    a: 'Billing follows the recorded session time rather than a manual tally at the counter, which is what removes most disputes over minutes.'
  },
  {
    q: 'How many PCs can I connect?',
    a: 'Each subscription plan sets a maximum number of PCs. You pick the plan that matches your floor size, and it can be changed as you grow.'
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes, there is a free trial plan. The exact length and PC limit are shown on the trial banner on this page, since they come from the current plan.'
  },
  {
    q: 'Can you build something specific for my setup?',
    a: 'We take on custom development and AI integration work alongside the core products. The contact form is the fastest way to describe what you need.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative bg-black overflow-hidden antialiased font-sans text-white">
      <PageBackground streakTop="top-1/4" streakBottom="bottom-1/3" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-20 sm:py-24">
        <SectionHeading
          eyebrow="Questions"
          title="Before you"
          highlight="get started."
          className="mb-12"
        />

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <Reveal key={faq.q} delay={index * 50}>
                <div
                  className={`rounded-xl border bg-white/[0.02] backdrop-blur-sm transition-colors duration-300 ${
                    isOpen ? 'border-red-500/30' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className={`text-sm sm:text-base font-medium transition-colors ${isOpen ? 'text-white' : 'text-neutral-300'}`}>
                        {faq.q}
                      </span>
                      <Plus
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-45 text-red-500' : 'text-neutral-500'
                        }`}
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="px-5 pb-5 -mt-1"
                  >
                    <p className="text-sm text-neutral-400 leading-relaxed text-pretty">{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
