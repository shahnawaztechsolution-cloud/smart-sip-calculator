import React, { useState, useMemo } from 'react';
import { TrendingUp, IndianRupee, PieChart as PieChartIcon, Calculator, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { cn } from './lib/utils';

type CalculatorTab = 'sip' | 'lumpsum';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <h4 className="text-lg font-bold text-gray-900">{question}</h4>
        <ChevronDown className={cn("w-5 h-5 text-emerald-500 transition-transform shrink-0", isOpen ? "rotate-180" : "")} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<CalculatorTab>('sip');
  
  // SIP defaults
  const [sipInvestment, setSipInvestment] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  
  // Lumpsum defaults
  const [lumpsumInvestment, setLumpsumInvestment] = useState(100000);
  const [lumpsumRate, setLumpsumRate] = useState(12);
  const [lumpsumYears, setLumpsumYears] = useState(10);

  // Calculations
  const results = useMemo(() => {
    if (tab === 'sip') {
      const P = sipInvestment;
      const r = sipRate / 12 / 100;
      const n = sipYears * 12;
      
      const totalInvested = P * n;
      const totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const estReturns = totalValue - totalInvested;
      
      return { totalInvested, estReturns, totalValue: Math.round(totalValue) };
    } else {
      const P = lumpsumInvestment;
      const r = lumpsumRate / 100;
      const t = lumpsumYears;
      
      const totalInvested = P;
      const totalValue = P * Math.pow(1 + r, t);
      const estReturns = totalValue - totalInvested;
      
      return { totalInvested, estReturns, totalValue: Math.round(totalValue) };
    }
  }, [tab, sipInvestment, sipRate, sipYears, lumpsumInvestment, lumpsumRate, lumpsumYears]);

  const chartData = [
    { name: 'Invested Amount', value: Math.round(results.totalInvested), color: '#d1fae5' }, // emerald-100
    { name: 'Est. Returns', value: Math.round(results.estReturns), color: '#10b981' } // emerald-500
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            <span className="text-xl font-bold tracking-tight text-gray-900">Smart SIP Calculator</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <a href="#calculator" className="hover:text-emerald-600 transition-colors">Calculator</a>
            <a href="#guide" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Smart SIP Calculator
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Free online Smart SIP Calculator to estimate your mutual fund returns. Calculate SIP and Lumpsum investments accurately and plan your financial freedom.
          </p>
        </section>

        {/* Calculator Widget */}
        <section id="calculator" className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-20 max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50">
            <button 
              onClick={() => setTab('sip')}
              className={cn(
                "flex-1 py-5 text-center font-semibold text-sm md:text-base transition-colors",
                tab === 'sip' ? "text-emerald-700 border-b-2 border-emerald-500 bg-white" : "text-gray-500 hover:text-gray-900"
              )}
            >
              SIP Calculator
            </button>
            <button 
              onClick={() => setTab('lumpsum')}
              className={cn(
                "flex-1 py-5 text-center font-semibold text-sm md:text-base transition-colors",
                tab === 'lumpsum' ? "text-emerald-700 border-b-2 border-emerald-500 bg-white" : "text-gray-500 hover:text-gray-900"
              )}
            >
              Lumpsum Calculator
            </button>
          </div>

          <div className="p-6 md:p-10 grid lg:grid-cols-12 gap-12">
            {/* Inputs Column */}
            <div className="lg:col-span-7 space-y-10">
              {/* Investment Amount */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="investment-amount" className="text-sm font-semibold text-gray-700">
                    {tab === 'sip' ? 'Monthly Investment' : 'Total Investment'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input 
                      id="investment-amount"
                      type="number" 
                      min={tab === 'sip' ? 500 : 1000}
                      max={tab === 'sip' ? 100000 : 10000000}
                      value={tab === 'sip' ? sipInvestment : lumpsumInvestment}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        tab === 'sip' ? setSipInvestment(val) : setLumpsumInvestment(val);
                      }}
                      className="pl-8 pr-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 font-semibold text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  aria-label={tab === 'sip' ? 'Monthly Investment' : 'Total Investment'}
                  min={tab === 'sip' ? 500 : 1000} 
                  max={tab === 'sip' ? 100000 : 10000000} 
                  step={tab === 'sip' ? 500 : 1000} 
                  value={tab === 'sip' ? sipInvestment : lumpsumInvestment}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    tab === 'sip' ? setSipInvestment(val) : setLumpsumInvestment(val);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              {/* Expected Return Rate */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="return-rate" className="text-sm font-semibold text-gray-700">Expected Return Rate (p.a)</label>
                  <div className="relative">
                    <input 
                      id="return-rate"
                      type="number" 
                      min={1}
                      max={30}
                      value={tab === 'sip' ? sipRate : lumpsumRate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        tab === 'sip' ? setSipRate(val) : setLumpsumRate(val);
                      }}
                      className="pr-8 pl-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 font-semibold text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 w-28"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  aria-label="Expected Return Rate"
                  min={1} 
                  max={30} 
                  step={0.1} 
                  value={tab === 'sip' ? sipRate : lumpsumRate}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    tab === 'sip' ? setSipRate(val) : setLumpsumRate(val);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              {/* Time Period */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="time-period" className="text-sm font-semibold text-gray-700">Time Period</label>
                  <div className="relative">
                    <input 
                      id="time-period"
                      type="number"
                      min={1}
                      max={40}
                      value={tab === 'sip' ? sipYears : lumpsumYears}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        tab === 'sip' ? setSipYears(val) : setLumpsumYears(val);
                      }}
                      className="pr-12 pl-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 font-semibold text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 w-32"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">Yr</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  aria-label="Time Period"
                  min={1} 
                  max={40} 
                  step={1} 
                  value={tab === 'sip' ? sipYears : lumpsumYears}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    tab === 'sip' ? setSipYears(val) : setLumpsumYears(val);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-full h-[240px] relative mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-semibold text-gray-500">Total Value</span>
                  <span className="text-xl font-bold text-gray-900 mt-1">
                    {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        notation: "compact",
                        compactDisplay: "short"
                    }).format(results.totalValue)}
                  </span>
                </div>
              </div>

              {/* Data Breakdown */}
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center text-sm p-3 bg-emerald-50/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-100"></div>
                    <span className="text-gray-700 font-medium">Invested Amount</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(results.totalInvested)}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-emerald-50/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-700 font-medium">Est. Returns</span>
                  </div>
                  <span className="font-semibold text-emerald-600">{formatCurrency(results.estReturns)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center px-2">
                  <span className="font-bold text-gray-800 text-lg">Total Value</span>
                  <span className="text-2xl font-black text-gray-900">{formatCurrency(results.totalValue)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO & Educational Content */}
        <article id="guide" className="max-w-5xl mx-auto mb-20">
          <header className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Smart SIP Calculator: Calculate Mutual Fund Returns Online</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our free investment calculator helps you project your wealth growth accurately. Whether you're planning for retirement, buying a house, or saving for education, understanding how your money compounds is the first step.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">What is a SIP (Systematic Investment Plan)?</h3>
              <p className="text-gray-600 leading-relaxed">
                A Systematic Investment Plan (SIP) is a popular method of investing in mutual funds. It allows you to invest a fixed amount of money at regular intervals, usually monthly. This disciplined approach means you don't need a large sum of money to start investing, and it helps you average out market volatility over time.
              </p>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Power of Compounding</h3>
              <p className="text-gray-600 leading-relaxed">
                Compounding is the process where the returns on your investment start generating their own returns. The longer you stay invested, the more powerful this effect becomes. Long-term investing can be highly beneficial because your wealth grows exponentially, not just linearly, as returns build upon previous returns.
              </p>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <PieChartIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">How Does the SIP Return Calculator Work?</h3>
              <p className="text-gray-600 leading-relaxed">
                The calculator takes your monthly investment, expected return rate, and investment duration to estimate the future value of your portfolio. It mathematically projects your total invested amount and the estimated returns. Please note that the results provided by the calculator are estimates and not guaranteed outcomes.
              </p>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">SIP vs Lumpsum: Which is Better?</h3>
              <p className="text-gray-600 leading-relaxed">
                A SIP involves regular, disciplined investing over time, which is suitable for spreading investments and mitigating market timing risks. A lumpsum is a one-time investment that may suit investors with available capital, though market timing can influence the results more heavily compared to a SIP.
              </p>
            </section>
          </div>
        </article>

        {/* FAQ Section */}
        <section id="faq" className="mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem 
              question="Is the Smart SIP Calculator free?" 
              answer="Yes, the Smart SIP Calculator is completely free to use. You can calculate different scenarios for both your SIP and Lumpsum investments without any charges." 
            />
            <FAQItem 
              question="What is a good return rate for SIP?" 
              answer="Returns depend heavily on the investment type and market performance. Equity funds generally aim for higher long-term growth, while debt funds are more conservative. We do not promise any specific returns." 
            />
            <FAQItem 
              question="Can I lose money in mutual funds?" 
              answer="Yes, mutual funds may involve market risk. The value of your investments can go up or down based on market conditions, and you may get back less than you invested." 
            />
            <FAQItem 
              question="Are SIP returns guaranteed?" 
              answer="No. Returns are not guaranteed and depend on market performance. Mutual fund investments are subject to market risks." 
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-6">
              <TrendingUp className="w-8 h-8 stroke-[2.5]" />
              <span className="text-2xl font-bold tracking-tight text-gray-900">Smart SIP Calculator</span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-medium text-gray-600 mb-12">
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Terms & Conditions</a>
              <a href="mailto:shahnawaztechsolution@gmail.com" className="hover:text-emerald-600 transition-colors">Contact Us</a>
            </nav>

            <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm text-left">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Financial Disclaimer:</strong> This calculator provides estimates for educational and informational purposes only. Mutual fund investments are subject to market risks. Past performance does not guarantee future results. Please consult a qualified financial professional before making investment decisions.
              </p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>
              Contact Us: Mohd Shahnawaz | <a href="mailto:shahnawaztechsolution@gmail.com" className="text-emerald-600 hover:underline">shahnawaztechsolution@gmail.com</a>
            </p>
            <p>&copy; {new Date().getFullYear()} Smart SIP Calculator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
