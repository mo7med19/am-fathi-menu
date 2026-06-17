import { memo } from "react";
import MenuCard from "./MenuCard";

export default memo(function MenuGrid({ categories }) {
  if (!categories?.length) {
    return (
      <p className="empty-state">
        لا توجد نتائج مطابقة للبحث الحالي.
      </p>
    );
  }

  return (
    <div className="menu-sections">
      {categories.map((category) => (
        <section
          key={category.id}
          id={`cat-${category.id}`}
          className="menu-section"
        >
          <div className="section-head">
            <h2>{category.name}</h2>

            <span>
              {category.items?.length || 0} صنف
            </span>
          </div>

          {category.description && (
            <p className="section-desc">
              {category.description}
            </p>
          )}

          {category.items?.length > 0 ? (
            <div className="grid">
              {category.items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="empty-state">
              لا توجد أصناف داخل هذا القسم
            </p>
          )}
        </section>
      ))}
    </div>
  );
});