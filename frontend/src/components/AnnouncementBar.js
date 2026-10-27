'use client';
import { useState, useEffect } from 'react';
import { IconTruck, IconShieldCheck, IconZap } from './Icons';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.documentElement.style.setProperty('--announcement-height', visible ? '38px' : '0px');
    return () => {
      document.documentElement.style.setProperty('--announcement-height', '0px');
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="announcement-bar" id="announcementBar">
      <div className="announcement-inner">
        <span className="announcement-badge">
          <IconZap size={14} /> EXPRESS DISPATCH
        </span>
        <span className="announcement-text">
          MS Material dispatched within 24 hours &bull; PAN India logistics &bull; 100% BIS / ISI certified mill test certificates
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
