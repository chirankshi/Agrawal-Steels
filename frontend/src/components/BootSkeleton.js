/**
 * Brand splash painted with the very first HTML, so a refresh shows a loading
 * state (route `loading.js` only covers client navigation).
 *  1. a steel line-art pattern fades in and slowly drifts;
 *  2. the logo scales in while a ring draws around it, the name types in
 *     letter by letter, then the tagline and a progress line;
 *  3. BootSkeletonHider adds `html.booted`: the splash lifts away with a
 *     fade + blur and the hero animations start underneath.
 * A CSS timeout hides it anyway after a few seconds, so it can never get stuck.
 */
const NAME = 'AGGARWAL STEELS';

export default function BootSkeleton() {
  return (
    <div id="boot-skeleton" className="boot-splash" aria-hidden="true">
      <div className="boot-pattern" />
      <div className="boot-glow" />
      <div className="boot-center">
        <div className="boot-logo-wrap">
          <svg className="boot-ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="56" />
          </svg>
          <img className="boot-logo" src="/images/brand/aggarwal_logo_circle.png" alt="" width={84} height={84} />
        </div>
        <div className="boot-name">
          {NAME.split('').map((ch, i) => (
            <span key={i} style={{ '--i': i }}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </div>
        <div className="boot-tag">Majestic AR Technology &bull; A legacy of strength</div>
        <div className="boot-progress"><span /></div>
      </div>
      {/* Marks when the splash was first painted, so the intro gets its full time. */}
      <script dangerouslySetInnerHTML={{ __html: 'window.__splashAt=performance.now()' }} />
    </div>
  );
}
