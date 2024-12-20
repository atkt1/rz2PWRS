/*
  # Add auth logs cleanup function
  
  1. New Function
    - `cleanup_old_auth_logs`: Removes auth logs older than specified retention period
    
  2. Parameters
    - `p_retention_days`: Number of days to keep logs (default 90 days)
    
  3. Returns
    - Number of deleted records
*/

CREATE OR REPLACE FUNCTION public.cleanup_old_auth_logs(p_retention_days integer DEFAULT 90)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    v_deleted_count integer;
BEGIN
    WITH deleted AS (
        DELETE FROM public.auth_logs
        WHERE timestamp < CURRENT_TIMESTAMP - (p_retention_days || ' days')::interval
        RETURNING *
    )
    SELECT COUNT(*) INTO v_deleted_count FROM deleted;

    RETURN v_deleted_count;
END;
$$;