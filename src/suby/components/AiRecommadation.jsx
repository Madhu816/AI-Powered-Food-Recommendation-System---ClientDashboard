import React, { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useCart } from "../cart/CartContext";

const AIRecommendation = () => {

    const [message, setMessage] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiFilters, setAiFilters] = useState(null);
    const [noResult, setNoResult] = useState(false);
    const [showSimilar, setShowSimilar] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const resetRecommendation = () => {
            setMessage("");
            setRecommendations([]);
            setAiFilters(null);
            setNoResult(false);
            setShowSimilar(false);
        };

        window.addEventListener("reset-ai-recommendation", resetRecommendation);
        return () => window.removeEventListener("reset-ai-recommendation", resetRecommendation);
    }, []);

    const getRecommendations = async () => {

        if (!message.trim()) {
            alert("Please enter what food you want");
            return;
        }

        try {

            setLoading(true);

            setRecommendations([]);
            setNoResult(false);
            setShowSimilar(false);

            const response = await fetch(
                `${API_URL}/api/ai/recommend`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Recommendation request failed: ${response.status}`);
            }

            const data = await response.json();

            console.log("AI Response:", data);

            // ==========================================
            // AI FILTERS
            // ==========================================

            setAiFilters(data.aiFilters || null);


            // ==========================================
            // EXACT PRODUCTS FOUND
            // ==========================================

            if (
                data.recommendations &&
                data.recommendations.length > 0
            ) {

                setRecommendations(
                    data.recommendations
                );

                setShowSimilar(false);

            }

            // ==========================================
            // EXACT PRODUCTS NOT FOUND
            // BUT SIMILAR PRODUCTS FOUND
            // ==========================================

            else if (
                data.similarProducts &&
                data.similarProducts.length > 0
            ) {

                setRecommendations(
                    data.similarProducts
                );

                setShowSimilar(true);

            }

            // ==========================================
            // NOTHING FOUND
            // ==========================================

            else {

                setNoResult(true);

            }

        } catch (error) {

            console.log(
                "AI Error:",
                error
            );

            alert(
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="aiRecommendation">

            {/* ==========================================
                TITLE
            ========================================== */}

            <h2>
                🤖 AI Food Recommendation
            </h2>


            {/* ==========================================
                SEARCH BOX
            ========================================== */}

            <div className="aiSearchBox">

                <input
                    type="text"
                    placeholder="Try: healthy veg food under 300 calories"
                    value={message}
                    onChange={(event) =>
                        setMessage(event.target.value)
                    }
                    onKeyDown={(event) => {

                        if (event.key === "Enter") {

                            getRecommendations();

                        }

                    }}
                />

                <button
                    onClick={getRecommendations}
                    disabled={loading}
                >

                    {loading
                        ? "Finding..."
                        : "✨ Find Food"
                    }

                </button>

            </div>


            {/* ==========================================
                AI UNDERSTOOD
            ========================================== */}

            {aiFilters && !loading && (

                <div className="aiUnderstood">

                    <p>
                        AI understood:
                    </p>


                    {/* FOOD */}

                    {aiFilters.keyword && (

                        <span>
                            🍴 {aiFilters.keyword}
                        </span>

                    )}


                    {/* CATEGORY */}

                    {aiFilters.category && (

                        <span>
                            🥗 {aiFilters.category}
                        </span>

                    )}


                    {/* PRICE */}

                    {aiFilters.maxPrice !== null &&
                        aiFilters.maxPrice !== undefined && (

                            <span>
                                💰 Under ₹
                                {aiFilters.maxPrice}
                            </span>

                        )}


                    {/* HEALTHY */}

                    {aiFilters.healthy === true && (

                        <span>
                            ❤️ Healthy
                        </span>

                    )}


                    {/* CALORIES */}

                    {aiFilters.maxCalories !== null &&
                        aiFilters.maxCalories !== undefined && (

                            <span>
                                🔥 Under{" "}
                                {aiFilters.maxCalories}
                                {" "}calories
                            </span>

                        )}

                </div>

            )}


            {/* ==========================================
                SIMILAR FOOD MESSAGE
            ========================================== */}

            {showSimilar &&
                recommendations.length > 0 &&
                !loading && (

                    <div className="similarMessage">

                        <h3>
                            😔{" "}
                            {aiFilters?.keyword
                                ? `${aiFilters.keyword} isn't available right now.`
                                : "Exact food isn't available right now."
                            }
                        </h3>

                        <p>
                            But we found these similar
                            options from our menu:
                        </p>

                    </div>

                )}


            {/* ==========================================
                NO RESULT
            ========================================== */}

            {noResult && !loading && (

                <div className="noResult">

                    <h3>
                        😔 No matching food found
                    </h3>

                    <p>
                        We couldn't find food matching
                        your request in our available menu.
                    </p>

                    <p>
                        Try searching for another food.
                    </p>

                </div>

            )}


            {/* ==========================================
                RECOMMENDATIONS
            ========================================== */}

            {recommendations.length > 0 && (

                <>

                    {/* TITLE */}

                    {!showSimilar ? (

                        <h3 className="recommendationTitle">
                            🍴 Recommended For You
                        </h3>

                    ) : (

                        <h3 className="recommendationTitle">
                            🍴 Similar Foods
                        </h3>

                    )}


                    {/* FOOD CARDS */}

                    <div className="aiResults">

                        {recommendations.map(
                            (food) => (

                                <div
                                    className="aiFoodCard"
                                    key={food._id}
                                >

                                    {/* ==================================
                                        IMAGE
                                    ================================== */}

                                    {food.image && (

                                        <img
                                            src={`${API_URL}/uploads/${food.image}`}
                                            alt={food.productName}
                                        />

                                    )}


                                    {/* ==================================
                                        FOOD NAME
                                    ================================== */}

                                    <h3>
                                        {food.productName}
                                    </h3>


                                    {/* ==================================
                                        DESCRIPTION
                                    ================================== */}

                                    <p>
                                        {food.description}
                                    </p>


                                    {/* ==================================
                                        PRICE + CALORIES
                                    ================================== */}

                                    <div className="aiFoodInfo">

                                        <strong>
                                            ₹{food.price}
                                        </strong>

                                        {food.calories !==
                                            undefined && (

                                            <span>
                                                🔥{" "}
                                                {food.calories}
                                                {" "}kcal
                                            </span>

                                        )}

                                    </div>


                                    {/* ==================================
                                        PROTEIN
                                    ================================== */}

                                    {food.protein !==
                                        undefined && (

                                        <p>
                                            💪 Protein:{" "}
                                            {food.protein}g
                                        </p>

                                    )}


                                    {/* ==================================
                                        HEALTHY
                                    ================================== */}

                                    {food.isHealthy && (

                                        <span
                                            className="aiBadge"
                                        >
                                            ✓ Healthy
                                        </span>

                                    )}

                                    <button
                                        className="aiAddToCart"
                                        onClick={() => addToCart(food)}
                                    >
                                        🛒 Add to Cart
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                </>

            )}

        </div>

    );

};

export default AIRecommendation;