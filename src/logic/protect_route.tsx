import ProtectedRoute from "@/components/protected_route";

export default function protectRoute(component: React.ReactNode) {
  return (
    <ProtectedRoute>
      {component}
    </ProtectedRoute>
  );
}
