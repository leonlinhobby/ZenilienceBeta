import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { TrendingUp, Brain, Heart, Moon, Target, Zap } from 'lucide-react';

interface HealthMetrics {
  stress_level: number;
  mood_score: number;
  sleep_quality: number;
  focus_level: number;
  anxiety_level: number;
  energy_level: number;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMetrics();
      fetchWeeklyData();
    }
  }, [user]);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('user_health_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_health_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) throw error;
      setWeeklyData(data || []);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Okay';
    return 'Needs Improvement';
  };

  const MetricCard = ({ icon: Icon, title, value, description, color }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{value || 'N/A'}</div>
          <div className="text-sm text-gray-500">out of 10</div>
        </div>
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      {value && (
        <div className="mt-3">
          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(value)}`}>
            {getScoreText(value)}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Analytics</h1>
        <p className="text-gray-600">Track your health and wellness metrics</p>
      </div>

      {/* Current Metrics */}
      <div className="mx-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            icon={Brain}
            title="Stress Level"
            value={metrics?.stress_level}
            description="How stressed do you feel?"
            color="bg-gradient-to-r from-red-500 to-pink-500"
          />
          <MetricCard
            icon={Heart}
            title="Mood"
            value={metrics?.mood_score}
            description="Your overall mood"
            color="bg-gradient-to-r from-green-500 to-emerald-500"
          />
          <MetricCard
            icon={Moon}
            title="Sleep Quality"
            value={metrics?.sleep_quality}
            description="How well did you sleep?"
            color="bg-gradient-to-r from-indigo-500 to-purple-500"
          />
          <MetricCard
            icon={Target}
            title="Focus"
            value={metrics?.focus_level}
            description="Your concentration ability"
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          <MetricCard
            icon={Brain}
            title="Anxiety Level"
            value={metrics?.anxiety_level}
            description="How anxious do you feel?"
            color="bg-gradient-to-r from-orange-500 to-red-500"
          />
          <MetricCard
            icon={Zap}
            title="Energy Level"
            value={metrics?.energy_level}
            description="Your energy level today"
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
        </div>
      </div>

      {/* Weekly Trend */}
      {weeklyData.length > 0 && (
        <div className="mx-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">7-Day Trend</h2>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="space-y-4">
              {weeklyData.slice(0, 7).map((day, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="text-sm text-gray-600">
                    {new Date(day.created_at).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Mood:</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getScoreColor(day.mood_score)}`}>
                        {day.mood_score}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Stress:</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getScoreColor(11 - day.stress_level)}`}>
                        {day.stress_level}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!metrics && (
        <div className="mx-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No data yet</h3>
            <p className="text-gray-600 mb-4">
              Complete your first lesson to start tracking your health values.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;