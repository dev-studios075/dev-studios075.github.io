import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  TrendingUp, 
  Fuel, 
  Receipt, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function ROICalculator() {
  const [fleetSize, setFleetSize] = useState<number>(50);
  const [monthlyFuel, setMonthlyFuel] = useState<number>(120000); // Average per truck
  const [emptyMilePct, setEmptyMilePct] = useState<number>(20); // Average empty run percentage

  // ROI Math
  // Fuel wastage on empty runs
  const totalFuelSpend = fleetSize * monthlyFuel;
  const emptyMileLoss = totalFuelSpend * (emptyMilePct / 100);
  
  // AI routing saves ~35% of empty mile costs
  const fuelSavings = emptyMileLoss * 0.35;
  
  // Toll reconciliation saves ~₹2,500 leakage and admin overhead per truck/month
  const tollSavings = fleetSize * 2500;
  
  // Automated billing & POD collections recovers ~₹4,500 leakage/errors per truck/month
  const billingSavings = fleetSize * 4500;

  const totalMonthlySavings = fuelSavings + tollSavings + billingSavings;
  const totalYearlySavings = totalMonthlySavings * 12;

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  };

  return (
    <section id="roi-calculator" className="relative py-24 overflow-hidden bg-slate-950">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <Calculator className="w-4 h-4" />
            ROI Savings Estimator
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Calculate How Much You Save with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Fleetcodes</span>
          </h2>
          <p className="text-lg text-slate-400">
            Enter your current fleet metrics to visualize how automation-first fleet management directly translates into increased profitability.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Controls - Left Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8">
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Your Fleet Profile
              </h3>
              
              {/* Slider 1: Fleet Size */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-300">Fleet Size (Active Trucks)</span>
                  <span className="text-indigo-400 font-semibold text-base">{fleetSize} Trucks</span>
                </div>
                <Slider
                  min={5}
                  max={250}
                  step={5}
                  value={[fleetSize]}
                  onValueChange={(val) => setFleetSize(val[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>5</span>
                  <span>100</span>
                  <span>250+</span>
                </div>
              </div>

              {/* Slider 2: Monthly Fuel Spend */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-300">Avg. Monthly Fuel Spend per Truck</span>
                  <span className="text-indigo-400 font-semibold text-base">₹{monthlyFuel.toLocaleString("en-IN")}</span>
                </div>
                <Slider
                  min={40000}
                  max={250000}
                  step={5000}
                  value={[monthlyFuel]}
                  onValueChange={(val) => setMonthlyFuel(val[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>₹40k</span>
                  <span>₹1.5L</span>
                  <span>₹2.5L+</span>
                </div>
              </div>

              {/* Slider 3: Empty Mile Percentage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-300">Empty Run Percentage (%)</span>
                  <span className="text-indigo-400 font-semibold text-base">{emptyMilePct}%</span>
                </div>
                <Slider
                  min={5}
                  max={45}
                  step={1}
                  value={[emptyMilePct]}
                  onValueChange={(val) => setEmptyMilePct(val[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>5% (Optimized)</span>
                  <span>20% (Avg)</span>
                  <span>45% (High Leakage)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-500">
              *Savings projections are calculated based on operational benchmarks collected from 100+ active fleets in India.
            </div>
          </div>

          {/* Outputs - Right Column (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-b from-indigo-950/20 to-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">Projected Savings</h3>
                  <p className="text-sm text-slate-400">Estimated money recovered with Fleetcodes</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +35% Efficiency
                </div>
              </div>

              {/* Huge Savings Display */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Monthly Savings</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {formatCurrency(totalMonthlySavings)}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="text-xs font-medium text-indigo-300 uppercase tracking-wider mb-2">Yearly Savings</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                    {formatCurrency(totalYearlySavings)}
                  </div>
                </div>
              </div>

              {/* Savings Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Breakdown of Recovery</h4>
                
                {/* 1. Fuel & Routing */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Fuel className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">AI Empty Run Reduction</div>
                      <div className="text-xs text-slate-400">35% reduction in empty dry-runs</div>
                    </div>
                  </div>
                  <div className="text-base font-bold text-slate-200">{formatCurrency(fuelSavings)}/mo</div>
                </div>

                {/* 2. Toll Reconciliation */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Toll & FASTag Protection</div>
                      <div className="text-xs text-slate-400">Leakage check & auto-reconciliation</div>
                    </div>
                  </div>
                  <div className="text-base font-bold text-slate-200">{formatCurrency(tollSavings)}/mo</div>
                </div>

                {/* 3. POD & Billing Leakage */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">POD & Billing Leakage</div>
                      <div className="text-xs text-slate-400">Instant invoicing & automated updates</div>
                    </div>
                  </div>
                  <div className="text-base font-bold text-slate-200">{formatCurrency(billingSavings)}/mo</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8 border-t border-slate-800/80 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-400 text-center sm:text-left">
                Start recovering your hard-earned revenue today.
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 group">
                <Link to="/book-demo">
                  Lock in Your Savings
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
