
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Vote, CheckCircle, Shield, Clock } from "lucide-react";

interface Election {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  totalVotes: number;
  candidates: Array<{
    id: string;
    name: string;
    party: string;
    votes: number;
  }>;
}

interface VotingInterfaceProps {
  election: Election;
  onBack: () => void;
  onVoteSubmitted: () => void;
}

export const VotingInterface = ({ election, onBack, onVoteSubmitted }: VotingInterfaceProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [voterCode, setVoterCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    if (voterCode.trim()) {
      setIsAuthenticated(true);
    }
  };

  const handleVoteSubmission = () => {
    if (!selectedCandidate) {
      alert("Please select a candidate before submitting your vote.");
      return;
    }

    // In a real application, this would submit the vote to a backend
    console.log(`Vote submitted for candidate: ${selectedCandidate}`);
    setHasVoted(true);
    
    // Simulate vote processing delay
    setTimeout(() => {
      onVoteSubmitted();
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Voter Authentication</CardTitle>
            <CardDescription>
              Enter your voter code to access the ballot for: <br />
              <strong>{election.title}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="voterCode">Voter Code</Label>
              <input
                id="voterCode"
                type="text"
                placeholder="Enter your unique voter code"
                value={voterCode}
                onChange={(e) => setVoterCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={onBack} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleAuthentication} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Authenticate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for participating in: <br />
              <strong>{election.title}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your vote has been securely recorded and will be counted in the final results.
            </p>
            <Button onClick={onBack} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button onClick={onBack} variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center">
              <Vote className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Cast Your Vote</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Election Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{election.title}</CardTitle>
              <CardDescription className="text-base">
                {election.description}
              </CardDescription>
              <div className="flex items-center text-sm text-gray-600 mt-4">
                <Clock className="w-4 h-4 mr-2" />
                Election ends: {new Date(election.endDate).toLocaleDateString()} at 11:59 PM
              </div>
            </CardHeader>
          </Card>

          {/* Ballot */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Candidate</CardTitle>
              <CardDescription>
                Choose one candidate to cast your vote. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                <div className="space-y-4">
                  {election.candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value={candidate.id} id={candidate.id} />
                      <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-lg text-gray-900">{candidate.name}</p>
                            <p className="text-gray-600">{candidate.party}</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Security & Privacy</h3>
                  <p className="text-blue-800 text-sm">
                    Your vote is encrypted and anonymous. Once submitted, it cannot be changed or traced back to you. 
                    All votes are securely stored and will be counted accurately in the final results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button onClick={onBack} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleVoteSubmission}
              disabled={!selectedCandidate}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              <Vote className="w-4 h-4 mr-2" />
              Submit Vote
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
