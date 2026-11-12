'use strict';
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const bookingUrl = 'https://n658656.yclients.ru/';
const services = {
  hair: { number:'01', image:'hair.jpg', alt:'Укладка длинных волос — работа салона «Эстетика»', title:'Волосы,<br>которые нравятся.', lead:'От лёгкого обновления до нового образа.<br>Найдите то, что хочется именно сейчас.', rows:[['Женская стрижка','45 минут','950 ₽'],['Стрижка на длинные волосы','60 минут','950–1 200 ₽'],['Укладка волос','30 минут','900–1 700 ₽'],['SPA-уход за волосами','60 минут','500–1 000 ₽']] },
  color: { number:'02', image:'hair.jpg', alt:'Волосы в мягких волнах из галереи салона', title:'Ваш оттенок.<br>Ваш характер.', lead:'Освежить цвет или решиться на перемены.<br>Стоимость зависит от длины и техники.', rows:[['Окрашивание в один тон','60 минут','3 000–5 000 ₽'],['Тонирование волос','120 минут','1 700–2 700 ₽'],['Мелирование','180 минут','3 500–7 500 ₽'],['Колористика','240 минут','4 500–10 000 ₽']] },
  nails: { number:'03', image:'manicure.jpg', alt:'Нюдовый маникюр с графичным дизайном — работа салона', title:'Забота<br>до кончиков.', lead:'Сдержанный нюд, любимый цвет или акцентный дизайн.<br>Детали, которые создают настроение.', rows:[['Маникюр с покрытием гель-лак','120 минут','2 000 ₽'],['Классический / комби-маникюр','60 минут','1 100 ₽'],['Японский маникюр','80 минут','1 500 ₽'],['Smart-педикюр с покрытием','120 минут','2 100 ₽']] },
  brows: { number:'04', image:'brows.jpg', alt:'Оформление бровей из галереи «Эстетики»', title:'Акцент<br>на естественность.', lead:'Форма, оттенок и выразительность.<br>Небольшие штрихи, которые меняют всё.', rows:[['Коррекция и окрашивание бровей','40 минут','1 100 ₽'],['Долговременная укладка бровей','60 минут','1 500 ₽'],['Окрашивание бровей','25 минут','500 ₽'],['Окрашивание ресниц','30 минут','300 ₽']] },
  men: { number:'05', image:'salon.jpg', alt:'Рабочее пространство салона «Эстетика»', title:'Хорошая форма.<br>Каждый день.', lead:'Стрижки и уход для него.<br>Привычный образ или что-то новое.', rows:[['Мужская стрижка','30 минут','800 ₽'],['Креативная стрижка','45 минут','900 ₽'],['Оформление усов / бороды','15 минут','200–400 ₽'],['SPA-уход за кожей головы','30 минут','250–400 ₽']] }
};
const tabs = $$('.service-tabs [role="tab"]');
function showService(tab) {
  const key = tab.dataset.service, service = services[key];
  tabs.forEach(item => {const active = item === tab;item.setAttribute('aria-selected', String(active));item.tabIndex = active ? 0 : -1;});
  const panel = $('#service-panel');panel.setAttribute('aria-labelledby',tab.id);
  const photo = $('#service-image');photo.src = `assets/${service.image}`;photo.alt = service.alt;photo.dataset.kind = key;
  $('#service-number').textContent = `${service.number} /`;
  $('#service-image-title').innerHTML = service.title;
  $('#service-lead').innerHTML = service.lead;
  $('#service-list').replaceChildren(...service.rows.map(([title,time,price])=>{
    const a=document.createElement('a');a.href=bookingUrl;a.target='_blank';a.rel='noopener noreferrer';
    const label=document.createElement('span');label.textContent=title;
    const duration=document.createElement('small');duration.textContent=time;label.append(duration);
    const amount=document.createElement('strong');amount.textContent=price;
    const arrow=document.createElement('span');arrow.className='row-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');a.append(label,amount,arrow);return a;
  }));
  if (!reducedMotion.matches && panel.animate) panel.animate([{opacity:.5,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
  tab.scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth',block:'nearest',inline:'nearest'});
}
tabs.forEach(tab=>{tab.addEventListener('click',()=>showService(tab));tab.addEventListener('keydown',event=>{
  const index=tabs.indexOf(tab);let next;
  if(event.key==='ArrowRight') next=tabs[(index+1)%tabs.length];
  if(event.key==='ArrowLeft') next=tabs[(index-1+tabs.length)%tabs.length];
  if(event.key==='Home') next=tabs[0];
  if(event.key==='End') next=tabs[tabs.length-1];
  if(next){event.preventDefault();next.focus({preventScroll:true});showService(next);}
});});

const menuToggle=$('.menu-toggle'), mobileMenu=$('#mobile-menu');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Открыть меню');mobileMenu.hidden=true;document.body.classList.remove('menu-open');if(!$('dialog[open]'))document.body.classList.remove('modal-open');}
menuToggle.addEventListener('click',()=>{const opening=menuToggle.getAttribute('aria-expanded')!=='true';if(!opening){closeMenu();return;}menuToggle.setAttribute('aria-expanded','true');menuToggle.setAttribute('aria-label','Закрыть меню');mobileMenu.hidden=false;document.body.classList.add('modal-open','menu-open');});
$$('a',mobileMenu).forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){closeMenu();menuToggle.focus();}});
window.matchMedia('(min-width:701px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

function openDialog(dialog){closeMenu();dialog.showModal();document.body.classList.add('modal-open');}
$$('[data-book]').forEach(button=>button.addEventListener('click',()=>openDialog($('#booking-dialog'))));
$('#demo-info').addEventListener('click',()=>openDialog($('#info-dialog')));
$$('dialog').forEach(dialog=>{
  $('[data-close]',dialog).addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');});
});
const gallery=[{image:'hair.jpg',title:'Мягкие волны',alt:'Укладка длинных волос с белыми цветами'},{image:'manicure.jpg',title:'Нюд с характером',alt:'Нюдовый маникюр с графичным дизайном'},{image:'brows.jpg',title:'Выразительный взгляд',alt:'Аккуратно оформленная бровь крупным планом'}];
let galleryIndex=0;
function updateGallery(){const item=gallery[galleryIndex];$('#lightbox-image').src=`assets/${item.image}`;$('#lightbox-image').alt=item.alt;$('#lightbox-caption').textContent=`${item.title} · ${galleryIndex+1} / ${gallery.length}`;}
$$('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{galleryIndex=Number(button.dataset.gallery);updateGallery();openDialog($('#lightbox'));}));
function stepGallery(direction){galleryIndex=(galleryIndex+direction+gallery.length)%gallery.length;updateGallery();}
$('#gallery-prev').addEventListener('click',()=>stepGallery(-1));$('#gallery-next').addEventListener('click',()=>stepGallery(1));
$('#lightbox').addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();stepGallery(-1);}if(event.key==='ArrowRight'){event.preventDefault();stepGallery(1);}});

if('IntersectionObserver' in window){
  document.documentElement.classList.add('js-ready');
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -15px 0px'});
  $$('.reveal').forEach(el=>observer.observe(el));
}
const header=$('.header'), heroImage=$('.hero-image');let ticking=false;
function updateScroll(){header.classList.toggle('scrolled',window.scrollY>15);if(!reducedMotion.matches&&window.innerWidth>700&&window.scrollY<900){heroImage.style.transform=`translateY(${Math.min(window.scrollY*.035,22)}px) scale(1.055)`;}ticking=false;}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});updateScroll();
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)heroImage.style.transform='none';else updateScroll();});
