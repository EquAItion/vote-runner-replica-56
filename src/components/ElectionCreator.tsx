
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Plus, X } from "lucide-react";

interface ElectionCreatorProps {
  onBack: () => void;
  onSave: (election: {
    title: string;
    description: string;
    status: 'draft' | 'active' | 'completed';
    startDate: string;
    endDate: string;
  }) => void;
}

interface Candidate {
  name: string;
  party: string;
}

export const ElectionCreator = ({ onBack, onSave }: ElectionCreatorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([
    { name: "", party: "" }
  ]);

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", party: "" }]);
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const updateCandidate = (index: number, field: keyof Candidate, value: string) => {
    const updated = candidates.map((candidate, i) => 
      i === index ? { ...candidate, [field]: value } : candidate
    );
    setCandidates(updated);
  };

  const handleSave = () => {
    if (!title || !description || !startDate || !endDate) {
      alert("Please fill in all required fields");
      return;
    }

    const validCandidates = candidates.filter(c => c.name.trim() && c.party.trim());
    if (validCandidates.length < 2) {
      alert("Please add at least 2 candidates with names and parties");
      return;
    }

    onSave({
      title,
      description,
      status: 'draft',
      startDate,
      endDate
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Election</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the basic details about your election
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Election Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Student Body President Election 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and context of this election..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Candidates</CardTitle>
                  <CardDescription>
                    Add the candidates who will be running in this election
                  </CardDescription>
                </div>
                <Button onClick={addCandidate} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate, index) => (
                  <div key={index} className="flex items-end space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor={`candidate-name-${index}`}>Candidate Name</Label>
                      <Input
                        id={`candidate-name-${index}`}
                        placeholder="Enter candidate name"
                        value={candidate.name}
                        onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Label htmlFor={`candidate-party-${index}`}>Party/Affiliation</Label>
                      <Input
                        id={`candidate-party-${index}`}
                        placeholder="Enter party or affiliation"
                        value={candidate.party}
                        onChange={(e) => updateCandidate(index, 'party', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    {candidates.length > 1 && (
                      <Button
                        onClick={() => removeCandidate(index)}
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button onClick={onBack} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Election
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
