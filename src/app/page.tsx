"use client";

import { useState, useEffect, DragEvent } from "react";
import { JsonRpcProvider, Contract } from "ethers";
import MyNFTABI from "../../artifacts/contracts/MyNFT.sol/MyNFT.json";

export default function Home() {
  const [contractAddress] = useState("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [mintStatus, setMintStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    // Connect to the local Hardhat node
    const _provider = new JsonRpcProvider("http://127.0.0.1:8545");
    setProvider(_provider);
    const contractInstance = new Contract(contractAddress, MyNFTABI.abi, _provider);
    setContract(contractInstance);
  }, [contractAddress]);

  // Handle drag & drop
  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle file selection via input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleMintNFT = async () => {
    if (!contract || !provider) {
      setMintStatus("Contract not loaded.");
      return;
    }
    if (recipientAddress.trim() === "") {
      setMintStatus("Please enter a valid recipient address.");
      return;
    }
    if (!selectedFile) {
      setMintStatus("Please select an image file.");
      return;
    }

    try {
      setLoading(true);
      setMintStatus("Minting NFT...");
      // Get the signer (Account #0 from your local Hardhat node)
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      // In this simple example, we are not uploading the image.
      // We call mintNFT(recipientAddress) as our contract only mints based on the recipient.
      const tx = await contractWithSigner.mintNFT(recipientAddress);
      await tx.wait();
      setMintStatus("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMintStatus("Error minting NFT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl text-blue-500 font-bold text-center mb-6">Mint Your NFT</h1>
        <p className="text-center text-gray-600 mb-4">
          Contract Address: <br /> {contractAddress}
        </p>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md p-4 mb-4 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="mx-auto h-48 object-contain" />
          ) : (
            <p className="text-gray-500">
              Drag & Drop an image here, or click below to select
            </p>
          )}
          <input 
            type="file"
            accept="image/*"
            className="mt-4 w-full text-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
            onChange={handleFileSelect}
          />
        </div> 
        <div className="mb-4">
          <input
            type="text"
            placeholder="Recipient Address (e.g., 0x...)"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={handleMintNFT}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors"
        >
          {loading ? "Minting..." : "Mint NFT"}
        </button>
        {mintStatus && (
          <p className="mt-4 text-center text-sm text-gray-800">{mintStatus}</p>
        )}
      </div>
    </div>
  );
}
