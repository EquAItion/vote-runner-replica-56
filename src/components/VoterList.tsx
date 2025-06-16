
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Users, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Download,
  FileText,
  Mail,
  Phone
} from "lucide-react";
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
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documentUrl?: string;
  photoUrl?: string;
  rejectionReason?: string;
}

interface VoterListProps {
  elections: Election[];
  onBack: () => void;
}

export const VoterList = ({ elections, onBack }: VoterListProps) => {
  const { toast } = useToast();
  const [selectedVoter, setSelectedVoter] = useState<VoterRegistration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Mock voter data - in a real app, this would come from your backend
  const [voters, setVoters] = useState<VoterRegistration[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      electionId: '1',
      voterCode: 'ABC12345',
      registrationDate: '2024-06-10T10:30:00Z',
      hasVoted: false,
      verificationStatus: 'pending',
      documentUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
      photoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0124',
      electionId: '1',
      voterCode: 'DEF67890',
      registrationDate: '2024-06-11T14:20:00Z',
      hasVoted: true,
      verificationStatus: 'verified',
      documentUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
      photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1-555-0125',
      electionId: '2',
      voterCode: 'GHI11223',
      registrationDate: '2024-06-09T09:15:00Z',
      hasVoted: false,
      verificationStatus: 'rejected',
      rejectionReason: 'Document image unclear',
      documentUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      photoUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  const getElectionTitle = (electionId: string) => {
    const election = elections.find(e => e.id === electionId);
    return election?.title || 'Unknown Election';
  };

  const getVerificationBadge = (status: VoterRegistration['verificationStatus']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
    }
  };

  const handleViewProfile = (voter: VoterRegistration) => {
    setSelectedVoter(voter);
    setIsDialogOpen(true);
  };

  const handleVerifyVoter = () => {
    if (!selectedVoter) return;
    
    setVoters(prev => prev.map(voter => 
      voter.id === selectedVoter.id 
        ? { ...voter, verificationStatus: 'verified' as const }
        : voter
    ));
    
    toast({
      title: "Voter Verified",
      description: `${selectedVoter.firstName} ${selectedVoter.lastName} has been verified successfully.`,
    });
    
    setIsDialogOpen(false);
    setSelectedVoter(null);
  };

  const handleRejectVoter = () => {
    if (!selectedVoter) return;
    
    setVoters(prev => prev.map(voter => 
      voter.id === selectedVoter.id 
        ? { 
            ...voter, 
            verificationStatus: 'rejected' as const,
            rejectionReason: 'Rejected by admin review'
          }
        : voter
    ));
    
    toast({
      title: "Voter Rejected",
      description: `${selectedVoter.firstName} ${selectedVoter.lastName} has been rejected.`,
      variant: "destructive"
    });
    
    setIsDialogOpen(false);
    setSelectedVoter(null);
  };

  const downloadDocument = () => {
    if (selectedVoter?.documentUrl) {
      const link = document.createElement('a');
      link.href = selectedVoter.documentUrl;
      link.download = `${selectedVoter.firstName}_${selectedVoter.lastName}_document.jpg`;
      link.click();
    }
  };

  const pendingCount = voters.filter(v => v.verificationStatus === 'pending').length;
  const verifiedCount = voters.filter(v => v.verificationStatus === 'verified').length;
  const rejectedCount = voters.filter(v => v.verificationStatus === 'rejected').length;

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
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Voter List & Verification</h1>
              </div>
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
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">{voters.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">{verifiedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voter List Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Voters</CardTitle>
            <CardDescription>
              Review and manage voter registrations for all elections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voter</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Election</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Voted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voters.map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={voter.photoUrl} alt={`${voter.firstName} ${voter.lastName}`} />
                          <AvatarFallback>
                            {voter.firstName.charAt(0)}{voter.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{voter.firstName} {voter.lastName}</p>
                          <p className="text-sm text-gray-500 font-mono">{voter.voterCode}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {voter.email}
                        </p>
                        <p className="flex items-center text-gray-500">
                          <Phone className="w-3 h-3 mr-1" />
                          {voter.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{getElectionTitle(voter.electionId)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{new Date(voter.registrationDate).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell>
                      {getVerificationBadge(voter.verificationStatus)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={voter.hasVoted ? "default" : "secondary"}>
                        {voter.hasVoted ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewProfile(voter)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Voter Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voter Profile Review</DialogTitle>
            <DialogDescription>
              Review voter information and verification documents
            </DialogDescription>
          </DialogHeader>
          
          {selectedVoter && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedVoter.photoUrl} alt={`${selectedVoter.firstName} ${selectedVoter.lastName}`} />
                    <AvatarFallback className="text-xl">
                      {selectedVoter.firstName.charAt(0)}{selectedVoter.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedVoter.firstName} {selectedVoter.lastName}
                    </h3>
                    <p className="text-gray-600">Voter Code: {selectedVoter.voterCode}</p>
                    {getVerificationBadge(selectedVoter.verificationStatus)}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm">{selectedVoter.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm">{selectedVoter.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Election</label>
                    <p className="text-sm">{getElectionTitle(selectedVoter.electionId)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Registration Date</label>
                    <p className="text-sm">{new Date(selectedVoter.registrationDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Voting Status</label>
                    <p className="text-sm">{selectedVoter.hasVoted ? 'Has voted' : 'Not voted yet'}</p>
                  </div>
                  {selectedVoter.rejectionReason && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Rejection Reason</label>
                      <p className="text-sm text-red-600">{selectedVoter.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Preview */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">ID Document</label>
                    <Button
                      onClick={downloadDocument}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  {selectedVoter.documentUrl ? (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={selectedVoter.documentUrl}
                        alt="ID Document"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No document uploaded</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Profile Photo</label>
                  {selectedVoter.photoUrl ? (
                    <div className="border rounded-lg overflow-hidden w-full h-48">
                      <img
                        src={selectedVoter.photoUrl}
                        alt="Profile Photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No photo uploaded</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            {selectedVoter?.verificationStatus === 'pending' && (
              <>
                <Button
                  onClick={handleRejectVoter}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={handleVerifyVoter}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
