import {redirect} from 'next/navigation';import {createClient} from '@/lib/supabase/server';import {AdminClient} from './admin-client';
export const dynamic = 'force-dynamic';
export default async function Admin(){const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/admin/login');const {data:profile}=await db.from('profiles').select('is_admin').eq('id',user.id).single();if(!profile?.is_admin)redirect('/');const {data}=await db.from('cars').select('*,car_images(*)').order('created_at',{ascending:false});return <AdminClient initialCars={data??[]}/>}
