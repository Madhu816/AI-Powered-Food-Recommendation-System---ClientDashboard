import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { API_URL } from "../api";

const AIFoodAssistant = () => {
    const [chat, setChat] = useState([
        {
            type: "ai",
            text: "Hi! 👋 I can help you choose something to eat. Are you looking for Veg or Non-Veg?"
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("foodType");
    const [preferences, setPreferences] = useState({
        foodType: "",
        taste: "",
        budget: ""
    });
    const [selectedOptions, setSelectedOptions] = useState([]);

    const addMessage = (type, text, extra = {}) => {
        setChat((previous) => [...previous, { type, text, ...extra }]);
    };

    const getFoodRecommendation = async (userPreferences) => {
        try {
            setLoading(true);

            const request = `I want ${userPreferences.foodType} food.
Taste preference: ${userPreferences.taste}
Budget: ${userPreferences.budget}
Suggest the best food from the available menu.`;

            const response = await fetch(`${API_URL}/api/ai/recommend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: request })
            });
            const data = await response.json();

            if (!response.ok) {
                addMessage("error", data.message || "Something went wrong.");
                return;
            }

            const recommendations = data.recommendations?.length
                ? data.recommendations
                : data.similarProducts || [];

            addMessage("ai", recommendations.length
                ? "Here are some good options for you!"
                : "Sorry, I couldn't find a suitable food.", {
                recommendations
            });
        } catch (error) {
            console.log("AI Assistant Error:", error);
            addMessage("error", "Unable to connect to AI assistant.");
        } finally {
            setLoading(false);
        }
    };

    const toggleOption = (value) => {
        setSelectedOptions((previous) => previous.includes(value)
            ? previous.filter((option) => option !== value)
            : [...previous, value]);
    };

    const confirmSelection = async () => {
        if (selectedOptions.length === 0) {
            return;
        }

        const selectedValue = selectedOptions.join(", ");

        if (step === "foodType") {
            setPreferences((previous) => ({ ...previous, foodType: selectedValue }));
            addMessage("user", selectedValue);
            setSelectedOptions([]);
            setTimeout(() => {
                addMessage("ai", "Great! 😊 What are you in the mood for?");
                setStep("taste");
            }, 300);
            return;
        }

        if (step === "taste") {
            setPreferences((previous) => ({ ...previous, taste: selectedValue }));
            addMessage("user", selectedValue);
            setSelectedOptions([]);
            setTimeout(() => {
                addMessage("ai", "Nice choice! 💰 What's your budget?");
                setStep("budget");
            }, 300);
            return;
        }

        if (step === "budget") {
            addMessage("user", selectedValue);
            const newPreferences = { ...preferences, budget: selectedValue };
            setPreferences(newPreferences);
            setSelectedOptions([]);
            setStep("finished");
            await getFoodRecommendation(newPreferences);
        }
    };

    const getOptions = () => {
        if (step === "foodType") {
            return ["🥗 Veg", "🍗 Non-Veg", "🍴 Both"];
        }

        if (step === "taste") {
            return [
                "🌶️ Spicy",
                "😋 Tasty",
                "🥗 Healthy",
                "💰 Budget-friendly",
                "🎲 Surprise me"
            ];
        }

        if (step === "budget") {
            return [
                "💰 Under ₹100",
                "💰 Under ₹200",
                "💰 Under ₹300",
                "💳 No limit"
            ];
        }

        return [];
    };

    return (
        <div className="aiAssistant">
            <div className="aiAssistantHeader">
                <div className="aiRobot">🤖</div>
                <div>
                    <h2>AI Food Assistant</h2>
                    <p>Let me help you choose your food</p>
                </div>
            </div>

            <div className="aiChat">
                {chat.map((item, index) => (
                    <div
                        key={`${item.type}-${index}`}
                        className={
                            item.type === "user"
                                ? "chatMessage userMessage"
                                : "chatMessage aiMessage"
                        }
                    >
                        {item.type === "user" ? (
                            <div className="messageBubble">{item.text}</div>
                        ) : (
                            <div className="aiResponse">
                                <div className="aiResponseText">
                                    <span className="responseIcon">
                                        {item.type === "error" ? "❌" : "🤖"}
                                    </span>
                                    <ReactMarkdown
                                        components={{
                                            img: (props) => (
                                                <img {...props} loading="lazy" />
                                            )
                                        }}
                                    >
                                        {item.text}
                                    </ReactMarkdown>
                                </div>

                                {item.recommendations?.length > 0 && (
                                    <div className="assistantFoods">
                                        {item.recommendations.map((food) => (
                                            <div
                                                className="assistantFoodCard"
                                                key={food._id}
                                            >
                                                {food.image ? (
                                                    <img
                                                        src={`${API_URL}/uploads/${food.image}`}
                                                        alt={food.productName}
                                                    />
                                                ) : (
                                                    <div className="noFoodImage">🍴</div>
                                                )}
                                                <div className="assistantFoodDetails">
                                                    <h3>{food.productName}</h3>
                                                    <strong>₹{food.price}</strong>
                                                    <p>{food.reason}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="aiLoading">🤖 Finding food for you...</div>
                )}

                {!loading && step !== "finished" && (
                    <div className="assistantOptions">
                        {getOptions().map((option) => (
                            <button
                                key={option}
                                className={selectedOptions.includes(option) ? "selected" : ""}
                                onClick={() => toggleOption(option)}
                            >
                                {option}
                            </button>
                        ))}
                        <button
                            className="assistantConfirm"
                            disabled={selectedOptions.length === 0}
                            onClick={confirmSelection}
                        >
                            {step === "budget" ? "✓ Show food" : "OK • Next"}
                        </button>
                    </div>
                )}
            </div>

            <div className="assistantFooter">
                <span>🤖 AI Food Assistant</span>
                {step === "finished" && <span>✓ Done</span>}
            </div>
        </div>
    );
};

export default AIFoodAssistant;