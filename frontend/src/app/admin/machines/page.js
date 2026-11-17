import MachinesView from './MachinesView';

// Admin screens are client-rendered behind a login check, so Next.js cannot
// validate them for instant navigation. Opt this segment out of that check.
export const instant = false;

export default function Page() {
  return <MachinesView />;
}
