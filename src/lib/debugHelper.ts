/**
 * Debug helper to inspect localStorage data
 * Use in browser console: debugHelper.viewLearners()
 */

import { STORAGE_KEYS } from './mockData';

export const debugHelper = {
  // View all learners currently in localStorage
  viewLearners: () => {
    try {
      const learners = localStorage.getItem(STORAGE_KEYS.LEARNERS);
      const parsed = learners ? JSON.parse(learners) : [];
      console.log('📚 Current Learners in localStorage:');
      console.table(parsed);
      return parsed;
    } catch (error) {
      console.error('Error reading learners:', error);
    }
  },

  // View all performance records in localStorage
  viewPerformanceRecords: () => {
    try {
      const records = localStorage.getItem(STORAGE_KEYS.PERFORMANCE_RECORDS);
      const parsed = records ? JSON.parse(records) : [];
      console.log('📊 Current Performance Records in localStorage:');
      console.table(parsed);
      return parsed;
    } catch (error) {
      console.error('Error reading performance records:', error);
    }
  },

  // Find a specific learner by name or student number
  findLearner: (searchTerm: string) => {
    try {
      const learners = localStorage.getItem(STORAGE_KEYS.LEARNERS);
      const parsed = learners ? JSON.parse(learners) : [];
      const result = parsed.filter((l: any) => 
        l.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.student_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`🔍 Search results for "${searchTerm}":`, result);
      return result;
    } catch (error) {
      console.error('Error searching learners:', error);
    }
  },

  // Get top performers sorted by avgScore
  getTopPerformers: (limit = 10) => {
    try {
      const learners = localStorage.getItem(STORAGE_KEYS.LEARNERS);
      const parsed = learners ? JSON.parse(learners) : [];
      const sorted = parsed.sort((a: any, b: any) => b.avgScore - a.avgScore).slice(0, limit);
      console.log(`🏆 Top ${limit} Performers:`, sorted);
      return sorted;
    } catch (error) {
      console.error('Error getting top performers:', error);
    }
  },

  // Clear localStorage (use with caution!)
  clearAll: () => {
    if (confirm('⚠️ Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEYS.LEARNERS);
      localStorage.removeItem(STORAGE_KEYS.PERFORMANCE_RECORDS);
      console.log('✅ All data cleared from localStorage');
      window.location.reload();
    }
  },

  // Verify avgScore types
  verifyDataTypes: () => {
    try {
      const learners = localStorage.getItem(STORAGE_KEYS.LEARNERS);
      const parsed = learners ? JSON.parse(learners) : [];
      const issues = parsed.filter((l: any) => typeof l.avgScore !== 'number');
      if (issues.length > 0) {
        console.warn('⚠️ Found learners with non-numeric avgScore:', issues);
      } else {
        console.log('✅ All avgScores are numbers');
      }
      return issues;
    } catch (error) {
      console.error('Error verifying data types:', error);
    }
  },
};

// Make it globally accessible in browser console
if (typeof window !== 'undefined') {
  (window as any).debugHelper = debugHelper;
}
