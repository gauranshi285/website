import { Suspense } from 'react';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { courses } from '@/lib/data';

export const metadata = {
  title: 'Courses',
};

export default function CoursesPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <Suspense key={course.id} fallback={<CourseCardSkeleton />}>
          <CourseCard course={course} />
        </Suspense>
      ))}
    </div>
  );
}
