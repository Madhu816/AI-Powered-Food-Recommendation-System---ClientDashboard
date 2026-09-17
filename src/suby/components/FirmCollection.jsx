import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { getFallbackImage } from '../imageFallback';
import { Link } from 'react-router-dom';

const FirmCollection = () => {
    const [firmData, setFirmData] = useState([]);
    const [fallbackImages, setFallbackImages] = useState(["1782828922625.jpg"]);
    const [selectRegion, setSelectRegion] = useState("All");
    const [activebtn, setActiveBtn] = useState("all");

    const Firmhandler = async () => {
        try {
            const [response, imageResponse] = await Promise.all([
                fetch(`${API_URL}/vender/allvenders`),
                fetch(`${API_URL}/uploads/list`)
            ]);
            const newData = await response.json();
            const imageData = await imageResponse.json();
            // console.log("Fetched vendor data:", newData);
            setFirmData(newData.vender);
            if (imageData.images?.length) {
                setFallbackImages([...new Set(imageData.images)]);
            }
        } catch (error) {
            console.log("Failed to fetch data:", error);
            alert("Failed to fetch the data");
        }
    };

    useEffect(() => {
        Firmhandler();
    }, []);

    const handleFilterClick = (region, cateory) => {
        setSelectRegion(region);
        setActiveBtn(cateory);
    };

    return (
        <>
            <h2>Restaurants with online food delivery in Hyderabad</h2>
            <div className="filterButton">
                <button onClick={() => handleFilterClick("All", "all")} className={activebtn === "all" ? "activeButton" : ""}>All</button>
                <button onClick={() => handleFilterClick("South-Indian", "south-indian")} className={activebtn === "south-indian" ? "activeButton" : ""}>South-Indian</button>
                <button onClick={() => handleFilterClick("North-Indian", "north-indian")} className={activebtn === "north-indian" ? "activeButton" : ""}>North-Indian</button>
                <button onClick={() => handleFilterClick("Chines", "chines")} className={activebtn === "chines" ? "activeButton" : ""}>Chinese</button>
                <button onClick={() => handleFilterClick("Bakery", "bakery")} className={activebtn === "bakery" ? "activeButton" : ""}>Bakery</button>
            </div>

            <section className='firmSection'>
                {firmData.map((vender, index) => (
                    vender.firm?.filter(item =>
                        selectRegion === "All" ||
                        item.region.map(r => r.toLowerCase()).includes(selectRegion.toLowerCase())
                    ).map((item, i) => (
                        (() => {
                            const fallbackImage = getFallbackImage(item._id, fallbackImages);

                            return (
                            <Link to={`/products/${item._id}/${item.firmname}`} className='link' key={`${index}-${i}`}>
                                <div className="firmGroup">
                                    <div className="firmImageContainer">
                                        {item.image && item.image !== "undefined" && item.image !== "null" ? (
                                            <img
                                                src={`${API_URL}/uploads/${item.image}`}
                                                alt={item.firmname}
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                    event.currentTarget.nextElementSibling.style.display = "flex";
                                                }}
                                            />
                                        ) : (
                                            <img
                                                className="firmFallbackImage"
                                                src={`${API_URL}/uploads/${fallbackImage}`}
                                                alt="Restaurant food"
                                            />
                                        )}
                                        {item.image && item.image !== "undefined" && item.image !== "null" && (
                                            <img
                                                className="firmFallbackImage imageFallback"
                                                src={`${API_URL}/uploads/${fallbackImage}`}
                                                alt="Restaurant food"
                                            />
                                        )}
                                        {item.offer && item.offer !== "undefined" && item.offer !== "null" && (
                                            <div className="firmOffer">{item.offer}</div>
                                        )}
                                    </div>
                                    <div className='firmDetails'>
                                        <strong>{item.firmname.toUpperCase()}</strong><br />
                                        <div className='firmArea'>{item.region.join(",")}</div>
                                        <div className='firmArea'>{item.area} (Loc)</div><br />
                                    </div>
                                </div>
                            </Link>
                            );
                        })()
                    ))
                ))}
            </section>
        </>
    );
};

export default FirmCollection;
