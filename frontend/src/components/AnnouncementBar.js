'use client';
import { useState } from 'react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="announcement-bar" id="announcementBar">
      <div className="announcement-inner">
        <span className="announcement-dot"></span>
        <span>🔥 Fast Dispatch – MS Material Dispatched Within 24 Hours &nbsp;|&nbsp; 📦 PAN India Delivery &nbsp;|&nbsp; ✅ ISI Certified Products</span>
        <button className="announcement-close" onClick={() => setVisible(false)} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
