import { supabase } from '@/lib/supabase';
import { AuditService } from '../AuditService';

export class AuthLogsCleanupService {
  static readonly DEFAULT_RETENTION_DAYS = 25;

  static async cleanupOldAuthLogs(retentionDays: number = this.DEFAULT_RETENTION_DAYS): Promise<void> {
    try {
      const { data: deletedCount, error } = await supabase
        .rpc('cleanup_old_auth_logs', { p_retention_days: retentionDays });

      if (error) {
        console.error('Failed to cleanup old auth logs:', error);
        throw error;
      }

      // Log the cleanup event
      await AuditService.logAuthEvent('AUTH_LOGS_CLEANUP', {
        timestamp: new Date().toISOString(),
        status: 'success',
        deletedCount,
        retentionDays
      });
    } catch (error) {
      console.error('Auth logs cleanup failed:', error);
      
      // Log the failure
      await AuditService.logAuthEvent('AUTH_LOGS_CLEANUP', {
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        retentionDays
      });
    }
  }
}