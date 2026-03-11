import { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/admin/SettingsForm';
import type { SiteSettings } from '@/lib/validations/settings';
import { defaultSettings } from '@/lib/validations/settings';

async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.siteSetting.findMany();

  // Convert array to key-value object
  const settingsObj: Record<string, any> = {};
  settings.forEach((setting) => {
    settingsObj[setting.key] = setting.value;
  });

  // Merge with defaults
  return {
    ...defaultSettings,
    ...settingsObj,
  } as SiteSettings;
}

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  if (session.user?.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  const settings = await getSiteSettings();

  return (
    <Suspense fallback={<div className="text-mist">Loading settings...</div>}>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-off-white">Site Settings</h1>
          <p className="text-mist/50 mt-1">Manage your site configuration and preferences</p>
        </div>
        <SettingsForm initialSettings={settings} />
      </div>
    </Suspense>
  );
}
