import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../css/styles/TopSellers.css";

const CollectionSkeleton = () => {
  return (
    <div className="seller-skeleton">
      <div className="seller-skeleton-wrap">
        <div className="seller-skeleton-avatar skeleton-shimmer"></div>
        <span className="seller-skeleton-verified">✓</span>
      </div>
      <div className="seller-skeleton-info">
        <div className="seller-skeleton-name skeleton-shimmer"></div>
        <div className="seller-skeleton-sales skeleton-shimmer"></div>
      </div>
    </div>
  );
};

const TopSellers = () => {
  const [topSellersCollection, setTopSellersCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSellersCollection = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers",
        );

        setTopSellersCollection(res.data);
      } catch (error) {
        console.error("Error fetching Top Sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellersCollection();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2 data-aos="fade" data-aos-duration="900">
                Top Sellers
              </h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol
              className="author_list"
              data-aos="fade"
              data-aos-delay="100"
              data-aos-duration="900"
            >
              {loading
                ? Array.from({ length: 12 }).map((_, index) => (
                    <CollectionSkeleton key={index} />
                  ))
                : topSellersCollection.map((collection) => (
                    <div key={collection.id}>
                      <div className="author_list_pp">
                        <Link to={`/author/${collection.authorId}`}>
                          <img
                            className="lazy pp-author"
                            src={collection.authorImage}
                            alt=""
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${collection.authorId}`}>
                          {collection.authorName}
                        </Link>
                        <span>{collection.price} ETH</span>
                      </div>
                    </div>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
