from datetime import datetime
from backend.blockchain.block import Block
from backend.utils.json_db import load_data, save_data
import json
BLOCKCHAIN_FILE = "blockchain.json"

class Blockchain:
    def __init__(self):
        self.chain = self.load_chain()

    def load_chain(self):
        data = load_data(BLOCKCHAIN_FILE)
        if len(data) == 0:
            # If the JSON is empty, create the Genesis Block
            genesis_block = Block(0, datetime.now().isoformat(), "GENESIS BLOCK", "0")
            save_data(BLOCKCHAIN_FILE, [genesis_block.to_dict()])
            return [genesis_block.to_dict()]
        return data

    def add_block(self, transaction):
        # 1. Get the last block in the chain to find its hash
        self.chain = self.load_chain()
        last_block = self.chain[-1]
        
        # 2. Create the new block
        new_index = last_block["index"] + 1
        timestamp = datetime.now().isoformat()
        previous_hash = last_block["hash"]
        
        new_block = Block(new_index, timestamp, transaction, previous_hash)
        
        # 3. Add to chain and save
        self.chain.append(new_block.to_dict())
        save_data(BLOCKCHAIN_FILE, self.chain)
        
        return new_block.to_dict()

    def is_chain_valid(self):
        self.chain = self.load_chain()
        
        # Loop through the chain starting from block 1 (skip genesis)
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # Re-calculate the hash of the current block's data to see if it matches
            block_string = f"{current_block['index']}{current_block['timestamp']}{json.dumps(current_block['transaction'], sort_keys=True)}{current_block['previous_hash']}"
            import hashlib
            calculated_hash = hashlib.sha256(block_string.encode()).hexdigest()

            # Rule 1: Has the data in this block been tampered with?
            if current_block["hash"] != calculated_hash:
                return False, f"Data tampered in block {current_block['index']}"
                
            # Rule 2: Does it point to the correct previous block?
            if current_block["previous_hash"] != previous_block["hash"]:
                return False, f"Broken link between block {previous_block['index']} and {current_block['index']}"
                
        return True, "Blockchain is valid."