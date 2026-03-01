import { X, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeSelectorProps {
  onClose: () => void;
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 pb-16 sm:pb-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-neu w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80dvh] sm:max-h-[90vh] flex flex-col neu">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neu-dark/20 shrink-0">
          <h3 className="text-base font-semibold text-slate-800">Choose Theme</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:neu-inset-sm text-slate-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themes.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); onClose(); }}
                  className={`relative rounded-xl p-3 text-left transition-all ${
                    active
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'hover:ring-1 hover:ring-slate-300'
                  }`}
                  style={{ background: t.preview.bg }}
                >
                  {/* Color swatches */}
                  <div className="flex gap-1.5 mb-2">
                    <span
                      className="w-6 h-6 rounded-md border border-black/10"
                      style={{ background: t.preview.card }}
                    />
                    <span
                      className="w-6 h-6 rounded-md border border-black/10"
                      style={{ background: t.preview.accent }}
                    />
                  </div>

                  <p
                    className="text-xs font-semibold leading-tight"
                    style={{ color: t.preview.accent }}
                  >
                    {t.name}
                  </p>
                  <p className="text-[10px] mt-0.5 opacity-60" style={{ color: t.preview.accent }}>
                    {t.description}
                  </p>

                  {active && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
