import React from "react";
import { Link } from "react-router-dom";
import { useFeaturedArticles } from "../../../hooks/useArticles";
import { ArticleCard } from "../../../components/Articles";

export default function ArticleHomeSection() {
  const { data: articles = [], isLoading } = useFeaturedArticles({ quantity: 3 });

  // If loading or no articles published yet, fail gracefully
  if (!isLoading && articles.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-8 lg:px-[70px] bg-background-secondary border-t border-b border-border/60">
      <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">
              Local Tips & Community Guides
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text tracking-tight m-0">
              Discover Local Insights
            </h2>
          </div>

          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-light transition-colors group no-underline self-start sm:self-auto"
          >
            <span>Explore All Guides</span>
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

      </div>
    </section>
  );
}
