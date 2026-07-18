// Importamos la función para crear el cliente de Supabase
import { createClient } from '@supabase/supabase-js'

// Leemos las variables de entorno del archivo .env
// Estas variables contienen la URL y la clave de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Creamos y exportamos el cliente de Supabase
// Este objeto "supabase" lo usaremos en toda la app para leer y escribir datos
export const supabase = createClient(supabaseUrl, supabaseAnonKey)