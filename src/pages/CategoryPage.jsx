import { Link, useParams } from "react-router-dom";
import { getCategory } from "../data/categories";
import EnquiryForm from "../components/EnquiryForm";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategory(slug);

  if (!category) {
    return (
      <section className="section category-page">
        <h1>Category not found</h1>
        <p>
          <Link to="/parts">Back to all parts</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="section category-page">
      <p className="category-page__eyebrow">
        <Link to="/parts">&larr; All categories</Link>
      </p>
      <h1>{category.label}</h1>
      <p className="category-page__ask">Ask about this category -- we don't have confirmed stock listed online yet.</p>
      {category.note && <p className="category-page__note">{category.note}</p>}
      <EnquiryForm categoryLabel={category.label} />
    </section>
  );
}
