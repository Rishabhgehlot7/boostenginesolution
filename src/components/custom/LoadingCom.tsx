import LoaderImage from "@/public/loader/loading.gif";
import Image from "next/image";

const LoadingCom = () => {
  return (
    <div className=" w-full h-screen flex justify-center items-center">
      <Image src={LoaderImage} alt="Loading" width={100} height={100} />
    </div>
  );
};

export default LoadingCom;
