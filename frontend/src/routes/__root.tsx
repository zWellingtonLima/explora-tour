import { Header } from "@/components/Header";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4">
        <Header />

        <Outlet />
      </div>
    </>
  );
}
