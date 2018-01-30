const SHA256 = require('crypto-js/sha256');

class Block{
	
	/***
	 * Index = position of block on the block chain
	 * timestamp - time when the block was created
	 * data - any data
	 * previousHash - hash of the block before this block
	 */
	constructor(index, timestamp, data, previousHash = '')
	{
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}
	
	calculateHash(){
		return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
	}
}

class BlockChain{
	
	constructor()
	{
		this.chain = [this.createGenesisBlock()];
	}
	
	createGenesisBlock(){
		return new Block(0, "30/Jan/2018", "Genesis Block", "0");
	}
	
	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}
	
	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}
	
	isChainValid()
	{
		for(let i = 1; i < this.chain.length; i++){
			let currentBlock = this.chain[i];
			let previousBlock = this.chain[i - 1];
			if((currentBlock.hash != currentBlock.calculateHash()) || (currentBlock.previousHash != previousBlock.hash)){
				return false;
			}
		}
	
		return true;
	}
}

let Gcoin = new BlockChain();
Gcoin.addBlock(new Block(1, "30/Jan/2018", {amount:4}, "0"));
Gcoin.addBlock(new Block(1, "31/Jan/2018", {amount:10}, "0"));

console.log(JSON.stringify(Gcoin, null, 4));
console.log("chain validity: ", Gcoin.isChainValid());

Gcoin.chain[1].data = "modified";
console.log("chain validity: ", Gcoin.isChainValid());