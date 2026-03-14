import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Corridor {
  id: string;
  origin_country: string;
  destination_country: string;
  slug: string;
  is_active: boolean;
}

const AdminCorridors = () => {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Corridor> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('relocation_corridors').select('*').order('created_at');
    if (data) setCorridors(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!editing?.origin_country?.trim() || !editing?.destination_country?.trim() || !editing?.slug?.trim()) {
      toast.error('Tutti i campi sono obbligatori'); return;
    }
    const payload = {
      origin_country: editing.origin_country,
      destination_country: editing.destination_country,
      slug: editing.slug,
      is_active: editing.is_active ?? true,
    };
    if (isNew) {
      const { error } = await supabase.from('relocation_corridors').insert(payload);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from('relocation_corridors').update(payload).eq('id', editing.id!);
      if (error) { toast.error(error.message); return; }
    }
    toast.success(isNew ? 'Corridoio creato!' : 'Corridoio aggiornato!');
    setEditing(null);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo corridoio?')) return;
    await supabase.from('relocation_corridors').delete().eq('id', id);
    toast.success('Corridoio eliminato');
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-foreground">Corridoi</h2>
        <button onClick={() => { setEditing({ origin_country: '', destination_country: '', slug: '', is_active: true }); setIsNew(true); }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Nuovo Corridoio
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-elevated animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{isNew ? 'Nuovo Corridoio' : 'Modifica'}</h3>
            <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Paese origine *</label>
              <input value={editing.origin_country || ''} onChange={(e) => setEditing({ ...editing, origin_country: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Paese destinazione *</label>
              <input value={editing.destination_country || ''} onChange={(e) => setEditing({ ...editing, destination_country: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Slug *</label>
              <input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
            Attivo
          </label>
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditing(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Annulla</button>
            <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">
              <Save className="h-4 w-4" /> Salva
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>
      ) : (
        <div className="space-y-2">
          {corridors.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{c.origin_country} → {c.destination_country}</p>
                <p className="text-xs text-muted-foreground">/{c.slug}</p>
              </div>
              {!c.is_active && <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">Inattivo</span>}
              <button onClick={() => { setEditing(c); setIsNew(false); }} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(c.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCorridors;
