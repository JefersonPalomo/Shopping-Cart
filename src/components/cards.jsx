import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Cards() {
    const [priz, setPriz] = useState([0, [], 0]);
    const [p, setP] = useState([]);
    const [sliderSettings, setSliderSettings] = useState({
        dots: true,
        infinite: true,
        speed: 3000,
        slidesToShow: 5,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 4000
    });
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        window.addEventListener("resize", updateSliderSettings);
        return () => {
            window.removeEventListener("resize", updateSliderSettings);
        };
    }, []);

    useEffect(() => {
        const barcodes = [
            3168930010265, 5449000000996, 3175680011442, 3017620420702,
            4056489216162, 20724696, 3155251205296, 7311070032611,
            5449000000439, 8480000168832, 8710522922019, 5015168000026
        ];
        barcodes.forEach(barcode => {
            getInfo(barcode);
        });
    }, []);

    function getInfo(barcode) {
        fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=product_name,nutriments,nutrition_grades,nutriscore_data,selected_images`)
            .then(response => response.json())
            .then(data => {
                const randomPrice = Math.floor(Math.random() * 20) + 10;
                let productWithPrice = null;
                if(!data.product.product_name) {
                    productWithPrice = { ...data, price: randomPrice, name: "KRISPOLLS" };
                } else {
                    productWithPrice = { ...data, price: randomPrice};
                }
                setP(prevP => [...prevP, productWithPrice]);
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
            });
    }

    useEffect(() => {
        if (p.length > 14) {
            setDataLoaded(true);
        }
    }, [p]);

    const updateSliderSettings = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 660) {
            setSliderSettings({
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
            });
        } else if (screenWidth >= 660 && screenWidth < 860) {
            setSliderSettings({
                slidesToShow: 2,
                slidesToScroll: 1,
                autoplay: true,
            });
        } else if (screenWidth >= 860 && screenWidth < 1268) {
            setSliderSettings({
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
            });
        } else if (screenWidth >= 1268 && screenWidth < 1424) {
            setSliderSettings({
                slidesToShow: 4,
                slidesToScroll: 2,
                autoplay: true,
            });
        } else {
            setSliderSettings({
                dots: true,
                infinite: true,
                speed: 3000,
                slidesToShow: 5,
                slidesToScroll: 3,
                autoplay: true,
                autoplaySpeed: 4000
            });
        }
    };

    function pricing(price, name) {
        setPriz(prevPriz => {
            const newPriz = [...prevPriz];
            newPriz[0]++;
            newPriz[1].push(name);
            newPriz[2] += price;
            console.log(priz);
            return newPriz;
        });
    }

    return (
        <>
            {dataLoaded && (
                <>
                    <div className="flex relative justify-center py-6">
                        <h1 className="text-4xl mx-auto ">Come and take a look at our products.</h1>
                    </div>
                    <Slider {...sliderSettings} className="mx-28 select-none bg-white mb-10">
                        {p.map((links, index) =>
                            <div className="flex text-black border-b border-r border-t border-black px-8 pt-10" key={index}>
                                <img className="mx-auto my-auto w-30 h-40" src={`./src/images/${links.code}.jpg`} alt={links.product.product_name}></img>
                                <div className="h-40 pt-5">
                                    <p className='text-1xl' > {links.product.product_name ? links.product.product_name : ("KRISPOLLS")} </p>
                                    <p> Carbohydrates: {links.product.nutriments.carbohydrates} </p>
                                    <p> EnergyKcal: {links.product.nutriments.energy_value} </p>
                                    <p className="text-2xl"> Price: ${links.price} </p>
                                </div>
                                <div className="flex items-end grid grid-cols-2 pb-6">
                                    <img className="w-28" src={`./src/images/${links.product.nutrition_grades}.svg`}></img>
                                    <button onClick={() => pricing(links.price, links.product.product_name ? links.product.product_name : "KRISPOLLS")}><img className="ml-4 md:ml-20 lg:ml-20 xl:ml-20 2xl:ml-30 w-10 h-10 pb-1" src="./src/images/car.png"></img>
                                    </button>
                                </div>
                            </div>
                        )}
                    </Slider>
                </>
            )}
            {!dataLoaded && <p></p>}
            {priz[0] > 0 && (
                <div className="relative text-2xl m-10">
                    <p>You have {priz[0]} product(s) in the cart.  Your payment is: <span className="text-red-600"> $ {priz[2]} </span></p>
                    <div className="flex mt-3">
                        {[...new Set(priz[1])].map((number, index) => (
                            <div key={index}>{number} -- </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
