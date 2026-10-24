import "../css/styles/CollectionSkeleton.css";

const CollectionSkeleton = ({ variant = "default" }) => {
  return (
    <div className={`collection-skeleton collection-skeleton--${variant}`}>
      <div className="skeleton-image skeleton-shimmer"></div>
      <div className="skeleton-author">
        <div className="skeleton-avatar skeleton-shimmer"></div>
        <span className="skeleton-verified">✓</span>
      </div>
      <div className="skeleton-title skeleton-shimmer"></div>
      <div className="skeleton-code skeleton-shimmer"></div>
    </div>
  );
};

export default CollectionSkeleton;
