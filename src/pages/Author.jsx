import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors";

const Author = () => {
  const { authorId } = useParams();
  const [searchParams] = useSearchParams();

  const selectedAuthorId =
    authorId || searchParams.get("author") || "73855012";

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAuthor = async () => {
      setLoading(true);
      setError("");
      setAuthor(null);
      setIsFollowing(false);

      try {
        const response = await fetch(
          `${API_URL}?author=${encodeURIComponent(selectedAuthorId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch author");
        }

        const data = await response.json();
        setAuthor(data);
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

    fetchAuthor();

    return () => controller.abort();
  }, [selectedAuthorId]);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleCopy = async () => {
    if (!author?.address) return;

    try {
      await navigator.clipboard.writeText(author.address);
    } catch (err) {
      console.error("Unable to copy wallet address:", err);
    }
  };

  const followerCount =
    (Number(author?.followers) || 0) + (isFollowing ? 1 : 0);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="Author banner"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="Author profile">
          <div className="container">
            {error && (
              <p role="alert">Unable to load author: {error}</p>
            )}

            {loading ? (
              <>
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <div
                        className="skeleton-avatar skeleton-shimmer"
                        style={{ width: 100, height: 100 }}
                      ></div>

                      <div className="profile_name">
                        <div
                          className="skeleton-title skeleton-shimmer"
                          style={{ width: 180 }}
                        ></div>
                        <div
                          className="skeleton-code skeleton-shimmer"
                          style={{ width: 120 }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div
                        className="skeleton-title skeleton-shimmer"
                        style={{ width: 120 }}
                      ></div>
                      <div
                        className="skeleton-code skeleton-shimmer"
                        style={{ width: 90, height: 30 }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="de_tab tab_simple">
                  <AuthorItems loading={true} />
                </div>
              </>
            ) : (
              author && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="d_profile de-flex">
                      <div className="de-flex-col">
                        <div className="profile_avatar">
                          <img
                            src={author.authorImage}
                            alt={author.authorName}
                          />

                          <i className="fa fa-check"></i>

                          <div className="profile_name">
                            <h4>
                              {author.authorName}

                              <span className="profile_username">
                                @{author.tag}
                              </span>

                              <span
                                id="wallet"
                                className="profile_wallet"
                              >
                                {author.address}
                              </span>

                              <button
                                id="btn_copy"
                                title="Copy wallet address"
                                onClick={handleCopy}
                              >
                                Copy
                              </button>
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="profile_follow de-flex">
                        <div className="de-flex-col">
                          <div className="profile_follower">
                            {followerCount.toLocaleString()} followers
                          </div>

                          <button
                            type="button"
                            className="btn-main"
                            onClick={handleFollow}
                            aria-pressed={isFollowing}
                          >
                            {isFollowing ? "Unfollow" : "Follow"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="de_tab tab_simple">
                      <AuthorItems
                        items={author.nftCollection || []}
                        authorImage={author.authorImage}
                      />
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

export default Author;
