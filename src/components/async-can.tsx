import { Suspense } from "react";

interface AsyncCanProps {
  condition: () => Promise<boolean>;
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  otherwise?: React.ReactNode;
}

export const AsyncCan: React.FC<AsyncCanProps> = ({
  condition,
  children,
  loadingFallback,
  otherwise,
}) => {
  return (
    <Suspense fallback={loadingFallback}>
      <SuspendedComponent condition={condition} otherwise={otherwise}>
        {children}
      </SuspendedComponent>
    </Suspense>
  );
};

async function SuspendedComponent({
  children,
  condition,
  otherwise,
}: Omit<AsyncCanProps, "loadingFallback">) {
  return (await condition()) ? children : otherwise;
}
