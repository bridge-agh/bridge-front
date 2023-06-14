import ProtectedRoute from "@/components/protected_route";

export default function protectRoute(component: () => JSX.Element) {
  const protectedComponent = () => <ProtectedRoute>{component()}</ProtectedRoute>;
  return protectedComponent;
}
