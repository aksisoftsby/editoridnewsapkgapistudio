import React, { useState } from 'react';
import { X, Github, Terminal, Check, Copy, Download, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

interface GitHubBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubBuildModal: React.FC<GitHubBuildModalProps> = ({ isOpen, onClose }) => {
  const [copiedAction, setCopiedAction] = useState(false);
  const [copiedLocal, setCopiedLocal] = useState(false);

  if (!isOpen) return null;

  const githubWorkflowYaml = `name: Build Android APK (Unsigned Demo)

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Install Dependencies
        run: npm install --legacy-peer-deps

      - name: Build Web Dist
        run: npm run build

      - name: Setup Capacitor Android
        run: |
          if [ ! -d "android" ]; then
            npx @capacitor/cli add android
          fi
          npx @capacitor/cli sync android

      - name: Build Unsigned Debug APK
        run: |
          cd android
          chmod +x ./gradlew
          ./gradlew assembleDebug --stacktrace

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: editor-id-news-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14
`;

  const localCommand = `# 1. Install Capacitor CLI & Android
npm install @capacitor/core @capacitor/cli @capacitor/android -D

# 2. Build aplikasi web
npm run build

# 3. Sinkronkan ke folder android
npx cap add android
npx cap sync android

# 4. Build APK Demo tanpa sign (Debug APK)
cd android && ./gradlew assembleDebug

# Lokasi APK siap install di HP Android:
# android/app/build/outputs/apk/debug/app-debug.apk`;

  const copyToClipboard = async (text: string, type: 'action' | 'local') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'action') {
        setCopiedAction(true);
        setTimeout(() => setCopiedAction(false), 2500);
      } else {
        setCopiedLocal(true);
        setTimeout(() => setCopiedLocal(false), 2500);
      }
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Build Android APK via GitHub
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Demo APK Unsigned (Langsung install di HP tanpa keystore)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Info Card */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-200">
                Bebas Sign untuk Demo (Unsigned Debug APK)
              </h4>
              <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                Anda tidak perlu membuat keystore atau signing key. File workflow GitHub Actions berikut akan otomatis memproses build Gradle dan menghasilkan <code className="bg-white/80 dark:bg-black/40 px-1 py-0.5 rounded font-mono text-[11px]">app-debug.apk</code> yang bisa langsung diunduh dari tab <strong>Actions &gt; Artifacts</strong> di GitHub Anda!
              </p>
            </div>
          </div>

          {/* Step 1: GitHub Actions Workflow */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Workflow GitHub Actions (<code className="text-blue-600 dark:text-blue-400">.github/workflows/build-apk.yml</code>)
              </span>
              <button
                onClick={() => copyToClipboard(githubWorkflowYaml, 'action')}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold"
              >
                {copiedAction ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAction ? 'Tersalin' : 'Salin YAML'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] leading-tight overflow-x-auto max-h-48 border border-slate-800">
              {githubWorkflowYaml}
            </pre>
          </div>

          {/* Step 2: How to trigger in GitHub */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h5 className="font-bold text-slate-900 dark:text-white">Cara Menjalankan di GitHub:</h5>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Export / Push project ini ke repository GitHub Anda.</li>
              <li>Buka tab <strong>Actions</strong> di repositori GitHub Anda.</li>
              <li>Pilih workflow <strong>"Build Android APK (Unsigned Demo)"</strong> &gt; klik <strong>Run workflow</strong>.</li>
              <li>Setelah selesai (±2-3 menit), download file <strong>editor-id-news-debug-apk</strong> dari section Artifacts!</li>
            </ol>
          </div>

          {/* Step 3: Local Command Alternative */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Atau Build di Terminal Laptop / Android Studio
              </span>
              <button
                onClick={() => copyToClipboard(localCommand, 'local')}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold"
              >
                {copiedLocal ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLocal ? 'Tersalin' : 'Salin Command'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] leading-tight overflow-x-auto max-h-36 border border-slate-800">
              {localCommand}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
