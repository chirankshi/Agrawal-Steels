import Navbar from './Navbar';

/**
 * Animated loading skeletons. Shown by the route `loading.js` files while a page
 * opens, and by components while their data arrives. Every block shimmers and
 * the groups fade in one after another; all motion stops for reduced-motion users.
 */

/** One shimmering block. `w`/`h` accept any CSS length. */
export function Bone({ w = '100%', h = 14, r = 8, className = '', style }) {
  return <span className={`sk-bone ${className}`} style={{ width: w, height: h, borderRadius: r, ...style }} aria-hidden="true" />;
}

/** A card: photo area + three text lines + a button. */
export function CardSkeleton({ photo = true, i = 0 }) {
  return (
    <div className="sk-card" style={{ '--sk-i': i }}>
      {photo && <Bone h={0} r={0} className="sk-photo" />}
      <div className="sk-card-body">
        <Bone w={34} h={4} r={2} />
        <Bone w="72%" h={18} />
        <Bone w="92%" />
        <Bone w="60%" />
        <Bone w={110} h={14} style={{ marginTop: 6 }} />
      </div>
    </div>
  );
}

function LoadingBar() {
  return <div className="sk-topbar" aria-hidden="true"><span /></div>;
}

function Status({ label }) {
  return <span className="sr-only" role="status">{label}</span>;
}

/** Generic page: header band + section title + three cards + text rows. */
export function PageSkeleton({ label = 'Loading page', withChrome = true }) {
  const Wrap = withChrome ? 'main' : 'div';
  return (
    <>
      {withChrome && <LoadingBar />}
      {withChrome && <Navbar />}
      <Wrap className="sk-page" aria-busy="true">
        <Status label={label} />
        <section className="sk-hero">
          <div className="section-container sk-hero-inner">
            <div className="sk-group" style={{ '--sk-i': 0 }}>
              <Bone w={220} h={28} r={999} />
              <Bone w="78%" h={44} r={10} />
              <Bone w="56%" h={44} r={10} />
              <Bone w="88%" />
              <Bone w="70%" />
              <div className="sk-row">
                <Bone w={170} h={46} r={999} />
                <Bone w={150} h={46} r={999} />
              </div>
            </div>
            <div className="sk-group sk-hero-art" style={{ '--sk-i': 1 }}>
              <Bone h="100%" r={18} />
            </div>
          </div>
        </section>
        <section className="section-container sk-section">
          <div className="sk-group sk-center" style={{ '--sk-i': 2 }}>
            <Bone w={200} h={26} r={999} />
            <Bone w={360} h={32} r={10} />
            <Bone w={300} />
          </div>
          <div className="sk-cards">
            {[0, 1, 2].map((i) => <CardSkeleton key={i} i={i + 3} />)}
          </div>
        </section>
      </Wrap>
    </>
  );
}

/** Product segment page: header, tree sidebar and a product line. */
export function CatalogueSkeleton({ withChrome = true }) {
  const body = (
    <>
      <section className="cat-head">
        <div className="section-container cat-head-inner">
          <div className="sk-group" style={{ '--sk-i': 0, width: 'min(560px, 100%)' }}>
            <Bone w={260} h={12} />
            <Bone w="80%" h={36} r={10} />
            <Bone w="50%" />
            <div className="sk-row"><Bone w={110} h={28} r={999} /><Bone w={110} h={28} r={999} /><Bone w={150} h={28} r={999} /></div>
          </div>
          <div className="sk-row sk-group" style={{ '--sk-i': 1 }}><Bone w={140} h={46} r={999} /><Bone w={150} h={46} r={999} /></div>
        </div>
      </section>
      <div className="section-container cat-browser">
        <aside className="cat-side sk-group" style={{ '--sk-i': 1 }}>
          <Bone w={120} h={10} style={{ margin: '4px 10px 14px' }} />
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="sk-tree-row" style={{ '--sk-i': i + 2 }}>
              <Bone w={`${55 + ((i * 17) % 35)}%`} h={13} />
              <Bone w={26} h={16} r={999} />
            </div>
          ))}
        </aside>
        <div className="cat-main">
          <div className="sk-line-head sk-group" style={{ '--sk-i': 2 }}>
            <Bone h="100%" r={0} className="sk-line-photo" />
            <div className="sk-line-text">
              <Bone w={100} h={22} r={999} />
              <Bone w="60%" h={28} r={8} />
              <Bone w="85%" />
            </div>
          </div>
          <div className="sk-cards sk-cards--4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <CardSkeleton key={i} i={i + 3} photo={i < 4} />)}
          </div>
        </div>
      </div>
    </>
  );
  if (!withChrome) return <div aria-busy="true"><Status label="Loading products" />{body}</div>;
  return (
    <>
      <LoadingBar />
      <Navbar />
      <main className="segment-page sk-page" aria-busy="true">
        <Status label="Loading products" />
        {body}
      </main>
    </>
  );
}

/** Admin area: sidebar-less panel skeleton (the admin shell stays mounted). */
export function AdminSkeleton() {
  return (
    <div className="sk-admin" aria-busy="true">
      <Status label="Loading" />
      <div className="sk-row" style={{ justifyContent: 'space-between' }}>
        <Bone w={220} h={26} />
        <Bone w={140} h={36} r={8} />
      </div>
      <div className="sk-cards sk-cards--4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="sk-card sk-stat" style={{ '--sk-i': i }}>
            <Bone w="50%" h={12} /><Bone w="40%" h={28} /><Bone w="70%" h={10} />
          </div>
        ))}
      </div>
      <div className="sk-card sk-table" style={{ '--sk-i': 4 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="sk-table-row" style={{ '--sk-i': i + 4 }}>
            <Bone w="18%" /><Bone w="26%" /><Bone w="14%" /><Bone w="12%" r={999} /><Bone w="10%" />
          </div>
        ))}
      </div>
    </div>
  );
}
