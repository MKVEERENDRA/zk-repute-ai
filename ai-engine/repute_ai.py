# ai-engine/repute_ai.py
# AI module for composite ZK reputation logic

class ReputeAI:
    def __init__(self, min_valid=3):
        self.min_valid = min_valid

    def score_hash(self, score, secret):
        # Simple hash for demo; replace with MiMC/Pedersen in ZK
        return hash((score, secret))

    def check_valid(self, score, threshold):
        return int(score >= threshold)

    def composite_decision(self, scores, thresholds, secrets):
        """
        scores: dict of {source: score}
        thresholds: dict of {source: threshold}
        secrets: dict of {source: secret}
        Returns: {
            'hashes': {source: hash},
            'valids': {source: 0/1},
            'final_valid': 0/1,
            'total_valid': int
        }
        """
        hashes = {}
        valids = {}

        for source in scores:
            hashes[source] = self.score_hash(scores[source], secrets[source])
            valids[source] = self.check_valid(scores[source], thresholds[source])

        total_valid = sum(valids.values())
        final_valid = int(total_valid >= self.min_valid)

        return {
            'hashes': hashes,
            'valids': valids,
            'final_valid': final_valid,
            'total_valid': total_valid
        }

# Example usage
if __name__ == '__main__':
    ai = ReputeAI(min_valid=3)
    scores = {
        'github': 187,
        'twitter': 120,
        'poap': 40,
        'upi': 100000,
        'stackoverflow': 150
    }
    thresholds = {
        'github': 100,
        'twitter': 80,
        'poap': 10,
        'upi': 50000,
        'stackoverflow': 100
    }
    secrets = {
        'github': 12345,
        'twitter': 67890,
        'poap': 33445,
        'upi': 24680,
        'stackoverflow': 77889
    }
    result = ai.composite_decision(scores, thresholds, secrets)
    print(result)
