'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { MetricsCards } from '@/components/dashboard/metrics-cards';
import { PriorityChart } from '@/components/dashboard/priority-chart';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
  });

  const { data: actionsData } = useQuery({
    queryKey: ['recent-actions'],
    queryFn: () => dashboardApi.getActions({}),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Failed to load dashboard</p>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Please check your connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) return null;

  const recentActions = actionsData?.actions.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Overview of your meetings and action items
        </p>
      </div>

      {/* Metrics Cards */}
      <MetricsCards metrics={metrics} />

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityChart metrics={metrics} />

        {/* Recent Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Actions</h3>
            {recentActions.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-8">
                No actions yet. Upload a meeting to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {recentActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        action.priority === 'high'
                          ? 'bg-red-500'
                          : action.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {action.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-600">
                          {action.assignee}
                        </span>
                        {action.dueDate && (
                          <>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-600">
                              {new Date(action.dueDate).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        action.status === 'done'
                          ? 'bg-green-100 text-green-700'
                          : action.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : action.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {action.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}