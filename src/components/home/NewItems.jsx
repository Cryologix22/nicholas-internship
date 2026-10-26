import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/styles/NewItems.css";
import axios from "axios";
import Countdown from "../Countdown";
import CollectionSkeleton from "../CollectionSkeleton";

const HoldArrow = ({ direction, onStart, onStop, onClick, wasHeld }) => (
  <button
    type="button"
    className={`hold-arrow hold-arrow-${direction}`}
    onPointerDown={(e) => {
      if (e.button === 0) onStart(direction);
    }}
    onPointerUp={onStop}
    onPointerCancel={onStop}
    onPointerLeave={onStop}
    onClick={(e) => {
      e.preventDefault();
      if (!wasHeld()) onClick?.();
    }}
  >
    {direction === "next" ? "›" : "‹"}
  </button>
);

const NewItems = () => {
  const [newItemsCollection, setNewItemsCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchNewItemsCollection = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems",
        );

        setNewItemsCollection(res.data);
      } catch (error) {
        console.error("Error fetching New Items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItemsCollection();
  }, []);
  
    const getSlidesToShow = () => {
    const width = window.innerWidth;
  
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
  
    return 4;
  };
  
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow);
  
  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow());
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderRef = useRef(null);
  const holdTimer = useRef(null);
  const holdTriggered = useRef(false);

  const startHold = (direction) => {
    stopHold();
    holdTriggered.current = false;

    holdTimer.current = setTimeout(() => {
      holdTriggered.current = true;

      holdTimer.current = setInterval(() => {
        if (direction === "next") {
          sliderRef.current?.slickNext();
        } else {
          sliderRef.current?.slickPrev();
        }
      }, 200);
    }, 200);
  };

  const stopHold = () => {
    clearTimeout(holdTimer.current);
    clearInterval(holdTimer.current);
    holdTimer.current = null;
  };

  useEffect(() => {
    return () => stopHold();
  }, []);

  const settings = {
    respondTo: "window",
    dots: true,
    infinite: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToScroll: 1,
    waitForAnimate: true,
    pauseOnHover: true,
    pauseOnFocus: true,
    swipeToSlide: true,
    draggable: true,
    nextArrow: (
      <HoldArrow
        direction="next"
        onStart={startHold}
        onStop={stopHold}
        wasHeld={() => holdTriggered.current}
      />
    ),

    prevArrow: (
      <HoldArrow
        direction="prev"
        onStart={startHold}
        onStop={stopHold}
        wasHeld={() => holdTriggered.current}
      />
    ),
    slidesToShow,
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2 data-aos="fade" data-aos-duration="900">
                New Items
              </h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div data-aos="fade" data-aos-delay="100" data-aos-duration="900">
            <Slider ref={sliderRef} {...settings} className="new-items-slider">
              {loading
                ? Array.from({ length: 7 }).map((_, index) => (
                    <CollectionSkeleton key={index} variant="new" />
                  ))
                : newItemsCollection.map((collection) => (
                    <div key={collection.id}>
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${collection.authorId}`}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Creator: NFT Author"
                          >
                            <img
                              className="lazy"
                              src={collection.authorImage}
                              alt=""
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        {collection.expiryDate && (
                          <Countdown expiryDate={collection.expiryDate} />
                        )}
                        <div className="nft__item_wrap">
                          <div className="nft__item_extra">
                            <div className="nft__item_buttons">
                              <button>Buy Now</button>
                              <div className="nft__item_share">
                                <h4>Share</h4>
                                <button type="button" aria-label="Share on Facebook" disabled>
                                  <i className="fa fa-facebook fa-lg"></i>
                                </button>
                                <button type="button" aria-label="Share on Twitter" disabled>
                                  <i className="fa fa-twitter fa-lg"></i>
                                </button>
                                <button type="button" aria-label="Share with Email" disabled>
                                  <i className="fa fa-envelope fa-lg"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <Link to={`/item-details/${collection.nftId}`}>
                            <img
                              src={collection.nftImage}
                              className="lazy nft__item_preview"
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="nft__item_info">
                          <Link to={`/item-details/${collection.nftId}`}>
                            <h4>{collection.title}</h4>
                          </Link>
                          <div className="nft__item_price">
                            {collection.price} ETH
                          </div>
                          <div className="nft__item_like">
                            <i className="fa fa-heart"></i>
                            <span>{collection.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
