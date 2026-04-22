import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout({ onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "📊 Dashboard" },
    { path: "/expenses", label: "💸 Expenses" },
    { path: "/budgets", label: "🎯 Budgets" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">💰 CashFlow</h1>
          <p className="text-sm text-gray-500">by Jay Mer</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2.5 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* This is critical - renders the page content */}
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}