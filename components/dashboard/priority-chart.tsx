'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics } from '@/lib/api';

interface PriorityChartProps {
  metrics: DashboardMetrics;
}

export function PriorityChart({ metrics }: PriorityChartProps) {
  const { priorityBreakdown } = metrics;
  const total = priorityBreakdown.high + priorityBreakdown.medium + priorityBreakdown.low;

  const priorities = [
    {
      label: 'High',
      value: priorityBreakdown.high,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      percentage: total > 0 ? Math.round((priorityBreakdown.high / total) * 100) : 0,
    },
    {
      label: 'Medium',
      value: priorityBreakdown.medium,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      percentage: total > 0 ? Math.round((priorityBreakdown.medium / total) * 100) : 0,
    },
    {
      label: 'Low',
      value: priorityBreakdown.low,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      percentage: total > 0 ? Math.round((priorityBreakdown.low / total) * 100) : 0,
    },
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Priority Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-slate-600 text-center py-8">
            No active actions to display
          </p>
        ) : (
          <div className="space-y-4">
            {priorities.map((priority) => (
              <div key={priority.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${priority.textColor}`}>
                    {priority.label} Priority
                  </span>
                  <span className="text-slate-600">
                    {priority.value} ({priority.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`${priority.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${priority.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}