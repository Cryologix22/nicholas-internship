
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import CollectionSkeleton from "../components/CollectionSkeleton";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails";

const ItemDetails = () => {
  const { nftId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const controller = new AbortController();

    const fetchItem = async () => {
      setLoading(true);
      setError("");
      setItem(null);

      try {
        if (!nftId) {
          throw new Error("No NFT ID provided.");
        }

        const response = await fetch(
          `${API_URL}?nftId=${encodeURIComponent(nftId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch NFT details.");
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => controller.abort();
  }, [nftId]);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          aria-label="NFT details"
          className="mt90 sm-mt-0"
        >
          <div className="container">
            {error && (
              <p role="alert">
                Unable to load NFT: {error}
              </p>
            )}

            {loading ? (
              <div className="row">
                <div className="col-md-6">
                  <CollectionSkeleton />
                </div>

                <div className="col-md-6">
                  <div className="item_info">
                    <div
                      className="skeleton-title skeleton-shimmer"
                      style={{
                        width: "75%",
                        height: 32,
                      }}
                    ></div>

                    <div
                      className="skeleton-code skeleton-shimmer"
                      style={{
                        width: "35%",
                        height: 20,
                        marginTop: 20,
                      }}
                    ></div>

                    <div
                      className="skeleton-title skeleton-shimmer"
                      style={{
                        width: "100%",
                        height: 65,
                        marginTop: 25,
                      }}
                    ></div>

                    <div
                      className="skeleton-avatar skeleton-shimmer"
                      style={{
                        width: 50,
                        height: 50,
                        marginTop: 30,
                      }}
                    ></div>

                    <div
                      className="skeleton-title skeleton-shimmer"
                      style={{
                        width: "45%",
                        height: 24,
                        marginTop: 30,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              item && (
                <div className="row">
                  <div className="col-md-6 text-center">
                    <img
                      src={item.nftImage}
                      className="img-fluid img-rounded mb-sm-30 nft-image"
                      alt={item.title}
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="item_info">
                      <h2>{item.title}</h2>

                      <div className="item_info_counts">
                        <div className="item_info_views">
                          <i className="fa fa-eye"></i>
                          {item.views}
                        </div>

                        <div className="item_info_like">
                          <i className="fa fa-heart"></i>
                          {item.likes}
                        </div>
                      </div>

                      <p>{item.description}</p>

                      <div className="d-flex flex-row">
                        <div className="mr40">
                          <h6>Owner</h6>

                          <div className="item_author">
                            <div className="author_list_pp">
                              <Link
                                to={`/author/${item.ownerId}`}
                              >
                                <img
                                  className="lazy"
                                  src={item.ownerImage}
                                  alt={item.ownerName}
                                />
                                <i className="fa fa-check"></i>
                              </Link>
                            </div>

                            <div className="author_list_info">
                              <Link
                                to={`/author/${item.ownerId}`}
                              >
                                {item.ownerName}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="de_tab tab_simple">
                        <div className="de_tab_content">
                          <h6>Creator</h6>

                          <div className="item_author">
                            <div className="author_list_pp">
                              <Link
                                to={`/author/${item.creatorId}`}
                              >
                                <img
                                  className="lazy"
                                  src={item.creatorImage}
                                  alt={item.creatorName}
                                />
                                <i className="fa fa-check"></i>
                              </Link>
                            </div>

                            <div className="author_list_info">
                              <Link
                                to={`/author/${item.creatorId}`}
                              >
                                {item.creatorName}
                              </Link>
                            </div>
                          </div>
                        </div>

                        <div className="spacer-40"></div>

                        <h6>Price</h6>

                        <div className="nft-item-price">
                          <img src={EthImage} alt="Ethereum" />
                          <span>{item.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
