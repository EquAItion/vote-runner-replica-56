
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Vote, Users, BarChart3, Settings, ArrowLeft, CheckCircle, Clock, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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

export const ElectionCommissionerPanel = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'manage' | 'voters'>('dashboard');
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

  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: ['']
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const addCandidate = () => {
    setNewElection({
      ...newElection,
      candidates: [...newElection.candidates, '']
    });
  };

  const updateCandidate = (index: number, value: string) => {
    const updatedCandidates = [...newElection.candidates];
    updatedCandidates[index] = value;
    setNewElection({
      ...newElection,
      candidates: updatedCandidates
    });
  };

  const removeCandidate = (index: number) => {
    if (newElection.candidates.length > 1) {
      const updatedCandidates = newElection.candidates.filter((_, i) => i !== index);
      setNewElection({
        ...newElection,
        candidates: updatedCandidates
      });
    }
  };

  const createElection = () => {
    if (!newElection.title.trim() || !newElection.description.trim() || !newElection.startDate || !newElection.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const filteredCandidates = newElection.candidates.filter(c => c.trim() !== '');
    if (filteredCandidates.length < 2) {
      toast({
        title: "Validation Error",
        description: "Please add at least 2 candidates",
        variant: "destructive"
      });
      return;
    }

    // Convert candidate names to full candidate objects
    const candidateObjects = filteredCandidates.map((name, index) => ({
      id: (Date.now() + index).toString(),
      name: name,
      party: 'Independent', // Default party
      votes: 0
    }));

    const election: Election = {
      id: Date.now().toString(),
      title: newElection.title,
      description: newElection.description,
      status: 'draft',
      startDate: newElection.startDate,
      endDate: newElection.endDate,
      totalVotes: 0,
      candidates: candidateObjects
    };

    setElections([...elections, election]);
    setNewElection({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      candidates: ['']
    });
    setCurrentView('dashboard');

    toast({
      title: "Election Created",
      description: "New election has been created successfully",
    });
  };

  const updateElectionStatus = (id: string, status: Election['status']) => {
    setElections(elections.map(e => 
      e.id === id ? { ...e, status } : e
    ));
    toast({
      title: "Status Updated",
      description: `Election status changed to ${status}`,
    });
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

  // Show voter list view
  if (currentView === 'voters') {
    return <VoterList elections={elections} onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button onClick={() => navigate('/')} variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-purple-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Election Commissioner Panel</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setCurrentView('voters')}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Voter List
              </Button>
              <Button
                onClick={() => setCurrentView('create')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Election
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'create' ? (
          <Card>
            <CardHeader>
              <CardTitle>Create New Election</CardTitle>
              <CardDescription>
                Set up a new election with candidates and schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Election Title</Label>
                <Input
                  id="title"
                  value={newElection.title}
                  onChange={(e) => setNewElection({...newElection, title: e.target.value})}
                  placeholder="Enter election title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newElection.description}
                  onChange={(e) => setNewElection({...newElection, description: e.target.value})}
                  placeholder="Enter election description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newElection.startDate}
                    onChange={(e) => setNewElection({...newElection, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newElection.endDate}
                    onChange={(e) => setNewElection({...newElection, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Candidates</Label>
                <div className="space-y-3 mt-2">
                  {newElection.candidates.map((candidate, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={candidate}
                        onChange={(e) => updateCandidate(index, e.target.value)}
                        placeholder={`Candidate ${index + 1} name`}
                        className="flex-1"
                      />
                      {newElection.candidates.length > 1 && (
                        <Button
                          onClick={() => removeCandidate(index)}
                          variant="outline"
                          size="sm"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button onClick={addCandidate} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Candidate
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => setCurrentView('dashboard')} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={createElection} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  Create Election
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Vote className="w-8 h-8 text-purple-600" />
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

            {/* Elections Management */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Elections</h2>
              
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
                          <span className="text-gray-600">Candidates</span>
                          <span className="font-bold text-lg text-purple-600">{election.candidates.length}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Votes</span>
                          <span className="font-bold text-lg text-blue-600">{election.totalVotes}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 pt-4">
                          {election.status === 'draft' && (
                            <Button
                              onClick={() => updateElectionStatus(election.id, 'active')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Start Election
                            </Button>
                          )}
                          
                          {election.status === 'active' && (
                            <Button
                              onClick={() => updateElectionStatus(election.id, 'completed')}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              End Election
                            </Button>
                          )}
                          
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Results
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ElectionCommissionerPanel;
