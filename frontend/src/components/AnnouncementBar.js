'use client';
import { useState, useEffect } from 'react';
import { IconZap } from './Icons';
import { useSiteSettings } from '../lib/siteSettings';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const { settings } = useSiteSettings();
  const show = visible && settings.announcement_enabled !== false;

  useEffect(() => {
    document.documentElement.style.setProperty('--announcement-height', show ? '38px' : '0px');
    return () => {
      document.documentElement.style.setProperty('--announcement-height', '0px');
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="announcement-bar" id="announcementBar">
      <div className="announcement-inner">
        <span className="announcement-badge">
          <IconZap size={14} /> EXPRESS DISPATCH
        </span>
        <span className="announcement-text">
          {settings.announcement_text}
        </span>
        <button
          className="announcement-close"
          onClick={() => setVisible(false)}
          aria-label="Close Announcement"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
