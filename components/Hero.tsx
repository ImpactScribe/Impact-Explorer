import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";

const myFont = localFont({
  src: "./intcf/IntegralCF-Bold.otf",
  display: "swap",
});
const dmsans = localFont({
  src: "./dmsans/DMSans-Regular.ttf",
  display: "swap",
});

function Hero() {
  return (
    <div
      className="lg:flex block lg:justify-around lg:py-[100px] md:py-[80px] py-[50px] h-fit w-full relative
       bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url('/herobg.jpg')`,
      }}
    >
      <div className="relative">
        <pre
          className={`${myFont.className} lg:font-[900] lg:text-[40px] md:text-[30px] text-[24px] lg:text-left text-center font-[700]`}
        >{`DISCOVER, AND COLLECT
DIGITAL ART NFTs`}</pre>
        <pre
          className={`${dmsans.className}  text-black lg:text-left text-center lg:text-[18px] md:text-[18px] text-[13px]`}
        >
          {`Digital marketplace for crypto collectibles and 
non-fungible tokens (NFTs). Buy, Sell, and discover
exclusive digital assets.`}
        </pre>
        <Link
          href={`/explore`}
          className={`flex justify-center items-center lg:p-3 p-2 rounded-[15px] text-white lg:mx-0 mx-auto
         font-semibold lg:w-[150px] md:w-[130px] w-[120px] lg:h-[45px] md:h-[45px] h-[35px] mt-3 bg-[#3D00B7] hover:opacity-75 active:opacity-50`}
        >
          Explore Now
        </Link>
        <div className="flex space-x-2 mt-3 relative items-center justify-center lg:justify-start">
          <Image
            src={`/dot.png`}
            className="absolute top-[-70px] lg:left-[-30px] left-[30%] lg:w-[196px] lg:h-[154px] w-[146px] h-[104px] z-[-1]"
            width={196}
            height={154}
            alt="img"
          />
          <p className="text-black text-center lg:text-[16px] text-[13px]">
            <b className="lg:text-[40px] text-[20px] md:text-[30px] text-black">
              98K+
            </b>
            <br />
            Artwork
          </p>
          <p className="text-center lg:text-[16px] text-[13px]">
            <b className="lg:text-[40px] text-[20px] md:text-[30px] text-black">
              12K+
            </b>
            <br />
            Auction
          </p>
          <p className="text-center lg:text-[16px] text-[13px]">
            <b className="lg:text-[40px] text-[20px] md:text-[30px] text-black">
              15K+
            </b>
            <br />
            Artist
          </p>
        </div>
      </div>

      <div
        className="relative lg:w-[500px] lg:h-[500px] w-[280px] h-[280px] md:w-[400px]
       md:h-[400px] lg:mt-0 md:mt-[150px] mt-[90px] mx-auto lg:mx-0"
      >
        <div className="absolute lg:right-[60px] right-[20px] bottom-[20%]">
          <div
            className="bg-[url('/nfts/F0VLqN8agAAe0wA.jpg')] bg-cover lg:h-[440px] z-[2] lg:w-[400px]
           md:h-[430px] md:w-[360px] w-[250px] h-[290px] relative p-4 rounded-[24px]"
          ></div>
        </div>
        <Image
          loading="lazy"
          alt="stack"
          width={356}
          height={391}
          src={`/nfts/Fz4Sw_macAEd5bV.jpg`}
          className="absolute bottom-[25%] lg:right-[30px] right-[5px] z-[1] w-[200px] h-[250px]
           lg:h-[391px] md:h-[380px] md:w-[340px] lg:w-[356px] rounded-[24px]"
        />
        <Image
          loading="lazy"
          alt="stack"
          width={310}
          height={341}
          src={`/nfts/Fz9HvneXoAE5epv.jpg`}
          className="absolute lg:top-0 md:top-[-12%] top-[-10px] lg:right-0 right-[-10px] lg:w-[310px]
           lg:h-[341px] md:h-[320px] md:w-[280px] w-[150px] h-[200px] z-0 rounded-[24px]"
        />
      </div>
    </div>
  );
}

export default Hero;
