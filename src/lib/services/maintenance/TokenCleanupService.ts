import { supabase } from '@/lib/supabase';
import { AuditService } from '../AuditService';

export class TokenCleanupService {
  static async cleanupExpiredTokens(): Promise<void> {
    try {
      const { error } = await supabase.rpc('cleanup_expired_tokens');
      
      if (error) {
        console.error('Failed to cleanup expired tokens:', error);
        throw error;
      }

      // Log the cleanup event
      await AuditService.logAuthEvent('TOKEN_CLEANUP', {
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    } catch (error) {
      console.error('Token cleanup failed:', error);
      
      // Log the failure
      await AuditService.logAuthEvent('TOKEN_CLEANUP', {
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}