import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Authentication functions
export const auth = {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Database service functions
export const notesService = {
  async create(note: {
    title: string;
    original_transcript: string;
    enhanced_text: string;
    writing_style: string;
    word_count: number;
    folder_id?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('notes')
      .insert([{ ...note, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAll(folderId?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('notes')
      .select(`
        *,
        folder:folders(id, name, color),
        note_tags:note_tags(
          tag:tags(id, name, color)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (folderId) {
      query = query.eq('folder_id', folderId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

export const foldersService = {
  async create(folder: { name: string; description?: string; color?: string }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('folders')
      .insert([{ ...folder, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAll() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) throw error
    return data
  }
}

export const tagsService = {
  async create(tag: { name: string; color?: string }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tags')
      .insert([{ ...tag, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAll() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) throw error
    return data
  }
}

export const subscriptionService = {
  async getCurrentSubscription() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, credits_remaining')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  },

  async logUsage(actionType: string, creditsUsed: number = 1) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('usage_logs')
      .insert([{ 
        user_id: user.id, 
        action_type: actionType, 
        credits_used: creditsUsed 
      }])

    if (error) throw error

    // Update remaining credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_remaining')
      .eq('id', user.id)
      .single()

    if (profile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          credits_remaining: Math.max(0, profile.credits_remaining - creditsUsed)
        })
        .eq('id', user.id)

      if (updateError) throw updateError
    }
  }
}

export default supabase
