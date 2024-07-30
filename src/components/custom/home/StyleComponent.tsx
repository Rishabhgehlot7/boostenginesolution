import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
interface IAds {
  image: string;
  link: string;
}

const StyleComponent = () => {
  const [ads, setAds] = useState<IAds[]>([{ image: "", link: "" }]);
  const [heading, setHeading] = useState<string>("");
  const contentId = "669b6a33a7c7bbdf043b7f19"; // Replace with the actual content ID
  const [loading, setLoading] = useState(true);

  const plugin: any = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/styleContent/getContentById/${contentId}`
        );
        const data = await response.json();

        if (response.ok) {
          setHeading(data.handing);
          setAds(data.images);
          // // // console.log(data);
          setLoading(false);
        } else {
          throw new Error(data.message || "Failed to fetch content");
        }
      } catch (error) {
        // // console.error(error);
      }
    };
    fetchData();
  }, [contentId]);

  if (loading) {
    return <div>Loding</div>;
  }
  return (
    <div className="contianer mx-auto">
      <div className=" backBlack m-4 md:m-10 rounded-3xl py-10">
        <h1 className=" gold text-3xl text-center font-bold uppercase">
          {heading}
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center px-3 py-7 gap-5 flex-wrap">
          {Array.isArray(ads) &&
            ads.map((item, index) => (
              <Link href={item.link} key={item.image}>
                <Image
                  src={item.image}
                  alt=""
                  className=" w-[250px] rounded-lg"
                  width={250}
                  height={100}
                />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StyleComponent;
