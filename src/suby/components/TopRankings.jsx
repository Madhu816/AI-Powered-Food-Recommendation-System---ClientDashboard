import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";
import { useCart } from "../cart/CartContext";

const TopRankings = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const restaurantScroller = useRef(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadRankings = async () => {
            try {
                const [restaurantsResponse, foodsResponse] = await Promise.all([
                    fetch(`${API_URL}/api/top/restaurants`),
                    fetch(`${API_URL}/api/top/foods`)
                ]);
                const restaurantsData = await restaurantsResponse.json();
                const foodsData = await foodsResponse.json();
                setRestaurants(restaurantsData.restaurants || []);
                setFoods(foodsData.foods || []);
            } catch (error) {
                console.error("Top rankings error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRankings();
    }, []);

    if (loading || (!restaurants.length && !foods.length)) {
        return null;
    }

    const scrollRestaurants = (direction) => {
        restaurantScroller.current?.scrollBy({
            left: direction === "left" ? -500 : 500,
            behavior: "smooth"
        });
    };

    return (
        <section className="topRankings">
            {restaurants.length > 0 && (
                <div className="topRankingSection">
                    <div className="topRankingHeading">
                        <div>
                            <p className="rankingEyebrow">Based on customer sentiment</p>
                            <h2>🏆 Top 10 Restaurants</h2>
                        </div>
                        <div className="rankingArrows">
                            <button
                                onClick={() => scrollRestaurants("left")}
                                aria-label="Scroll top restaurants left"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => scrollRestaurants("right")}
                                aria-label="Scroll top restaurants right"
                            >
                                →
                            </button>
                        </div>
                    </div>
                    <div className="topRankingScroller" ref={restaurantScroller}>
                        {restaurants.map((restaurant, index) => (
                            <Link
                                className="topRankingCard"
                                key={restaurant._id}
                                to={`/products/${restaurant._id}/${restaurant.firmname}`}
                            >
                                <span className="rankingPosition">{index + 1}</span>
                                {restaurant.image ? (
                                    <img
                                        src={`${API_URL}/uploads/${restaurant.image}`}
                                        alt={restaurant.firmname}
                                    />
                                ) : (
                                    <div className="rankingNoImage">🏪</div>
                                )}
                                <div className="rankingCardBody">
                                    <h3>{restaurant.firmname}</h3>
                                    <strong>⭐ {restaurant.rating}</strong>
                                    <p>
                                        {restaurant.reviewCount} reviews · {restaurant.positivePercentage}% positive
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {foods.length > 0 && (
                <div className="topRankingSection">
                    <div className="topRankingHeading">
                        <div>
                            <p className="rankingEyebrow">Loved by the food crowd</p>
                            <h2>🍴 Top 10 Food Items</h2>
                        </div>
                    </div>
                    <div className="topRankingScroller">
                        {foods.map((food, index) => (
                            <article className="topRankingCard" key={food._id}>
                                <span className="rankingPosition">{index + 1}</span>
                                {food.image ? (
                                    <img
                                        src={`${API_URL}/uploads/${food.image}`}
                                        alt={food.productName}
                                    />
                                ) : (
                                    <div className="rankingNoImage">🍴</div>
                                )}
                                <div className="rankingCardBody">
                                    <h3>{food.productName}</h3>
                                    <strong>⭐ {food.rating}</strong>
                                    <p>
                                        {food.reviewCount} reviews · {food.positivePercentage}% positive
                                    </p>
                                    <button
                                        className="rankingAddButton"
                                        onClick={() => addToCart(food)}
                                    >
                                        ADD
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default TopRankings;
