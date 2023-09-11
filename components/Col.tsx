import Image from "next/image";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

function Col() {
  return (
    <div className="block mt-5 bg-white w-[269px] h-[373px] p-2 rounded-[20px]">
      <div
        style={{ backgroundImage: "url('/cardi.png')" }}
        className="bg-cover w-[247px] h-[222px] relative"
      >
        <Image
          src={`/face4.png`}
          alt="face"
          width={30}
          height={30}
          className="absolute bottom-[-15px] left-[5%]"
        />
        <Image
          src={`/face5.png`}
          alt="face"
          width={30}
          height={30}
          className="absolute bottom-[-15px] left-[12%]"
        />
        <Image
          src={`/face6.png`}
          alt="face"
          width={30}
          height={30}
          className="absolute bottom-[-15px] left-[19%]"
        />
        <Image
          src={`/face7.png`}
          alt="face"
          width={30}
          height={30}
          className="absolute bottom-[-15px] left-[26%]"
        />
      </div>
      <div className="flex items-center mt-5">
        <div className="block space-y-2 w-full">
          <p className={`${dmSans.className} text-[19px] font-bold`}>
            ArtCrypto
          </p>
          <div className="flex w-full space-x-[50%] items-center px-2 pb-3">
            <div className="flex space-x-2">
              <Image src={`/ethgreen2.png`} alt="eth" width={9} height={15} />
              <p
                className={`${dmSans.className} text-[11px] font-[500] text-[#00AC4F]`}
              >
                0.25 ETH
              </p>
            </div>
            <p
              className={`${dmSans.className} text-[13px] font-medium text-[#838383]`}
            >
              1 of 38
            </p>
          </div>
          <hr />
          <div className="flex justify-center space-x-10">
            <button
              className={`${dmSans.className} h-[28px] text-[#5539A8] text-[10px] bg-[#F5F5F5] rounded-[25px] px-2`}
            >
              <b>3</b>h <b>50</b>m <b>2</b>s <b>left</b>
            </button>
            <button
              className={`${dmSans.className} h-[28px] text-[#5539A8] font-medium 
                   hover:text-white hover:bg-[#5539A8] text-[15px] bg-[#F5F5F5] rounded-[25px] px-2`}
            >
              Place a bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Col;