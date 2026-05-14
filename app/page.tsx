'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Flame, 
  Utensils, 
  TrendingUp, 
  X,
  Scale
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// 型定義
type DietLog = {
  id: string;
  created_at: string;
  tag: string;
  content: string | null;
  calories: number | null;
  weight: number | null;
};

const TAGS = ['体重', '朝食', '昼食', '夕食', '間食', '運動'] as const;
type Tag = typeof TAGS[number];

export default function DietApp() {
  const [logs, setLogs] = useState<DietLog[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag>('昼食');
  const [weight, setWeight] = useState('');
  const [content, setContent] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);

  // データの取得
  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('diet_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching logs:', error);
    else setLogs(data || []);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 保存処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      tag: selectedTag,
      weight: selectedTag === '体重' ? parseFloat(weight) : null,
      content: selectedTag !== '体重' ? content : null,
      calories: selectedTag !== '体重' ? parseInt(calories) : null,
    };

    const { error } = await supabase.from('diet_logs').insert([payload]);

    if (error) {
      alert('エラーが発生しました: ' + error.message);
    } else {
      setWeight('');
      setContent('');
      setCalories('');
      fetchLogs();
    }
    setLoading(false);
  };

  // 本日の集計
  const today = new Date().toLocaleDateString();
  const todayLogs = logs.filter(l => new Date(l.created_at).toLocaleDateString() === today);
  
  const intakeTotal = todayLogs
    .filter(l => ['朝食', '昼食', '夕食', '間食'].includes(l.tag))
    .reduce((acc, curr) => acc + (curr.calories || 0), 0);
  
  const burnTotal = todayLogs
    .filter(l => l.tag === '運動')
    .reduce((acc, curr) => acc + (curr.calories || 0), 0);

  // グラフ用データ (直近10件の体重)
  const chartData = logs
    .filter(l => l.tag === '体重' && l.weight)
    .slice(0, 10)
    .reverse()
    .map(l => ({
      date: new Date(l.created_at).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
      weight: l.weight
    }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ヘッダー */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
              自分専用ダイエット管理
            </h1>
            <p className="text-zinc-400">今日も一歩ずつ進みましょう</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <Scale className="text-orange-400 w-6 h-6" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左側：入力セクション */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Plus className="text-orange-500" /> クイック記録
              </h2>
              
              {/* タグ選択ボタン */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`py-3 rounded-xl font-bold transition-all text-sm ${
                      selectedTag === tag 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* フォーム */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedTag === '体重' ? (
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 uppercase tracking-widest">体重 (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-zinc-800 border-none rounded-xl p-4 text-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-500 uppercase tracking-widest">内容</label>
                      <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={selectedTag === '運動' ? "何をした？" : "何を食べた？"}
                        className="w-full bg-zinc-800 border-none rounded-xl p-4 text-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-500 uppercase tracking-widest">カロリー (kcal)</label>
                      <input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        placeholder="0"
                        className="w-full bg-zinc-800 border-none rounded-xl p-4 text-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all mt-4"
                >
                  {loading ? '送信中...' : '記録を保存する'}
                </button>
              </form>
            </div>

            {/* 中央：グラフセクション */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="text-rose-500" /> 体重推移
              </h2>
              <div className="h-[300px] w-full">
                {chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#f97316' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#f97316" 
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#18181b' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-600 italic">
                    体重を2回以上記録するとグラフが表示されます
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右側：サマリーと履歴 */}
          <div className="space-y-6">
            {/* 今日のサマリー */}
            <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-orange-500/20">
              <div className="flex justify-between items-start mb-4">
                <Flame className="w-8 h-8 opacity-80" />
                <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Today</span>
              </div>
              <p className="text-orange-100 text-sm font-medium">今日の摂取カロリー</p>
              <h3 className="text-4xl font-bold mt-1">{intakeTotal} <span className="text-xl font-normal opacity-70">kcal</span></h3>
              <div className="mt-4 pt-4 border-t border-white/20 flex justify-between">
                <div>
                  <p className="text-orange-100 text-[10px] font-medium uppercase tracking-widest">消費</p>
                  <p className="text-lg font-bold">{burnTotal} kcal</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-100 text-[10px] font-medium uppercase tracking-widest">差引</p>
                  <p className="text-lg font-bold">{intakeTotal - burnTotal} kcal</p>
                </div>
              </div>
            </div>

            {/* 直近の履歴 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-4 text-zinc-500 uppercase text-[10px] tracking-widest">最近の履歴</h3>
              <div className="space-y-4">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{log.tag}</p>
                        <p className="text-[10px] text-zinc-500">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-zinc-300">
                        {log.tag === '体重' ? `${log.weight}kg` : `${log.calories}kcal`}
                      </p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="text-center text-zinc-600 text-sm italic">履歴がありません</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
