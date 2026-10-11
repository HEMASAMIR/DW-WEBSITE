'use client';

import apiClient from './api';

const DEVICE_ID_KEY = 'dw_device_id';

export function getDeviceId() {
  if (typeof window === 'undefined') return 'server_placeholder';
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = 'dev_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    }
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { deviceType: 'desktop', deviceName: 'متصفح ويب' };
  }

  const ua = navigator.userAgent || '';
  const isMobile = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|Tablet|PlayBook/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  let deviceType = 'desktop';
  if (isTablet) deviceType = 'tablet';
  else if (isMobile) deviceType = 'mobile';

  let os = 'جهاز غير معروف';
  if (/iPhone/i.test(ua)) os = 'iPhone';
  else if (/iPad/i.test(ua)) os = 'iPad';
  else if (/Android/i.test(ua)) os = 'هاتف Android';
  else if (/Windows NT/i.test(ua)) os = 'كمبيوتر Windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'جهاز Mac';
  else if (/Linux/i.test(ua)) os = 'جهاز Linux';

  let browser = '';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';

  const deviceName = browser ? `${os} (${browser})` : os;

  return {
    deviceType,
    deviceName,
  };
}

export async function pingDeviceSession(action = 'heartbeat') {
  try {
    const deviceId = getDeviceId();
    const { deviceName, deviceType } = getDeviceInfo();
    const res = await apiClient.post('/api/device-session', {
      deviceId,
      deviceName,
      deviceType,
      action,
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      return { active: false, unauthorized: true };
    }
    return { active: true, error: true };
  }
}
