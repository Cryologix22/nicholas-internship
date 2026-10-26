import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CollectionSkeleton from "../CollectionSkeleton";
import Countdown from "../Countdown";
import "../../css/styles/ExploreItems.css";

const ExploreItems = () => {
  const [expItem, setExpItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore",
        );

        setExpItem(res.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const sortedItems = [...expItem];

  if (sortBy === "price_low_to_high") {
    sortedItems.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "price_high_to_low") {
    sortedItems.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === "likes_high_to_low") {
    sortedItems.sort((a, b) => Number(b.likes) - Number(a.likes));
  }

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  return (
    <>
      <div>
        <select
          id="filter-items"
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setVisibleCount(8);
          }}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      <div className="row">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6" key={index}>
                <CollectionSkeleton variant="explore" />
              </div>
            ))
          : sortedItems.slice(0, visibleCount).map((item) => (
              <div className="col-lg-3 col-md-6 col-sm-6" key={item.id}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                    >
                      <img className="lazy" src={item.authorImage} alt="" />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  {item.expiryDate && (
                    <Countdown expiryDate={item.expiryDate} />
                  )}
                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a href="/" target="_blank" rel="noreferrer">
                            <i className="fa fa-facebook fa-lg"></i>
                          </a>
                          <a href="/" target="_blank" rel="noreferrer">
                            <i className="fa fa-twitter fa-lg"></i>
                          </a>
                          <a href="/">
                            <i className="fa fa-envelope fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {!loading && visibleCount < expItem.length && (
        <div
          className="text-center"
          data-aos="fade"
          data-aos-delay="0"
          data-aos-duration="300"
        >
          <button
            type="button"
            id="loadmore"
            className="btn-main lead"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
