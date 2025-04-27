import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { read, utils } from 'npm:xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Column definitions with their data types and structures
const columnDefs = {
  chapter_id: { type: 'uuid', required: true },
  summary_en: { type: 'text', required: true },
  summary_ch: { type: 'text', required: true },
  vocabulary: {
    type: 'json',
    required: false,
    structure: {
      word: 'string',
      translation: 'string',
      pronunciation: 'string',
      difficulty: 'enum: beginner|intermediate|advanced',
      context: {
        en: 'string',
        ch: 'string'
      },
      examples: [{
        en: 'string',
        ch: 'string'
      }]
    }
  },
  key_points: {
    type: 'json',
    required: false,
    structure: {
      en: 'string',
      ch: 'string',
      importance: 'number (1-5)',
      related_concepts: 'string[]'
    }
  },
  status: { type: 'enum', values: ['draft', 'published', 'archived'], default: 'published' },
  audio_url_en: { type: 'text', required: false },
  audio_url_ch: { type: 'text', required: false },
  tags: { type: 'text[]', required: false }
};

function validateRow(row: any): any {
  // Validate required fields
  if (!row.chapter_id) throw new Error('chapter_id is required');
  if (!row.summary_en) throw new Error('summary_en is required');
  if (!row.summary_ch) throw new Error('summary_ch is required');

  // Parse JSON fields
  let vocabulary = [];
  let key_points = [];
  let tags = [];

  try {
    vocabulary = row.vocabulary ? JSON.parse(row.vocabulary) : [];
    key_points = row.key_points ? JSON.parse(row.key_points) : [];
    tags = row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [];
  } catch (error) {
    throw new Error(`Error parsing JSON fields: ${error.message}`);
  }

  // Validate status
  const status = row.status || 'published';
  if (!['draft', 'published', 'archived'].includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return {
    chapter_id: row.chapter_id,
    summary_en: row.summary_en,
    summary_ch: row.summary_ch,
    vocabulary,
    key_points,
    status,
    audio_url_en: row.audio_url_en || null,
    audio_url_ch: row.audio_url_ch || null,
    tags,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw new Error('No file uploaded');
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      throw new Error('Invalid file format. Only Excel files (.xlsx, .xls) are supported');
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = utils.sheet_to_json(worksheet);

    if (!Array.isArray(rawData) || rawData.length === 0) {
      throw new Error('No data found in the uploaded file');
    }

    const processedData = [];
    for (let i = 0; i < rawData.length; i++) {
      try {
        const validatedRow = validateRow(rawData[i]);
        processedData.push(validatedRow);
      } catch (error) {
        throw new Error(`Error in row ${i + 1}: ${error.message}`);
      }
    }

    const { data, error } = await supabaseClient
      .from('chapter_content')
      .upsert(processedData, {
        onConflict: 'chapter_id'
      });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Content uploaded successfully',
        rowsProcessed: processedData.length
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing upload:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});