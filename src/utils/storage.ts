/**
 * Professional Data Storage System
 * Provides utilities for saving and loading application data
 */

import { Requisition, User, SecurityLog } from '../types';

// Storage keys
const STORAGE_KEYS = {
  REQUISITION: 'procurement-requisition',
  USER: 'procurement-current-user',
  USERS: 'procurement-users',
  REQUISITIONS: 'procurement-requisitions',
  SECURITY_LOGS: 'procurement-security-logs',
  SETTINGS: 'procurement-settings'
} as const;

/**
 * Save data to localStorage with error handling
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving to storage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Load data from localStorage with error handling
 */
export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Error loading from storage (key: ${key}):`, error);
    return null;
  }
};

/**
 * Remove data from localStorage
 */
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Clear all application data
 */
export const clearAllStorage = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Save requisition data
 */
export const saveRequisition = (requisition: Requisition): boolean => {
  return saveToStorage(STORAGE_KEYS.REQUISITION, requisition);
};

/**
 * Load requisition data with date parsing
 */
export const loadRequisition = (): Requisition | null => {
  const data = loadFromStorage<any>(STORAGE_KEYS.REQUISITION);
  if (!data) return null;

  // Parse dates
  if (data.dateRequested) data.dateRequested = new Date(data.dateRequested);
  if (data.createdAt) data.createdAt = new Date(data.createdAt);
  if (data.updatedAt) data.updatedAt = new Date(data.updatedAt);
  if (data.submissionDate) data.submissionDate = new Date(data.submissionDate);
  if (data.poIssuedDate) data.poIssuedDate = new Date(data.poIssuedDate);
  if (data.invoiceReceivedDate) data.invoiceReceivedDate = new Date(data.invoiceReceivedDate);

  // Parse attachment dates
  if (data.attachments) {
    data.attachments = data.attachments.map((att: any) => ({
      ...att,
      uploadedAt: new Date(att.uploadedAt)
    }));
  }

  // Parse approval step dates
  if (data.approvalSteps) {
    data.approvalSteps = data.approvalSteps.map((step: any) => ({
      ...step,
      approvedAt: step.approvedAt ? new Date(step.approvedAt) : undefined,
      rejectedAt: step.rejectedAt ? new Date(step.rejectedAt) : undefined
    }));
  }

  return data as Requisition;
};

/**
 * Save current user
 */
export const saveCurrentUser = (user: User): boolean => {
  return saveToStorage(STORAGE_KEYS.USER, user);
};

/**
 * Load current user
 */
export const loadCurrentUser = (): User | null => {
  return loadFromStorage<User>(STORAGE_KEYS.USER);
};

/**
 * Remove current user
 */
export const removeCurrentUser = (): boolean => {
  return removeFromStorage(STORAGE_KEYS.USER);
};

/**
 * Save all users
 */
export const saveUsers = (users: User[]): boolean => {
  return saveToStorage(STORAGE_KEYS.USERS, users);
};

/**
 * Load all users
 */
export const loadUsers = (): User[] | null => {
  return loadFromStorage<User[]>(STORAGE_KEYS.USERS);
};

/**
 * Save all requisitions
 */
export const saveRequisitions = (requisitions: Requisition[]): boolean => {
  return saveToStorage(STORAGE_KEYS.REQUISITIONS, requisitions);
};

/**
 * Load all requisitions with date parsing
 */
export const loadRequisitions = (): Requisition[] | null => {
  const data = loadFromStorage<any[]>(STORAGE_KEYS.REQUISITIONS);
  if (!data) return null;

  return data.map(req => {
    // Parse dates
    if (req.dateRequested) req.dateRequested = new Date(req.dateRequested);
    if (req.createdAt) req.createdAt = new Date(req.createdAt);
    if (req.updatedAt) req.updatedAt = new Date(req.updatedAt);
    if (req.submissionDate) req.submissionDate = new Date(req.submissionDate);
    if (req.poIssuedDate) req.poIssuedDate = new Date(req.poIssuedDate);
    if (req.invoiceReceivedDate) req.invoiceReceivedDate = new Date(req.invoiceReceivedDate);

    // Parse attachment dates
    if (req.attachments) {
      req.attachments = req.attachments.map((att: any) => ({
        ...att,
        uploadedAt: new Date(att.uploadedAt)
      }));
    }

    // Parse approval step dates
    if (req.approvalSteps) {
      req.approvalSteps = req.approvalSteps.map((step: any) => ({
        ...step,
        approvedAt: step.approvedAt ? new Date(step.approvedAt) : undefined,
        rejectedAt: step.rejectedAt ? new Date(step.rejectedAt) : undefined
      }));
    }

    return req as Requisition;
  });
};

/**
 * Save security logs
 */
export const saveSecurityLogs = (logs: SecurityLog[]): boolean => {
  return saveToStorage(STORAGE_KEYS.SECURITY_LOGS, logs);
};

/**
 * Load security logs with date parsing
 */
export const loadSecurityLogs = (): SecurityLog[] | null => {
  const data = loadFromStorage<any[]>(STORAGE_KEYS.SECURITY_LOGS);
  if (!data) return null;

  return data.map(log => ({
    ...log,
    timestamp: new Date(log.timestamp)
  }));
};

/**
 * Export data to JSON file
 */
export const exportToJSON = (data: any, filename: string): void => {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
};

/**
 * Import data from JSON file
 */
export const importFromJSON = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Get storage usage statistics
 */
export const getStorageStats = (): { used: number; available: number; percentage: number } => {
  try {
    let used = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        used += item.length;
      }
    });

    // Most browsers allow 5-10MB per domain
    const available = 5 * 1024 * 1024; // 5MB estimate
    const percentage = (used / available) * 100;

    return {
      used,
      available,
      percentage: Math.min(percentage, 100)
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return { used: 0, available: 0, percentage: 0 };
  }
};

/**
 * Backup all data to a single JSON file
 */
export const backupAllData = (): void => {
  const backup = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    data: {
      requisition: loadFromStorage(STORAGE_KEYS.REQUISITION),
      users: loadFromStorage(STORAGE_KEYS.USERS),
      requisitions: loadFromStorage(STORAGE_KEYS.REQUISITIONS),
      securityLogs: loadFromStorage(STORAGE_KEYS.SECURITY_LOGS),
      settings: loadFromStorage(STORAGE_KEYS.SETTINGS)
    }
  };

  const filename = `procurement-backup-${new Date().toISOString().split('T')[0]}.json`;
  exportToJSON(backup, filename);
};

/**
 * Restore data from backup
 */
export const restoreFromBackup = async (file: File): Promise<boolean> => {
  try {
    const backup = await importFromJSON(file);
    
    if (!backup.version || !backup.data) {
      throw new Error('Invalid backup file format');
    }

    // Restore each data type
    if (backup.data.requisition) {
      saveToStorage(STORAGE_KEYS.REQUISITION, backup.data.requisition);
    }
    if (backup.data.users) {
      saveToStorage(STORAGE_KEYS.USERS, backup.data.users);
    }
    if (backup.data.requisitions) {
      saveToStorage(STORAGE_KEYS.REQUISITIONS, backup.data.requisitions);
    }
    if (backup.data.securityLogs) {
      saveToStorage(STORAGE_KEYS.SECURITY_LOGS, backup.data.securityLogs);
    }
    if (backup.data.settings) {
      saveToStorage(STORAGE_KEYS.SETTINGS, backup.data.settings);
    }

    return true;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return false;
  }
};



