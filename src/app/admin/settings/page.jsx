import Link from "next/link";

export default function SettingsAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-lg text-gray-400 mb-6">This page is under construction.</p>
        <div className="space-y-2">
          <Link href="/admin/services" className="block text-[#00FFFF] hover:underline">Go to Services Management</Link>
          <Link href="/admin/projects" className="block text-[#00FFFF] hover:underline">Go to Projects Management</Link>
          <Link href="/admin/media" className="block text-[#00FFFF] hover:underline">Go to Media Management</Link>
        </div>
      </div>
    </div>
  );
} 