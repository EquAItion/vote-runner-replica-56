
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Vote, Users, BarChart3, Settings, Clock, CheckCircle, Shield, UserCheck, List } from "lucide-react";
import { ElectionCreator } from "@/components/ElectionCreator";
import { VotingInterface } from "@/components/VotingInterface";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { VoterCodeGenerator } from "@/components/VoterCodeGenerator";
import { VoterVerification } from "@/components/VoterVerification";
import { VoterList } from "@/components/VoterList";

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

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'vote' | 'results' | 'codes' | 'verification' | 'voterlist'>('dashboard');
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [elections, setElections] = useState<Election[]>([
    {
      id: '1',
      title: 'Student Body President Election 2024',
      description: 'Annual election for student body president and vice president positions.',
      status: 'active',
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
    }
  ]);

  const addElection = (election: Omit<Election, 'id' | 'totalVotes' | 'candidates'>) => {
    const newElection: Election = {
      ...election,
      id: Date.now().toString(),
      totalVotes: 0,
      candidates: []
    };
    setElections([...elections, newElection]);
    setCurrentView('dashboard');
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

  if (currentView === 'create') {
    return <ElectionCreator onBack={() => setCurrentView('dashboard')} onSave={addElection} />;
  }

  if (currentView === 'vote' && selectedElection) {
    return (
      <VotingInterface 
        election={selectedElection} 
        onBack={() => setCurrentView('dashboard')}
        onVoteSubmitted={() => {
          setCurrentView('dashboard');
        }}
      />
    );
  }

  if (currentView === 'results' && selectedElection) {
    return (
      <ResultsDashboard 
        election={selectedElection} 
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'codes') {
    return (
      <VoterCodeGenerator 
        elections={elections} 
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'verification') {
    return (
      <VoterVerification 
        elections={elections} 
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'voterlist') {
    return (
      <VoterList 
        elections={elections} 
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Vote className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">ElectionRunner</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setCurrentView('voterlist')}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <List className="w-4 h-4 mr-2" />
                Voter List
              </Button>
              <Button
                onClick={() => setCurrentView('verification')}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Voter Verification
              </Button>
              <Button
                onClick={() => setCurrentView('codes')}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Shield className="w-4 h-4 mr-2" />
                Generate Voter Codes
              </Button>
              <Button
                onClick={() => setCurrentView('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Election
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Vote className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Elections</p>
                  <p className="text-2xl font-bold text-gray-900">{elections.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {elections.reduce((sum, e) => sum + e.totalVotes, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Elections</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {elections.filter(e => e.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {elections.filter(e => e.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Elections List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Elections</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {elections.map((election) => (
              <Card key={election.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">
                        {election.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mb-3">
                        {election.description}
                      </CardDescription>
                    </div>
                    <Badge className={`ml-2 ${getStatusColor(election.status)} flex items-center`}>
                      {getStatusIcon(election.status)}
                      <span className="ml-1 capitalize">{election.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-medium">{new Date(election.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-medium">{new Date(election.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Votes</span>
                      <span className="font-bold text-lg text-blue-600">{election.totalVotes}</span>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      {election.status === 'active' && (
                        <Button
                          onClick={() => {
                            setSelectedElection(election);
                            setCurrentView('vote');
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Vote className="w-4 h-4 mr-2" />
                          Vote Now
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => {
                          setSelectedElection(election);
                          setCurrentView('results');
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Results
                      </Button>
                      
                      <Button variant="outline" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
