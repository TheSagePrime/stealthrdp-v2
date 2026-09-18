import { auth } from '@clerk/nextjs/server';

export default async function OnboardingLayout(props: {
  children: React.ReactNode;
}) {
  await auth.protect();
  return props.children;
}
