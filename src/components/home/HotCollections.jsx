import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../components/CollectionSkeleton';
import "../../css/styles/hotCollections.css";
import axios from "axios";
import CollectionSkeleton from "../../components/CollectionSkeleton";

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

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections",
        );

        setCollections(res.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
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
    dots: true,
    infinite: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 4,
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
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <Slider
            ref={sliderRef}
            {...settings}
            className="hot-collections-slider"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <CollectionSkeleton key={index} variant="hot" />
                ))
              : collections.map((collection) => (
                  <div key={collection.id}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to={`/item-details/${collection.nftId}`}>
                          <img
                            src={collection.nftImage}
                            className="lazy img-fluid"
                            alt={collection.title}
                          />
                        </Link>
                      </div>

                      <div className="nft_coll_pp">
                        <Link to={`/author/${collection.authorId}`}>
                          <img
                            className="lazy pp-coll"
                            src={collection.authorImage}
                            alt={collection.authorName || "Collection author"}
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>

                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>ERC-{collection.code}</span>
                      </div>
                    </div>
                  </div>
                ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
