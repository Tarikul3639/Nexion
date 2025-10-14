"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function IntegrationsSection() {
  const integrations = [
    {
      name: "Background Remover",
      description: "AI-powered background removal for images",
      status: "active",
      icon: "🖼️",
    },
    {
      name: "PDF to Doc Converter",
      description: "Convert PDF files to editable documents",
      status: "active",
      icon: "📄",
    },
    {
      name: "Google Drive",
      description: "Sync files with Google Drive",
      status: "inactive",
      icon: "📁",
    },
    {
      name: "Slack",
      description: "Connect with your Slack workspace",
      status: "inactive",
      icon: "💬",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card
            key={integration.name}
            className="p-6 bg-neutral-900 border-neutral-800 rounded"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {integration.description}
                  </p>
                  {integration.status === "active" && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-blue-500 font-medium">
                        Connected
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant={
                  integration.status === "active" ? "outline" : "default"
                }
                size="sm"
                className={
                  "active:scale-95 transition-transform" +
                  (integration.status === "active"
                    ? " border-zinc-700 text-white hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded"
                    : " bg-blue-600 hover:bg-blue-700 text-white rounded")
                }
              >
                {integration.status === "active" ? "Manage" : "Connect"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-neutral-900 border-neutral-800 rounded">
        <h3 className="text-lg font-semibold text-white mb-2">API Access</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Generate API keys to integrate Nexion with your applications
        </p>
        <Button
          variant="outline"
          className="border-zinc-700 text-white hover:text-white hover:bg-zinc-800 bg-transparent rounded active:scale-99 transition-all"
        >
          Generate API Key
        </Button>
      </Card>
    </div>
  );
}
