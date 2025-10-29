
import abi from "./abi/MilestoneEscrow.json" assert { type: "json" };

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";

// Replace with your MetaMask/Alchemy/Infura API key endpoint
const PROVIDER_URL = "https://mainnet.infura.io/v3/3625eaa735484ae1b43203bef055b39b"; 

let provider, signer, contract;

async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask not found. Please install MetaMask!");
        return;
    }
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();

    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    const userAddress = await signer.getAddress();
    alert("Connected: " + userAddress);
}

async function invest(amountInEth) {
    if (!contract) return alert("Please connect wallet first");

    try {
        const tx = await contract.deposit({
            value: ethers.parseEther(amountInEth.toString())
        });
        await tx.wait();
        alert("Investment successful!");
    } catch (err) {
        console.error(err);
        alert("Transaction failed.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.querySelector(".btn-primary");
    connectBtn.addEventListener("click", async () => {
        await connectWallet();
        await invest(0.01); 
    });
});
