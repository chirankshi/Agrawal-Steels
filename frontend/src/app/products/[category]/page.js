import { Suspense } from 'react';
import SegmentView from './SegmentView';

// Segment content comes from Supabase on the client (editable in admin),
// so this route is rendered in the browser.
export const instant = false;

export default function SegmentPage() {
  return (
    <Suspense fallback={null}>
      <SegmentView />
    </Suspense>
  );
}
