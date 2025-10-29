
import abi from "./abi/MilestoneEscrow.json" assert { type: "json" };

const INFURA_PROJECT_ID = "3625eaa735484ae1b43203bef055b39b";
const NETWORK = "sepolia"; // Change to 'mainnet' when going live
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // Replace with your deployed one

let provider, signer, userAddress;

async function connectMetaMask() {
  if (!window.ethereum) {
    alert("MetaMask not found! Please install it.");
    return;
  }

  const browserProvider = new ethers.BrowserProvider(window.ethereum);
  await browserProvider.send("eth_requestAccounts", []);
  signer = await browserProvider.getSigner();
  userAddress = await signer.getAddress();
  document.querySelector(".btn-primary").innerHTML = `<i class="fas fa-wallet"></i> Connected: ${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
  return signer;
}

async function invest() {
  try {
    await connectMetaMask();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    const usdAmount = document.querySelector(".amount-input").value;
    const ethAmount = (usdAmount / 3500).toFixed(6); 

    const tx = await contract.deposit({
      value: ethers.parseEther(ethAmount.toString())
    });

    await tx.wait();
    alert(`✅ Investment Successful!\nTX Hash: ${tx.hash}`);
  } catch (err) {
    console.error(err);
    alert("❌ Transaction failed: " + err.message);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const investButton = document.querySelector(".btn-primary");
  if (investButton) {
    investButton.addEventListener("click", invest);
  }
});
