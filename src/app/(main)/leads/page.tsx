
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, doc, writeBatch } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Lead } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';

function formatTimestamp(timestamp: { seconds: number; nanoseconds: number }) {
  if (!timestamp || typeof timestamp.seconds !== 'number') {
    return 'Invalid date';
  }
  const date = new Date(timestamp.seconds * 1000);
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

function LeadsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"><Checkbox disabled /></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Date Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Checkbox disabled /></TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-40" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function LeadsPage() {
  const firestore = useFirestore();
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const leadsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'))
        : null,
    [firestore]
  );

  const {
    data: leads,
    isLoading,
    error,
  } = useCollection<Lead>(leadsQuery);

  useEffect(() => {
    setSelectedLeads([]);
  }, [leads]);

  const handleDeleteConfirm = async () => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
    const leadsToDelete = leadToDelete ? [leadToDelete.id] : selectedLeads;

    leadsToDelete.forEach(id => {
        const leadRef = doc(firestore, 'leads', id);
        batch.delete(leadRef);
    });

    try {
        await batch.commit();
    } catch (error) {
        console.error('Error deleting lead(s):', error);
    } finally {
        setIsConfirmOpen(false);
        setLeadToDelete(null);
        setSelectedLeads([]);
    }
  };

  const openConfirmation = (lead: Lead | null = null) => {
    setLeadToDelete(lead);
    setIsConfirmOpen(true);
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && leads) {
      setSelectedLeads(leads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, id]);
    } else {
      setSelectedLeads(prev => prev.filter(leadId => leadId !== id));
    }
  };

  const numSelected = selectedLeads.length;
  const rowCount = leads?.length ?? 0;

  return (
    <>
      <AlertDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {leadToDelete ? `the lead for ${leadToDelete.name}` : `${numSelected} lead(s)`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: 'destructive' })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leads</CardTitle>
              <CardDescription>
                Contact information captured from the AI Counselor.
              </CardDescription>
            </div>
             <div className="flex items-center gap-2">
              {numSelected > 0 && (
                <Button variant="destructive" size="sm" onClick={() => openConfirmation()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({numSelected})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LeadsSkeleton />
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Leads</AlertTitle>
              <AlertDescription>
                {error.message.includes('permission-denied')
                  ? 'You do not have permission to view this data. Please check Firestore security rules.'
                  : 'There was a problem loading the leads data. Please try again later.'}
              </AlertDescription>
            </Alert>
          ) : leads && leads.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={rowCount > 0 && numSelected === rowCount}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} data-state={selectedLeads.includes(lead.id) && "selected"}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={(checked) => handleSelectRow(lead.id, !!checked)}
                          aria-label={`Select lead ${lead.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{formatTimestamp(lead.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openConfirmation(lead)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete lead</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed bg-muted/50">
              <p className="text-muted-foreground">No leads captured yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
