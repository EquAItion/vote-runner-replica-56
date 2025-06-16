
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Shield, User, Mail, Phone, CheckCircle, Copy, Download, Upload, FileText, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface VoterVerificationProps {
  elections: Election[];
  onBack: () => void;
}

interface VoterRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  electionId: string;
  voterCode: string;
  registrationDate: string;
  hasVoted: boolean;
  documentUrl?: string;
  photoUrl?: string;
}

export const VoterVerification = ({ elections, onBack }: VoterVerificationProps) => {
  const [registrations, setRegistrations] = useState<VoterRegistration[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    electionId: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const { toast } = useToast();

  const generateVoterCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

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

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Valid email address is required",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.electionId) {
      toast({
        title: "Validation Error",
        description: "Please select an election",
        variant: "destructive"
      });
      return false;
    }
    if (!documentFile) {
      toast({
        title: "Validation Error",
        description: "ID document is required for verification",
        variant: "destructive"
      });
      return false;
    }
    if (!photoFile) {
      toast({
        title: "Validation Error",
        description: "Photo is required for verification",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleGenerateCode = async () => {
    if (!validateForm()) return;

    const existingRegistration = registrations.find(
      reg => reg.email === formData.email && reg.electionId === formData.electionId
    );

    if (existingRegistration) {
      toast({
        title: "Already Registered",
        description: "This email is already registered for the selected election",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const voterCode = generateVoterCode();
      const newRegistration: VoterRegistration = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        electionId: formData.electionId,
        voterCode,
        registrationDate: new Date().toISOString(),
        hasVoted: false,
        documentUrl: URL.createObjectURL(documentFile!),
        photoUrl: URL.createObjectURL(photoFile!)
      };

      setRegistrations([...registrations, newRegistration]);
      setGeneratedCode(voterCode);
      setIsGenerating(false);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        electionId: ''
      });
      setDocumentFile(null);
      setPhotoFile(null);
      setDocumentPreview("");
      setPhotoPreview("");

      toast({
        title: "Voter Code Generated",
        description: "Registration successful! Your identity has been verified and voter code generated.",
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Voter code copied to clipboard",
    });
  };

  const exportRegistrations = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Election', 'Voter Code', 'Registration Date', 'Voted', 'Verified'],
      ...registrations.map(reg => {
        const election = elections.find(e => e.id === reg.electionId);
        return [
          `${reg.firstName} ${reg.lastName}`,
          reg.email,
          reg.phone,
          election?.title || 'Unknown',
          reg.voterCode,
          new Date(reg.registrationDate).toLocaleDateString(),
          reg.hasVoted ? 'Yes' : 'No',
          'Yes'
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'verified_voter_registrations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getElectionTitle = (electionId: string) => {
    const election = elections.find(e => e.id === electionId);
    return election?.title || 'Unknown Election';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button onClick={onBack} variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Voter Verification</h1>
              </div>
            </div>
            {registrations.length > 0 && (
              <Button onClick={exportRegistrations} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Verified Voters
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Voter Registration & Verification</CardTitle>
                <CardDescription>
                  Complete voter registration with identity verification to receive your unique voter code
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

                <div>
                  <Label htmlFor="election">Select Election</Label>
                  <Select value={formData.electionId} onValueChange={(value) => setFormData({...formData, electionId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an election" />
                    </SelectTrigger>
                    <SelectContent>
                      {elections.filter(e => e.status === 'active' || e.status === 'draft').map((election) => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Upload Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Identity Verification Documents</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ID Document Upload */}
                    <div>
                      <Label htmlFor="document">ID Document (Driver's License, Passport, etc.)</Label>
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
                              <p className="text-sm text-gray-600">Click to upload ID document</p>
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
                              <p className="text-sm text-gray-600">Click to upload photo</p>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateCode} 
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Shield className="w-4 h-4 mr-2 animate-spin" />
                      Verifying & Generating Code...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Verify Identity & Generate Voter Code
                    </>
                  )}
                </Button>

                {generatedCode && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                          <p className="font-semibold text-green-900">Identity Verified & Code Generated</p>
                          <p className="text-2xl font-mono font-bold text-green-800">{generatedCode}</p>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(generatedCode)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Verified Voters List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Verified Voters</CardTitle>
                <CardDescription>
                  Recently verified voter registrations ({registrations.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {registrations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No verified voters yet</p>
                      <p className="text-sm">Verified registrations will appear here</p>
                    </div>
                  ) : (
                    registrations.map((registration) => (
                      <Card key={registration.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold">{registration.firstName} {registration.lastName}</p>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Verified
                              </Badge>
                              <Badge variant={registration.hasVoted ? "default" : "secondary"}>
                                {registration.hasVoted ? "Voted" : "Pending"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {registration.email}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {registration.phone}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {getElectionTitle(registration.electionId)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-lg font-bold text-blue-600">
                              {registration.voterCode}
                            </p>
                            <Button
                              onClick={() => copyToClipboard(registration.voterCode)}
                              variant="ghost"
                              size="sm"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
