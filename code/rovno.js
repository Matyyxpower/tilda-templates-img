(function(){
var $=function(i){return document.getElementById(i)};
var WA="79000000000";

/* шапка: тень при прокрутке + бургер */
var top=document.querySelector(".rtop");
function onSc(){top&&top.classList.toggle("sc",scrollY>20)}addEventListener("scroll",onSc,{passive:true});onSc();
var bg=$("rBurger"),nav=$("rNav");
function menu(o){bg.setAttribute("aria-expanded",o);nav.classList.toggle("open",o);document.documentElement.style.overflow=o?"hidden":""}
if(bg){bg.addEventListener("click",function(){menu(bg.getAttribute("aria-expanded")!=="true")});
 nav.addEventListener("click",function(e){if(e.target.closest("a"))menu(false)})}

/* было/стало */
var ba=$("rBa");
if(ba){var drag=false;var sx=function(v){ba.style.setProperty("--x",Math.max(0,Math.min(100,v))+"%")};
 var fe=function(e){var r=ba.getBoundingClientRect();sx((e.clientX-r.left)/r.width*100)};
 ba.addEventListener("pointerdown",function(e){drag=true;ba.setPointerCapture(e.pointerId);fe(e)});
 ba.addEventListener("pointermove",function(e){if(drag)fe(e)});
 ba.addEventListener("pointerup",function(){drag=false});ba.addEventListener("pointercancel",function(){drag=false})}

/* появление блоков */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll(".rv").forEach(function(el){io.observe(el)});

/* отправка через скрытую форму Тильды (она шлёт в Telegram и CRM) */
function tForm(){return document.querySelector("form.t-form")}
function hideT(){var f=tForm();if(f){var r=f.closest(".t-rec");if(r)r.classList.add("rovno-hidden")}}
hideT();document.addEventListener("DOMContentLoaded",hideT);
function setV(el,v){if(!el)return;var d=Object.getOwnPropertyDescriptor(el.constructor.prototype,"value");d&&d.set?d.set.call(el,v):el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}))}
function send(name,phone,text,help){return new Promise(function(ok,no){
 var f=tForm();
 if(!f){no("noform");return}
 var q=function(s){return f.querySelector(s)};
 setV(q('[name="Name"],[name="Имя"]'),name||"—");
 setV(q('[name="Phone"],[name="Телефон"]'),phone);
 setV(q('[name="Zayavka"],[name="Заявка"],textarea'),text);
 f.classList.remove("js-send-form-success");
 var btn=f.querySelector(".t-submit,[type=submit]");btn&&btn.click();
 var rec=f.closest(".t-rec"),shown=false,t0=Date.now(),iv=setInterval(function(){
  var sb=f.parentNode.querySelector(".js-successbox"),eb=f.querySelector(".js-errorbox-all");
  var okd=f.classList.contains("js-send-form-success")||(sb&&sb.style.display&&sb.style.display!=="none");
  var errd=eb&&getComputedStyle(eb).display!=="none"&&eb.textContent.trim();
  /* Тильда может попросить подтвердить, что это не робот: показываем её форму, уже заполненную */
  if(!okd&&!shown&&Date.now()-t0>5000&&rec&&help){shown=true;rec.classList.remove("rovno-hidden");rec.classList.add("rovno-shown");help(rec)}
  if(okd){clearInterval(iv);if(rec){rec.classList.remove("rovno-shown");rec.classList.add("rovno-hidden")}ok()}
  else if(errd&&!shown){clearInterval(iv);no(errd)}
  else if(Date.now()-t0>180000){clearInterval(iv);no("timeout")}
 },300)})}
function digits(s){return(s||"").replace(/\D/g,"")}
function bindForm(form,build){
 if(!form)return;var msg=form.querySelector(".rq-msg"),b=form.querySelector("[type=submit]"),ph=form.querySelector('[name="p"]');
 ph.addEventListener("input",function(){ph.classList.remove("err")});
 form.addEventListener("submit",function(e){e.preventDefault();
  var d=digits(ph.value);if(d.length<10){ph.classList.add("err");msg.className="rq-msg bad";msg.textContent="Проверьте номер телефона";ph.focus();return}
  var text=build(form),nm=form.querySelector('[name="n"]').value.trim();
  b.disabled=true;msg.className="rq-msg";msg.textContent="Отправляем…";
  send(nm,ph.value.trim(),text,function(rec){
   form.parentNode.insertBefore(rec,form.nextSibling);var bt=rec.querySelector(".t-btnflex__text,.t-submit");if(bt)bt.textContent="Подтвердить отправку";msg.className="rq-msg";msg.textContent="Почти готово — подтвердите отправку в форме ниже.";
   rec.scrollIntoView({behavior:"smooth",block:"center"});
  }).then(function(){
   form.innerHTML='<div class="rq-done"><b>Спасибо'+(nm?", "+nm.replace(/[<>&]/g,""):"")+'!</b><p class="rq-lead">Заявка у нас. Перезвоним в течение 15 минут в рабочее время.</p></div>';
  },function(err){
   b.disabled=false;msg.className="rq-msg bad";
   msg.innerHTML='Не получилось отправить. Напишите нам в <a href="https://wa.me/'+WA+'?text='+encodeURIComponent(text)+'" target="_blank" rel="noopener">WhatsApp</a> — расчёт уже вставлен в сообщение.';
   if(err!=="noform")console.warn("form:",err)})})}

/* квиз-калькулятор */
var qz=$("rQuiz");
if(qz){
 var all=[].slice.call(qz.querySelectorAll(".rq-s")),preset=qz.dataset.type,ans={},hist=[];
 if(preset){var pb=qz.querySelector('[data-q="type"] [data-key="'+preset+'"]');if(pb){pb.setAttribute("aria-pressed","true");ans.type=pb}}
 var steps=all.filter(function(s){return !(preset&&s.dataset.q==="type")});
 var qN=steps.length-1,cur=0;
 function show(i){cur=i;steps.forEach(function(s,j){s.classList.toggle("on",j===i)});
  $("rqBar").style.width=(i>=qN?100:Math.round(i/qN*100))+"%";
  $("rqStep").textContent=i>=qN?"Готово! Вот ваш расчёт":"Вопрос "+(i+1)+" из "+qN;
  $("rqBack").classList.toggle("on",i>0);if(i>=qN)result()}
 function go(i){hist.push(cur);show(i)}
 qz.addEventListener("click",function(e){var b=e.target.closest(".opts button");if(!b)return;
  var s=b.closest(".rq-s");[].forEach.call(b.parentNode.children,function(x){x.setAttribute("aria-pressed",x===b)});
  ans[s.dataset.q]=b;setTimeout(function(){go(cur+1)},260)});
 qz.querySelector(".rq-next").addEventListener("click",function(){go(cur+1)});
 $("rqBack").addEventListener("click",function(){if(hist.length)show(hist.pop())});
 var ar=$("rqArea");ar.addEventListener("input",function(){$("rqAreaV").textContent=ar.value});
 function pick(q,def){return ans[q]||qz.querySelector('[data-q="'+q+'"] .opts button'+(def?':nth-child('+def+')':''))}
 var R={};
 function result(){
  var a=+ar.value,t=pick("type",2),h=pick("home"),st=pick("state"),w=pick("when");
  var p=+t.dataset.p*+h.dataset.k+(+st.dataset.a||0),s=Math.round(a*p/1000)*1000;
  var bp=+t.dataset.p,wk=Math.max(2,Math.round(a/(bp>11000?6:bp>6000?9:15))+(+st.dataset.a?1:0));
  $("rqSum").textContent="≈ "+s.toLocaleString("ru-RU")+" ₽";
  $("rqTerm").textContent="Срок: около "+wk+" недель";
  R={lines:[t.dataset.v+" ремонт",a+" м²",h.dataset.v,st.dataset.v,"Начать: "+w.dataset.v],sum:s,wk:wk};
  $("rqList").innerHTML=R.lines.map(function(x){return"<li>"+x+"</li>"}).join("")}
 bindForm($("rqForm"),function(){return"Расчёт с сайта: "+R.lines.join(", ")+". Итого ≈ "+R.sum.toLocaleString("ru-RU")+" ₽, срок около "+R.wk+" недель."});
 show(0);
}else{
 /* форма на странице контактов */
 bindForm($("rqForm"),function(f){var c=f.querySelector('[name="c"]');return"Запись на замер"+(c&&c.value.trim()?". Комментарий: "+c.value.trim():"")});
}

/* объекты: фильтр и просмотр фото */
var fl=$("rFilter");
if(fl){fl.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
 [].forEach.call(fl.children,function(x){x.setAttribute("aria-pressed",x===b)});
 document.querySelectorAll("#rWorks figure").forEach(function(f){f.classList.toggle("hide",!!b.dataset.f&&f.dataset.k!==b.dataset.f)})});
 var lb=$("rLb");
 $("rWorks").addEventListener("click",function(e){var z=e.target.closest(".zoom");if(!z)return;lb.querySelector("img").src=z.querySelector("img").src;lb.hidden=false});
 lb.addEventListener("click",function(e){if(e.target.tagName!=="IMG")lb.hidden=true});
 addEventListener("keydown",function(e){if(e.key==="Escape")lb.hidden=true})}
})();
