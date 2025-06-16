
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BarChart3, Users, Trophy, Download } from "lucide-react";

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

interface ResultsDashboardProps {
  election: Election;
  onBack: () => void;
}

export const ResultsDashboard = ({ election, onBack }: ResultsDashboardProps) => {
  const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates[0];
  const maxVotes = Math.max(...election.candidates.map(c => c.votes));

  const getPercentage = (votes: number) => {
    return election.totalVotes > 0 ? ((votes / election.totalVotes) * 100).toFixed(1) : '0';
  };

  const getProgressColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

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
                <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Election Results</h1>
              </div>
            </div>
            <Button variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Election Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{election.title}</CardTitle>
              <CardDescription className="text-base">
                {election.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{election.totalVotes}</p>
                  <p className="text-gray-600">Total Votes</p>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{election.candidates.length}</p>
                  <p className="text-gray-600">Candidates</p>
                </div>
                <div className="text-center">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-gray-900">{winner?.name || 'TBD'}</p>
                  <p className="text-gray-600">Leading Candidate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Vote Breakdown</CardTitle>
              <CardDescription>
                Detailed results showing vote counts and percentages for each candidate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sortedCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                        <div>
                          <p className="font-semibold text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{candidate.votes}</p>
                        <p className="text-sm text-gray-600">{getPercentage(candidate.votes)}%</p>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={election.totalVotes > 0 ? (candidate.votes / election.totalVotes) * 100 : 0}
                        className="h-3"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visual Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Results</CardTitle>
              <CardDescription>
                Graphical representation of the election results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive chart would be displayed here</p>
                  <p className="text-sm text-gray-500">Showing vote distribution and trends</p>
                </div>
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
                    <p className="text-sm text-gray-600">{new Date(election.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${election.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="font-medium">Election {election.status === 'completed' ? 'Ended' : 'Ends'}</p>
                    <p className="text-sm text-gray-600">{new Date(election.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
