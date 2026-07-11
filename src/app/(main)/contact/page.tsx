import Image from 'next/image';
import { contacts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => {
        const image = PlaceHolderImages.find((img) => img.id === contact.avatarId);
        return (
          <Card key={contact.id} className="text-center transition-shadow hover:shadow-lg">
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                {image && (
                  <AvatarImage
                    src={image.imageUrl}
                    alt={`Avatar of ${contact.name}`}
                    data-ai-hint={image.imageHint}
                  />
                )}
                <AvatarFallback className="text-3xl">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold">{contact.name}</h3>
              <p className="text-primary">{contact.title}</p>
              <p className="text-sm text-muted-foreground">{contact.department}</p>
              <div className="mt-4 flex flex-col items-center justify-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${contact.email}`} className="w-40">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${contact.phone}`} className="w-40">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
