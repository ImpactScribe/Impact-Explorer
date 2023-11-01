import { NFTStorage } from "nft.storage";
import { getAccount, getProvider } from "./actions";
import PdfABI from "@/ABIs/PDFABI.json";
import { FormState } from "@/components/Attest2";
import { Contract } from "ethers";

async function mintPDF(hash: string, tokenAccount: string) {
  let response;
  try {
    const { provider, chainID } = await getProvider();
    const goerliID = 5;

    if (chainID !== goerliID) {
      try {
        await provider?.send("wallet_switchEthereumChain", [
          { chainId: "0x5" },
        ]);
      } catch (switchError) {
        console.error("Network switch error", switchError);
        return null;
      }
    }

    const signer = await provider?.getSigner();
    const contractAddress = "0xEf466CBe76ce09Bb45ce7b25556E9b8BFD784001";
    const contract = new Contract(contractAddress, PdfABI, signer);

    if (contract) {
      response = await contract.safeMint(tokenAccount, hash);
    }
  } catch (err) {
    console.error("Method Failed", err);
  }

  return response;
}

const NFTSTORAGE = process.env.NEXT_PUBLIC_NFTSTORAGE as string;
interface UploadPDFProps {
  pdf: Blob;
}
async function UploadPDF(props: FormState, tokenAccount: string) {
  const nftstorage = new NFTStorage({ token: NFTSTORAGE });

  const nftCoverHash = await Promise.all([
    nftstorage.storeBlob(
      new Blob([props.coverimage as BlobPart], {
        type: "application/octet-stream",
      })
    ),
  ]);

  // Create metadata JSON with the correct IPFS hashes

  const metadata = {
    nftcover: `https://ipfs.io/ipfs/${nftCoverHash}`,
    description: props.description,
  };

  // Store metadata JSON
  const metadataHash = await nftstorage.storeBlob(
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );

  const hash = `https://ipfs.io/ipfs/${metadataHash}`;
  const res = await mintPDF(hash, tokenAccount);

  return res;
}
export default UploadPDF;
