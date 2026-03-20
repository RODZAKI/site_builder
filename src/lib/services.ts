import { supabase } from './supabase';
import type { Field, Artifact } from './types';

export async function fetchFields(): Promise<Field[]> {
  const { data, error } = await supabase
    .from('fields')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchFields error:', error);
    return [];
  }

  return data as Field[];
}

export async function createField(
  field: Omit<Field, 'id' | 'created_at' | 'updated_at'>
): Promise<Field | null> {
  const { data, error } = await supabase
    .from('fields')
    .insert([field])
    .select()
    .single();

  if (error) {
    console.error('createField error:', error);
    return null;
  }

  return data as Field;
}

export async function fetchArtifacts(fieldId: string): Promise<Artifact[]> {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('field_id', fieldId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchArtifacts error:', error);
    return [];
  }

  return data as Artifact[];
}

export async function createArtifact(
  artifact: Omit<Artifact, 'id' | 'created_at' | 'updated_at'>
): Promise<Artifact | null> {
  const { data, error } = await supabase
    .from('artifacts')
    .insert([artifact])
    .select()
    .single();

  if (error) {
    console.error('createArtifact error:', error);
    return null;
  }

  return data as Artifact;
}