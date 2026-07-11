import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/lib/types';
import { BookCheck, Clock, CheckCircle, Award } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2">{course.department}</Badge>
            <CardTitle className="font-headline text-xl">{course.title}</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-primary">{course.code}</div>
            <div className="text-xs text-muted-foreground">{course.credits} Credits</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <BookCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Description</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {course.description}
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 flex-shrink-0 text-primary/80" />
            <div>
              <h4 className="font-semibold">Duration</h4>
              <p className="text-muted-foreground">{course.duration}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Award className="h-5 w-5 flex-shrink-0 text-primary/80" />
            <div>
              <h4 className="font-semibold">Eligibility</h4>
              <p className="text-muted-foreground">{course.eligibility}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-5 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </div>
        <div>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}
