import { ethers, Contract, providers } from "ethers";
import ABI from "@/ABIs/ABI.json";
import AndroidABI from "@/ABIs/AndroidsLovingAbi.json";
import { NFTData } from "@/redux/types";
import { getClaims } from "./hypercerts";
import { getAllListing } from "./marketplace";
declare let window: any;

const cache: Record<string, any> = {};

const getCachedValue = async <T>(
  key: string,
  func: () => Promise<T>
): Promise<T> => {
  if (cache[key]) {
    return cache[key];
  } else {
    const result = await func();
    cache[key] = result;
    return result;
  }
};

export async function getProviderReadOnly() {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY;
  const key = "providerReadOnly";
  return getCachedValue(key, async () => {
    let provider;
    try {
      provider = new providers.AlchemyProvider("goerli", alchemyKey);
      console.log("ReadOnly provider has been set");
    } catch (err) {
      console.error("Provider failed", err);
    }
    return provider;
  });
}

export async function getProvider() {
  const key = "provider";
  return getCachedValue(key, async () => {
    let provider;
    let chainID;
    try {
      if (window.ethereum !== undefined && window.ethereum.isConnected()) {
        provider = new providers.Web3Provider(window.ethereum);
        let network = await provider.getNetwork();
        chainID = network.chainId;
        console.log("Provider has been set");
        const goerliID = 5;
        if (chainID !== goerliID) {
          await provider.send("wallet_switchEthereumChain", [
            { chainId: "0x5" },
          ]);
        }
      }
    } catch (err) {
      console.error("Provider failed", err);
    }
    return { provider, chainID };
  });
}

export async function getAccount() {
  const key = "account";
  return getCachedValue(key, async () => {
    let account;
    const { provider } = await getProvider();
    try {
      if (provider instanceof providers.Web3Provider) {
        const signer = provider.getSigner();
        account = await signer.getAddress();
        console.log("Got user account");
      }
    } catch (err) {
      console.error("Process Failed", err);
    }
    return account;
  });
}

export async function getContract() {
  const key = "contract";
  return getCachedValue(key, async () => {
    let contract;
    try {
      const provider = await getProviderReadOnly();
      const contractAddress = "0x4bB0a205fceD93c8834b379c461B07BBe6aAE622";
      contract = new Contract(contractAddress, ABI, provider);
      console.log("Main Contract set ");
    } catch (err) {
      console.error("Process Failed", err);
    }
    return contract;
  });
}

export async function getNextId() {
  const key = "nextId";
  return getCachedValue(key, async () => {
    let nextId;
    try {
      const contract = await getContract();
      if (contract) {
        nextId = await contract.nextTokenId();
      }
    } catch (err) {
      console.error("Operatipn Failed", err);
    }
    return nextId;
  });
}

export async function getTokenByIndex(index: number) {
  let id;
  try {
    const contract = await getContract();
    if (contract) {
      id = await contract.tokenByIndex(index);
      console.log("ID has been gotten");
    }
  } catch (err) {
    console.error("Can't fetch ID", err);
  }
  return id;
}
export async function getTotalSupply() {
  let totalSupply;
  try {
    const contract = await getContract();
    if (contract) {
      totalSupply = await contract.totalSupply();
      console.log("Total Supply gotten");
    }
  } catch (err) {
    console.error("Method Failed", err);
  }
  return totalSupply;
}

export const getAll = async () => {
  const key = "allnfts";
  return getCachedValue(key, async () => {
    const allNfts: NFTData[] = [];
    try {
      const listings = await getAllListing();
      const unloaded = listings.valueOf();
      const destructured = Array(...unloaded).map((item) => item.valueOf());
      const data = destructured.map((item) => {
        return {
          id: item[0],
          price: item[1],
          owner: item[2],
        };
      });
      const nftPromise = data.map(async (item) => {
        const contract = await getContract();
        if (contract) {
          try {
            let tokenURI = await contract.tokenURI(item.id);
            let tokenAccount = await contract.tokenAccount(Number(item.id));
            let attributes = await getAttributes(Number(item.id));
            let claims = await getClaims(tokenAccount);
            let res = await fetch(tokenURI);
            let data = await res.json();
            let nft: NFTData = {
              id: Number(item.id),
              attributes: attributes,
              name: data.name,
              coordinates: data.coordinates,
              coverImage: data.nftcover,
              projectImages: data.projectimages,
              image: data.image,
              ipfsUri: tokenURI,
              tokenAccount: tokenAccount,
              description: data.description,
              claims: claims,
            };
            allNfts.push(nft);
          } catch (err) {}
        }
      });
      await Promise.all(nftPromise);
      console.log("Got all listed nfts");
    } catch (err) {
      console.error("Failed to retrieve data:", err);
    }
    return allNfts;
  });
};

export async function getOwnedTokens() {
  const key = "ownednfts";
  if (!window.ethereum.isConnected()) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  }
  return getCachedValue(key, async () => {
    const contract = await getContract();
    const owner = await getAccount();
    let ownedNfts: NFTData[] = [];
    if (owner && contract) {
      try {
        // Get the IDs of the user's NFTs
        const ids = await getTokenOfOwnerByIndex(owner, contract);

        // Create a function to fetch the data for a single NFT
        const fetchNFTData = async (id: number) => {
          let tokenURI = await contract.tokenURI(id);
          let tokenAccount = await contract.tokenAccount(Number(id));
          let attributes = await getAttributes(Number(id));
          let claims = await getClaims(tokenAccount);
          let res = await fetch(tokenURI);
          let data = await res.json();
          let nft: NFTData = {
            id: Number(id),
            attributes: attributes,
            name: data.name,
            coordinates: data.coordinates,
            coverImage: data.nftcover,
            projectImages: data.projectimages,
            image: data.image,
            ipfsUri: tokenURI,
            tokenAccount: tokenAccount,
            description: data.description,
            claims: claims,
          };
          return nft;
        };

        // Fetch the data for all of the user's NFTs
        const ownedTokenPromises = ids.map(fetchNFTData);
        ownedNfts = await Promise.all(ownedTokenPromises);
        console.log("User's NFTs has been fetched");
      } catch (err) {
        console.error("Failed to get user's NFT");
      }
      return ownedNfts;
    }
  });
}

export const getGeojson = async (allNfts: NFTData[]) => {
  let geojson = {
    type: "FeatureCollection",
    features: allNfts.map((nft) => {
      return {
        type: "Feature",
        properties: {
          id: Number(nft.id),
        },
        geometry: {
          type: "Point",
          coordinates: nft.coordinates,
        },
      };
    }),
  };
  console.log("GeoJSON build complete");
  return geojson;
};

export async function mintNft(hash: string) {
  let response;
  try {
    const address = await getAccount();
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

    const signer = provider?.getSigner();
    const contractAddress = "0x4bB0a205fceD93c8834b379c461B07BBe6aAE622";
    const contract = new Contract(contractAddress, ABI, signer);

    if (contract) {
      response = await contract.safeMint(address, hash);
    }
  } catch (err) {
    console.error("Method Failed", err);
  }

  return response;
}
export async function getTokenAccount(id: number) {
  let tokenAccount;
  const contract = await getContract();
  try {
    if (contract) {
      tokenAccount = await contract.tokenAccount(id);
      console.log("Token account has been gotten");
    }
  } catch (err) {
    console.error("Couldn't get token account", err);
  }
  return tokenAccount;
}

export async function getAndContract() {
  const key = "androidContract";
  return getCachedValue(key, async () => {
    let contract;
    try {
      const contractAddress = "0xdb4d99fece09326d2cabdef29ab8be41eeab771a";
      const provider = await getProviderReadOnly();
      contract = new Contract(contractAddress, AndroidABI, provider);
    } catch (err) {
      console.error("Get contract failed", err);
    }
    return contract;
  });
}

export async function getAndContractWrite() {
  const key = "androidContractWrite";
  return getCachedValue(key, async () => {
    let contract;
    try {
      const contractAddress = "0xdb4d99fece09326d2cabdef29ab8be41eeab771a";
      const { provider } = await getProvider();
      const signer = await provider?.getSigner();
      contract = new Contract(contractAddress, AndroidABI, signer);
    } catch (err) {
      console.error("Get contract failed", err);
    }
    return contract;
  });
}

export async function getTokenOfOwnerByIndex(owner: string, contract: any) {
  let tokenIds = [];
  try {
    let balance = await contract?.balanceOf(owner);
    for (let i = 0; i < balance; i++) {
      let tokenId = await contract?.tokenOfOwnerByIndex(owner, i);
      tokenIds.push(tokenId);
    }
    console.log("Token of Owner fetched");
  } catch (err) {
    console.error("Couldn't fetch the tokenIds", err);
  }
  return tokenIds;
}
export async function getAttributes(id: number) {
  let tokens: string[] = [];
  const owner = await getTokenAccount(id);
  const contract = await getAndContract();
  try {
    const ids = await getTokenOfOwnerByIndex(owner, contract);

    await Promise.all(
      ids.map(async (id) => {
        if (contract) {
          const tokenURI = await contract.tokenURI(id);
          if (typeof tokenURI === "string") {
            tokens.push(tokenURI);
          }
        }
      })
    );
    console.log("Attributes have been fetched");
  } catch (err) {
    console.error("Fetch attributes Operation failed", err);
  }
  return tokens;
}

export async function isOwnerOf(id: number) {
  const contract = await getContract();
  const account = await getAccount();
  try {
    const ownerOf = await contract?.ownerOf(id);
    if (ownerOf == account) return true;
    else return false;
  } catch (err) {
    console.error("Check isOwner failed", err);
  }
}

export async function getTotalSupplyTemp(contract: ethers.Contract) {
  let totalSupply;
  try {
    if (contract) {
      totalSupply = await contract.totalSupply();
    }
  } catch (err) {
    console.error("Method Failed", err);
  }
  return totalSupply;
}

export async function safeMintNft(
  contract: ethers.Contract,
  tokenAccount: string
) {
  try {
    await contract.safeMint(tokenAccount);
  } catch (err) {
    console.error("safeMint failed:", err);
  }
}

export async function createContract(contractAddress: string, ABI: any) {
  let contractP;
  const provider = await getProviderReadOnly();
  if (provider !== undefined) {
    try {
      //const signer = await provider.getSigner();
      contractP = new Contract(contractAddress, ABI, provider);
    } catch (err) {
      console.error("Failed to create contract");
    }
  }
  return contractP;
}
