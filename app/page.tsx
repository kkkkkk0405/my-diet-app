'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Flame, 
  Utensils, 
  TrendingUp, 
  Calendar,
  X,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Mock data for the chart
const data = [
  { name: 'Mon', calories: 2100, weight: 75.2 },
  { name: 'Tue', calories: 1850, weight: 75.0 },
  { name: 'Wed', calories: 2300, weight: 74.9 },
  { name: 'Thu', calories: 1900, weight: 74.8 },
  { name: 'Fri', calories: 2100, weight: 74.6 },
  { name: 'Sat', calories: 2500, weight: 74.7 },
  { name: 'Sun', calories: 1800, weight: 74.5 },
];

const PRESET_TAGS = [
  { name: 'Chicken Breast', cals: 165, color: 'bg-blue-500' },
  { name: 'Brown Rice', cals: 215, color: 'bg-orange-500' },
  { name: 'Avocado', cals: 160, color: 'bg-green-500' },
  { name: 'Protein Shake', cals: 120, color: 'bg-purple-500' },
  { name: 'Salmon', cals: 208, color: 'bg-red-500' },
  { name: 'Salad', cals: 50, color: 'bg-emerald-500' },
];

export default function DietProDashboard() {
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: any) => {
    setSelectedTags([...selectedTags, { ...tag, id: Date.now() }]);
  };

  const removeTag = (id: number) => {
    setSelectedTags(selectedTags.filter(t => t.id !== id));
  };

  const totalCals = selectedTags.reduce((acc, curr) => acc + curr.cals, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
              Instant Diet Pro
            </h1>
            <p className="text-zinc-400">Welcome back, Keitaro</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <span className="font-bold text-orange-400">K</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="text-orange-500" /> Quick Log
              </h2>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Search foods or type custom..."
                  className="w-full bg-zinc-800 border-zinc-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {PRESET_TAGS.map(tag => (
                  <button
                    key={tag.name}
                    onClick={() => addTag(tag)}
                    className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                    {tag.name}
                    <span className="text-zinc-500">+{tag.cals}</span>
                  </button>
                ))}
              </div>

              <div className="min-h-[100px] border-2 border-dashed border-zinc-800 rounded-xl p-4 flex flex-wrap gap-2 items-start">
                {selectedTags.length === 0 ? (
                  <p className="text-zinc-600 text-center w-full py-4 italic">No items added yet</p>
                ) : (
                  selectedTags.map(tag => (
                    <div 
                      key={tag.id}
                      className="flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg animate-in fade-in zoom-in duration-200"
                    >
                      <span className="text-sm font-medium">{tag.name}</span>
                      <button onClick={() => removeTag(tag.id)}>
                        <X className="w-4 h-4 hover:text-white transition-colors" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button 
                disabled={selectedTags.length === 0}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
              >
                Log {totalCals} Calories
              </button>
            </div>

            {/* Chart Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="text-rose-500" /> Progress
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#71717a" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#71717a" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCals)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Summaries */}
          <div className="space-y-6">
            <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-orange-500/20">
              <div className="flex justify-between items-start mb-4">
                <Flame className="w-8 h-8 opacity-80" />
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Today</span>
              </div>
              <p className="text-orange-100 text-sm font-medium">Daily Calories</p>
              <h3 className="text-4xl font-bold mt-1">1,850 <span className="text-xl font-normal opacity-70">/ 2,200</span></h3>
              <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-white h-full rounded-full w-[84%]" />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-4 text-zinc-400 uppercase text-xs tracking-widest">Macro Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Protein</span>
                    <span className="font-bold">142g</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[70%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carbs</span>
                    <span className="font-bold">185g</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full w-[55%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fats</span>
                    <span className="font-bold">62g</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full w-[40%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-4 text-zinc-400 uppercase text-xs tracking-widest">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: '12:30 PM', meal: 'Lunch', cals: 650 },
                  { time: '08:15 AM', meal: 'Breakfast', cals: 420 },
                  { time: 'Yesterday', meal: 'Dinner', cals: 850 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                        <Utensils className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.meal}</p>
                        <p className="text-xs text-zinc-500">{item.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-300">+{item.cals}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
