import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { getFallbackImage } from '../imageFallback';
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { MagnifyingGlass } from 'react-loader-spinner'


function Chains() {
  const [venderData, setVenderData] = useState([]);
  const [fallbackImages, setFallbackImages] = useState(["1782828922625.jpg"]);
  const [scrollSection,setScrollSection]=useState(0);//scorring right and left
  const [loading,setLoading]=useState();
  const venderFirmHandler = async () => {
    try {
      const [response, imageResponse] = await Promise.all([
        fetch(`${API_URL}/vender/allvenders`),
        fetch(`${API_URL}/uploads/list`)
      ]);
      const newData = await response.json();
      const imageData = await imageResponse.json();
      // console.log("Fetched vendor data:", newData);
      setVenderData(newData.vender);
      if (imageData.images?.length) {
        setFallbackImages([...new Set(imageData.images)]);
      }
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch data:", error);
      alert("Failed to fetch the data");
      setLoading(true);
    }
  };

  useEffect(() => {
    venderFirmHandler();
  }, []);

  const handleSection=(direction)=>{
    //id is passed then get it
    const gallery=document.getElementById("chainGallery");
    const scrollAmount=500;
    if(direction === "left"){
      gallery.scrollTo({
        left:gallery.scrollLeft -scrollAmount,
        behavior:'smooth'
      })
    }else if(direction==="right"){
      gallery.scrollTo({
       left:gallery.scrollLeft +scrollAmount,
        behavior:"smooth"
      })
    } 

  }
  return (
    <>
    {/* load-spinner take from npm load spinner */}
    <div className='loadingSection'>
    {loading && 
    <>Loading the Images..just wait..few seconds..
    <MagnifyingGlass
  visible={true}
  height="80"
  width="80"
  ariaLabel="magnifying-glass-loading"
  wrapperStyle={{}}
  wrapperClass="magnifying-glass-wrapper"
  glassColor="#c0efff"
  color="#e15b64"
  />
    </>}
    </div>
    <div className="btnSection">
      <button onClick={()=>handleSection("left")}><HiOutlineArrowSmLeft className='btnIcons'/></button>
      <button onClick={()=>handleSection("right")}><HiOutlineArrowSmRight className='btnIcons'/></button>
    </div>
    <h2>Top Restaurants in Hyderabad</h2>
    <section className="chainSection" id="chainGallery" onScroll={(event)=>setScrollSection(event.target.scrollLeft)}>
      {/* Getting all - vendors data in venderData and   */}
      {venderData.map((venders, index) => (
        <div className="venderBox" key={index}>
          {Array.isArray(venders.firm) ? (
            venders.firm.map((item, i) => (
              <div className="firmCard" key={i}>
                {(() => {
                  const hasUploadedImage = item.image &&
                    item.image !== "undefined" &&
                    item.image !== "null";
                  const fallbackImage = getFallbackImage(item._id, fallbackImages);

                  return (
                    <>
                      {hasUploadedImage ? (
                        <img
                          src={`${API_URL}/uploads/${item.image}`}
                          alt={item.firmname}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            event.currentTarget.nextElementSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <img
                        className={hasUploadedImage ? "firmFallbackImage imageFallback" : "firmFallbackImage"}
                        src={`${API_URL}/uploads/${fallbackImage}`}
                        alt={item.firmname}
                      />
                    </>
                  );
                })()}
              </div>
            ))
          ) : (
            <div>No firm data</div>
          )}
        </div>
      ))}
    </section>
    </>
  );
}

export default Chains;
