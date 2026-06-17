import MenuCard from "./MenuCard";

export default function Recommended({ categories }) {
  const allItems = (categories || [])
    .flatMap((category) => category.items || [])
    .filter((item) => item.isAvailable !== false);

  const featured = allItems
    .filter((item) => item.isFeatured)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    .slice(0, 4);

  if (!featured.length) return null;

  return (
    <section className="recommended">
      <div className="section-head">
        <h2>الأكثر ترشيحًا</h2>
        <span>{featured.length} اختيارات</span>
      </div>

      <div className="grid compact-grid">
        {featured.map((item) => <MenuCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
