const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Collection Contract", function () {
  let collection;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    console.log("Owner Address:", owner.address);  // In ra địa chỉ của owner
    console.log("Addr1 Address:", addr1.address);  // In ra địa chỉ của addr1
    console.log("Addr2 Address:", addr2.address);  // In ra địa chỉ của addr2
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);
    console.log("Address from private key:", wallet.address);
    // Deploy contract với các thông số truyền vào, bao gồm cả blockchainType "forma"
    const Collection = await ethers.getContractFactory("Collection");
    collection = await Collection.deploy(
      "MyNFTCollection", 
      "MNFT", 
      "A collection of unique NFTs", 
      "https://example.com/image.jpg",
      "forma"
    );
    await collection.waitForDeployment();
  });

  it("should deploy the contract with correct name, description, image URL, blockchainType, and creator", async function () {
    // Lấy đầy đủ 5 giá trị trả về từ getCollectionInfo()
    const [name, description, imageURL, blockchainType, creator] = await collection.getCollectionInfo();

    expect(name).to.equal("MyNFTCollection");
    expect(description).to.equal("A collection of unique NFTs");
    expect(imageURL).to.equal("https://example.com/image.jpg");
    expect(blockchainType).to.equal("forma");
    expect(creator).to.equal(owner.address);
  });
  it("should deploy the contract with the correct owner address", async function () {
    // Lấy địa chỉ của owner
    const ownerAddress = owner.address;
    
    // Kiểm tra rằng địa chỉ owner là chính xác
    console.log("Owner Address:", ownerAddress); // In ra địa chỉ của người deploy
  
    // Kiểm tra lại thông tin của creator (người deploy)
    const [, , , , creator] = await collection.getCollectionInfo();
    expect(creator).to.equal(ownerAddress); // Đảm bảo creator là người deploy
  });
  it("should mint a new NFT by the creator", async function () {
    const tokenURI = "https://example.com/metadata/1";
    
    // Kiểm tra rằng người không phải creator không thể mint
    await expect(collection.connect(addr1).mintNFT(tokenURI))
      .to.be.revertedWith("Only collection owner can mint");

    // Creator mint NFT thành công
    await collection.connect(owner).mintNFT(tokenURI);

    const tokenId = 1;
    const tokenOwner = await collection.ownerOf(tokenId);
    const tokenURIFromContract = await collection.tokenURI(tokenId);

    expect(tokenOwner).to.equal(owner.address);
    expect(tokenURIFromContract).to.equal(tokenURI);
  });

  it("should transfer ownership of the collection", async function () {
    // Owner chuyển giao quyền sở hữu collection sang addr1
    await collection.connect(owner).transferCollectionOwnership(addr1.address);

    // Vì hàm getCollectionInfo trả về 5 giá trị, nên lấy phần tử thứ 5 là creator mới
    const [, , , , newCreator] = await collection.getCollectionInfo();
    expect(newCreator).to.equal(addr1.address);
  });
});
