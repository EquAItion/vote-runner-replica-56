
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Vote, CheckCircle, Shield, Clock, User } from "lucide-react";

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
    profilePicture?: string;
  }>;
}

interface VotingInterfaceProps {
  elections: Election[];
  onBack: () => void;
  onVoteSubmitted: () => void;
  voterInfo: {
    firstName: string;
    lastName: string;
    email: string;
    voterId: string;
  };
}

export const VotingInterface = ({ elections, onBack, onVoteSubmitted, voterInfo }: VotingInterfaceProps) => {
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeElections = elections.filter(election => election.status === 'active');

  const handleCandidateSelect = (electionId: string, candidateId: string) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [electionId]: candidateId
    }));
  };

  const handleVoteSubmission = () => {
    const incompleteElections = activeElections.filter(election => !selectedCandidates[election.id]);
    
    if (incompleteElections.length > 0) {
      alert(`Please select a candidate for: ${incompleteElections.map(e => e.title).join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    console.log('Votes submitted:', selectedCandidates);
    
    setTimeout(() => {
      setHasVoted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        onVoteSubmitted();
      }, 2000);
    }, 2000);
  };

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Votes Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for participating in {activeElections.length} election{activeElections.length > 1 ? 's' : ''}.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your votes have been securely recorded and will be counted in the final results.
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button onClick={onBack} variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center">
                <Vote className="w-6 h-6 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Cast Your Votes</h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Voter: {voterInfo.firstName} {voterInfo.lastName}</p>
              <p className="text-xs text-gray-500">ID: {voterInfo.voterId}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Voting Instructions</h3>
                  <p className="text-blue-800 text-sm">
                    You have been approved to vote in {activeElections.length} active election{activeElections.length > 1 ? 's' : ''}. 
                    Select one candidate from each election below. All votes will be submitted together.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Elections */}
          {activeElections.map((election) => (
            <Card key={election.id}>
              <CardHeader>
                <CardTitle className="text-xl">{election.title}</CardTitle>
                <CardDescription>
                  {election.description}
                </CardDescription>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Election ends: {new Date(election.endDate).toLocaleDateString()} at 11:59 PM
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedCandidates[election.id] || ""} 
                  onValueChange={(value) => handleCandidateSelect(election.id, value)}
                >
                  <div className="space-y-4">
                    {election.candidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value={candidate.id} id={`${election.id}-${candidate.id}`} />
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={candidate.profilePicture} alt={candidate.name} />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <Label htmlFor={`${election.id}-${candidate.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-semibold text-lg text-gray-900">{candidate.name}</p>
                            <p className="text-gray-600">{candidate.party}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button onClick={onBack} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleVoteSubmission}
              disabled={isSubmitting || activeElections.some(e => !selectedCandidates[e.id])}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              {isSubmitting ? (
                <>
                  <Vote className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Votes...
                </>
              ) : (
                <>
                  <Vote className="w-4 h-4 mr-2" />
                  Submit All Votes ({activeElections.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
