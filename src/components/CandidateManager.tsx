
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Plus, Upload, User, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  profilePicture?: string;
}

interface Election {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  totalVotes: number;
  candidates: Candidate[];
}

interface CandidateManagerProps {
  election: Election;
  onBack: () => void;
  onUpdateElection: (election: Election) => void;
}

export const CandidateManager = ({ election, onBack, onUpdateElection }: CandidateManagerProps) => {
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    profilePicture: ''
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  const { toast } = useToast();

  const handleProfilePictureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfilePictureFile(file);
      setProfilePicturePreview(result);
      setNewCandidate(prev => ({ ...prev, profilePicture: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Candidate name is required",
        variant: "destructive"
      });
      return;
    }

    if (!newCandidate.party.trim()) {
      toast({
        title: "Validation Error",
        description: "Party name is required",
        variant: "destructive"
      });
      return;
    }

    const candidate: Candidate = {
      id: Date.now().toString(),
      name: newCandidate.name.trim(),
      party: newCandidate.party.trim(),
      votes: 0,
      profilePicture: newCandidate.profilePicture || undefined
    };

    const updatedElection = {
      ...election,
      candidates: [...election.candidates, candidate]
    };

    onUpdateElection(updatedElection);

    // Reset form
    setNewCandidate({ name: '', party: '', profilePicture: '' });
    setProfilePictureFile(null);
    setProfilePicturePreview("");

    toast({
      title: "Success",
      description: "Candidate added successfully",
    });
  };

  const handleRemoveCandidate = (candidateId: string) => {
    const updatedElection = {
      ...election,
      candidates: election.candidates.filter(c => c.id !== candidateId)
    };
    onUpdateElection(updatedElection);

    toast({
      title: "Success",
      description: "Candidate removed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button onClick={onBack} variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Election
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Manage Candidates</h1>
              <p className="text-sm text-gray-600">{election.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Candidate */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Candidate</CardTitle>
              <CardDescription>
                Add candidates with their profile pictures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="text-center">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <div className="mt-2 flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={profilePicturePreview} alt="Preview" />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProfilePictureUpload(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('profilePicture')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              {/* Candidate Details */}
              <div>
                <Label htmlFor="candidateName">Full Name</Label>
                <Input
                  id="candidateName"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter candidate's full name"
                />
              </div>

              <div>
                <Label htmlFor="candidateParty">Party/Affiliation</Label>
                <Input
                  id="candidateParty"
                  value={newCandidate.party}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, party: e.target.value }))}
                  placeholder="Enter party or affiliation"
                />
              </div>

              <Button onClick={handleAddCandidate} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </CardContent>
          </Card>

          {/* Current Candidates */}
          <Card>
            <CardHeader>
              <CardTitle>Current Candidates ({election.candidates.length})</CardTitle>
              <CardDescription>
                Manage existing candidates for this election
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {election.candidates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No candidates added yet</p>
                  </div>
                ) : (
                  election.candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={candidate.profilePicture} alt={candidate.name} />
                        <AvatarFallback>
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{candidate.name}</p>
                        <p className="text-sm text-gray-600">{candidate.party}</p>
                        {election.status !== 'draft' && (
                          <p className="text-xs text-gray-500">Votes: {candidate.votes}</p>
                        )}
                      </div>
                      {election.status === 'draft' && (
                        <Button
                          onClick={() => handleRemoveCandidate(candidate.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
