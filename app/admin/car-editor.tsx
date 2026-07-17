'use client';
import {useState, useRef, useEffect} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {useRouter} from 'next/navigation';

type Image={id:string;url:string;position:number};
const storageMarker='/storage/v1/object/public/car-images/';

export function CarEditor({car}:{car?:any}){
  const router=useRouter(),db=createClient();
  const initialImages:Image[]=(car?.car_images??[]).sort((a:Image,b:Image)=>a.position-b.position);
  const [images,setImages]=useState<Image[]>(initialImages),[busy,setBusy]=useState(false),[dragged,setDragged]=useState<number|null>(null);
  const [form,setForm]=useState<any>({brand:car?.brand??'',model:car?.model??'',year:car?.year??new Date().getFullYear(),price:car?.price??'',mileage:car?.mileage??'',fuel:car?.fuel??'',engine:car?.engine??'',transmission:car?.transmission??'',drive:car?.drive??'',body_type:car?.body_type??'',short_description:car?.short_description??'',description:car?.description??'',features:(car?.features??[]).join('\n'),details:Object.entries(car?.details??{}).map(([k,v])=>`${k}: ${v}`).join('\n')});
  function change(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){setForm({...form,[e.target.name]:e.target.value})}
  const handleAutocompleteChange = (name: string, val: string) => { setForm((prev: any) => ({ ...prev, [name]: val })); };
  function move(from:number,to:number){if(from===to)return;setImages(current=>{const next=[...current];const [image]=next.splice(from,1);next.splice(to,0,image);return next})}
  async function files(list:FileList|null){if(!list)return;if(images.length+list.length>50)return alert('Максимум 50 фотографій');setBusy(true);try{const uploaded:Image[]=[];for(const file of Array.from(list)){const blob=await webp(file);const ext=blob.type.split('/')[1]||'webp';const path=`${crypto.randomUUID()}.${ext}`;const {error}=await db.storage.from('car-images').upload(path,blob,{contentType:blob.type});if(error)throw error;const {data}=db.storage.from('car-images').getPublicUrl(path);uploaded.push({id:crypto.randomUUID(),url:data.publicUrl,position:images.length+uploaded.length})}setImages(current=>[...current,...uploaded])}catch(error:any){alert(error.message)}finally{setBusy(false)}}
  async function removeOrphanedFiles(){const paths=initialImages.map(image=>image.url).filter(url=>url.includes(storageMarker)&&!images.some(current=>current.url===url)).map(url=>decodeURIComponent(url.split(storageMarker)[1]));if(paths.length){const {error}=await db.storage.from('car-images').remove(paths);if(error)console.warn('Storage cleanup failed:',error.message)}}
  function normalizeFuel(fuelStr: string): string {
    if (!fuelStr) return '';
    const clean = fuelStr.trim().toLowerCase().replace(/\s+/g, '');
    if (clean === 'газ/бензин' || clean === 'бензин/газ') {
      return 'Бензин / Газ';
    }
    return fuelStr;
  }
  async function save(e:React.FormEvent){e.preventDefault();setBusy(true);try{const details=Object.fromEntries(form.details.split('\n').filter(Boolean).map((line:string)=>line.split(/:\s*/,2)));const row={...form,fuel:normalizeFuel(form.fuel),year:+form.year,price:+form.price,mileage:+form.mileage,features:form.features.split('\n').filter(Boolean),details};const result=car?await db.from('cars').update(row).eq('id',car.id).select().single():await db.from('cars').insert(row).select().single();if(result.error)throw result.error;const removed=await db.from('car_images').delete().eq('car_id',result.data.id);if(removed.error)throw removed.error;if(images.length){const inserted=await db.from('car_images').insert(images.map((image,position)=>({car_id:result.data.id,url:image.url,position})));if(inserted.error)throw inserted.error}await removeOrphanedFiles();router.replace('/admin');router.refresh()}catch(error:any){alert(error.message);setBusy(false)}}
  return (
    <main className="editor">
      <h1>{car ? 'Редагування авто' : 'Нове авто'}</h1>
      <form onSubmit={save}>
        <div className="form-grid">
          <Autocomplete name="brand" value={form.brand} onChange={handleAutocompleteChange} options={['Audi', 'BMW', 'Mercedes-Benz', 'Tesla', 'Honda', 'Jeep', 'Land Rover', 'Toyota', 'Volkswagen', 'Ford', 'Hyundai', 'Kia', 'Nissan', 'Skoda', 'Renault', 'Lexus', 'Porsche', 'Mazda', 'Volvo', 'Opel', 'Chevrolet', 'Mitsubishi', 'Dodge', 'Aston Martin']} placeholder="brand" required />
          <input name="model" value={form.model} onChange={change} placeholder="model" required />
          <input type="number" name="year" value={form.year} onChange={change} placeholder="year" required />
          <input type="number" name="price" value={form.price} onChange={change} placeholder="price" required />
          <input type="number" name="mileage" value={form.mileage} onChange={change} placeholder="mileage" required />
          <Autocomplete name="fuel" value={form.fuel} onChange={handleAutocompleteChange} options={['Бензин', 'Дизель', 'Газ', 'Бензин / Газ', 'Електро', 'Гібрид']} placeholder="fuel" required />
          <Autocomplete name="engine" value={form.engine} onChange={handleAutocompleteChange} options={['1.5 L', '1.6 L', '2.0 L', '2.4 L', '2.5 L', '3.0 L', '3.5 L', '4.4 L', 'Електро']} placeholder="engine" required />
          <Autocomplete name="transmission" value={form.transmission} onChange={handleAutocompleteChange} options={['Автомат', 'Механіка', 'Варіатор', 'Редуктор', 'Робот']} placeholder="transmission" required />
          <Autocomplete name="drive" value={form.drive} onChange={handleAutocompleteChange} options={['Передній', 'Задній', 'Повний']} placeholder="drive" />
          <Autocomplete name="body_type" value={form.body_type} onChange={handleAutocompleteChange} options={['Седан', 'Кросовер', 'Позашляховик', 'Хетчбек', 'Універсал', 'Купе', 'Кабріолет', 'Мінівен', 'Ліфтбек', 'Пікап']} placeholder="body_type" />
        </div>

        <textarea name="short_description" value={form.short_description} onChange={change} placeholder="Короткий опис" />
        <textarea name="description" value={form.description} onChange={change} placeholder="Повний опис" />
        <textarea name="details" value={form.details} onChange={change} placeholder="Характеристики: один рядок = Назва: значення" />
        <textarea name="features" value={form.features} onChange={change} placeholder="Комплектація: один пункт на рядок" />
        
        <label className="dropzone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); files(e.dataTransfer.files) }}>
          Перетягніть до 50 фото або натисніть
          <input type="file" accept="image/*" multiple onChange={e => files(e.target.files)} />
        </label>
        
        <div className="photo-list">
          {images.map((image, index) => (
            <div key={image.id} draggable onDragStart={() => setDragged(index)} onDragOver={e => e.preventDefault()} onDrop={() => { if (dragged !== null) move(dragged, index); setDragged(null) }}>
              <img src={image.url} alt="" />
              <button type="button" onClick={() => setImages(current => current.filter(item => item !== image))} aria-label="Видалити фото">×</button>
              <button type="button" disabled={!index} onClick={() => move(index, index - 1)}>←</button>
              <button type="button" disabled={index === images.length - 1} onClick={() => move(index, index + 1)}>→</button>
            </div>
          ))}
        </div>
        
        <button className="button" disabled={busy}>{busy ? 'Збереження…' : 'Зберегти автомобіль'}</button>
      </form>
    </main>
  );
}
async function webp(file:File){
  let width=0,height=0,draw:(ctx:CanvasRenderingContext2D)=>void;
  try{
    const bitmap=await createImageBitmap(file);
    width=bitmap.width;
    height=bitmap.height;
    draw=(ctx)=>ctx.drawImage(bitmap,0,0);
  }catch(e){
    const img=await new Promise<HTMLImageElement>((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=(event)=>{
        const image=new Image();
        image.onload=()=>resolve(image);
        image.onerror=(err)=>reject(err);
        image.src=event.target?.result as string;
      };
      reader.onerror=(err)=>reject(err);
      reader.readAsDataURL(file);
    });
    width=img.width;
    height=img.height;
    draw=(ctx)=>ctx.drawImage(img,0,0);
  }
  const max=1920,scale=Math.min(1,max/Math.max(width,height)),canvas=document.createElement('canvas');
  canvas.width=Math.round(width*scale);
  canvas.height=Math.round(height*scale);
  const ctx=canvas.getContext('2d')!;
  ctx.scale(scale,scale);
  draw(ctx);
  return await new Promise<Blob>((resolve,reject)=>{
    canvas.toBlob((blob)=>{
      if(blob)resolve(blob);
      else{
        canvas.toBlob((jpegBlob)=>{
          if(jpegBlob)resolve(jpegBlob);
          else reject(new Error('Не вдалося стиснути фото'));
        },'image/jpeg',0.85);
      }
    },'image/webp',0.82);
  });
}

type AutocompleteProps = {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
};

function Autocomplete({ name, value, onChange, options, placeholder, required }: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="autocomplete-container" ref={containerRef}>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="autocomplete-dropdown">
          {filtered.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(name, opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
