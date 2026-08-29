import hashlib
import json

class Block:
    def __init__(self, index, timestamp, transaction, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.transaction = transaction
        self.previous_hash = previous_hash
        # Calculate the fingerprint as soon as the block is created
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        # We combine all the block's data into one single string
        block_string = f"{self.index}{self.timestamp}{json.dumps(self.transaction, sort_keys=True)}{self.previous_hash}"
        # Then we run it through the SHA-256 math formula
        return hashlib.sha256(block_string.encode()).hexdigest()
        
    def to_dict(self):
        # Helper to convert the block into a dictionary so we can save it to JSON
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "transaction": self.transaction,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }