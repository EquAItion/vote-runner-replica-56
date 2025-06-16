
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Vote, User, ArrowLeft } from "lucide-react";
import { VotingInterface } from "./VotingInterface";

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

interface ApprovedVoter {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  voterId: string;
  isApproved: boolean;
  hasVoted: boolean;
  approvedAt?: string;
}

interface ApprovedVoterInterfaceProps {
  onBack: () => void;
}

export const ApprovedVoterInterface = ({ onBack }: ApprovedVoterInterfaceProps) => {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'voting'>('login');
  const [voterCode, setVoterCode] = useState("");
  const [currentVoter, setCurrentVoter] = useState<ApprovedVoter | null>(null);
  const [elections, setElections] = useState<Election[]>([
    {
      id: '1',
      title: 'Student Body President Election 2024',
      description: 'Choose the next student body president',
      status: 'active',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      totalVotes: 1247,
      candidates: [
        { 
          id: '1', 
          name: 'Sarah Johnson', 
          party: 'Progressive Party', 
          votes: 543,
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b9c7a2b4?w=150&h=150&fit=crop&crop=face'
        },
        { 
          id: '2', 
          name: 'Mike Chen', 
          party: 'Unity Coalition', 
          votes: 421,
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        { 
          id: '3', 
          name: 'Emma Davis', 
          party: 'Student First', 
          votes: 283,
          profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        }
      ]
    },
    {
      id: '2',
      title: 'Class Representative Election',
      description: 'Select your class representative',
      status: 'active',
      startDate: '2024-06-10',
      endDate: '2024-06-25',
      totalVotes: 456,
      candidates: [
        { 
          id: '4', 
          name: 'Robert Smith', 
          party: 'Independent', 
          votes: 245,
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        { 
          id: '5', 
          name: 'Lisa Wong', 
          party: 'Reform Group', 
          votes: 211,
          profilePicture: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face'
        }
      ]
    }
  ]);

  // Mock approved voters data
  const [approvedVoters] = useState<ApprovedVoter[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      voterId: 'VOTER001',
      isApproved: true,
      hasVoted: false,
      approvedAt: '2024-06-15T10:30:00Z'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      voterId: 'VOTER002',
      isApproved: true,
      hasVoted: false,
      approvedAt: '2024-06-15T11:45:00Z'
    }
  ]);

  const handleLogin = () => {
    const voter = approvedVoters.find(v => v.voterId === voterCode && v.isApproved);
    if (voter) {
      setCurrentVoter(voter);
      setCurrentView('dashboard');
    } else {
      alert('Invalid voter code or voter not approved by commissioner');
    }
  };

  const handleStartVoting = () => {
    setCurrentView('voting');
  };

  const handleVoteSubmitted = () => {
    if (currentVoter) {
      setCurrentVoter({ ...currentVoter, hasVoted: true });
    }
    setCurrentView('dashboard');
  };

  const activeElections = elections.filter(e => e.status === 'active');

  if (currentView === 'voting' && currentVoter) {
    return (
      <VotingInterface
        elections={elections}
        onBack={() => setCurrentView('dashboard')}
        onVoteSubmitted={handleVoteSubmitted}
        voterInfo={currentVoter}
      />
    );
  }

  if (currentView === 'dashboard' && currentVoter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button onClick={onBack} variant="ghost" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <div className="flex items-center">
                  <Vote className="w-6 h-6 text-blue-600 mr-3" />
                  <h1 className="text-xl font-bold text-gray-900">Voter Dashboard</h1>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Approved Voter
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Voter Info */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {currentVoter.firstName} {currentVoter.lastName}</CardTitle>
                <CardDescription>
                  Voter ID: {currentVoter.voterId} | Status: Approved
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Voting Status */}
            <Card>
              <CardHeader>
                <CardTitle>Voting Status</CardTitle>
                <CardDescription>
                  You are approved to vote in {activeElections.length} active election{activeElections.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentVoter.hasVoted ? (
                  <div className="flex items-center space-x-3 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">You have successfully voted in all elections</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-blue-600">
                      <Clock className="w-6 h-6" />
                      <span className="font-semibold">Ready to vote</span>
                    </div>
                    <Button 
                      onClick={handleStartVoting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Vote className="w-4 h-4 mr-2" />
                      Start Voting ({activeElections.length} elections)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Elections */}
            <Card>
              <CardHeader>
                <CardTitle>Active Elections</CardTitle>
                <CardDescription>
                  Elections you can participate in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeElections.map((election) => (
                    <div key={election.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{election.title}</h3>
                          <p className="text-gray-600 text-sm">{election.description}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            Ends: {new Date(election.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {election.candidates.length} candidates
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <CardTitle>Approved Voter Login</CardTitle>
          <CardDescription>
            Enter your voter ID to access your approved elections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="voterCode" className="block text-sm font-medium text-gray-700 mb-2">
              Voter ID
            </label>
            <input
              id="voterCode"
              type="text"
              placeholder="Enter your voter ID (e.g., VOTER001)"
              value={voterCode}
              onChange={(e) => setVoterCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={onBack} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={handleLogin} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Demo voter IDs: VOTER001, VOTER002
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
