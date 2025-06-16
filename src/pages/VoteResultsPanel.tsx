
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Users, Vote, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export const VoteResultsPanel = () => {
  const [selectedElectionId, setSelectedElectionId] = useState<string>('1');
  const navigate = useNavigate();

  const elections: Election[] = [
    {
      id: '1',
      title: 'Student Body President Election 2024',
      description: 'Annual election for student body president and vice president positions.',
      status: 'completed',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      totalVotes: 1247,
      candidates: [
        { id: '1', name: 'Sarah Johnson', party: 'Progressive Party', votes: 543 },
        { id: '2', name: 'Mike Chen', party: 'Unity Coalition', votes: 421 },
        { id: '3', name: 'Emma Davis', party: 'Student First', votes: 283 }
      ]
    },
    {
      id: '2',
      title: 'Board of Directors Election',
      description: 'Quarterly election for company board positions.',
      status: 'completed',
      startDate: '2024-05-01',
      endDate: '2024-05-15',
      totalVotes: 856,
      candidates: [
        { id: '4', name: 'Robert Smith', party: 'Independent', votes: 445 },
        { id: '5', name: 'Lisa Wong', party: 'Reform Group', votes: 411 }
      ]
    },
    {
      id: '3',
      title: 'Student Council Election 2024',
      description: 'Semi-annual student council representative election.',
      status: 'active',
      startDate: '2024-06-10',
      endDate: '2024-06-25',
      totalVotes: 892,
      candidates: [
        { id: '6', name: 'Alex Rodriguez', party: 'Student Voice', votes: 324 },
        { id: '7', name: 'Maria Garcia', party: 'Future Leaders', votes: 298 },
        { id: '8', name: 'James Wilson', party: 'Progressive Unity', votes: 270 }
      ]
    }
  ];

  const selectedElection = elections.find(e => e.id === selectedElectionId);
  
  if (!selectedElection) {
    return <div>Election not found</div>;
  }

  const sortedCandidates = [...selectedElection.candidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates[0];

  const getPercentage = (votes: number) => {
    return selectedElection.totalVotes > 0 ? ((votes / selectedElection.totalVotes) * 100).toFixed(1) : '0';
  };

  const getStatusIcon = (status: Election['status']) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'active': return <Vote className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: Election['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button onClick={() => navigate('/')} variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 text-green-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Vote Results Panel</h1>
              </div>
            </div>
            <div className="w-64">
              <Select value={selectedElectionId} onValueChange={setSelectedElectionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an election" />
                </SelectTrigger>
                <SelectContent>
                  {elections.map((election) => (
                    <SelectItem key={election.id} value={election.id}>
                      {election.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Election Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl">{selectedElection.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {selectedElection.description}
                  </CardDescription>
                </div>
                <Badge className={`ml-4 ${getStatusColor(selectedElection.status)} flex items-center`}>
                  {getStatusIcon(selectedElection.status)}
                  <span className="ml-1 capitalize">{selectedElection.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedElection.totalVotes}</p>
                  <p className="text-gray-600">Total Votes</p>
                </div>
                <div className="text-center">
                  <Vote className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedElection.candidates.length}</p>
                  <p className="text-gray-600">Candidates</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-gray-900">{winner?.name || 'TBD'}</p>
                  <p className="text-gray-600">
                    {selectedElection.status === 'completed' ? 'Winner' : 'Leading'}
                  </p>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{getPercentage(winner?.votes || 0)}%</p>
                  <p className="text-gray-600">Leading Vote Share</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedElection.status === 'completed' ? 'Final Results' : 'Live Results'}
                  </CardTitle>
                  <CardDescription>
                    {selectedElection.status === 'completed' 
                      ? 'Final vote counts and percentages' 
                      : 'Real-time vote counts (updates every 5 minutes)'}
                  </CardDescription>
                </div>
                {selectedElection.status === 'active' && (
                  <Badge variant="outline" className="text-green-600 border-green-600 animate-pulse">
                    Live Updates
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sortedCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {index === 0 && selectedElection.status === 'completed' && (
                          <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                        )}
                        {index === 0 && selectedElection.status === 'active' && (
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold animate-pulse">
                            1
                          </div>
                        )}
                        {index > 0 && (
                          <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-lg text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">{candidate.votes.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{getPercentage(candidate.votes)}%</p>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={selectedElection.totalVotes > 0 ? (candidate.votes / selectedElection.totalVotes) * 100 : 0}
                        className="h-4"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Election Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Election Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Election Started</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedElection.startDate).toLocaleDateString()} at 12:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${
                    selectedElection.status === 'completed' ? 'bg-green-500' : 
                    selectedElection.status === 'active' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium">
                      Election {selectedElection.status === 'completed' ? 'Ended' : 'Ends'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedElection.endDate).toLocaleDateString()} at 11:59 PM
                    </p>
                  </div>
                </div>
                {selectedElection.status === 'completed' && (
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Results Finalized</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedElection.endDate).toLocaleDateString()} at 12:15 AM
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Visual Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Analytics</CardTitle>
              <CardDescription>
                Detailed charts and graphs showing voting patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Interactive Charts Coming Soon</p>
                  <p className="text-sm text-gray-500">Pie charts, bar graphs, and voting trend analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VoteResultsPanel;
