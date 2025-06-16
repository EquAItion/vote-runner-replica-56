
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Vote, User, Upload, Camera, FileText, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Candidate {
  id: string;
  name: string;
  party: string;
}

export const VoterPanel = () => {
  const [currentStep, setCurrentStep] = useState<'register' | 'vote' | 'success'>('register');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    voterId: ''
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const candidates: Candidate[] = [
    { id: '1', name: 'Sarah Johnson', party: 'Progressive Party' },
    { id: '2', name: 'Mike Chen', party: 'Unity Coalition' },
    { id: '3', name: 'Emma Davis', party: 'Student First' },
    { id: '4', name: 'Robert Smith', party: 'Independent' }
  ];

  const handleFileUpload = (file: File, type: 'document' | 'photo') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'document') {
        setDocumentFile(file);
        setDocumentPreview(result);
      } else {
        setPhotoFile(file);
        setPhotoPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateRegistration = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    if (!documentFile || !photoFile) {
      toast({
        title: "Validation Error",
        description: "Please upload both ID document and photo",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleRegistration = () => {
    if (!validateRegistration()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const voterId = `VTR${Date.now().toString().slice(-6)}`;
      setFormData({...formData, voterId});
      setIsSubmitting(false);
      setCurrentStep('vote');
      toast({
        title: "Registration Successful",
        description: `Your Voter ID is: ${voterId}`,
      });
    }, 2000);
  };

  const handleVote = () => {
    if (!selectedCandidate) {
      toast({
        title: "Selection Required",
        description: "Please select a candidate before submitting your vote",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep('success');
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded successfully",
      });
    }, 1500);
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for participating in the democratic process.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your vote has been securely recorded and will be counted in the final results.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button onClick={() => navigate('/')} variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center">
                <Vote className="w-6 h-6 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Voter Panel</h1>
              </div>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {currentStep === 'register' ? 'Registration' : 'Voting'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'register' ? (
          <Card>
            <CardHeader>
              <CardTitle>Voter Registration</CardTitle>
              <CardDescription>
                Register to vote by providing your information and verification documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>

              {/* Document Upload Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Identity Verification Documents</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID Document Upload */}
                  <div>
                    <Label htmlFor="document">ID Document</Label>
                    <div className="mt-2">
                      <input
                        id="document"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'document');
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400"
                        onClick={() => document.getElementById('document')?.click()}
                      >
                        {documentPreview ? (
                          <div className="text-center">
                            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-green-600">Document uploaded</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Upload ID Document</p>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <Label htmlFor="photo">Recent Photo</Label>
                    <div className="mt-2">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'photo');
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400"
                        onClick={() => document.getElementById('photo')?.click()}
                      >
                        {photoPreview ? (
                          <div className="text-center">
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                            />
                            <p className="text-sm text-green-600">Photo uploaded</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Upload Photo</p>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleRegistration} 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <User className="w-4 h-4 mr-2 animate-spin" />
                    Processing Registration...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Complete Registration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Cast Your Vote</CardTitle>
              <CardDescription>
                Select your preferred candidate for the Student Body President Election 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Voter Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Voter ID:</strong> {formData.voterId} | <strong>Name:</strong> {formData.firstName} {formData.lastName}
                  </p>
                </div>

                {/* Candidates */}
                <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                  <div className="space-y-4">
                    {candidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value={candidate.id} id={candidate.id} />
                        <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-semibold text-lg text-gray-900">{candidate.name}</p>
                            <p className="text-gray-600">{candidate.party}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <Button
                  onClick={handleVote}
                  disabled={!selectedCandidate || isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Vote className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Vote...
                    </>
                  ) : (
                    <>
                      <Vote className="w-4 h-4 mr-2" />
                      Submit Vote
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default VoterPanel;
