import { TokenCleanupService } from './TokenCleanupService';
import { AuthLogsCleanupService } from './AuthLogsCleanupService';

export class MaintenanceScheduler {
  private static cleanupInterval: number | null = null;
  private static readonly HOURLY_INTERVAL = 1000 * 60 * 60; // 1 hour
  private static readonly DAILY_INTERVAL = 1000 * 60 * 60 * 24; // 24 hours

  static startScheduledMaintenance(): void {
    if (this.cleanupInterval) {
      return; // Already running
    }

    // Run initial cleanup
    void this.runMaintenance();

    // Schedule periodic cleanup
    this.cleanupInterval = window.setInterval(() => {
      void this.runMaintenance();
    }, this.HOURLY_INTERVAL);

    console.log('Maintenance scheduler started');
  }

  static stopScheduledMaintenance(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Maintenance scheduler stopped');
    }
  }

  private static async runMaintenance(): Promise<void> {
    const currentHour = new Date().getHours();
    
    // Run token cleanup every hour
    await TokenCleanupService.cleanupExpiredTokens();

    // Run auth logs cleanup once per day at 2 AM
    if (currentHour === 2) {
      await AuthLogsCleanupService.cleanupOldAuthLogs();
    }
  }
}