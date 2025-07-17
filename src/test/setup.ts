import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock Notification API
global.Notification = class Notification {
  constructor(title: string, options?: NotificationOptions) {}
  static permission: NotificationPermission = 'default';
  static requestPermission(): Promise<NotificationPermission> {
    return Promise.resolve('granted');
  }
} as any;