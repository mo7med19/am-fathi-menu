export default function CategoryBar({ categories, active, onSelect }) {
  if (!categories?.length) return null;

  return (
    <nav className="category-bar" aria-label="أقسام المنيو">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={active === category.id ? "active" : ""}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}
