import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCorridors } from '@/hooks/useCorridors';
import { Plus, Pencil, Trash2, Upload, Image, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface StepTemplate {
  id: string;
  corridor_id: string;
  step_order: number;
  title: string;
  explanation: string;
  why_it_matters: string;
  where_to_go: string;
  estimated_time: string;
  cost: string;
  category: string;
  documents: { name: string; description: string }[];
  checklist_items: string[];
  image_url: string | null;
  is_active: boolean;
}

const EMPTY_STEP: Omit<StepTemplate, 'id'> = {
  corridor_id: '',
  step_order: 1,
  title: '',
  explanation: '',
  why_it_matters: '',
  where_to_go: '',
  estimated_time: '',
  cost: '',
  category: 'documenti',
  documents: [],
  checklist_items: [],
  image_url: null,
  is_active: true,
};

const AdminSteps = () => {
  const { corridors } = useCorridors();
  const [selectedCorridor, setSelectedCorridor] = useState<string>('');
  const [steps, setSteps] = useState<StepTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingStep, setEditingStep] = useState<Partial<StepTemplate> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Auto-select first corridor
  useEffect(() => {
    if (corridors.length > 0 && !selectedCorridor) {
      setSelectedCorridor(corridors[0].id);
    }
  }, [corridors, selectedCorridor]);

  const fetchSteps = async () => {
    if (!selectedCorridor) return;
    setLoading(true);
    const { data } = await supabase
      .from('journey_step_templates')
      .select('*')
      .eq('corridor_id', selectedCorridor)
      .order('step_order', { ascending: true });

    if (data) {
      setSteps(data.map((d: any) => ({
        ...d,
        documents: Array.isArray(d.documents) ? d.documents : [],
        checklist_items: Array.isArray(d.checklist_items) ? d.checklist_items : [],
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSteps();
  }, [selectedCorridor]);

  const handleEdit = (step: StepTemplate) => {
    setEditingStep({ ...step });
    setIsNew(false);
  };

  const handleNew = () => {
    setEditingStep({
      ...EMPTY_STEP,
      corridor_id: selectedCorridor,
      step_order: steps.length + 1,
    });
    setIsNew(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingStep) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${editingStep.corridor_id || selectedCorridor}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('step-images').upload(path, file);
    if (error) {
      toast.error('Errore upload: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('step-images').getPublicUrl(path);
    setEditingStep({ ...editingStep, image_url: urlData.publicUrl });
    setUploading(false);
    toast.success('Immagine caricata!');
  };

  const handleSave = async () => {
    if (!editingStep?.title?.trim()) {
      toast.error('Il titolo è obbligatorio');
      return;
    }

    const payload = {
      corridor_id: editingStep.corridor_id || selectedCorridor,
      step_order: editingStep.step_order || 1,
      title: editingStep.title,
      explanation: editingStep.explanation || '',
      why_it_matters: editingStep.why_it_matters || '',
      where_to_go: editingStep.where_to_go || '',
      estimated_time: editingStep.estimated_time || '',
      cost: editingStep.cost || '',
      category: editingStep.category || 'documenti',
      documents: editingStep.documents || [],
      checklist_items: editingStep.checklist_items || [],
      image_url: editingStep.image_url || null,
      is_active: editingStep.is_active ?? true,
    };

    if (isNew) {
      const { error } = await supabase.from('journey_step_templates').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Step creato!');
    } else {
      const { error } = await supabase.from('journey_step_templates').update(payload).eq('id', editingStep.id!);
      if (error) { toast.error(error.message); return; }
      toast.success('Step aggiornato!');
    }

    setEditingStep(null);
    fetchSteps();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo step?')) return;
    const { error } = await supabase.from('journey_step_templates').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Step eliminato');
    fetchSteps();
  };

  const updateField = (field: string, value: any) => {
    setEditingStep((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const updateChecklistItem = (index: number, value: string) => {
    const items = [...(editingStep?.checklist_items || [])];
    items[index] = value;
    updateField('checklist_items', items);
  };

  const addChecklistItem = () => {
    updateField('checklist_items', [...(editingStep?.checklist_items || []), '']);
  };

  const removeChecklistItem = (index: number) => {
    const items = [...(editingStep?.checklist_items || [])];
    items.splice(index, 1);
    updateField('checklist_items', items);
  };

  const updateDocument = (index: number, field: 'name' | 'description', value: string) => {
    const docs = [...(editingStep?.documents || [])];
    docs[index] = { ...docs[index], [field]: value };
    updateField('documents', docs);
  };

  const addDocument = () => {
    updateField('documents', [...(editingStep?.documents || []), { name: '', description: '' }]);
  };

  const removeDocument = (index: number) => {
    const docs = [...(editingStep?.documents || [])];
    docs.splice(index, 1);
    updateField('documents', docs);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-foreground">Journey Steps</h2>
        <button onClick={handleNew} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Nuovo Step
        </button>
      </div>

      {/* Corridor selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {corridors.map((c) => (
          <button key={c.id} onClick={() => setSelectedCorridor(c.id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              selectedCorridor === c.id ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}>
            {c.origin_country} → {c.destination_country}
          </button>
        ))}
      </div>

      {/* Edit form */}
      {editingStep && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-elevated animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">{isNew ? 'Nuovo Step' : 'Modifica Step'}</h3>
            <button onClick={() => setEditingStep(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Titolo *</label>
              <input value={editingStep.title || ''} onChange={(e) => updateField('title', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Ordine</label>
              <input type="number" value={editingStep.step_order || 1} onChange={(e) => updateField('step_order', parseInt(e.target.value))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Categoria</label>
              <input value={editingStep.category || ''} onChange={(e) => updateField('category', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Spiegazione</label>
              <textarea value={editingStep.explanation || ''} onChange={(e) => updateField('explanation', e.target.value)}
                rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Perché è importante</label>
              <textarea value={editingStep.why_it_matters || ''} onChange={(e) => updateField('why_it_matters', e.target.value)}
                rows={2} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Dove andare</label>
              <input value={editingStep.where_to_go || ''} onChange={(e) => updateField('where_to_go', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Tempo stimato</label>
              <input value={editingStep.estimated_time || ''} onChange={(e) => updateField('estimated_time', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Costo</label>
              <input value={editingStep.cost || ''} onChange={(e) => updateField('cost', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <input type="checkbox" checked={editingStep.is_active ?? true} onChange={(e) => updateField('is_active', e.target.checked)} />
                Attivo
              </label>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Immagine</label>
            <div className="mt-2 flex items-start gap-4">
              {editingStep.image_url ? (
                <div className="relative">
                  <img src={editingStep.image_url} alt="" className="h-32 w-48 rounded-xl object-cover border border-border" />
                  <button onClick={() => updateField('image_url', null)}
                    className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
                  {uploading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-xs font-medium">Carica immagine</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Documents */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground">Documenti richiesti</label>
              <button onClick={addDocument} className="text-xs font-semibold text-primary hover:underline">+ Aggiungi</button>
            </div>
            {(editingStep.documents || []).map((doc: any, i: number) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={doc.name} onChange={(e) => updateDocument(i, 'name', e.target.value)} placeholder="Nome"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground" />
                <input value={doc.description} onChange={(e) => updateDocument(i, 'description', e.target.value)} placeholder="Descrizione"
                  className="flex-[2] rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground" />
                <button onClick={() => removeDocument(i)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground">Checklist</label>
              <button onClick={addChecklistItem} className="text-xs font-semibold text-primary hover:underline">+ Aggiungi</button>
            </div>
            {(editingStep.checklist_items || []).map((item: string, i: number) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={item} onChange={(e) => updateChecklistItem(i, e.target.value)} placeholder={`Elemento ${i + 1}`}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground" />
                <button onClick={() => removeChecklistItem(i)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditingStep(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">Annulla</button>
            <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">
              <Save className="h-4 w-4" /> Salva
            </button>
          </div>
        </div>
      )}

      {/* Steps list */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>
      ) : steps.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Nessuno step per questo corridoio</div>
      ) : (
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.id} className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
              <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === step.id ? null : step.id)}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {step.step_order}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.category} • {step.estimated_time || '—'} • {step.cost || '—'}</p>
                </div>
                {step.image_url && <Image className="h-4 w-4 text-primary shrink-0" />}
                {!step.is_active && <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">Inattivo</span>}
                <div className="flex gap-1 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(step); }} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(step.id); }} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {expandedId === step.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
              {expandedId === step.id && (
                <div className="border-t border-border px-4 py-3 bg-muted/30 space-y-2 text-xs animate-fade-in">
                  {step.image_url && <img src={step.image_url} alt={step.title} className="h-40 rounded-xl object-cover" />}
                  <p><strong>Spiegazione:</strong> {step.explanation || '—'}</p>
                  <p><strong>Perché:</strong> {step.why_it_matters || '—'}</p>
                  <p><strong>Dove:</strong> {step.where_to_go || '—'}</p>
                  <p><strong>Documenti:</strong> {step.documents.length ? step.documents.map(d => d.name).join(', ') : '—'}</p>
                  <p><strong>Checklist:</strong> {step.checklist_items.length ? step.checklist_items.join(' • ') : '—'}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSteps;
