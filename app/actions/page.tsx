'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi, ActionItem } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ActionsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['actions'],
    queryFn: () => dashboardApi.getActions({}),
  });

  const updateActionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ActionItem['status'] }) =>
      dashboardApi.updateAction(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
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
              <p className="font-medium">Failed to load actions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const actions = data?.actions || [];

  // Group actions by status
  const columns = [
    { status: 'pending' as const, title: 'Pending', color: 'bg-slate-100' },
    { status: 'in_progress' as const, title: 'In Progress', color: 'bg-blue-100' },
    { status: 'done' as const, title: 'Done', color: 'bg-green-100' },
    { status: 'overdue' as const, title: 'Overdue', color: 'bg-red-100' },
  ];

  const getActionsByStatus = (status: ActionItem['status']) =>
    actions.filter((action) => action.status === status);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleStatusChange = (actionId: string, newStatus: ActionItem['status']) => {
    updateActionMutation.mutate({ id: actionId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Action Items</h1>
        <p className="text-slate-600 mt-2">
          Manage and track your meeting action items
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnActions = getActionsByStatus(column.status);
          return (
            <div key={column.status} className="space-y-4">
              <div className={`rounded-lg p-3 ${column.color}`}>
                <h3 className="font-semibold text-slate-900">
                  {column.title}
                  <span className="ml-2 text-sm font-normal text-slate-600">
                    ({columnActions.length})
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                {columnActions.map((action) => (
                  <Card key={action.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {action.description}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`ml-2 text-xs ${getPriorityColor(action.priority)}`}
                        >
                          {action.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{action.assignee}</span>
                        </div>
                        {action.dueDate && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(action.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        {action.status !== 'in_progress' && action.status !== 'done' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleStatusChange(action.id, 'in_progress')}
                            disabled={updateActionMutation.isPending}
                          >
                            Start
                          </Button>
                        )}
                        {action.status !== 'done' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleStatusChange(action.id, 'done')}
                            disabled={updateActionMutation.isPending}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnActions.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-sm text-slate-500">
                      No {column.title.toLowerCase()} actions
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}