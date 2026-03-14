import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCorridors } from '@/hooks/useCorridors';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Guide {
  id: string;
  corridor_id: string | null;
  title: string;
  category: string;
  reading_time: string;
  summary: string;
  sections: { title: string; content: string; bullets?: string[] }[];
  sort_order: number;
  is_published: boolean;
}

const AdminGuides = () => {
  const { corridors } = useCorridors();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Guide> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchGuides = async () => {
    setLoading(true);
    const { data } = await supabase.from('guides').select('*').order('sort_order');
    if (data) setGuides(data.map((g: any) => ({ ...g, sections: Array.isArray(g.sections) ? g.sections : [] })));
    setLoading(false);
  };

  useEffect(() => { fetchGuides(); }, []);

  const handleSave = async () => {
    if (!editing?.title?.trim()) { toast.error('Titolo obbligatorio'); return; }
    const payload = {
      title: editing.title,
      corridor_id: editing.corridor_id || null,
      category: editing.category || 'documenti',
      reading_time: editing.reading_time || '5 min',
      summary: editing.summary || '',
      sections: editing.sections || [],
      sort_order: editing.sort_order || 0,
      is_published: editing.is_published ?? true,
    };

    if (isNew) {
      const { error } = await supabase.from('guides').insert(payload);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from('guides').update(payload).eq('id', editing.id!);
      if (error) { toast.error(error.message); return; }
    }
    toast.success(isNew ? 'Guida creata!' : 'Guida aggiornata!');
    setEditing(null);
    fetchGuides();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa guida?')) return;
    await supabase.from('guides').delete().eq('id', id);
    toast.success('Guida eliminata');
    fetchGuides();
  };

  const addSection = () => {
    setEditing((e) => e ? { ...e, sections: [...(e.sections || []), { title: '', content: '' }] } : e);
  };

  const updateSection = (i: number, field: string, value: any) => {
    setEditing((e) => {
      if (!e) return e;
      const sections = [...(e.sections || [])];
      sections[i] = { ...sections[i], [field]: value };
      return { ...e, sections };
    });
  };

  const removeSection = (i: number) => {
    setEditing((e) => {
      if (!e) return e;
      const sections = [...(e.sections || [])];
      sections.splice(i, 1);
      return { ...e, sections };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-foreground">Guide</h2>
        <button onClick={() => { setEditing({ title: '', sections: [], is_published: true, sort_order: guides.length }); setIsNew(true); }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Nuova Guida
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-elevated animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{isNew ? 'Nuova Guida' : 'Modifica Guida'}</h3>
            <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Titolo *</label>
              <input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Corridoio</label>
              <select value={editing.corridor_id || ''} onChange={(e) => setEditing({ ...editing, corridor_id: e.target.value || null })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="">Tutti</option>
                {corridors.map((c) => <option key={c.id} value={c.id}>{c.origin_country} → {c.destination_country}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Categoria</label>
              <input value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Tempo lettura</label>
              <input value={editing.reading_time || ''} onChange={(e) => setEditing({ ...editing, reading_time: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Ordine</label>
              <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Sommario</label>
              <textarea value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                rows={2} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <input type="checkbox" checked={editing.is_published ?? true} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
                Pubblicata
              </label>
            </div>
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground">Sezioni</label>
              <button onClick={addSection} className="text-xs font-semibold text-primary hover:underline">+ Aggiungi</button>
            </div>
            {(editing.sections || []).map((sec: any, i: number) => (
              <div key={i} className="mb-3 rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Sezione {i + 1}</span>
                  <button onClick={() => removeSection(i)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <input value={sec.title} onChange={(e) => updateSection(i, 'title', e.target.value)} placeholder="Titolo sezione"
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm" />
                <textarea value={sec.content} onChange={(e) => updateSection(i, 'content', e.target.value)} placeholder="Contenuto"
                  rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm resize-none" />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
          {guides.map((g) => (
            <div key={g.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{g.title}</p>
                <p className="text-xs text-muted-foreground">{g.category} • {g.reading_time} • {g.sections.length} sezioni</p>
              </div>
              {!g.is_published && <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">Bozza</span>}
              <button onClick={() => { setEditing(g); setIsNew(false); }} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(g.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGuides;
