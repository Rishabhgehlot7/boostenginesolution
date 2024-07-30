import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
interface IAds {
  image: string;
  link: string;
}

const HomeSlider = () => {
  const [ads, setAds] = useState<IAds[]>([{ image: "", link: "" }]);
  const [heading, setHeading] = useState<string>("");
  const contentId = "669b69bca7c7bbdf043b7f08"; // Replace with the actual content ID
  const [loading, setLoading] = useState(true);

  const plugin: any = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/mobileContent/getContentById/${contentId}`
        );
        const data = await response.json();

        if (response.ok) {
          setHeading(data.handing);
          setAds(data.images);
          // console.log(data);
          setLoading(false);
        } else {
          throw new Error(data.message || "Failed to fetch content");
        }
      } catch (error) {
        // console.error(error);
      }
    };
    fetchData();
  }, [contentId]);

  if (loading) {
    return <div>Loding</div>;
  }
  return (
    <div className="relative block lg:hidden">
      <div className="bg-[#FFCC4D] overflow-hidden">
        <h3 className=" text-black w-full font-bold text-[12px] md:text-sm">
          <Marquee>{heading}</Marquee>
        </h3>
      </div>
      <Carousel
        className=""
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent className="flex">
          {Array.isArray(ads) &&
            ads.map((ad, index) => (
              <CarouselItem key={index} className=" w-full ">
                <Link href={ad.link}>
                  <Image
                    src={ad.image}
                    alt={`Slide ${index + 1}`}
                    width={1200}
                    height={600}
                    className=" w-full carousel-item"
                  />
                </Link>
              </CarouselItem>
            ))}
        </CarouselContent>
        {/* <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" /> */}
      </Carousel>
    </div>
  );
};

export default HomeSlider;
