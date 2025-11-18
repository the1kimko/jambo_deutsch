import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';
import type { ToasterProps } from 'sonner';

export function SonnerToaster() {
  const { theme = 'system' } = useTheme();

  return (
    <Toaster
      theme={theme as ToasterProps['theme']}
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: "rounded-md border bg-background text-foreground shadow-card",
          title: "text-sm font-semibold",
          description: "text-sm text-muted-foreground",
          actionButton:
            "inline-flex h-8 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          cancelButton:
            "inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm font-medium text-muted-foreground hover:text-foreground",
        },
      }}
    />
  );
}
