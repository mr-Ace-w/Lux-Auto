import {createClient} from './supabase/server'; import type {Car} from './types';
export async function getCars(){const db=await createClient();const {data}=await db.from('cars').select('*,car_images(*)').eq('is_hidden',false).order('is_top',{ascending:false}).order('created_at',{ascending:false});return ((data??[]) as any[]).map(normalize)}
export async function getCar(id:string){const db=await createClient();const {data}=await db.from('cars').select('*,car_images(*)').eq('id',id).single();return data?normalize(data as any):null}
export function normalizeFuel(fuelStr: string): string {
  if (!fuelStr) return '';
  const clean = fuelStr.trim().toLowerCase().replace(/\s+/g, '');
  if (clean === 'газ/бензин' || clean === 'бензин/газ') {
    return 'Бензин / Газ';
  }
  return fuelStr;
}

function normalize(row:any):Car{return {...row,fuel:normalizeFuel(row.fuel),images:(row.car_images??[]).sort((a:any,b:any)=>a.position-b.position),features:row.features??[],details:row.details??{}}}

