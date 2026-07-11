import { ChatInterface } from '@/components/chat-interface';
import { Card } from '@/components/ui/card';

export default function AIPage() {
  return (
    <div className="h-full">
      <Card className="h-full overflow-hidden">
        <ChatInterface />
      </Card>
    </div>
  );
}
