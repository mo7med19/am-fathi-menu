import { useEffect, useMemo, useState } from "react";
import menu from "../data/menu2.json";
import CategoryBar from "../components/CategoryBar";
import MenuGrid from "../components/MenuGrid";
import Recommended from "../components/Recommended";

const normalize = (value = "") => String(value).trim().toLowerCase();

export default function Home() {
  const categories = menu.categories || [];
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(categories[0]?.id || "");

  const filtered = useMemo(() => {
    const term = normalize(search);

    return categories
      .map((category) => {
        const items = (category.items || [])
          .filter((item) => item.isAvailable !== false)
          .filter((item) => {
            if (!term) return true;

            const haystack = [
              item.name,
              item.description,
              ...(item.tags || [])
            ].join(" ").toLowerCase();

            return haystack.includes(term);
          })
          .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

        return { ...category, items };
      })
      .filter((category) => category.items.length > 0);
  }, [categories, search]);

  const scrollToCat = (id) => {
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => {
      categories.forEach((category) => {
        const element = document.getElementById(`cat-${category.id}`);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        if (rect.top < 170 && rect.bottom > 170) {
          setActive(category.id);
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [categories]);

  return (
    <main className="container main-content">
      <section className="search-panel">
        <input
          placeholder="ابحث باسم الصنف أو النوع..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="search"
        />
        <p>{filtered.reduce((sum, category) => sum + category.items.length, 0)} صنف متاح</p>
      </section>

      {!search && <Recommended categories={categories} />}

      <CategoryBar
        categories={filtered}
        active={active}
        onSelect={scrollToCat}
      />

      <MenuGrid categories={filtered} />
    </main>
  );
}
