import React, { useState } from "react";
import { API_URL } from "../api";

const Review = ({ productId }) => {

    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const submitReview = async () => {

        if (!reviewText.trim()) {
            return;
        }

        try {

            setLoading(true);
            setResult(null);

            const response = await fetch(
                `${API_URL}/review/add`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        productId: productId,
                        reviewText: reviewText.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setResult({
                    type: "error",
                    message: data.message || "Failed to add review"
                });

                return;
            }

            // Show AI result on page
            setResult({
                type: "success",
                sentiment: data.review.sentiment,
                score: data.review.sentimentScore
            });

            // Clear textbox
            setReviewText("");

        } catch (error) {

            console.log("Review error:", error);

            setResult({
                type: "error",
                message: "Something went wrong. Please try again."
            });

        } finally {

            setLoading(false);

        }
    };


    // Press Enter to submit
    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            submitReview();

        }

    };


    return (

        <div className="reviewSection">

            <div className="reviewTitle">
                ⭐ Rate & Review
            </div>

            <textarea
                className="reviewInput"
                placeholder="How was your food? Write your review..."
                value={reviewText}
                onChange={(event) =>
                    setReviewText(event.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={loading}
            />

            <div className="reviewBottom">

                <small>
                    Press Enter to submit
                </small>

                <button
                    className="reviewButton"
                    onClick={submitReview}
                    disabled={loading || !reviewText.trim()}
                >

                    {loading
                        ? "🤖 Analyzing..."
                        : "Submit Review"
                    }

                </button>

            </div>


            {/* ============================= */}
            {/* AI RESULT */}
            {/* ============================= */}

            {result && result.type === "success" && (

                <div className="reviewResult">

                    <div className="reviewSuccess">
                        ✓ Review submitted successfully
                    </div>

                    <div className="aiSentiment">

                        <span>
                            🤖 AI Sentiment
                        </span>

                        <strong
                            className={
                                result.sentiment === "positive"
                                    ? "positive"
                                    : result.sentiment === "negative"
                                        ? "negative"
                                        : "neutral"
                            }
                        >
                            {result.sentiment.toUpperCase()}
                        </strong>

                    </div>

                    <div className="sentimentScore">

                        <span>
                            AI Confidence
                        </span>

                        <strong>
                            {Math.round(result.score * 100)}%
                        </strong>

                    </div>

                </div>

            )}


            {result && result.type === "error" && (

                <div className="reviewError">

                    ❌ {result.message}

                </div>

            )}

        </div>

    );
};

export default Review;